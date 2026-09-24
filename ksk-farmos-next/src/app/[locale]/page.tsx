import { setRequestLocale } from "next-intl/server";

import { AboutPreview } from "@/components/home/AboutPreview";
import { ClosingCta } from "@/components/home/ClosingCta";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { MapSection } from "@/components/home/MapSection";
import { Moment } from "@/components/home/Moment";
import { Reviews } from "@/components/home/Reviews";
import { ServiceList } from "@/components/home/ServiceList";
import { Steps } from "@/components/home/Steps";

/**
 * Главная страница.
 *
 * Порядок отвечает порядку вопросов семьи в кризисной ситуации:
 *
 *   1. что это за служба            — хиро
 *   2. кто вы вообще                — вводная фраза с метриками
 *   3. как это выглядит             — кадр во весь экран
 *   4. что вы делаете               — услуги (по решению владельца
 *                                      закрашена фиолетовым — см.
 *                                      комментарий в `ServiceList.tsx` —
 *                                      и переставлена после кадра, а не
 *                                      сразу после вводной фразы)
 *   5. сколько ждать                — три шага
 *   6. работаете ли в моём районе   — карта Гессена
 *   7. кто вы такие                 — основатель
 *   8. что говорят другие           — отзывы
 *   9. что делать дальше            — закрывающий разворот
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
      <Steps />
      <MapSection />
      <AboutPreview />
      <Reviews />
      <ClosingCta />
    </>
  );
}
