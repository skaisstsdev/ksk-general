import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { FaqList } from "@/components/page/FaqList";
import { PageClosing } from "@/components/page/PageClosing";
import { RuledGrid } from "@/components/page/RuledGrid";
import { StickyHeading } from "@/components/page/SectionHeading";
import { Col, Grid } from "@/components/ui/Grid";
import { closing as familyClosing } from "@/content/home";
import { categories, closing, hero, meta, questions, topCards } from "@/content/pages/faq";
import { kontaktCta } from "@/content/pages/shared";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

/**
 * FAQ. Порядок блоков — как в старом `faq.html`, кроме первого:
 *
 *   1. заголовок + фильтр по категориям + раскрывающийся перечень
 *   2. три карточки-выжимки
 *   3. закрывающий разворот — «вопроса не было» → Kontakt
 *
 * По просьбе владельца хиро на этой странице нет — вместо него
 * закреплённый заголовок слева (`text`) и сам перечень справа
 * (`aside`), тем же приёмом, что у Leitbild на Über uns и диагнозов
 * на Leistungen.
 *
 * Раз хиро больше нет, страница убрана из `pagesWithHero` — шапка
 * здесь всегда непрозрачная, а первому блоку нужен свой отступ
 * под неё (`--header-h`) вместо отступа хиро.
 */
export default async function FaqPage({
  params,
}: PageProps<"/[locale]/faq">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="pt-[calc(var(--header-h)+var(--spacing-break))]">
        <Grid>
          <Col span="text">
            <StickyHeading eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead} />
          </Col>
          <Col span="aside">
            <FaqList categories={categories} questions={questions} />
          </Col>
        </Grid>
      </section>

      <section className="pt-beat">
        <Grid>
          <Col>
            <RuledGrid items={topCards} />
          </Col>
        </Grid>
      </section>

      {/* Пункты — не новый текст: те же три (`ber.c1–3`), что уже
          стоят в закрывающем развороте Leistungen/Über uns/Kontakt
          (`familyClosing.points` из `home.ts`, туда попали со страницы
          «Beratung»). Аудитория та же — семья, которая обращается
          напрямую, — поэтому повторное приглашение написать не
          получило собственного текста, а переиспользует готовый. */}
      <PageClosing
        eyebrow={hero.eyebrow}
        title={closing.title}
        text={closing.text}
        points={familyClosing.points}
        action={{ href: "/kontakt", label: kontaktCta }}
      />
    </>
  );
}
