import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Служебная страница дизайн-системы — не для поиска (тот же
      // `noindex`, что и в её собственных метаданных).
      disallow: ["/styleguide", "/*/styleguide"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
