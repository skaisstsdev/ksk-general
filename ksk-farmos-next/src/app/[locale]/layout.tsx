import type { Metadata, Viewport } from "next";
import ReactDOM from "react-dom";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import "../globals.css";

import { ChatWidget } from "@/components/chat/ChatWidget";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { company, siteUrl } from "@/content/site";
import { localeDir, routing, type Locale } from "@/i18n/routing";
import { preloadedFonts } from "@/lib/fonts";
import { MedicalBusinessJsonLd } from "@/components/seo/JsonLd";

/**
 * Корневой layout живёт внутри сегмента `[locale]`: язык — часть адреса,
 * а не состояние в localStorage, как было в старом сайте.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * `--color-paper` буквально — то же самое поле, что видно под шапкой
 * на первом кадре, а не приблизительный тон: адресная строка Chrome
 * на телефоне и панель задач на iOS красятся ровно в цвет страницы,
 * а не в произвольный "фирменный" оттенок.
 */
export const viewport: Viewport = {
  themeColor: "#f2f0eb",
};

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${company.legalName} — ${t("meta.titleSuffix")}`,
      template: `%s — ${company.legalName}`,
    },
    // Тот же файл для обоих: логотип не квадратный (300×259), но это
    // по-прежнему лучше, чем полное отсутствие apple-touch-icon —
    // без него iOS подставляет скриншот страницы при «Добавить на экран».
    icons: { icon: "/logo-icon.png", apple: "/logo-icon.png" },
    manifest: "/manifest.webmanifest",
  };
}

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
   * Клиенту — не все десять словарей, а только те, что реально читает
   * `useTranslations` в клиентских компонентах: `leistungen`, `karriere`,
   * `faq`, `ueberUns` целиком серверные (`getTranslations` в самих
   * страницах), их текст уже стоит в готовой разметке HTML — второй
   * копией в RSC-пейлоаде на каждой странице он был не нужен вообще.
   * Список — не догадка, а инвентаризация всех `useTranslations(...)`
   * в файлах с `"use client"`.
   */
  const allMessages = await getMessages();
  const CLIENT_NAMESPACES = [
    "common",
    "legal",
    "home",
    "kontakt",
    "beratung",
    "schnellbewerbung",
  ] as const;
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.map((ns) => [ns, allMessages[ns]]),
  );

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
        <MedicalBusinessJsonLd />
        <NextIntlClientProvider messages={clientMessages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <LanguageSwitcher />
          <CookieBanner />
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
