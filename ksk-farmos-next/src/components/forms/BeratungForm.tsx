"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { Checkbox, Field, Honeypot, Textarea } from "./fields";
import { FormStatus } from "./FormStatus";
import { submitForm } from "./submit";

type Status = "idle" | "sending" | "success" | "error";

type Errors = Partial<Record<"vorname" | "nachname" | "email" | "consent", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Форма страницы «Beratung» — тот же приём, что у `ContactForm.tsx`
 * (клиентская проверка, honeypot, замена карточки статусом), но короче:
 * нет темы обращения, а сообщение необязательно — здесь и так понятно,
 * зачем пишут.
 */
export function BeratungForm() {
  const t = useTranslations("beratung.form");

  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [consent, setConsent] = useState(false);
  const [firma, setFirma] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  if (status === "success") {
    return <FormStatus tone="success" title={t("success.title")} text={t("success.text")} />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors: Errors = {};
    if (!vorname.trim()) nextErrors.vorname = t("validation.vorname");
    if (!nachname.trim()) nextErrors.nachname = t("validation.nachname");
    if (!EMAIL_RE.test(email)) nextErrors.email = t("validation.email");
    if (!consent) nextErrors.consent = t("validation.consent");

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (firma.trim() !== "" || Date.now() - startedAt.current < 2000) {
      setStatus("success");
      return;
    }

    setStatus("sending");
    const result = await submitForm("beratung", {
      vorname,
      nachname,
      email,
      telefon,
      nachricht,
      honeypot: firma,
      elapsedMs: Date.now() - startedAt.current,
    });
    setStatus(result.ok ? "success" : "error");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-md">
      <Honeypot value={firma} onChange={setFirma} label={t("honeypotLabel")} />

      <div className="grid gap-md sm:grid-cols-2">
        <Field
          id="vorname"
          label={t("fields.vorname")}
          required
          autoComplete="given-name"
          value={vorname}
          onChange={setVorname}
          error={errors.vorname}
        />
        <Field
          id="nachname"
          label={t("fields.nachname")}
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
          label={t("fields.email")}
          required
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />
        <Field
          id="telefon"
          type="tel"
          label={t("fields.telefon")}
          autoComplete="tel"
          value={telefon}
          onChange={setTelefon}
        />
      </div>

      <Textarea
        id="nachricht"
        label={t("fields.nachricht")}
        placeholder={t("fields.nachrichtPlaceholder")}
        value={nachricht}
        onChange={setNachricht}
      />

      <Checkbox id="consent" checked={consent} onChange={setConsent} error={errors.consent}>
        {t("fields.consentPrefix")}
        <Link href="/datenschutz" target="_blank" className="text-violet underline decoration-violet/30 hover:decoration-violet">
          {t("fields.consentLink")}
        </Link>
        {t("fields.consentSuffix")}
      </Checkbox>

      {status === "error" ? (
        <FormStatus tone="error" title={t("error.title")} text={t("error.text")} />
      ) : null}

      <Button type="submit" disabled={status === "sending"} size="lg" className="self-start">
        {status === "sending" ? "…" : t("fields.submit")}
      </Button>
    </form>
  );
}
