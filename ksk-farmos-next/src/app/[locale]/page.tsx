import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AboutPreview } from "@/components/home/AboutPreview";
import { ClosingCta } from "@/components/home/ClosingCta";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { MapSection } from "@/components/home/MapSection";
import { Moment } from "@/components/home/Moment";
import { Reviews } from "@/components/home/Reviews";
import { ServiceList } from "@/components/home/ServiceList";
import { company } from "@/content/site";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return buildPageMetadata({
    locale,
    path: "/",
    title: t("meta.title"),
    description: t("meta.description"),
    // `[locale]/page.tsx` лежит в том же сегменте, что `[locale]/layout.tsx`,
    // и его `title.template` сюда не достаёт — см. комментарий в `lib/metadata.ts`.
    titleSuffix: company.legalName,
  });
}

/**
 * Главная страница.
 *
 * Порядок отвечает порядку вопросов семьи в кризисной ситуации:
 *
 *   1. что это за служба            — хиро
 *   2. кто вы вообще                — вводная фраза с метриками
 *   3. как это выглядит             — кадр во весь экран
 *   4. что вы делаете               — услуги + «сколько ждать» (три
 *                                      шага) одним фиолетовым блоком
 *                                      (по решению владельца — см.
 *                                      комментарий в `ServiceList.tsx`;
 *                                      блок переставлен после кадра,
 *                                      а не сразу после вводной фразы,
 *                                      и объединяет то, что раньше
 *                                      было двумя разделами, `Steps.tsx`
 *                                      удалён)
 *   5. работаете ли в моём районе   — карта Гессена
 *   6. кто вы такие                 — основатель
 *   7. что говорят другие           — отзывы
 *   8. что делать дальше            — закрывающий разворот
 *
 * Блок «берёте ли такой случай» (диагнозы, `Diagnoses`) убран со
 * страницы по просьбе владельца — компонент и контент оставлены
 * нетронутыми на случай, если он вернётся.
 */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Intro />
      <Moment />
      <ServiceList />
      <MapSection />
      <AboutPreview />
      <Reviews />
      <ClosingCta />
    </>
  );
}
