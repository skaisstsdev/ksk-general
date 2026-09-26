"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import {
  erfahrungValues,
  fuehrerscheinValues,
  qualifikationValues,
} from "@/content/pages/schnellbewerbung";
import { cn } from "@/lib/cn";
import { Checkbox, Field, Honeypot, Select, Textarea } from "./fields";
import { FormStatus } from "./FormStatus";
import { submitStub } from "./submit";

type Status = "idle" | "sending" | "success" | "error";

type Step1Errors = Partial<Record<"vorname" | "nachname" | "email" | "telefon", string>>;
type Errors = Step1Errors & { consent?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CV_SIZE = 10 * 1024 * 1024;

/**
 * Три шага вместо трёх обязательных решений сразу — приём один в один
 * со старым сайтом (там же три `wizard-panel`), но без ручного
 * переключения классов: шаг — обычное состояние React.
 *
 * Обязательные поля — только на первом шаге (имя, фамилия, e-mail,
 * телефон) и согласие на третьем: квалификация, опыт и права — тем
 * же необязательным приёмом, что и в старой форме, где у этих полей
 * не было `required`.
 */
function WizardSteps({ current, labels }: { current: number; labels: string[] }) {
  return (
    <ol className="flex items-center">
      {labels.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <span
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-xs text-meta font-medium tabular-nums transition-colors",
                done || active
                  ? "bg-violet text-paper"
                  : "border border-line-strong text-ink-muted",
              )}
            >
              {n}
            </span>
            <span className="ms-2xs hidden text-meta text-ink-soft sm:inline">{label}</span>
            {n < labels.length ? (
              <span
                aria-hidden="true"
                className={cn("mx-sm h-px flex-1 transition-colors", done ? "bg-violet" : "bg-line")}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function BewerbungForm() {
  const t = useTranslations("schnellbewerbung.form");
  const stepLabels = useTranslations("schnellbewerbung").raw("steps") as string[];

  const [step, setStep] = useState(1);

  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [qualifikation, setQualifikation] = useState("");
  const [erfahrung, setErfahrung] = useState("");
  const [fuehrerschein, setFuehrerschein] = useState<string>(fuehrerscheinValues[0]);
  const [nachricht, setNachricht] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string>();
  const [consent, setConsent] = useState(false);
  const [firma, setFirma] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const qualifikationOptions = t
    .raw("qualifikationOptions")
    .map((label: string, i: number) => ({ value: qualifikationValues[i], label }));
  const erfahrungOptions = t
    .raw("erfahrungOptions")
    .map((label: string, i: number) => ({ value: erfahrungValues[i], label }));
  const fuehrerscheinOptions = t
    .raw("fuehrerscheinOptions")
    .map((label: string, i: number) => ({ value: fuehrerscheinValues[i], label }));

  if (status === "success") {
    return <FormStatus tone="success" title={t("success.title")} text={t("success.text")} />;
  }

  function validateStep1(): Step1Errors {
    const next: Step1Errors = {};
    if (!vorname.trim()) next.vorname = t("validation.vorname");
    if (!nachname.trim()) next.nachname = t("validation.nachname");
    if (!EMAIL_RE.test(email)) next.email = t("validation.email");
    if (!telefon.trim()) next.telefon = t("validation.telefon");
    return next;
  }

  function goNext() {
    if (step === 1) {
      const step1Errors = validateStep1();
      setErrors(step1Errors);
      if (Object.keys(step1Errors).length > 0) return;
    }
    setStep((s) => Math.min(3, s + 1));
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  function onCvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_CV_SIZE) {
      setCvError(t("validation.cv"));
      setCv(null);
      e.target.value = "";
      return;
    }
    setCvError(undefined);
    setCv(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const step1Errors = validateStep1();
    const nextErrors: Errors = { ...step1Errors };
    if (!consent) nextErrors.consent = t("validation.consent");

    setErrors(nextErrors);
    if (Object.keys(step1Errors).length > 0) {
      setStep(1);
      return;
    }
    if (nextErrors.consent) return;

    if (firma.trim() !== "" || Date.now() - startedAt.current < 2000) {
      setStatus("success");
      return;
    }

    setStatus("sending");
    const result = await submitStub("schnellbewerbung", {
      vorname,
      nachname,
      email,
      telefon,
      qualifikation,
      erfahrung,
      fuehrerschein,
      nachricht,
      cv: cv?.name ?? null,
    });
    setStatus(result.ok ? "success" : "error");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-lg">
      <Honeypot value={firma} onChange={setFirma} label={t("honeypotLabel")} />
      <WizardSteps current={step} labels={stepLabels} />

      {step === 1 ? (
        <div className="flex flex-col gap-md">
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
              required
              autoComplete="tel"
              value={telefon}
              onChange={setTelefon}
              error={errors.telefon}
            />
          </div>
          <Button type="button" size="lg" className="self-start" onClick={goNext}>
            {t("fields.weiter")}
          </Button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="flex flex-col gap-md">
          <Select
            id="qualifikation"
            label={t("fields.qualifikationLabel")}
            value={qualifikation}
            onChange={setQualifikation}
            options={qualifikationOptions}
            placeholder={t("fields.qualifikationPlaceholder")}
          />
          <Select
            id="erfahrung"
            label={t("fields.erfahrungLabel")}
            value={erfahrung}
            onChange={setErfahrung}
            options={erfahrungOptions}
            placeholder={t("fields.qualifikationPlaceholder")}
          />
          <Select
            id="fuehrerschein"
            label={t("fields.fuehrerscheinLabel")}
            value={fuehrerschein}
            onChange={setFuehrerschein}
            options={fuehrerscheinOptions}
            placeholder={t("fields.qualifikationPlaceholder")}
          />
          <div className="flex items-center gap-sm">
            <Button type="button" variant="secondary" onClick={goBack}>
              {t("fields.zurueck")}
            </Button>
            <Button type="button" size="lg" onClick={goNext}>
              {t("fields.weiter")}
            </Button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="flex flex-col gap-md">
          <Textarea
            id="nachricht"
            label={t("fields.nachrichtLabel")}
            placeholder={t("fields.nachrichtPlaceholder")}
            value={nachricht}
            onChange={setNachricht}
          />

          <div className="flex flex-col gap-3xs">
            <label htmlFor="cv" className="text-meta text-ink-soft">
              {t("fields.cvLabel")}
            </label>
            <input
              id="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={onCvChange}
              className={cn(
                "w-full rounded-xs border border-line-strong bg-surface text-ui text-ink-muted",
                "file:me-sm file:rounded-xs file:border-0 file:bg-violet file:px-sm file:py-xs file:text-ui file:text-paper file:transition-colors hover:file:bg-violet-mid",
              )}
            />
            {cv ? <p className="text-meta text-ink-muted">{cv.name}</p> : null}
            {cvError ? <p className="text-meta text-critical">{cvError}</p> : null}
          </div>

          <Checkbox id="consent" checked={consent} onChange={setConsent} error={errors.consent}>
            {t("fields.consentPrefix")}
            <Link
              href="/datenschutz"
              target="_blank"
              className="text-violet underline decoration-violet/30 hover:decoration-violet"
            >
              {t("fields.consentLink")}
            </Link>
            {t("fields.consentSuffix")}
          </Checkbox>

          {status === "error" ? (
            <FormStatus tone="error" title={t("error.title")} text={t("error.text")} />
          ) : null}

          <div className="flex items-center gap-sm">
            <Button type="button" variant="secondary" onClick={goBack}>
              {t("fields.zurueck")}
            </Button>
            <Button type="submit" size="lg" disabled={status === "sending"}>
              {status === "sending" ? "…" : t("fields.submit")}
            </Button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
