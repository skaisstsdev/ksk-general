import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { NumberedList } from "@/components/page/NumberedList";
import { PageClosing } from "@/components/page/PageClosing";
import { PageHero } from "@/components/page/PageHero";
import { PhotoSplit } from "@/components/page/PhotoSplit";
import { RuledList } from "@/components/page/RuledList";
import { SectionHeading, StickyHeading } from "@/components/page/SectionHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ExpandingPhoto } from "@/components/ui/ExpandingPhoto";
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

      {/* Тот же приём, что у `Moment` на главной: кадр растёт при
          прокрутке, текст проявляется следом. По просьбе владельца —
          для блока Geschichte, с командным фото вместо портрета
          основателя. Без верхнего отступа по той же причине, что
          и там: пауза заложена в самой сцене. */}
      <section>
        <ExpandingPhoto
          src="/img/team-garten.webp"
          width={2000}
          height={1125}
          srcNarrow="/img/team-garten-hoch.webp"
          widthNarrow={1000}
          heightNarrow={1502}
          alt="Das Team von KSK Farmos GmbH & Co. KG im Garten"
        >
          <div className="flex max-w-[34rem] flex-col gap-xs">
            <Eyebrow className="text-paper/85">{geschichte.eyebrow}</Eyebrow>
            <h3 className="text-h2 text-paper">{geschichte.title}</h3>
            {geschichte.paragraphs.map((p) => (
              <p key={p} className="text-body text-paper/90 lg:text-lead">
                {p}
              </p>
            ))}
          </div>
        </ExpandingPhoto>
      </section>

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

      {/* Фиолетовый на весь разворот — тот же приём, что у ServiceList
          на главной и у Kostenübernahme/Wohnprojekte на Leistungen:
          не карточка внутри блока, а сам блок целиком, во всю ширину
          экрана. Своя, не через `SectionHeading` разметка заголовка —
          тому компоненту неоткуда взять `white-pure` вместо `ink`. */}
      <section className="pt-beat">
        <div className="bg-violet">
          <Grid className="py-2xl lg:py-3xl">
            <Col span="text">
              <Eyebrow className="text-white-pure/90">{social.eyebrow}</Eyebrow>
              <h2 className="mt-2xs max-w-[18ch] text-h1 text-white-pure hyphens-auto">
                {social.title}
              </h2>
              <p className="mt-md max-w-[40ch] text-body text-white-pure/90">
                {social.text}
              </p>
            </Col>
            <Col span="aside" className="flex flex-col justify-center gap-md">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-b border-white-pure/25 py-sm text-h4 text-white-pure underline decoration-transparent underline-offset-4 transition-colors hover:decoration-white-pure/50"
              >
                Instagram
                <ArrowRight className="size-5 shrink-0 text-white-pure transition-transform duration-200 ease-out-soft rtl:-scale-x-100" />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-b border-white-pure/25 py-sm text-h4 text-white-pure underline decoration-transparent underline-offset-4 transition-colors hover:decoration-white-pure/50"
              >
                Facebook
                <ArrowRight className="size-5 shrink-0 text-white-pure transition-transform duration-200 ease-out-soft rtl:-scale-x-100" />
              </a>
            </Col>
          </Grid>
        </div>
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
