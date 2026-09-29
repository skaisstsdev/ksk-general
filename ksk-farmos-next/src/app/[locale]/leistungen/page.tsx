import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Accordion } from "@/components/page/Accordion";
import { DetailList } from "@/components/page/DetailList";
import { NumberedList } from "@/components/page/NumberedList";
import { PageClosing } from "@/components/page/PageClosing";
import { PhotoSplit } from "@/components/page/PhotoSplit";
import { RuledGrid } from "@/components/page/RuledGrid";
import { RuledList } from "@/components/page/RuledList";
import { SectionHeading, StickyHeading } from "@/components/page/SectionHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Photo } from "@/components/ui/Photo";
import { Rule } from "@/components/ui/Rule";
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
    image: "/img/leistungen/wohnprojekt.webp",
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
 * Хиро (полноэкранное фото) на этой странице временно убрано по
 * просьбе владельца — страница начинается сразу с первого блока.
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
    alt: string;
    groups: { title: string; items: string[] }[];
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
      <section id="haeuslich" className="pt-[calc(var(--header-h)+var(--spacing-break))]">
        <Grid>
          <Col span="text">
            <SectionHeading
              as="h1"
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

      {/* Не `PhotoSplit`: тому компоненту неоткуда взять фиолетовый —
          он красит только колонку текста (см. её же приём на других
          страницах), а тут нужен фиолетовый под всем разворотом
          целиком, включая полосу за фото. От `lg` высоту фиолетового
          не назначаю числом — она сама берётся из высоты строки сетки,
          а строку задаёт самый высокий её элемент. Фото здесь выше
          текста (проверено: 4/5 при ширине колонки даёт кадр заметно
          выше шести строк вводного абзаца и двух коротких списков),
          поэтому нижняя граница фиолетового совпадает с нижним краем
          фото само собой — так же, как верхняя, без вычислений.

          Ниже `lg` колонки складываются в столбец, и последним идёт
          не фото, а текст — этому трюку неоткуда взять отступ снизу,
          поэтому `pb-2xl` здесь назначен явно, тем же значением, что
          у остальных фиолетовых разворотов сайта (Kostenübernahme на
          этой же странице, Vakanzen+Bewerbung на Karriere, услуги
          главной). */}
      <section id="wohnprojekte" className="overflow-x-clip pt-turn">
        <div data-tone="dark" className="bg-violet">
          <Grid className="pb-2xl lg:items-center lg:pb-0">
            <Col span="text">
              <Photo
                src="/img/leistungen/wohnprojekt.webp"
                alt={wohnprojekte.alt}
                ratio="4 / 5"
                position="40% 60%"
                sizes="(min-width: 1024px) 55vw, 100vw"
                bleed="start"
                slide
                parallax
              />
            </Col>

            <Col span="aside">
              <Eyebrow className="text-white-pure/90">{wohnprojekte.eyebrow}</Eyebrow>
              <h2 className="mt-2xs max-w-[18ch] text-h1 text-white-pure hyphens-auto">
                {wohnprojekte.title}
              </h2>
              <p className="mt-md max-w-[40ch] text-body text-white-pure/90">
                {wohnprojekte.text}
              </p>

              <div className="mt-xl grid gap-x-lg gap-y-xl sm:grid-cols-2">
                {wohnprojekte.groups.map((group) => (
                  <RuledList
                    key={group.title}
                    title={group.title}
                    items={group.items}
                    tone="paper"
                  />
                ))}
              </div>
            </Col>
          </Grid>
        </div>
      </section>

      <section id="krankheitsbild" className="pt-turn">
        <Grid>
          <Col span="text">
            <StickyHeading eyebrow={diagnosen.eyebrow} title={diagnosen.title} />
          </Col>
          <Col span="aside">
            <NumberedList
              items={diagnosen.items}
              moreLabel={t("moreCta")}
              closeLabel={tCommon("dialog.close")}
            />
          </Col>
        </Grid>
      </section>

      <PhotoSplit
        id="beratung"
        side="end"
        pause="turn"
        photo={{
          src: "/img/leistungen/beratung.webp",
          alt: beratung.alt,
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
