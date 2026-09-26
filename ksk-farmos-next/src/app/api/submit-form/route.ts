import { Resend } from "resend";

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
const MAX_CV_SIZE = 10 * 1024 * 1024;

function isBot(payload: Record<string, unknown>) {
  const honeypot = typeof payload.honeypot === "string" ? payload.honeypot : "";
  const elapsed = typeof payload.elapsedMs === "number" ? payload.elapsedMs : Infinity;
  return honeypot.trim() !== "" || elapsed < 2000;
}

export async function POST(request: Request) {
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
  if (cv && cv.size > MAX_CV_SIZE) {
    return Response.json({ error: "CV too large" }, { status: 400 });
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
        ? [{ filename: cv.name, content: Buffer.from(await cv.arrayBuffer()) }]
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
