import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { NumberedList } from "@/components/page/NumberedList";
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

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/ueber-uns">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ueberUns" });
  return { title: t("meta.title"), description: t("meta.description") };
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
 * Хиро (полноэкранное фото) на этой странице временно убрано по
 * просьбе владельца — страница начинается сразу с первого блока.
 */
export default async function UeberUnsPage({
  params,
}: PageProps<"/[locale]/ueber-uns">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ueberUns");
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
      <section className="pt-[calc(var(--header-h)+var(--spacing-break))]">
        <Grid>
          <Col>
            <SectionHeading eyebrow={team.eyebrow} title={team.title} />

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
          src="/img/ueber-uns/team-garten.webp"
          width={2000}
          height={1125}
          srcNarrow="/img/ueber-uns/team-garten-hoch.webp"
          widthNarrow={1000}
          heightNarrow={1502}
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

      {/* Тот же приём, что у Wohnprojekte на Leistungen: фиолетовый
          на весь разворот, включая полосу за фото, но по высоте
          не выходит за пределы самой фотографии — высота фиолетового
          ничем не назначена, она берётся из высоты строки сетки,
          а строку задаёт более высокий из двух элементов. Ниже `lg`
          колонки складываются в столбец и последней идёт не фото,
          а текст — `pb-2xl` даёт ей отступ снизу тем же значением,
          что у остальных фиолетовых разворотов сайта. */}
      <section className="overflow-x-clip pt-turn">
        <div data-tone="dark" className="bg-violet">
          <Grid className="pb-2xl lg:items-center lg:pb-0">
            <Col span="text">
              <Photo
                src="/img/ueber-uns/kooperation-team.webp"
                alt={kooperationen.alt}
                ratio="4 / 5"
                sizes="(min-width: 1024px) 55vw, 100vw"
                bleed="start"
                slide
                parallax
              />
            </Col>

            <Col span="aside">
              <Eyebrow className="text-white-pure/90">{kooperationen.eyebrow}</Eyebrow>
              <h2 className="mt-2xs max-w-[18ch] text-h1 text-white-pure hyphens-auto">
                {kooperationen.title}
              </h2>
              <p className="mt-md max-w-[40ch] text-body text-white-pure/90">
                {kooperationen.text}
              </p>
              <RuledList className="mt-md" items={kooperationen.items} tone="paper" />
            </Col>
          </Grid>
        </div>
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
            {/* Не сеть — ссылка на профиль компании в Google (отзывы
                и карточка на Google Maps). Тот же адрес, что уже
                используется на главной кнопкой «Bewertung abgeben»
                под отзывами (`social.googleReview` в `site.ts`) —
                не новый реквизит, а повтор существующего. */}
            <a
              href={socialLinks.googleReview}
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
