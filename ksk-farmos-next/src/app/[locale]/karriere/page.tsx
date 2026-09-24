import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { NumberedList } from "@/components/page/NumberedList";
import { PageClosing } from "@/components/page/PageClosing";
import { PageHero } from "@/components/page/PageHero";
import { SectionHeading, StickyHeading } from "@/components/page/SectionHeading";
import { StepsGrid } from "@/components/page/StepsGrid";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Rule } from "@/components/ui/Rule";
import { benefits, bewerbung, closing, hero, meta, vakanzen } from "@/content/pages/karriere";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

/**
 * Karriere. Порядок блоков — как в старом `karriere.html`:
 *
 *   1. хиро — вторая дверь главной ведёт сюда
 *   2. Benefits — шесть пунктов
 *   3. Vakanzen                          #vakanzen
 *   4. Bewerbungsprozess — три шага
 *   5. закрывающий разворот для соискателя
 */
export default async function KarrierePage({
  params,
}: PageProps<"/[locale]/karriere">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.lead}
        actions={[
          { href: "/schnellbewerbung", label: hero.bewerben },
          { href: "/karriere#vakanzen", label: hero.vakanzen, variant: "secondary" },
        ]}
      />

      {/* Тот же приём, что у Leitbild на Über uns и диагнозов на
          Leistungen: закреплённый заголовок слева, пронумерованный
          перечень справа. По просьбе владельца — вместо фото
          (`PhotoSplit`) и трёх карточек в ряд (`RuledGrid`). */}
      <section className="pt-break">
        <Grid>
          <Col span="text">
            <StickyHeading eyebrow={benefits.eyebrow} title={benefits.title} />
          </Col>
          <Col span="aside">
            <NumberedList items={benefits.items} />
          </Col>
        </Grid>
      </section>

      {/* По просьбе владельца — вакансии не в узкой `aside`-колонке
          рядом с заголовком, а во всю ширину разворота, строкой ниже. */}
      <section id="vakanzen" className="pt-turn">
        <Grid>
          <Col>
            <SectionHeading eyebrow={vakanzen.eyebrow} title={vakanzen.title} />

            <ul className="mt-xl">
              {vakanzen.items.map((item, i) => (
                <li key={item.title}>
                  <Rule index={i} />
                  <div className="flex flex-col items-start gap-md py-md sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-2xs">
                      <h3 className="text-h3 text-ink">{item.title}</h3>
                      <div className="flex flex-wrap gap-2xs">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-xs border border-line-strong px-2xs py-3xs text-caption text-ink-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button href="/schnellbewerbung" variant="secondary" size="sm">
                      {vakanzen.bewerben}
                    </Button>
                  </div>
                </li>
              ))}
              <li aria-hidden="true">
                <Rule index={vakanzen.items.length} />
              </li>
            </ul>
          </Col>
        </Grid>
      </section>

      {/* Заголовок здесь — не `SectionHeading` (тот даёт `text-h1`,
          как у прочих разделов страницы), а `text-h2` напрямую, тем
          же приёмом, что у «In 3 Schritten zur Versorgung» на главной
          (`home/Steps.tsx`): по просьбе владельца этот блок должен
          выглядеть точно как его аналог там. */}
      <section className="pt-break">
        <Grid>
          <Col>
            <Eyebrow className="text-ink-muted">{bewerbung.eyebrow}</Eyebrow>
            <h2 className="mt-2xs text-h2 text-ink">{bewerbung.title}</h2>
            <StepsGrid items={bewerbung.steps} />
          </Col>
        </Grid>
      </section>

      <PageClosing
        eyebrow={closing.eyebrow}
        title={closing.title}
        text={closing.text}
        action={{
          href: "/schnellbewerbung",
          label: closing.cta,
          variant: "secondary",
        }}
      />
    </>
  );
}
