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
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://maps.google.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    // По умолчанию Next.js 16 разрешает только quality=75 и тихо
    // округляет всё остальное до него — хиро главной запрашивает 90.
    qualities: [75, 90],
    // Только WebP. Пробовал добавить AVIF первым — на реальном сервере
    // его кодирование на лету для хиро (2000×1332) заняло ~900мс против
    // 6мс у WebP (замерено: fetch с Accept: image/avif дал 139КБ за
    // 888мс, с Accept: image/webp — 373КБ за 6мс). В проде на Vercel
    // эта цена платится один раз и кэшируется на CDN, но именно на хиро —
    // самом важном месте сайта — секунда до первой картинки того не стоит,
    // особенно у первых посетителей после каждого деплоя.
    formats: ["image/webp"],
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
