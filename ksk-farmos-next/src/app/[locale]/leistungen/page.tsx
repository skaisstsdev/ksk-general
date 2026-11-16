import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Accordion } from "@/components/page/Accordion";
import { DetailList } from "@/components/page/DetailList";
import { NumberedList } from "@/components/page/NumberedList";
import { PageBanner } from "@/components/page/PageBanner";
import { PageClosing } from "@/components/page/PageClosing";
import { PhotoCarousel } from "@/components/page/PhotoCarousel";
import { PhotoSplit } from "@/components/page/PhotoSplit";
import { RuledGrid } from "@/components/page/RuledGrid";
import { RuledList } from "@/components/page/RuledList";
import { SectionHeading, StickyHeading } from "@/components/page/SectionHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Rule } from "@/components/ui/Rule";
import { SlideIn } from "@/components/ui/SlideIn";
import { StickyCol } from "@/components/ui/StickyCol";
import { haeuslichGroupIds } from "@/content/pages/leistungen";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/leistungen">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "leistungen" });
  return buildPageMetadata({
    locale,
    path: "/leistungen",
    title: t("meta.title"),
    description: t("meta.description"),
    image: "/img/leistungen/wohnen-lounge-hd.webp",
  });
}

/**
 * Leistungen. Порядок блоков отличается от старого `leistungen.html`
 * по решению владельца: вводная фраза про Beatmungspflege снята
 * целиком, häusliche Intensivpflege лишилась фотографии и встала
 * в тот же текстовый разворот, что диагнозы и Kostenübernahme, а
 * Wohnprojekte переехал сразу после неё — перед диагнозами, а не
 * после.
 *
 *   1. häusliche Intensivpflege            #haeuslich
 *   2. Wohnprojekte                       #wohnprojekte
 *   3. кого берём — пять диагнозов
 *   4. Pflegeberatung                      #beratung
 *   5. кто платит
 *   6. закрывающий разворот
 *
 * Сверху — мини-хиро (`PageBanner`): узкая полоса с фото и названием
 * раздела. Полноэкранного хиро на этой странице нет.
 *
 * Якоря `#haeuslich`, `#wohnprojekte`, `#beratung` — цели ссылок
 * из списка услуг главной. В старом сайте два последних назывались
 * `#aufenthalt` и `#fortbildung` и с главной не совпадали.
 */
/** Порядок кадров ленты Wohnprojekte — тот же, что у подписей `wohnprojekte.gallery.alts`. */
const wohnenFotos = ["lounge", "kueche", "treppenlift", "flur", "wohnraum"] as const;

