import { Resend } from "resend";

import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { buildEmailHtml, buildEmailSubject, buildEmailText } from "./email";

/**
 * Приём всех трёх форм сайта (kontakt, beratung, schnellbewerbung) —
 * один роут вместо трёх, потому что письмо всегда падает по одному
 * и тому же адресу (`RESEND_TO`) и различается только набором полей.
 *
 * Замена старого EmailJS: там ключ был в браузере и письмо уходило
 * прямо с клиента; здесь ключ только на сервере, а форма шлёт сюда
 * обычный POST. Сохранения в базу (был Supabase, только для
 * schnellbewerbung) больше нет по решению владельца — письма достаточно.
 *
 * Honeypot и метка времени (см. `submit.ts`, `*Form.tsx`) проверяются
 * и на клиенте, и здесь: бот, который выполняет JS страницы, отсеется
 * ещё в браузере, а бот, который просто шлёт POST на этот адрес мимо
 * формы, — только здесь.
 */

const REQUIRED_FIELDS: Record<string, string[]> = {
  kontakt: ["vorname", "nachname", "email", "nachricht"],
  beratung: ["vorname", "nachname", "email"],
  schnellbewerbung: ["vorname", "nachname", "email", "telefon"],
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/**
 * Ни одно текстовое поле формы (имя, сообщение, что угодно) не имело
 * верхнего предела длины вообще — только размер файла резюме был
 * ограничен. Один запрос с полем на несколько мегабайт текста уходил
 * бы в письмо как есть.
 */
const MAX_FIELD_LENGTH = 5000;
/**
 * 4 МБ, не 10: Vercel ограничивает тело serverless-функции 4.5 МБ
 * целиком (тело запроса плюс служебные заголовки multipart) — прежний
 * предел 10 МБ пропускал файл через клиентскую проверку (`BewerbungForm.tsx`),
 * а сервер отвечал глухим `500`, до которого клиент вообще не добирался:
 * платформа обрывала запрос раньше, чем он попадал в этот код.
 */
const MAX_CV_SIZE = 4 * 1024 * 1024;
const ALLOWED_CV_EXTENSIONS = [".pdf", ".doc", ".docx"];
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function isBot(payload: Record<string, unknown>) {
  const honeypot = typeof payload.honeypot === "string" ? payload.honeypot : "";
  const elapsed = typeof payload.elapsedMs === "number" ? payload.elapsedMs : Infinity;
  return honeypot.trim() !== "" || elapsed < 2000;
}

/** Имя вложения — только для письма (`Content-Disposition`), не путь
 *  на диске, но береженого бог бережёт: убираем всё, кроме букв, цифр
 *  и точки/дефиса/подчёркивания, и обрезаем длину. */
function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[^\p{L}\p{N}._-]/gu, "_").slice(-100);
  return cleaned || "lebenslauf";
}

function hasAllowedExtension(name: string): boolean {
  const lower = name.toLowerCase();
  return ALLOWED_CV_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`submit-form:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.RESEND_TO?.trim();
  if (!apiKey || !to) {
    return Response.json({ error: "Mailer not configured" }, { status: 500 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  let formName: string;
  let payload: Record<string, unknown>;
  let cv: File | null = null;

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      formName = String(form.get("formName") ?? "");
      payload = JSON.parse(String(form.get("payload") ?? "{}"));
      const file = form.get("cv");
      if (file instanceof File && file.size > 0) cv = file;
    } else {
      const body = await request.json();
      formName = String(body.formName ?? "");
      payload = body.payload ?? {};
    }
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const required = REQUIRED_FIELDS[formName];
  if (!required) {
    return Response.json({ error: "Unknown form" }, { status: 400 });
  }

  for (const value of Object.values(payload)) {
    if (typeof value === "string" && value.length > MAX_FIELD_LENGTH) {
      return Response.json({ error: "Field too long" }, { status: 400 });
    }
  }

  // Бот, который выполняет JS: клиент уже отсеял его сам и сюда не
  // дошёл (см. `*Form.tsx`). Бот, который просто шлёт POST мимо формы, —
  // молчаливый «успех» без отправки письма, чтобы не подсказывать,
  // что именно его выдало.
  if (isBot(payload)) {
    return Response.json({ ok: true });
  }

  for (const field of required) {
    const value = payload[field];
    if (typeof value !== "string" || value.trim() === "") {
      return Response.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }
  const email = payload.email;
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }
  if (cv) {
    if (cv.size > MAX_CV_SIZE) {
      return Response.json({ error: "CV too large" }, { status: 400 });
    }
    if (!hasAllowedExtension(cv.name)) {
      return Response.json({ error: "Invalid CV file type" }, { status: 400 });
    }
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM?.trim() || "onboarding@resend.dev";

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: buildEmailSubject(formName, payload),
      html: buildEmailHtml(formName, payload),
      text: buildEmailText(formName, payload),
      attachments: cv
        ? [{ filename: sanitizeFilename(cv.name), content: Buffer.from(await cv.arrayBuffer()) }]
        : undefined,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "Mailer error" }, { status: 500 });
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Submit-form route error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
