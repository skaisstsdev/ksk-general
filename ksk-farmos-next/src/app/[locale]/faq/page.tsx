import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FaqList } from "@/components/page/FaqList";
import { PageClosing } from "@/components/page/PageClosing";
import { RuledGrid } from "@/components/page/RuledGrid";
import { StickyHeading } from "@/components/page/SectionHeading";
import { Col, Grid } from "@/components/ui/Grid";
import { questionsMeta } from "@/content/pages/faq";
import { buildPageMetadata } from "@/lib/metadata";
import { FaqJsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/faq">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return buildPageMetadata({
    locale,
    path: "/faq",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

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
  const t = await getTranslations("faq");
  const tHome = await getTranslations("home");
  const tCommon = await getTranslations("common");

  const hero = t.raw("hero");
  const closing = t.raw("closing");
  const categories = t.raw("categories");
  const questions = t
    .raw("questions")
    .map((q: { q: string; a: string; action?: { label: string } }, i: number) => ({
      ...q,
      ...questionsMeta[i],
      action: q.action ? { ...q.action, href: questionsMeta[i].actionHref } : undefined,
    }));
  const topCards = t.raw("topCards");

  return (
    <>
      <FaqJsonLd questions={questions} />
      <section className="pt-[calc(var(--header-h)+var(--spacing-break))]">
        <Grid>
          <Col span="text">
            <StickyHeading as="h1" eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead} />
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
          (`home.closing.points` в словаре, туда попали со страницы
          «Beratung»). Аудитория та же — семья, которая обращается
          напрямую, — поэтому повторное приглашение написать не
          получило собственного текста, а переиспользует готовый. */}
      <PageClosing
        eyebrow={hero.eyebrow}
        title={closing.title}
        text={closing.text}
        points={tHome.raw("closing.points")}
        action={{ href: "/kontakt", label: tCommon("kontaktCta") }}
      />
    </>
  );
}
