import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { Accordion } from "@/components/page/Accordion";
import { NumberedList } from "@/components/page/NumberedList";
import { PageClosing } from "@/components/page/PageClosing";
import { PageHero } from "@/components/page/PageHero";
import { PhotoSplit } from "@/components/page/PhotoSplit";
import { RuledGrid } from "@/components/page/RuledGrid";
import { RuledList } from "@/components/page/RuledList";
import { SectionHeading, StickyHeading } from "@/components/page/SectionHeading";
import { Col, Grid } from "@/components/ui/Grid";
import { closing } from "@/content/home";
import {
  beatmung,
  beratung,
  diagnosen,
  haeuslich,
  hero,
  kosten,
  meta,
  wohnprojekte,
} from "@/content/pages/leistungen";
import { closingFamily } from "@/content/pages/shared";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

/**
 * Leistungen. Порядок блоков — как в старом `leistungen.html`:
 *
 *   1. хиро
 *   2. Beatmungspflege — ключевая компетенция, одной фразой
 *   3. häusliche Intensivpflege            #haeuslich
 *   4. кого берём — пять диагнозов
 *   5. Wohnprojekte                       #wohnprojekte
 *   6. Pflegeberatung                      #beratung
 *   7. кто платит
 *   8. закрывающий разворот
 *
 * Якоря `#haeuslich`, `#wohnprojekte`, `#beratung` — цели ссылок
 * из списка услуг главной. В старом сайте два последних назывались
 * `#aufenthalt` и `#fortbildung` и с главной не совпадали.
 */
export default async function LeistungenPage({
  params,
}: PageProps<"/[locale]/leistungen">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.lead}
        actions={[
          { href: "/beratung", label: hero.beratung },
          {
            href: "/leistungen#haeuslich",
            label: hero.all,
            variant: "secondary",
          },
        ]}
      />

      {/* Одна крупная фраза — как вводная фраза главной после хиро. */}
      <section className="pt-break">
        <Grid>
          <Col span="wide">
            <p className="text-h2 text-ink">{beatmung.statement}</p>
            <p className="mt-md text-lead text-ink-soft">{beatmung.text}</p>
          </Col>
        </Grid>
      </section>

      <PhotoSplit
        id="haeuslich"
        align="start"
        photo={{
          src: "/img/haeuslich.jpg",
          alt: "Pflegefachkraft von KSK Farmos mit Notfalltasche am Einsatzfahrzeug",
          ratio: "4 / 3",
          ratioLg: "1 / 1",
          position: "90% 50%",
        }}
      >
        <SectionHeading
          eyebrow={haeuslich.eyebrow}
          title={haeuslich.title}
          lead={haeuslich.text}
        />

        <Accordion
          className="mt-xl"
          defaultOpen={haeuslich.groups[0].id}
          items={haeuslich.groups.map((group) => ({
            id: group.id,
            title: group.title,
            content: (
              <ul className="flex flex-col gap-3xs">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ),
          }))}
        />
      </PhotoSplit>

      <section id="krankheitsbild" className="pt-turn">
        <Grid>
          <Col span="text">
            <StickyHeading eyebrow={diagnosen.eyebrow} title={diagnosen.title} />
          </Col>
          <Col span="aside">
            <NumberedList items={diagnosen.items} />
          </Col>
        </Grid>
      </section>

      <PhotoSplit
        id="wohnprojekte"
        side="end"
        pause="turn"
        photo={{
          src: "/img/wohnprojekt.webp",
          alt: "Seniorin und Betreuerin mit Tablet im Wintergarten eines Wohnprojekts",
          ratio: "4 / 5",
          position: "40% 60%",
        }}
      >
        <SectionHeading
          eyebrow={wohnprojekte.eyebrow}
          title={wohnprojekte.title}
          lead={wohnprojekte.text}
        />

        <div className="mt-xl grid gap-x-lg gap-y-xl sm:grid-cols-2">
          {wohnprojekte.groups.map((group) => (
            <RuledList key={group.title} title={group.title} items={group.items} />
          ))}
        </div>
      </PhotoSplit>

      <PhotoSplit
        id="beratung"
        pause="turn"
        photo={{
          src: "/img/beratung.webp",
          alt: "Pflegeberaterin und Seniorin besprechen gemeinsam Unterlagen auf dem Tablet",
          ratio: "3 / 2",
          position: "40% 40%",
        }}
      >
        <SectionHeading
          eyebrow={beratung.eyebrow}
          title={beratung.title}
          lead={beratung.text}
        />
      </PhotoSplit>

      <section className="pt-beat">
        <Grid>
          <Col>
            <RuledGrid items={beratung.items} />
          </Col>
        </Grid>
      </section>

      <section id="kosten" className="pt-turn">
        <Grid>
          <Col span="text">
            <StickyHeading
              eyebrow={kosten.eyebrow}
              title={kosten.title}
              lead={kosten.text}
            />
          </Col>
          <Col span="aside">
            <NumberedList
              items={kosten.items.map((item) => ({
                title: item.title,
                text:
                  "list" in item ? (
                    <>
                      <p>{item.text}</p>
                      <ul className="mt-2xs flex list-disc flex-col gap-3xs ps-md">
                        {item.list.map((entry) => (
                          <li key={entry}>{entry}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    item.text
                  ),
              }))}
            />
          </Col>
        </Grid>
      </section>

      <PageClosing
        eyebrow={closingFamily.eyebrow}
        title={closingFamily.title}
        text={closingFamily.text}
        points={closing.points}
        action={{ href: "/beratung", label: closingFamily.cta }}
      />
    </>
  );
}
