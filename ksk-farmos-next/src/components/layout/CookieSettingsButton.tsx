"use client";

import { useTranslations } from "next-intl";

import { resetConsent } from "@/lib/consent";

/** Возможность передумать: стирает решение, баннер появляется снова. */
export function CookieSettingsButton({ className }: { className?: string }) {
  const t = useTranslations("legal");

  return (
    <button type="button" onClick={resetConsent} className={className}>
      {t("cookieBanner.settings")}
    </button>
  );
}
