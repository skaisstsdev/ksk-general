import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { FaqList } from "@/components/page/FaqList";
import { PageClosing } from "@/components/page/PageClosing";
import { PageHero } from "@/components/page/PageHero";
import { RuledGrid } from "@/components/page/RuledGrid";
import { Col, Grid } from "@/components/ui/Grid";
import { categories, closing, hero, meta, questions, topCards } from "@/content/pages/faq";
import { kontaktCta } from "@/content/pages/shared";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

/**
 * FAQ. Порядок блоков — как в старом `faq.html`:
 *
 *   1. хиро — без кнопок, страница сама отвечает на вопрос
 *   2. фильтр по категориям + раскрывающийся перечень
 *   3. три карточки-выжимки
 *   4. закрывающий разворот — «вопроса не было» → Kontakt
 */
export default async function FaqPage({
  params,
}: PageProps<"/[locale]/faq">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead} />

      <section className="pt-break">
        <Grid>
          <Col span="text">
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

      <PageClosing
        eyebrow={hero.eyebrow}
        title={closing.title}
        text={closing.text}
        action={{ href: "/kontakt", label: kontaktCta }}
      />
    </>
  );
}
