import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PageClosing } from "@/components/page/PageClosing";
import { PageHero } from "@/components/page/PageHero";
import { PhotoSplit } from "@/components/page/PhotoSplit";
import { RuledGrid } from "@/components/page/RuledGrid";
import { SectionHeading } from "@/components/page/SectionHeading";
import { StepsGrid } from "@/components/page/StepsGrid";
import { Button } from "@/components/ui/Button";
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

      <PhotoSplit
        photo={{
          src: "/img/team.jpg",
          alt: "Das Team von KSK Farmos gemeinsam im Büro",
          ratio: "4 / 3",
          ratioLg: "3 / 2",
        }}
      >
        <SectionHeading eyebrow={benefits.eyebrow} title={benefits.title} />
      </PhotoSplit>

      <section className="pt-beat">
        <Grid>
          <Col>
            <RuledGrid items={benefits.items} />
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

      <section className="pt-break">
        <Grid>
          <Col>
            <SectionHeading eyebrow={bewerbung.eyebrow} title={bewerbung.title} />
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
