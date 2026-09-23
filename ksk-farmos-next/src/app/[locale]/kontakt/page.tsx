import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { ConsentMap } from "@/components/page/ConsentMap";
import { PageClosing } from "@/components/page/PageClosing";
import { PageHero } from "@/components/page/PageHero";
import { SectionHeading } from "@/components/page/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Col, Grid } from "@/components/ui/Grid";
import { Rule } from "@/components/ui/Rule";
import { ContactForm } from "@/components/forms/ContactForm";
import { closing } from "@/content/home";
import { bewerber, cards, form, hero, map, meta, standorte } from "@/content/pages/kontakt";
import { closingFamily } from "@/content/pages/shared";
import { contact, impressum, locations } from "@/content/site";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

/**
 * Kontakt. Порядок блоков — как в старом `kontakt.html`, с двумя
 * отличиями по решению владельца: адрес Касселя, которого на старой
 * странице не было ни разу, и согласие на карту, которое теперь
 * запоминается (`ConsentMap`) вместо того, чтобы спрашиваться заново
 * при каждом визите.
 *
 *   1. хиро — без кнопок, страница сама и есть действие
 *   2. форма + контактные каналы + блок для соискателей
 *   3. Standorte — оба адреса, карта Volkmarsen по согласию
 *   4. закрывающий разворот
 */
export default async function KontaktPage({
  params,
}: PageProps<"/[locale]/kontakt">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead} />

      <section className="pt-break">
        <Grid>
          <Col span="text">
            <SectionHeading eyebrow={form.eyebrow} title={form.title} lead={form.text} />
            <div className="mt-lg">
              <ContactForm />
            </div>
          </Col>

          <Col span="aside">
            <p className="text-meta text-ink-muted">{form.callLabel}</p>

            <ul className="mt-2xs">
              <li>
                <Rule index={0} />
                <div className="py-md">
                  <p className="text-meta text-ink-muted">{cards.headquarters}</p>
                  <a
                    href={contact.phone.href}
                    className="text-h4 tabular-nums text-ink transition-colors hover:text-violet"
                  >
                    {contact.phone.display}
                  </a>
                </div>
              </li>
              <li>
                <Rule index={1} />
                <div className="py-md">
                  <p className="text-meta text-ink-muted">{cards.mobile}</p>
                  <a
                    href={contact.mobile.href}
                    className="text-h4 tabular-nums text-ink transition-colors hover:text-violet"
                  >
                    {contact.mobile.display}
                  </a>
                </div>
              </li>
              <li>
                <Rule index={2} />
                <div className="py-md">
                  <p className="text-meta text-ink-muted">{cards.email}</p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-h4 text-ink transition-colors hover:text-violet"
                  >
                    {contact.email}
                  </a>
                </div>
              </li>
              <li>
                <Rule index={3} />
                <div className="py-md">
                  <p className="text-meta text-ink-muted">{cards.fax}</p>
                  <p className="text-h4 tabular-nums text-ink">{impressum.fax.display}</p>
                </div>
              </li>
              <li aria-hidden="true">
                <Rule index={4} />
              </li>
            </ul>

            <div className="mt-xl border-s border-violet ps-md">
              <p className="text-eyebrow uppercase text-violet">{bewerber.eyebrow}</p>
              <p className="mt-2xs text-h4 text-ink">{bewerber.title}</p>
              <Button href="/karriere" variant="secondary" size="sm" className="mt-sm">
                {bewerber.cta}
              </Button>
            </div>
          </Col>
        </Grid>
      </section>

      <section className="pt-turn">
        <Grid>
          <Col span="text">
            <SectionHeading eyebrow={standorte.eyebrow} title={standorte.title} />

            <div className="mt-lg flex flex-col gap-lg">
              <div>
                <p className="text-subhead text-ink">{standorte.headquartersRole}</p>
                <p className="mt-2xs text-ui text-ink-soft">
                  {locations.headquarters.street}
                  <br />
                  {locations.headquarters.postalCode} {locations.headquarters.city}
                </p>
              </div>
              <div>
                <p className="text-subhead text-ink">{standorte.residenceRole}</p>
                <p className="mt-2xs text-ui text-ink-soft">
                  {locations.residence.street}
                  <br />
                  {locations.residence.postalCode} {locations.residence.city}
                </p>
              </div>
            </div>
          </Col>

          <Col span="aside">
            <ConsentMap
              query={`${locations.headquarters.street}, ${locations.headquarters.postalCode} ${locations.headquarters.city}`}
              label={standorte.headquartersRole}
              consentText={map.consent}
              loadLabel={map.load}
              revokeLabel={map.revoke}
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
