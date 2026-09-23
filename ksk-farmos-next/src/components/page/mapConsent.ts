const STORAGE_KEY = "ksk-consent-maps";

/**
 * Крошечное внешнее хранилище согласия на карту — `useSyncExternalStore`,
 * а не `useState` + `useEffect`: чтение `localStorage` — обращение
 * к внешней системе, и синхронизировать его с рендером положено именно
 * так, без побочного эффекта, стреляющего сразу после монтирования.
 *
 * Значение кэшируется в модуле: `localStorage` при выдаче согласия
 * событие `storage` в своей же вкладке не поднимает (оно только для
 * других вкладок), поэтому обновление приходит через ручных подписчиков.
 */
let cache: boolean | null = null;
const listeners = new Set<() => void>();

function read(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function subscribeMapConsent(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getMapConsent(): boolean {
  if (cache === null) cache = read();
  return cache;
}

export function getServerMapConsent(): boolean {
  return false;
}

export function setMapConsent(value: boolean) {
  cache = value;
  try {
    if (value) localStorage.setItem(STORAGE_KEY, "1");
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Приватный режим или заблокированное хранилище: согласие держится
    // до перезагрузки страницы через кэш модуля, не дольше.
  }
  listeners.forEach((callback) => callback());
}
