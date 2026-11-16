import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** Страницы старого сайта. Пути сохраняются, уходит только `.html`. */
const legacyPages = [
  "leistungen",
  "ueber-uns",
  "karriere",
  "faq",
  "kontakt",
  "beratung",
  "schnellbewerbung",
  "impressum",
  "datenschutz",
];

/**
 * Ни одного внешнего CDN по всему сайту (см. AGENTS.md/CLAUDE.md) — CSP
 * здесь просто закрепляет это на уровне заголовка, а не вводит новое
 * правило. Единственное исключение — Google Maps, и то по клику
 * пользователя (`ConsentMap.tsx`), поэтому `frame-src` открыт только
 * для него, не шире. Два адреса, не один: iframe грузится с
 * `maps.google.com`, но сам Google внутри перенаправляет запрос на
 * `www.google.com` (проверено — без второго домена браузер блокирует
 * встраивание на этом самом перенаправлении, уже после разрешённого
 * первого адреса).
 *
 * Второе исключение — Google Analytics/Ads (`GoogleTag.tsx`): скрипт
 * запрашивается только после согласия в баннере, до него ни один из
 * этих адресов не открывается. Домены — те, что gtag.js использует
 * для самого скрипта, отправки измерений и пикселя конверсий.
 *
 * `'unsafe-inline'` у `script-src`/`style-src` — не ослабление
 * специально для этого сайта: React/Next вставляет данные гидратации
 * инлайн-скриптом, а Motion меняет анимируемые свойства через
 * `element.style`, не через отдельный файл. Без нонсов (они требуют
 * генерации на каждый запрос в `proxy.ts`, которого сейчас нет) это
 * единственный практичный способ не сломать оба.
 *
 * `'unsafe-eval'` — только в `next dev`: React в деве восстанавливает
 * стек вызовов через `eval()` для отладки (компонент, где случилась
 * ошибка, и т.п.) и без этого разрешения падает уже на первой ошибке
 * рендера с собственной жалобой на CSP. Сам React прямо говорит, что
 * в проде `eval()` не использует никогда — там разрешение не нужно
 * и не должно быть в заголовке.
 */
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.googleadservices.com https://pagead2.googlesyndication.com https://www.googletagmanager.com https://*.google-analytics.com https://*.doubleclick.net https://www.google.com https://www.google.de https://www.google.at https://www.google.ch",
  "font-src 'self'",
  "connect-src 'self' https://www.googleadservices.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.doubleclick.net https://www.google.com https://www.google.de https://www.google.at https://www.google.ch",
  "frame-src https://maps.google.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // Не сообщать в заголовке ответа, на чём собран сайт (`X-Powered-By: Next.js`).
  poweredByHeader: false,

  images: {
    // Фотографии отдаются заранее подготовленными размерами, а не
    // ужимаются оптимизатором Next на лету: он заметно терял резкость
    // (замер: после уменьшения до 1920px оставалось меньше половины
    // мелкого контраста против обычного Lanczos). Размеры делает
    // `scripts/make-image-variants.py`, выбирает их `src/lib/imageLoader.ts`.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    // Ширины совпадают с готовыми размерами — браузер берёт ровно тот,
    // что нужен экрану, и сам почти не пересчитывает картинку.
    deviceSizes: [480, 640, 828, 1080, 1280, 1600, 1920, 2400, 3000],
    qualities: [75, 90],
  },

  async redirects() {
    return [
      // `/index.html` → `/`
      { source: "/index.html", destination: "/", permanent: true },
      // `/leistungen.html` → `/leistungen`, и так далее.
      // Пути намеренно не меняются: индексация старого сайта сохраняется,
      // а языковые версии добавляются префиксом сверху.
      ...legacyPages.map((page) => ({
        source: `/${page}.html`,
        destination: `/${page}`,
        permanent: true,
      })),
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
      {
        // Фотографии: неделя. Не «навсегда», потому что файл можно
        // заменить без смены имени; новое имя (`-v2`) показывается сразу.
        source: "/img/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800" },
        ],
      },
      {
        // Шрифты неизменяемы: имя файла меняется — меняется и содержимое.
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
