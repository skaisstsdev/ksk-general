"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

/** Экспортированы, чтобы `ChatWidget` мог узнать, занят ли нижний угол баннером,
 *  и подняться над ним, пока тот не закрыт (см. комментарий там). */
export const COOKIE_NOTICE_STORAGE_KEY = "ksk-cookie-notice-dismissed";
export const COOKIE_NOTICE_DISMISS_EVENT = "ksk-cookie-notice-dismiss";

/**
 * Уведомление о cookie, не запрос согласия. Datenschutzerklärung
 * прямо говорит: сайт использует только технически необходимые
 * cookie, для которых согласие по закону не требуется (§ 25 Abs. 2
 * TDDDG) — поэтому одна кнопка «Понятно», а не Accept/Reject, который
 * подразумевал бы выбор там, где его нет. Если позже на сайте
 * появятся cookie, требующие согласия (аналитика, чат-виджет),
 * баннер и раздел 6 Datenschutz нужно менять вместе.
 *
 * Правый нижний угол — переключатель языка уже занимает левый
 * (`LanguageSwitcher.tsx`, `bottom-md start-md`), после клика запись
 * остаётся в `localStorage` — тем же приёмом, что и остальной клиентский
 * стейт сайта, без cookie ради баннера про cookie.
 */
export function CookieBanner() {
  const t = useTranslations("legal");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Синхронизация с `localStorage` — внешним хранилищем: значение
    // читается при монтировании и при событии `storage` (запись из
    // другой вкладки), тем же приёмом, что `probe`/`resize`
    // в `LanguageSwitcher.tsx`.
    function sync() {
      try {
        setVisible(localStorage.getItem(COOKIE_NOTICE_STORAGE_KEY) === null);
      } catch {
        // Приватный режим/запрет доступа к хранилищу — показываем баннер каждый раз.
        setVisible(true);
      }
    }
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(COOKIE_NOTICE_STORAGE_KEY, "1");
    } catch {
      // Хранить негде — баннер просто появится снова в следующий визит.
    }
    // `storage` не срабатывает во вкладке, которая сама изменила значение —
    // событие для тех, кто слушает именно этот клик в этой вкладке (`ChatWidget`).
    window.dispatchEvent(new Event(COOKIE_NOTICE_DISMISS_EVENT));
  }

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-md bottom-md z-50 rounded-xs border border-line-strong bg-paper p-sm sm:inset-x-auto sm:end-md sm:w-[22rem]"
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
      <button
        type="button"
        onClick={dismiss}
        className="mt-xs inline-flex h-9 items-center rounded-xs border border-ink px-sm text-meta font-medium text-ink transition-colors hover:bg-ink/5"
      >
        {t("cookieBanner.dismiss")}
      </button>
    </div>
  );
}
