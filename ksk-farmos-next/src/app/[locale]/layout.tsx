import type { Metadata } from "next";
import ReactDOM from "react-dom";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import "../globals.css";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { company, siteUrl } from "@/content/site";
import { localeDir, routing, type Locale } from "@/i18n/routing";
import { preloadedFonts } from "@/lib/fonts";

/**
 * Корневой layout живёт внутри сегмента `[locale]`: язык — часть адреса,
 * а не состояние в localStorage, как было в старом сайте.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.legalName} — ${company.descriptor} in Nordhessen`,
    template: `%s — ${company.legalName}`,
  },
  icons: { icon: "/logo-icon.png" },
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Без этого страницы уходят в динамический рендеринг и теряют пререндер.
  setRequestLocale(locale);

  const dir = localeDir(locale);

  /**
   * Предзагрузка шрифтов через ReactDOM, а не отрисовкой <link>.
   *
   * Отрисованный <link> React поднимает в <head> при стриминге, но
   * при этом оставляет и собственную копию — теги удваивались, и
   * гидратация падала на каждой странице. `preload` умеет
   * дедуплицировать, потому что для этого и сделан.
   */
  for (const file of preloadedFonts(locale as Locale)) {
    ReactDOM.preload(`/fonts/${file}`, {
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    });
  }

  return (
    <html lang={locale} dir={dir} className="h-full">
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink antialiased">
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <LanguageSwitcher />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
