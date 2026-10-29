"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_STORAGE_KEY,
  readConsent,
  writeConsent,
} from "@/lib/consent";

/** Ключ и событие, по которым `ChatWidget.tsx` узнаёт, что баннер ещё на экране. */
export const COOKIE_NOTICE_STORAGE_KEY = CONSENT_STORAGE_KEY;
export const COOKIE_NOTICE_DISMISS_EVENT = CONSENT_CHANGE_EVENT;

/**
 * Запрос согласия на Google Analytics и Google Ads (§ 25 Abs. 1 TDDDG,
 * Art. 6 Abs. 1 lit. a DSGVO). Две кнопки одного веса — «Принять» и
 * «Отклонить»: отказ не должен быть заметно труднее согласия. Пока
 * решения нет, тег Google не загружается (`GoogleTag.tsx`).
 *
 * Правый нижний угол — переключатель языка уже занимает левый
 * (`LanguageSwitcher.tsx`, `bottom-md start-md`). Передумать можно через
 * «Cookie-Einstellungen» в футере (`CookieSettingsButton.tsx`).
 */
export function CookieBanner() {
  const t = useTranslations("legal");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function sync() {
      setVisible(readConsent() === null);
    }
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(CONSENT_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
    };
  }, []);

  if (!visible) return null;

  const button =
    "inline-flex h-9 items-center rounded-xs border border-ink px-sm text-meta font-medium text-ink transition-colors hover:bg-ink/5";

  return (
    <div
      role="dialog"
      aria-label={t("cookieBanner.settings")}
      className="fixed inset-x-md bottom-[calc(var(--spacing-md)+env(safe-area-inset-bottom))] z-50 rounded-xs border border-line-strong bg-paper p-sm sm:inset-x-auto sm:end-md sm:w-[24rem]"
    >
      <p className="text-meta text-ink-soft">
        {t("cookieBanner.text")}{" "}
        <Link
          href="/datenschutz"
          className="text-violet underline decoration-violet/30 hover:decoration-violet"
        >
          {t("datenschutz.title")}
        </Link>
      </p>
      <div className="mt-xs flex gap-xs">
        <button type="button" onClick={() => writeConsent("granted")} className={button}>
          {t("cookieBanner.accept")}
        </button>
        <button type="button" onClick={() => writeConsent("denied")} className={button}>
          {t("cookieBanner.decline")}
        </button>
      </div>
    </div>
  );
}
