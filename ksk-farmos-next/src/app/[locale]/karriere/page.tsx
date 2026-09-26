import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { NumberedList } from "@/components/page/NumberedList";
import { PageClosing } from "@/components/page/PageClosing";
import { PageHero } from "@/components/page/PageHero";
import { SectionHeading, StickyHeading } from "@/components/page/SectionHeading";
import { StepsGrid } from "@/components/page/StepsGrid";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Rule } from "@/components/ui/Rule";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/karriere">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "karriere" });
  return { title: t("meta.title"), description: t("meta.description") };
}

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
  const t = await getTranslations("karriere");
  const hero = t.raw("hero");
  const benefits = t.raw("benefits");
  const vakanzen: {
    eyebrow: string;
    title: string;
    bewerben: string;
    items: { title: string; tags: string[] }[];
  } = t.raw("vakanzen");
  const bewerbung = t.raw("bewerbung");
  const closing = t.raw("closing");

  /**
   * На узких экранах естественный перенос даёт «Arbeiten, wo es» /
   * «wirklich zählt.» — по просьбе владельца заголовок разбит на три
   * строки вручную («Arbeiten,» / «wo es» / «wirklich zählt.»), только
   * для немецкого текста и только ниже `lg`: обычным переносом такое
   * неравномерное деление (9/5/15 символов) не получить ни при какой
   * ширине колонки — единственный способ передать её точно.
   */
  const heroTitle =
    locale === "de" ? (
      <>
        Arbeiten,
        <br className="lg:hidden" /> wo es
        <br className="lg:hidden" /> wirklich zählt.
      </>
    ) : (
      hero.title
    );

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={heroTitle}
        lead={hero.lead}
        actions={[
          { href: "/schnellbewerbung", label: hero.bewerben },
          {
            href: "/karriere#vakanzen",
            label: hero.vakanzen,
            variant: "secondary",
            // От `lg` ширина по первой кнопке: вторая короче по тексту
            // и без этого заметно уже — тем же приёмом, что у дверей
            // хиро главной (`hero/HeroCopy.tsx`). На телефоне обе и так
            // `w-full` (см. `PageHero.tsx`), этот `min-w` там ни на что
            // не влияет.
            className: "justify-center lg:min-w-[176px]",
          },
        ]}
        image={{
          src: "/img/karriere/karriere-hero.webp",
          width: 2000,
          height: 1125,
          srcNarrow: "/img/karriere/karriere-hero-hoch.webp",
          widthNarrow: 1000,
          heightNarrow: 1502,
          alt: hero.alt,
        }}
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

      {/* Второе исключение из «подложка не разделяет блоки» на этой
          странице, по образцу Kostenübernahme на Leistungen: вакансии
          и шаги подачи заявки — по просьбе владельца один фиолетовый
          разворот на двоих, а не два отдельных блока. Фото здесь нет,
          поэтому высота фиолетового задаётся отступом (`py-2xl/3xl`),
          как в Kostenübernahme и в ServiceList на главной, а не берётся
          из кадра. Между вакансиями и шагами внутри — `mt-beat`: по
          просьбе владельца это теперь один блок, а не два, поэтому
          отступ внутри него меньше, чем между обычными разделами.

          Заголовок шагов — не `SectionHeading` (тот даёт `text-h1`,
          как у остальных разделов страницы), а `text-h2` напрямую, тем
          же приёмом, что у «In 3 Schritten zur Versorgung» на главной
          (`home/ServiceList.tsx` — раньше был отдельным `Steps.tsx`,
          теперь объединён с Leistungen тем же приёмом, что здесь):
          по прежней просьбе владельца этот блок должен выглядеть
          точно как его аналог там, и на фиолетовом поле это
          по-прежнему верно. */}
      <section id="vakanzen" className="pt-turn">
        <div data-tone="dark" className="bg-violet">
          <Grid className="pt-2xl lg:pt-3xl">
            <Col>
              <SectionHeading
                eyebrow={vakanzen.eyebrow}
                title={vakanzen.title}
                tone="paper"
              />

              <ul className="mt-xl">
                {vakanzen.items.map((item, i) => (
                  <li key={item.title}>
                    <Rule index={i} tone="paper" />
                    <div className="flex flex-col items-start gap-md py-md sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col gap-2xs">
                        <h3 className="text-h3 text-white-pure">{item.title}</h3>
                        <div className="flex flex-wrap gap-2xs">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-xs border border-white-pure/30 px-2xs py-3xs text-caption text-white-pure/80"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button
                        href="/schnellbewerbung"
                        variant="secondary"
                        size="sm"
                        className="border-white-pure/60 text-white-pure hover:border-white-pure hover:bg-white-pure/10"
                      >
                        {vakanzen.bewerben}
                      </Button>
                    </div>
                  </li>
                ))}
                <li aria-hidden="true">
                  <Rule index={vakanzen.items.length} tone="paper" />
                </li>
              </ul>
            </Col>
          </Grid>

          <Grid className="mt-beat pb-2xl lg:pb-3xl">
            <Col>
              <Eyebrow className="text-white-pure/90">{bewerbung.eyebrow}</Eyebrow>
              <h2 className="mt-2xs text-h2 text-white-pure">{bewerbung.title}</h2>
              <StepsGrid items={bewerbung.steps} tone="paper" />
            </Col>
          </Grid>
        </div>
      </section>

      {/* Тот же вид, что у закрывающего разворота для семьи на
          Leistungen/Über uns/FAQ/Kontakt (`closingFamily` + `points`
          из `home.ts`) — по просьбе владельца, вместо кнопки-обводки
          без пунктов. `action.variant` не задан — кнопка по умолчанию
          `primary`, фиолетовая. */}
      <PageClosing
        eyebrow={closing.eyebrow}
        title={closing.title}
        text={closing.text}
        points={closing.points}
        action={{
          href: "/schnellbewerbung",
          label: closing.cta,
        }}
      />
    </>
  );
}
