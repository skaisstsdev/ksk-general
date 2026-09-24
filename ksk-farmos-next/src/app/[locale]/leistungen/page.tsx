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
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Photo } from "@/components/ui/Photo";
import { StickyCol } from "@/components/ui/StickyCol";
import { closing } from "@/content/home";
import {
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
 * Leistungen. Порядок блоков отличается от старого `leistungen.html`
 * по решению владельца: вводная фраза про Beatmungspflege снята
 * целиком, häusliche Intensivpflege лишилась фотографии и встала
 * в тот же текстовый разворот, что диагнозы и Kostenübernahme, а
 * Wohnprojekte переехал сразу после неё — перед диагнозами, а не
 * после.
 *
 *   1. хиро
 *   2. häusliche Intensivpflege            #haeuslich
 *   3. Wohnprojekte                       #wohnprojekte
 *   4. кого берём — пять диагнозов
 *   5. Pflegeberatung                      #beratung
 *   6. кто платит
 *   7. закрывающий разворот
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

      <section id="haeuslich" className="pt-break">
        <Grid>
          <Col span="text">
            <SectionHeading
              eyebrow={haeuslich.eyebrow}
              title={haeuslich.title}
              lead={haeuslich.text}
            />
          </Col>

          <Col span="aside">
            <Accordion
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
          </Col>
        </Grid>
      </section>

      {/* Не `PhotoSplit`: тому компоненту неоткуда взять фиолетовый —
          он красит только колонку текста (см. её же приём на других
          страницах), а тут нужен фиолетовый под всем разворотом
          целиком, включая полосу за фото. Высоту фиолетового не
          назначаю числом — она сама берётся из высоты строки сетки,
          а строку задаёт самый высокий её элемент. Фото здесь выше
          текста (проверено: 4/5 при ширине колонки даёт кадр заметно
          выше шести строк вводного абзаца и двух коротких списков),
          поэтому нижняя граница фиолетового совпадает с нижним краем
          фото само собой — так же, как верхняя, без вычислений. */}
      <section id="wohnprojekte" className="overflow-x-clip pt-turn">
        <div className="bg-violet">
          <Grid className="lg:items-center">
            <Col span="text">
              <Photo
                src="/img/wohnprojekt.webp"
                alt="Seniorin und Betreuerin mit Tablet im Wintergarten eines Wohnprojekts"
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
            <NumberedList items={diagnosen.items} />
          </Col>
        </Grid>
      </section>

      <PhotoSplit
        id="beratung"
        side="end"
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
        <div className="bg-violet">
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
              <ul className="flex flex-col gap-lg">
                {kosten.items.map((item, i) => (
                  <li key={item.title} className="flex items-baseline gap-md">
                    <span className="w-[2ch] shrink-0 text-meta tabular-nums text-white-pure/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-2xs">
                      <h3 className="text-h3 text-white-pure">{item.title}</h3>
                      <div className="text-ui text-white-pure/90">
                        <p>{item.text}</p>
                        {"list" in item ? (
                          <ul className="mt-2xs flex list-disc flex-col gap-3xs ps-md">
                            {item.list.map((entry) => (
                              <li key={entry}>{entry}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
