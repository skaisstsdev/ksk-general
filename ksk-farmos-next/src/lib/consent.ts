export const CONSENT_STORAGE_KEY = "ksk-consent-v1";
export const CONSENT_CHANGE_EVENT = "ksk-consent-change";

export type Consent = "granted" | "denied";

/**
 * Решение посетителя о Google Analytics / Google Ads. Живёт в
 * `localStorage`, как и остальной клиентский стейт сайта, — без cookie
 * ради баннера про cookie. `null` — решения ещё нет: баннер показан,
 * тег не загружен.
 */
export function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function notify() {
  // `storage` не срабатывает во вкладке, которая сама изменила значение.
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

export function writeConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Хранить негде — решение действует до перезагрузки страницы.
  }
  notify();
}

/** «Cookie-Einstellungen» в футере: стереть решение и показать баннер заново. */
export function resetConsent() {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // см. выше
  }
  notify();
}
