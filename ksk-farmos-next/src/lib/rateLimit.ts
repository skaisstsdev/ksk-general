/**
 * Простой лимит частоты запросов по IP — фиксированное окно, без внешнего
 * хранилища. На серверless-платформах (Vercel) состояние живёт только
 * в памяти тёплого инстанса функции: это не защита уровня инфраструктуры
 * (при холодном старте или параллельных инстансах счётчик не общий), но
 * реальный барьер против одного клиента, заливающего форму или чат
 * подряд с одного адреса — а сейчас barrier не было вообще никакого,
 * кроме honeypot/таймера на форме.
 */

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

// Изредка подчищаем карту, чтобы она не росла бесконечно на долгоживущем
// тёплом инстансе — без отдельного таймера, просто при каждом обращении.
function sweep(now: number, windowMs: number) {
  if (buckets.size < 1000) return;
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > windowMs) buckets.delete(key);
  }
}

/**
 * `key` — обычно IP плюс имя роута (чтобы лимиты чата и форм не делили
 * одну корзину). Возвращает `true`, если запрос уложился в лимит.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now, windowMs);

  const bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return true;
  }

  bucket.count += 1;
  return bucket.count <= limit;
}

/**
 * IP клиента за прокси Vercel. `x-forwarded-for` может содержать цепочку
 * адресов через запятую — первый — исходный клиент.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