export default async function LeistungenPage({
  params,
}: PageProps<"/[locale]/leistungen">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("leistungen");
  const tHome = await getTranslations("home");
  const tCommon = await getTranslations("common");

  const haeuslich = t.raw("haeuslich");
  const haeuslichGroups = haeuslich.groups.map(
    (group: { title: string; items: string[]; detail: string }, i: number) => ({
      ...group,
      id: haeuslichGroupIds[i],
    }),
  );
  const diagnosen = t.raw("diagnosen");
  const wohnprojekte: {
    eyebrow: string;
    title: string;
    text: string;
    groups: { title: string; items: string[] }[];
    gallery: {
      region: string;
      prev: string;
      next: string;
      goTo: string;
      alts: string[];
    };
  } = t.raw("wohnprojekte");
  const beratung = t.raw("beratung");
  const kosten: {
    eyebrow: string;
    title: string;
    text: string;
    items: { title: string; text: string; list?: string[] }[];
  } = t.raw("kosten");
  const closingFamily = tCommon.raw("closingFamily");

  return (
    <>
      <PageBanner
        title={tCommon("nav.leistungen")}
        image={{
          src: "/img/leistungen/hero-hd.webp",
          alt: t("hero.alt"),
          position: "center 60%",
        }}
      />

      <section id="haeuslich" className="pt-break">
        <Grid>
          <Col span="text">
            <SectionHeading
              as="h2"
              eyebrow={haeuslich.eyebrow}
              title={haeuslich.title}
              lead={haeuslich.text}
            />
          </Col>

          <Col span="aside">
            <Accordion
              defaultOpen={haeuslichGroups[0].id}
              items={haeuslichGroups.map(
                (group: {
                  id: string;
                  title: string;
                  items: string[];
                  detail: string;
                }) => ({
                  id: group.id,
                  title: group.title,
                  content: (
                    <DetailList
                      title={group.title}
                      items={group.items}
                      detail={group.detail}
                      moreLabel={t("moreCta")}
                      closeLabel={tCommon("dialog.close")}
                    />
                  ),
                }),
              )}
            />
          </Col>
        </Grid>
      </section>

      {/* Wohnprojekte. Белый разворот: слева лента кадров
          (`PhotoCarousel`), закреплённая под шапкой, пока справа
          проезжает текст; кадры листаются сами и вручную. Лента
          выезжает из-за левого края вслед за прокруткой (`SlideIn`). Ниже `lg`
          лента идёт первой, от края до края, текст под ней.

          Справа три блока — заголовок с вводным абзацем и два
          списка — с умеренной паузой между ними. */}
      <section id="wohnprojekte" className="overflow-x-clip pt-turn">
        <Grid>
          <Col span="text">
            <div className="bleed-start-capped bleed-end lg:sticky lg:top-[calc(var(--header-h)+var(--spacing-lg))] lg:me-0">
              <SlideIn from="start">
                <PhotoCarousel
                  className="aspect-[3/2]"
                  slides={wohnprojekte.gallery.alts.map((alt: string, i: number) => ({
                    src: `/img/leistungen/wohnen-${wohnenFotos[i]}-hd.webp`,
                    alt,
                  }))}
                  labels={wohnprojekte.gallery}
                />
              </SlideIn>
            </div>
          </Col>

          <Col span="aside" className="flex flex-col gap-xl lg:gap-2xl lg:pt-xl">
            <div>
              <Eyebrow className="text-ink-muted">{wohnprojekte.eyebrow}</Eyebrow>
              <h2 className="mt-2xs text-h1 text-ink">{wohnprojekte.title}</h2>
              <p className="mt-md text-body text-ink-soft">{wohnprojekte.text}</p>
            </div>

            {/* Сначала «Wohnen & Ausstattung», потом «Betreuung & Service» —
                в словаре они идут в обратном порядке. */}
            {[...wohnprojekte.groups].reverse().map((group) => (
              <RuledList
                key={group.title}
                title={group.title.replace("\n", " ")}
                items={group.items}
              />
            ))}
          </Col>
        </Grid>
      </section>

      {/* Диагнозы — фиолетовый разворот на всю ширину, как Kostenübernahme
          ниже по странице: заливка общая на оба столбца, закреплённый
          заголовок слева не оставляет под собой белой полосы. Между
          двумя фиолетовыми блоками стоит белый (Pflegeberatung). */}
      <section id="krankheitsbild" className="pt-turn">
        <div data-tone="dark" className="bg-violet">
          <Grid className="py-2xl lg:py-3xl">
            <Col span="text">
              <StickyHeading
                tone="paper"
                eyebrow={diagnosen.eyebrow}
                title={diagnosen.title}
                lead={diagnosen.text}
              />
            </Col>
            <Col span="aside">
              <NumberedList
                tone="paper"
                items={diagnosen.items}
                moreLabel={t("moreCta")}
                closeLabel={tCommon("dialog.close")}
              />
            </Col>
          </Grid>
        </div>
      </section>

      <PhotoSplit
        id="beratung"
        side="end"
        pause="turn"
        photo={{
          src: "/img/leistungen/beratung-pumpe-hd.webp",
          alt: beratung.alt,
          ratio: "3 / 2",
          position: "60% 40%",
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

      {/* Единственное место на сайте, где подложка красит целый блок,
          не отдельную карточку внутри него, — по прямому решению
          владельца (испробовали построчную заливку бледным, затем
          насыщенным `violet-light`, в итоге — основной бренд-фиолетовый
          на всю ширину). Это расходится с правилом «подложка не
          разделяет блоки»: здесь она обособляет один конкретный раздел
          намеренно, как исключение, а не как повторяющийся приём.

          Текст — `white-pure`: в токенах он так и подписан («текст на
          фиолетовом»), та же пара, что у заливки primary-кнопки.
          7.4:1 у сплошного текста, не ниже 5.4:1 даже у приглушённых
          через прозрачность — вопросов к контрасту здесь нет, в отличие
          от промежуточного варианта на `violet-light`.

          Левая колонка закреплена (`StickyCol`) — тем же приёмом, что
          и в остальных разделах страницы: заголовок держится на месте,
          пока читается перечень. Фиолетовое поле общее на весь блок,
          поэтому под закреплённым заголовком не проглядывает белая
          страница — заливка не обрывается вместе с высотой колонки. */}
      <section id="kosten" className="pt-turn">
        <div data-tone="dark" className="bg-violet">
          <Grid className="py-2xl lg:py-3xl">
            <Col span="text">
              <StickyCol>
                <Eyebrow className="text-white-pure/90">{kosten.eyebrow}</Eyebrow>
                <h2 className="mt-2xs max-w-[14ch] text-h1 text-white-pure">
                  {kosten.title}
                </h2>
                <p className="mt-md max-w-[40ch] text-body text-white-pure/90">
                  {kosten.text}
                </p>
              </StickyCol>
            </Col>

            <Col span="aside">
              <ul>
                {kosten.items.map((item, i) => (
                  <li key={item.title}>
                    <Rule index={i} tone="paper" />
                    <div className="flex items-baseline gap-md py-lg">
                      <span className="w-[2ch] shrink-0 text-meta tabular-nums text-white-pure/80">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex flex-col gap-2xs">
                        <h3 className="text-h3 text-white-pure">{item.title}</h3>
                        <div className="text-ui text-white-pure/90">
                          <p>{item.text}</p>
                          {item.list ? (
                            <ul className="mt-2xs flex list-disc flex-col gap-3xs ps-md">
                              {item.list.map((entry) => (
                                <li key={entry}>{entry}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                <li aria-hidden="true">
                  <Rule index={kosten.items.length} tone="paper" />
                </li>
              </ul>
            </Col>
          </Grid>
        </div>
      </section>

      <PageClosing
        eyebrow={closingFamily.eyebrow}
        title={closingFamily.title}
        text={closingFamily.text}
        points={tHome.raw("closing.points")}
        action={{ href: "/beratung", label: closingFamily.cta }}
      />
    </>
  );
}
