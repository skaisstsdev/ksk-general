import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { NumberedList } from "@/components/page/NumberedList";
import { PageBanner } from "@/components/page/PageBanner";
import { RuledList } from "@/components/page/RuledList";
import { SectionHeading, StickyHeading } from "@/components/page/SectionHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ExpandingPhoto } from "@/components/ui/ExpandingPhoto";
import { ArrowRight } from "@/components/ui/icons";
import { Col, Grid } from "@/components/ui/Grid";
import { Photo } from "@/components/ui/Photo";
import { Rule } from "@/components/ui/Rule";
import { teamMemberNames } from "@/content/pages/ueber-uns";
import { social as socialLinks } from "@/content/site";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/ueber-uns">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ueberUns" });
  return buildPageMetadata({
    locale,
    path: "/ueber-uns",
    title: t("meta.title"),
    description: t("meta.description"),
    image: "/img/ueber-uns/team-sofa-3-orig.webp",
  });
}

/**
 * Über uns. Порядок и состав отличаются от старого `ueber-uns.html`
 * по решению владельца: Team стоит на первом месте, Geschichte — на
 * втором, перед Leitbild, закрывающий разворот (`PageClosing`) убран
 * со страницы совсем, и последним блоком стоит Social Media.
 *
 *   1. Team — люди за компанией
 *   2. Geschichte — фото основателя
 *   3. Leitbild — пять принципов
 *   4. Kooperationen — с кем работаем
 *   5. Social Media
 *
 * Сверху — мини-хиро (`PageBanner`) с названием раздела, как на
 * Leistungen. Полноэкранного хиро на этой странице нет.
 */
export default async function UeberUnsPage({
  params,
}: PageProps<"/[locale]/ueber-uns">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ueberUns");
  const tCommon = await getTranslations("common");
  const leitbild = t.raw("leitbild");
  const geschichte: { eyebrow: string; title: string; paragraphs: string[] } = t.raw("geschichte");
  const team: {
    eyebrow: string;
    title: string;
    members: { name: string; role: string; desc: string; desc2: string }[];
  } = t.raw("team");
  const kooperationen = t.raw("kooperationen");
  const social = t.raw("social");
  const teamMembers = team.members.map((member, i) => ({
    ...member,
    name: teamMemberNames[i] ?? member.name,
  }));

  return (
    <>
      <PageBanner
        title={tCommon("nav.ueberUns")}
        image={{
          src: "/img/ueber-uns/banner-hd.webp",
          alt: t("hero.bannerAlt"),
          position: "center 68%",
        }}
      />

      <section className="pt-break">
        <Grid>
          <Col>
            <SectionHeading as="h2" eyebrow={team.eyebrow} title={team.title} />

            <ul className="mt-xl grid gap-x-lg gap-y-xl sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, i) => (
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
          src="/img/ueber-uns/team-sofa-3-hd.webp"
          width={2696}
          height={2008}
          srcNarrow="/img/ueber-uns/team-sofa-2-hoch-hd2.webp"
          widthNarrow={2244}
          heightNarrow={2804}
          position="center 60%"
          alt={t("hero.alt")}
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

      {/* Leitbild — фиолетовый разворот на всю ширину (заливка общая
          на оба столбца, закреплённый заголовок слева не оставляет под
          собой белой полосы). Стоит вплотную к кадру Geschichte выше —
          без белой паузы. Следом идёт белый разворот с фото. */}
      <section>
        <div data-tone="dark" className="bg-violet">
          <Grid className="py-2xl lg:py-3xl">
            <Col span="text">
              <StickyHeading
                tone="paper"
                eyebrow={leitbild.eyebrow}
                title={leitbild.title}
                lead={leitbild.text}
              />
            </Col>
            <Col span="aside">
              <NumberedList tone="paper" items={leitbild.items} />
            </Col>
          </Grid>
        </div>
      </section>

      {/* Kooperationen — белый разворот: кадр уходит в левый край
          экрана, верх кадра на одной линии с верхом текстового блока
          (метка над заголовком) и закреплён под шапкой, пока справа
          проезжает список. На телефоне кадр идёт первым, текст под ним. */}
      <section className="overflow-x-clip pt-turn">
        <Grid>
          <Col span="text">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+var(--spacing-lg))]">
              <Photo
                src="/img/ueber-uns/kooperation-arbeit-orig.webp"
                alt={kooperationen.alt}
                ratio="3 / 2"
                sizes="(min-width: 1024px) 55vw, 100vw"
                bleed="start"
                slide
                parallax
              />
            </div>
          </Col>

          <Col span="aside">
            <Eyebrow className="text-ink-muted">{kooperationen.eyebrow}</Eyebrow>
            <h2 className="mt-2xs text-h1 text-ink">{kooperationen.title}</h2>
            <p className="mt-md max-w-[40ch] text-body text-ink-soft">
              {kooperationen.text}
            </p>
            <RuledList className="mt-md" items={kooperationen.items} />
          </Col>
        </Grid>
      </section>

      {/* Закрывающий разворот (`PageClosing`) убран с этой страницы
          целиком по просьбе владельца — последний блок теперь Social
          Media. Отступы — как у обычного разворота «заголовок слева,
          перечень справа» (ServiceList, Kooperationen): раньше правая
          колонка была растянута через `justify-center` до высоты
          левой и центрировалась в ней, из-за чего между двумя
          короткими ссылками и следующим блоком оставался неоправданно
          большой зазор. Здесь тот же верхний край у обеих колонок,
          без трюка. */}
      <section className="pt-turn pb-turn">
        <Grid>
          <Col span="text">
            <SectionHeading
              eyebrow={social.eyebrow}
              title={social.title}
              lead={social.text}
            />
          </Col>
          <Col span="aside" className="flex flex-col gap-md">
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
            {/* Не сеть — ссылка на карточку компании в Google Maps
                (`social.googleProfile`), не на форму отзыва: та
                (`social.googleReview`) отдельно используется на главной
                кнопкой «Bewertung abgeben» под отзывами. */}
            <a
              href={socialLinks.googleProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between border-b border-line py-sm text-h4 text-ink transition-colors hover:text-violet"
            >
              Google
              <ArrowRight className="size-5 text-violet transition-transform duration-200 ease-out-soft group-hover:translate-x-1 rtl:-scale-x-100" />
            </a>
          </Col>
        </Grid>
      </section>
    </>
  );
}
