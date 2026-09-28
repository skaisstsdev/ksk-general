import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalH2, LegalH3, LegalP } from "@/components/page/Legal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { company, dataProtectionOfficer, impressum, locations } from "@/content/site";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/impressum">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return buildPageMetadata({
    locale,
    path: "/impressum",
    title: t("impressum.title"),
    description: t("impressum.metaDescription"),
  });
}

/**
 * Impressum. Обязательные сведения по § 5 DDG — юридический документ,
 * поэтому тело страницы остаётся на немецком на всех языках сайта
 * (см. комментарий в `Legal.tsx`). Переводится только заголовок
 * страницы — как и на старом сайте.
 *
 * Данные — из `content/site.ts`, единого источника: почему у
 * Impressum свой набор телефонов, отдельный от того, что показывается
 * посетителю, объясняет комментарий там же.
 */
export default async function ImpressumPage({
  params,
}: PageProps<"/[locale]/impressum">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <section className="pt-[calc(var(--header-h)+var(--spacing-break))] pb-turn">
      <Grid>
        <Col span="full" className="max-w-prose">
          <Eyebrow className="text-ink-muted">{t("tag")}</Eyebrow>
          <h1 className="mt-2xs text-h1 text-ink">{t("impressum.title")}</h1>

          <LegalH2>Angaben gemäß § 5 DDG</LegalH2>
          <LegalP>
            {company.fullLegalName}
            <br />
            {locations.headquarters.street}
            <br />
            {locations.headquarters.postalCode} {locations.headquarters.city}
          </LegalP>

          <LegalP>
            <strong className="text-ink">
              Vertreten durch den persönlich haftenden Gesellschafter:
            </strong>
            <br />
            {impressum.generalPartner}
            <br />
            Registergericht: {impressum.registerCourt}
            <br />
            Registernummer: {impressum.registerGmbH}
            <br />
            Geschäftsführer: {impressum.managingDirector}
          </LegalP>

          <LegalP>
            <strong className="text-ink">Registereintrag (GmbH &amp; Co. KG):</strong>
            <br />
            Eintragung im Handelsregister.
            <br />
            Registergericht: {impressum.registerCourt}
            <br />
            Registernummer: {impressum.registerKG}
          </LegalP>

          <LegalP>
            <strong className="text-ink">Kontakt:</strong>
            <br />
            Tel: {impressum.phone.display}
            <br />
            Fax: {impressum.fax.display}
            <br />
            Mobil: {impressum.mobile.display}
            <br />
            E-Mail: {impressum.email}
          </LegalP>

          <LegalP>
            <strong className="text-ink">Steuernummer:</strong> {impressum.taxNumber}
            <br />
            <strong className="text-ink">Betriebsnummer:</strong> {impressum.operatingNumber}
            <br />
            <strong className="text-ink">IK-Nummer:</strong> {impressum.ikNumber}
          </LegalP>

          <LegalP>
            <strong className="text-ink">Zuständige Aufsichtsbehörden:</strong>
            <br />
            Gesundheitsamt, Heimaufsicht, Medizinischer Dienst der Krankenversicherung (MDK)
          </LegalP>

          <LegalP>
            <strong className="text-ink">Betrieblicher Datenschutzbeauftragter:</strong>
            <br />
            {dataProtectionOfficer.name}
            <br />
            E-Mail: {dataProtectionOfficer.email}
          </LegalP>

          <LegalH2>Rechtliche Hinweise</LegalH2>

          <LegalH3>1. Haftungsbeschränkung</LegalH3>
          <LegalP>
            Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt. Der
            Anbieter übernimmt jedoch keine Gewähr für die Richtigkeit, Vollständigkeit und
            Aktualität der bereitgestellten Inhalte. Die Nutzung der Inhalte der Website
            erfolgt auf eigene Gefahr des Nutzers.
          </LegalP>

          <LegalH3>2. Externe Links</LegalH3>
          <LegalP>
            Diese Website enthält Verknüpfungen zu Websites Dritter (externe Links). Diese
            Websites unterliegen der Haftung der jeweiligen Betreiber. Der Anbieter hat bei
            der erstmaligen Verknüpfung die fremden Inhalte daraufhin überprüft, ob etwaige
            Rechtsverstöße bestehen. Zu dem Zeitpunkt waren keine Rechtsverstöße ersichtlich.
          </LegalP>

          <LegalH3>3. Urheberrecht</LegalH3>
          <LegalP>
            Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen dem
            deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede
            Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </LegalP>

          <LegalH3>4. Datenschutz</LegalH3>
          <LegalP>
            Durch den Besuch der Website des Anbieters können Informationen über den Zugriff
            gespeichert werden. Diese Daten (Server-Logfiles) stellen keine personenbezogenen
            Daten dar. Ausführliche Informationen zur Verarbeitung personenbezogener Daten
            finden Sie in unserer Datenschutzerklärung.
          </LegalP>

          <LegalH3>5. Besondere Nutzungsbedingungen</LegalH3>
          <LegalP>
            Soweit besondere Bedingungen für einzelne Nutzungen dieser Website von den
            vorgenannten Paragraphen abweichen, wird an entsprechender Stelle ausdrücklich
            darauf hingewiesen. In diesem Falle gelten im jeweiligen Einzelfall die
            besonderen Nutzungsbedingungen.
          </LegalP>
        </Col>
      </Grid>
    </section>
  );
}
