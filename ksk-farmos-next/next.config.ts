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

const nextConfig: NextConfig = {
  images: {
    // По умолчанию Next.js 16 разрешает только quality=75 и тихо
    // округляет всё остальное до него — хиро главной запрашивает 90.
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
