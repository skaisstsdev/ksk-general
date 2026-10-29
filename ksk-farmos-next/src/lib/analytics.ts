import { readConsent } from "@/lib/consent";

/**
 * Идентификаторы тега. Это публичные значения, не секреты (они и так
 * видны в коде любой страницы после согласия), поэтому у них есть
 * значения по умолчанию — сайт считает заявки без настройки окружения.
 * Переменные `NEXT_PUBLIC_*` их переопределяют: например, чтобы
 * выключить тег в превью, достаточно задать их пустыми.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-N37DZN7B72";
export const ADS_ID = process.env.NEXT_PUBLIC_ADS_ID ?? "AW-18476076122";
const ADS_LABEL_LEAD = process.env.NEXT_PUBLIC_ADS_LABEL_LEAD ?? "2OcUCLzuna4dENqYiupE";
const ADS_LABEL_CALL = process.env.NEXT_PUBLIC_ADS_LABEL_CALL ?? "oyMvCL_una4dENqYiupE";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/** События уходят только после согласия: до него тег не загружен, `gtag` не существует. */
function send(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || readConsent() !== "granted" || !window.gtag) return;
  window.gtag("event", name, params);
}

function sendAdsConversion(label: string | undefined) {
  if (!ADS_ID || !label) return;
  send("conversion", { send_to: `${ADS_ID}/${label}` });
}

/** Успешно отправленная форма (ответ сервера `ok`, не клик по кнопке). */
export function trackFormSubmit(formName: string) {
  if (formName === "schnellbewerbung") {
    // Отклик на вакансию — не пациент: отдельное событие, без конверсии Ads.
    send("job_application", { form_name: formName });
    return;
  }
  send("generate_lead", { form_name: formName });
  sendAdsConversion(ADS_LABEL_LEAD);
}

/** Клик по ссылке `tel:` — звонок с сайта. */
export function trackPhoneClick(href: string) {
  send("click_to_call", { link_url: href });
  sendAdsConversion(ADS_LABEL_CALL);
}

/** Клик по ссылке `mailto:`. */
export function trackEmailClick(href: string) {
  send("click_email", { link_url: href });
}
