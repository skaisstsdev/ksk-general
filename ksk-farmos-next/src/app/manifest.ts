import type { MetadataRoute } from "next";

import { company } from "@/content/site";

/**
 * Один манифест на весь сайт, не по языку: установка на домашний экран —
 * не то место, где имеет смысл спрашивать язык заново, а немецкий —
 * зафиксированный дефолт роутинга (`routing.defaultLocale`).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.legalName,
    short_name: company.shortName,
    start_url: "/",
    display: "standalone",
    background_color: "#f2f0eb",
    theme_color: "#f2f0eb",
    icons: [
      {
        src: "/logo-icon.png",
        sizes: "300x259",
        type: "image/png",
      },
    ],
  };
}
