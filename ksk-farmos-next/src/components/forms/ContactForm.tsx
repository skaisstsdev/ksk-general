"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { betreffValues } from "@/content/pages/kontakt";
import { Checkbox, Field, Honeypot, Select, Textarea } from "./fields";
import { FormStatus } from "./FormStatus";
import { submitStub } from "./submit";

type Status = "idle" | "sending" | "success" | "error";

type Errors = Partial<Record<"vorname" | "nachname" | "email" | "nachricht" | "consent", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Контактная форма.
 *
 * Проверка — на клиенте, тем же способом, каким её потом проверит
 * сервер (этап 4): один и тот же набор правил, а не `checkValidity()`
 * браузера, как в старом сайте, — так сообщение об ошибке одинаково
 * для мыши, клавиатуры и автозаполнения.
 *
 * `startedAt` и `Honeypot` — простая защита от ботов: пустая ловушка
 * и слишком быстрое заполнение (меньше двух секунд) отбрасываются
 * молча, без сообщения об ошибке боту.
 */
export function ContactForm() {
  const t = useTranslations("kontakt.form");
  const content = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    text: t("text"),
    callLabel: t("callLabel"),
    fields: {
      vorname: t("fields.vorname"),
      nachname: t("fields.nachname"),
      email: t("fields.email"),
      telefon: t("fields.telefon"),
      betreff: t("fields.betreff"),
      betreffPlaceholder: t("fields.betreffPlaceholder"),
      nachricht: t("fields.nachricht"),
      consentPrefix: t("fields.consentPrefix"),
      consentLink: t("fields.consentLink"),
      consentSuffix: t("fields.consentSuffix"),
      submit: t("fields.submit"),
    },
    betreffOptions: t
      .raw("betreffOptions")
      .map((label: string, i: number) => ({ value: betreffValues[i], label })),
    success: { title: t("success.title"), text: t("success.text") },
    error: { title: t("error.title"), text: t("error.text") },
  };

  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [betreff, setBetreff] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [consent, setConsent] = useState(false);
  const [firma, setFirma] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  // `Date.now()` не вызывается прямо при рендере (нечистая функция) —
  // отметка времени берётся один раз после монтирования, до того как
  // пользователь успеет что-либо отправить.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  if (status === "success") {
    return (
      <FormStatus
        tone="success"
        title={content.success.title}
        text={content.success.text}
      />
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors: Errors = {};
    if (!vorname.trim()) nextErrors.vorname = t("validation.vorname");
    if (!nachname.trim()) nextErrors.nachname = t("validation.nachname");
    if (!EMAIL_RE.test(email)) nextErrors.email = t("validation.email");
    if (!nachricht.trim()) nextErrors.nachricht = t("validation.nachricht");
    if (!consent) nextErrors.consent = t("validation.consent");

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Ловушка сработала, или форма заполнена за секунды нечеловеческим
    // способом — тихо считаем отправку успешной, ничего не отправляя.
    if (firma.trim() !== "" || Date.now() - startedAt.current < 2000) {
      setStatus("success");
      return;
    }

    setStatus("sending");
    const result = await submitStub("kontakt", {
      vorname,
      nachname,
      email,
      telefon,
      betreff,
      nachricht,
    });
    setStatus(result.ok ? "success" : "error");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-md">
      <Honeypot value={firma} onChange={setFirma} label={t("honeypotLabel")} />

      <div className="grid gap-md sm:grid-cols-2">
        <Field
          id="vorname"
          label={content.fields.vorname}
          required
          autoComplete="given-name"
          value={vorname}
          onChange={setVorname}
          error={errors.vorname}
        />
        <Field
          id="nachname"
          label={content.fields.nachname}
          required
          autoComplete="family-name"
          value={nachname}
          onChange={setNachname}
          error={errors.nachname}
        />
      </div>

      <div className="grid gap-md sm:grid-cols-2">
        <Field
          id="email"
          type="email"
          label={content.fields.email}
          required
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />
        <Field
          id="telefon"
          type="tel"
          label={content.fields.telefon}
          autoComplete="tel"
          value={telefon}
          onChange={setTelefon}
        />
      </div>

      <Select
        id="betreff"
        label={content.fields.betreff}
        value={betreff}
        onChange={setBetreff}
        options={content.betreffOptions}
        placeholder={content.fields.betreffPlaceholder}
      />

      <Textarea
        id="nachricht"
        label={content.fields.nachricht}
        required
        value={nachricht}
        onChange={setNachricht}
        error={errors.nachricht}
      />

      <Checkbox id="consent" checked={consent} onChange={setConsent} error={errors.consent}>
        {content.fields.consentPrefix}
        <Link href="/datenschutz" target="_blank" className="text-violet underline decoration-violet/30 hover:decoration-violet">
          {content.fields.consentLink}
        </Link>
        {content.fields.consentSuffix}
      </Checkbox>

      {status === "error" ? (
        <FormStatus tone="error" title={content.error.title} text={content.error.text} />
      ) : null}

      <Button type="submit" disabled={status === "sending"} size="lg" className="self-start">
        {status === "sending" ? "…" : content.fields.submit}
      </Button>
    </form>
  );
}
