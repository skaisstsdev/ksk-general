import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { NumberedList } from "@/components/page/NumberedList";
import { PageClosing } from "@/components/page/PageClosing";
import { PageHero } from "@/components/page/PageHero";
import { PhotoSplit } from "@/components/page/PhotoSplit";
import { RuledList } from "@/components/page/RuledList";
import { SectionHeading, StickyHeading } from "@/components/page/SectionHeading";
import { ArrowRight } from "@/components/ui/icons";
import { Col, Grid } from "@/components/ui/Grid";
import { Rule } from "@/components/ui/Rule";
import { closing } from "@/content/home";
import {
  geschichte,
  hero,
  kooperationen,
  leitbild,
  meta,
  social,
  team,
} from "@/content/pages/ueber-uns";
import { closingFamily } from "@/content/pages/shared";
import { social as socialLinks } from "@/content/site";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

/**
 * Über uns. Порядок отличается от старого `ueber-uns.html` по решению
 * владельца: Team переехал на первое место сразу после хиро,
 * Geschichte — на второе, перед Leitbild.
 *
 *   1. хиро
 *   2. Team — люди за компанией
 *   3. Geschichte — фото основателя
 *   4. Leitbild — пять принципов
 *   5. Kooperationen — с кем работаем
 *   6. Social Media
 *   7. закрывающий разворот
 */
export default async function UeberUnsPage({
  params,
}: PageProps<"/[locale]/ueber-uns">) {
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
          { href: "/kontakt", label: hero.kontakt, variant: "secondary" },
        ]}
      />

      <section className="pt-break">
        <Grid>
          <Col>
            <SectionHeading eyebrow={team.eyebrow} title={team.title} />

            <ul className="mt-xl grid gap-x-lg gap-y-xl sm:grid-cols-2 lg:grid-cols-4">
              {team.members.map((member, i) => (
                <li key={member.name} className="flex flex-col gap-2xs">
                  <Rule index={i} />
                  <h3 className="mt-md text-h4 text-ink">{member.name}</h3>
                  <p className="text-ui text-violet">{member.role}</p>
                  <p className="mt-2xs text-meta text-ink-soft">{member.desc}</p>
                  {"desc2" in member && member.desc2 ? (
                    <p className="text-meta text-ink-soft">{member.desc2}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Col>
        </Grid>
      </section>

      <PhotoSplit
        pause="turn"
        photo={{
          src: "/img/gruender.webp",
          alt: "Viktor Beresnev, Gründer von KSK Farmos, im Gespräch mit einer Mitarbeiterin",
          ratio: "4 / 3",
          ratioLg: "3 / 2",
        }}
      >
        <SectionHeading eyebrow={geschichte.eyebrow} title={geschichte.title} />
        <div className="mt-md flex flex-col gap-sm">
          {geschichte.paragraphs.map((p) => (
            <p key={p} className="text-body text-ink-soft">
              {p}
            </p>
          ))}
        </div>
      </PhotoSplit>

      <section className="pt-turn">
        <Grid>
          <Col span="text">
            <StickyHeading eyebrow={leitbild.eyebrow} title={leitbild.title} />
          </Col>
          <Col span="aside">
            <NumberedList items={leitbild.items} />
          </Col>
        </Grid>
      </section>

      <PhotoSplit
        side="end"
        pause="turn"
        photo={{
          src: "/img/kooperation.webp",
          alt: "Pflegeberaterin und Seniorin besprechen gemeinsam Unterlagen",
          ratio: "3 / 4",
        }}
      >
        <SectionHeading eyebrow={kooperationen.eyebrow} title={kooperationen.title} />
        <RuledList className="mt-md" items={kooperationen.items} />
      </PhotoSplit>

      <section className="pt-beat">
        <Grid>
          <Col span="text">
            <SectionHeading
              eyebrow={social.eyebrow}
              title={social.title}
              lead={social.text}
            />
          </Col>
          <Col span="aside" className="flex flex-col justify-center gap-md">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between border-b border-line py-sm text-h4 text-ink transition-colors hover:text-violet"
            >
              Instagram
              <ArrowRight className="size-5 text-violet transition-transform duration-200 ease-out-soft group-hover:translate-x-1 rtl:-scale-x-100" />
            </a>
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between border-b border-line py-sm text-h4 text-ink transition-colors hover:text-violet"
            >
              Facebook
              <ArrowRight className="size-5 text-violet transition-transform duration-200 ease-out-soft group-hover:translate-x-1 rtl:-scale-x-100" />
            </a>
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
