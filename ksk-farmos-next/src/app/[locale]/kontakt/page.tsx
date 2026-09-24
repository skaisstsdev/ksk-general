import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { ConsentMap } from "@/components/page/ConsentMap";
import { StickyHeading } from "@/components/page/SectionHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { LocationCards } from "@/components/ui/LocationCards";
import { Rule } from "@/components/ui/Rule";
import { StickyCol } from "@/components/ui/StickyCol";
import { ContactForm } from "@/components/forms/ContactForm";
import { map as homeMap } from "@/content/home";
import { cards, form, hero, map, meta, standorte } from "@/content/pages/kontakt";
import { contact, impressum, locations } from "@/content/site";

/**
 * Volkmarsen первым — как на главной (`home/MapSection.tsx`),
 * `locations.headquarters` и есть Volkmarsen.
 */
const standorteItems = [
  {
    role: standorte.headquartersRole,
    city: locations.headquarters.city,
    street: `${locations.headquarters.street}, ${locations.headquarters.postalCode} ${locations.headquarters.city}`,
    phone: contact.phone.display,
  },
  {
    role: standorte.residenceRole,
    city: locations.residence.city,
    street: `${locations.residence.street}, ${locations.residence.postalCode} ${locations.residence.city}`,
    phone: contact.mobile.display,
  },
];

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

/**
 * Kontakt. Порядок блоков — как в старом `kontakt.html`, с тремя
 * отличиями по решению владельца: хиро на этой странице больше нет,
 * адрес Касселя, которого на старой странице не было ни разу, и
 * согласие на карту, которое теперь запоминается (`ConsentMap`)
 * вместо того, чтобы спрашиваться заново при каждом визите.
 *
 *   1. закреплённый заголовок слева, форма справа
 *   2. каналы связи строкой (телефон, мобильный, почта, факс)
 *   3. Standorte — буквально тот же блок, что MapSection на главной
 *      (тот же заголовок и подтекст), но вместо карты Гессена —
 *      карта Volkmarsen по согласию, а под ней те же карточки адресов
 *      (`LocationCards`, вынесен из `HesseMap`)
 *
 * Закрывающего разворота («Kostenlose Beratung» → `/beratung`) здесь
 * больше нет по просьбе владельца: сама страница уже и есть та самая
 * консультация — приглашать со страницы контактов на страницу
 * контактов было лишним.
 *
 * Хиро убрано тем же приёмом, что на FAQ: заголовок слева (`text`,
 * закреплён), контент справа (`aside`) — здесь это форма. Текст
 * заголовка — прежний `hero` (был в `PageHero`), а не `form.eyebrow/
 * title/text`: тот вводный абзац формы («Kontaktformular» рядом
 * с самой формой) стал бы дублировать очевидное. Блок для
 * соискателей (`bewerber`, ни разу не показывался и на старом сайте)
 * убран со страницы целиком по просьбе владельца — карточка вела
 * на Karriere, которая и так есть в шапке. Каналы связи, которые
 * раньше стояли отдельной колонкой рядом с формой, теперь строкой
 * пониже, на всю ширину — так им не тесно в узкой колонке.
 * Страница убрана из `pagesWithHero` — шапка здесь всегда
 * непрозрачная, первому блоку нужен свой отступ под неё
 * (`--header-h`) вместо отступа хиро.
 */
export default async function KontaktPage({
  params,
}: PageProps<"/[locale]/kontakt">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="pt-[calc(var(--header-h)+var(--spacing-break))]">
        <Grid>
          <Col span="text">
            <StickyHeading eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead} />
          </Col>
          <Col span="aside">
            <ContactForm />
          </Col>
        </Grid>
      </section>

      <section className="pt-beat">
        <Grid>
          <Col>
            <p className="text-meta text-ink-muted">{form.callLabel}</p>

            <ul className="mt-md grid gap-x-lg gap-y-xl sm:grid-cols-2 lg:grid-cols-4">
              <li className="flex flex-col gap-2xs">
                <Rule index={0} />
                <p className="mt-md text-meta text-ink-muted">{cards.headquarters}</p>
                <a
                  href={contact.phone.href}
                  className="text-h4 tabular-nums text-ink transition-colors hover:text-violet"
                >
                  {contact.phone.display}
                </a>
              </li>
              <li className="flex flex-col gap-2xs">
                <Rule index={1} />
                <p className="mt-md text-meta text-ink-muted">{cards.mobile}</p>
                <a
                  href={contact.mobile.href}
                  className="text-h4 tabular-nums text-ink transition-colors hover:text-violet"
                >
                  {contact.mobile.display}
                </a>
              </li>
              <li className="flex flex-col gap-2xs">
                <Rule index={2} />
                <p className="mt-md text-meta text-ink-muted">{cards.email}</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-h4 text-ink transition-colors hover:text-violet"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex flex-col gap-2xs">
                <Rule index={3} />
                <p className="mt-md text-meta text-ink-muted">{cards.fax}</p>
                <p className="text-h4 tabular-nums text-ink">{impressum.fax.display}</p>
              </li>
            </ul>
          </Col>
        </Grid>
      </section>

      {/* Буквально тот же блок, что MapSection на главной (тот же
          заголовок и тот же подтекст, `map.coverage` из `home.ts`),
          только вместо карты Гессена — карта Volkmarsen по согласию:
          у HesseMap на этой странице нет смысла, а вот прямая ссылка
          на дорогу до штаб-квартиры есть. Карточки адресов — под
          картой, той же колонкой, тем же приёмом, что у HesseMap
          (карта и `LocationCards` друг под другом, `gap-xl`). */}
      <section className="pt-turn pb-turn">
        <Grid>
          <Col span="text">
            <StickyCol>
              <Eyebrow className="text-ink-muted">{standorte.eyebrow}</Eyebrow>
              <h2 className="mt-2xs text-h1 text-ink">{standorte.title}</h2>
              <p className="mt-md max-w-[34ch] text-body text-ink-soft">
                {homeMap.coverage}
              </p>
            </StickyCol>
          </Col>

          <Col span="aside" className="flex flex-col gap-xl">
            <ConsentMap
              query={`${locations.headquarters.street}, ${locations.headquarters.postalCode} ${locations.headquarters.city}`}
              label={standorte.headquartersRole}
              consentText={map.consent}
              loadLabel={map.load}
              loadingText={map.loading}
              revokeLabel={map.revoke}
            />
            <LocationCards items={standorteItems} />
          </Col>
        </Grid>
      </section>
    </>
  );
}
