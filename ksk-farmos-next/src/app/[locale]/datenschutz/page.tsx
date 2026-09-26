import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalH2, LegalMeta, LegalP, LegalUl } from "@/components/page/Legal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { company, dataProtectionOfficer, impressum, locations } from "@/content/site";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/datenschutz">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("datenschutz.title"), description: t("datenschutz.metaDescription") };
}

/**
 * Datenschutzerklärung. Тело страницы — на немецком на всех языках
 * сайта, тем же приёмом, что Impressum (см. `Legal.tsx`).
 *
 * Текст перенесён со старого сайта не дословно — в трёх местах он
 * расходился бы с тем, что реально происходит в этом проекте прямо
 * сейчас, а описывать несуществующую обработку данных в юридическом
 * документе нельзя, даже если она раньше стояла на старом сайте:
 *
 *   1. Раздел про EmailJS снят — формы пока не отправляют почту
 *      никуда (`forms/submit.ts` — заглушка), настоящая отправка
 *      появится на этапе 5 через Resend или Postmark (см. BRIEF.md,
 *      раздел 5). Раздел 8 ниже написан обобщённо, без названия
 *      поставщика — его нужно дополнить названием и ссылкой на
 *      политику конфиденциальности, как только сервис подключат.
 *   2. Раздел про Supabase снят из раздела о заявках — по решению
 *      владельца это отдельный вопрос («мы к этому приступим позже»),
 *      бриф прямо помечал его «вынести на обсуждение». Как только
 *      решение будет принято, сюда возвращается либо абзац с
 *      реквизитами Supabase (если БД остаётся), либо ничего не меняется
 *      (если заявки идут только почтой).
 *   3. Раздел про ИИ-чат-бота (OpenAI) снят целиком — виджета нет
 *      в кодовой базе ни в каком виде. Бриф называет его в списке
 *      функциональности к переносу, но пока это не написано и не
 *      подключено, разговор о нём в Datenschutz был бы описанием
 *      несуществующей обработки. Добавить обратно (текст уже есть
 *      в `_source/` старого сайта) в тот момент, когда виджет
 *      действительно появится на сайте.
 *
 * Google Maps, хостинг на Vercel, отсутствие трекинг-cookies —
 * перенесены как есть: это либо уже реализовано (`ConsentMap.tsx` —
 * карта не грузится без клика, с кнопкой отзыва согласия), либо
 * зафиксировано в BRIEF.md как решённый технический выбор.
 *
 * Это не юридическая консультация. Перед реальным запуском сайта —
 * особенно после подключения Resend/Postmark, решения по Supabase
 * и чат-бота — этот текст стоит ещё раз показать юристу: бизнес
 * работает с данными о здоровье, а это отдельная категория данных
 * по ст. 9 DSGVO.
 */
export default async function DatenschutzPage({
  params,
}: PageProps<"/[locale]/datenschutz">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <section className="pt-[calc(var(--header-h)+var(--spacing-break))] pb-turn">
      <Grid>
        <Col span="full" className="max-w-prose">
          <Eyebrow className="text-ink-muted">{t("tag")}</Eyebrow>
          <h1 className="mt-2xs text-h1 text-ink">{t("datenschutz.title")}</h1>

          <LegalH2>1. Verantwortlicher</LegalH2>
          <LegalP>
            Verantwortlicher für die Datenverarbeitung auf dieser Website im Sinne der
            Datenschutz-Grundverordnung (DSGVO) ist:
          </LegalP>
          <LegalP>
            <strong className="text-ink">{company.fullLegalName}</strong>
            <br />
            {locations.headquarters.street}
            <br />
            {locations.headquarters.postalCode} {locations.headquarters.city}
          </LegalP>
          <LegalP>
            Telefon: {impressum.phone.display}
            <br />
            E-Mail: <a href={`mailto:${impressum.email}`} className="text-violet underline decoration-violet/30 hover:decoration-violet">{impressum.email}</a>
          </LegalP>
          <LegalP>Die Gesellschaft wird vertreten durch ihre persönlich haftende Gesellschafterin:</LegalP>
          <LegalP>
            <strong className="text-ink">{impressum.generalPartner}</strong>
            <br />
            Registergericht: {impressum.registerCourt}
            <br />
            Handelsregisternummer: {impressum.registerGmbH}
            <br />
            Geschäftsführer: {impressum.managingDirector}
          </LegalP>
          <LegalP>
            Handelsregister der {company.fullLegalName}:
            <br />
            {impressum.registerCourt}, {impressum.registerKG}
          </LegalP>

          <LegalH2>2. Betrieblicher Datenschutzbeauftragter</LegalH2>
          <LegalP>
            Bei Fragen zur Verarbeitung Ihrer personenbezogenen Daten oder zur Wahrnehmung
            Ihrer datenschutzrechtlichen Rechte können Sie sich an unseren betrieblichen
            Datenschutzbeauftragten wenden:
          </LegalP>
          <LegalP>
            <strong className="text-ink">{dataProtectionOfficer.name}</strong>
            <br />
            Betrieblicher Datenschutzbeauftragter
            <br />
            E-Mail: <a href={`mailto:${dataProtectionOfficer.email}`} className="text-violet underline decoration-violet/30 hover:decoration-violet">{dataProtectionOfficer.email}</a>
          </LegalP>

          <LegalH2>3. Allgemeine Hinweise zur Datenverarbeitung</LegalH2>
          <LegalP>
            Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen. Wir
            verarbeiten personenbezogene Daten ausschließlich im Rahmen der gesetzlichen
            Bestimmungen der Datenschutz-Grundverordnung (DSGVO), des
            Bundesdatenschutzgesetzes (BDSG) sowie weiterer datenschutzrechtlicher
            Vorschriften.
          </LegalP>
          <LegalP>
            Personenbezogene Daten werden von uns nur verarbeitet, soweit dies zur
            Bereitstellung einer funktionsfähigen Website sowie unserer Leistungen
            erforderlich ist oder Sie uns diese freiwillig mitteilen.
          </LegalP>
          <LegalP>
            Die jeweiligen Rechtsgrundlagen ergeben sich aus dem konkreten
            Verarbeitungsvorgang und werden in den nachfolgenden Abschnitten erläutert.
          </LegalP>

          <LegalH2>4. Hosting durch Vercel</LegalH2>
          <LegalP>
            Unsere Website wird bei <strong className="text-ink">Vercel Inc.</strong>, 340 S
            Lemon Ave #4133, Walnut, CA 91789, USA gehostet.
          </LegalP>
          <LegalP>
            Beim Aufruf unserer Website werden durch Vercel automatisch technische
            Informationen verarbeitet. Hierzu gehören insbesondere:
          </LegalP>
          <LegalUl
            items={[
              "IP-Adresse",
              "Datum und Uhrzeit des Zugriffs",
              "Browsertyp und Browserversion",
              "verwendetes Betriebssystem",
              "Referrer-URL",
              "aufgerufene Seiten und Dateien",
              "technische Informationen zur Fehleranalyse und Systemsicherheit",
            ]}
          />
          <LegalP>
            Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser
            berechtigtes Interesse besteht in der sicheren, stabilen und effizienten
            Bereitstellung unserer Website sowie in der Gewährleistung der IT-Sicherheit und
            der Fehleranalyse.
          </LegalP>
          <LegalP>
            Mit Vercel wurde ein Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO
            abgeschlossen.
          </LegalP>
          <LegalP>
            Soweit personenbezogene Daten in die USA oder andere Drittländer übermittelt
            werden, erfolgt dies ausschließlich unter Beachtung der Voraussetzungen der Art.
            44 ff. DSGVO. Hierzu können insbesondere die von der Europäischen Kommission
            genehmigten Standardvertragsklauseln sowie gegebenenfalls ein
            Angemessenheitsbeschluss der Europäischen Kommission herangezogen werden.
          </LegalP>

          <LegalH2>5. Server-Logfiles</LegalH2>
          <LegalP>
            Beim Besuch unserer Website werden automatisch Informationen durch den
            Hostinganbieter erfasst und in sogenannten Server-Logfiles gespeichert. Folgende
            Daten können hierbei verarbeitet werden: IP-Adresse des zugreifenden Endgeräts,
            Datum und Uhrzeit des Zugriffs, aufgerufene URL, Browsertyp und Browserversion,
            verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners,
            HTTP-Statuscodes sowie übertragene Datenmengen.
          </LegalP>
          <LegalP>
            Eine Zusammenführung dieser Daten mit anderen Datenquellen erfolgt nicht. Die
            Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser
            berechtigtes Interesse liegt in der Gewährleistung der Systemsicherheit, der
            Stabilität des Webangebots, der Fehleranalyse, der Missbrauchs- und
            Angriffserkennung sowie der technischen Administration der Website.
          </LegalP>
          <LegalP>
            Die Logfiles werden regelmäßig gelöscht und grundsätzlich nicht länger als 14
            Tage gespeichert, sofern keine sicherheitsrelevanten Ereignisse eine längere
            Aufbewahrung erforderlich machen.
          </LegalP>

          <LegalH2>6. Cookies</LegalH2>
          <LegalP>
            Unsere Website verwendet ausschließlich technisch notwendige Cookies. Diese
            Cookies sind für den technischen Betrieb der Website erforderlich. Rechtsgrundlage
            hierfür ist Art. 6 Abs. 1 lit. f DSGVO in Verbindung mit § 25 Abs. 2 TDDDG.
            Tracking-, Analyse- oder Marketing-Cookies werden nicht eingesetzt.
          </LegalP>

          <LegalH2>7. Kontaktaufnahme per E-Mail oder Kontaktformular</LegalH2>
          <LegalP>
            Wenn Sie uns per E-Mail oder über ein Kontaktformular kontaktieren, werden die
            von Ihnen übermittelten personenbezogenen Daten zur Bearbeitung Ihrer Anfrage
            verarbeitet. Hierzu können insbesondere Name, E-Mail-Adresse, Telefonnummer,
            Nachrichteninhalt sowie weitere freiwillig übermittelte Informationen gehören.
          </LegalP>
          <LegalP>
            Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO bei
            vorvertraglichen oder vertraglichen Anfragen sowie Art. 6 Abs. 1 lit. f DSGVO bei
            sonstigen Anfragen. Unser berechtigtes Interesse besteht in der Bearbeitung und
            Beantwortung von Kontaktanfragen.
          </LegalP>
          <LegalP>
            Die Bereitstellung der als Pflichtfelder gekennzeichneten Daten ist erforderlich,
            um Ihre Anfrage bearbeiten zu können. Ohne diese Angaben ist eine Bearbeitung
            Ihrer Anfrage gegebenenfalls nicht möglich.
          </LegalP>
          <LegalP>
            Teilen Sie uns im Rahmen Ihrer Anfrage Angaben zur Pflege- oder
            Gesundheitssituation mit, verarbeiten wir diese ausschließlich zur Beantwortung
            Ihres Anliegens. Rechtsgrundlage ist insoweit Ihre ausdrückliche Einwilligung
            gemäß Art. 9 Abs. 2 lit. a DSGVO, die Sie durch die freiwillige Übermittlung
            dieser Angaben erteilen.
          </LegalP>
          <LegalP>Die Übertragung Ihrer Daten erfolgt verschlüsselt mittels TLS-/SSL-Technologie.</LegalP>
          <LegalP>
            Die im Rahmen von Kontaktanfragen erhobenen personenbezogenen Daten werden
            grundsätzlich bis zu sechs Monate nach Abschluss der Bearbeitung gespeichert und
            anschließend gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten oder
            berechtigten Interessen einer längeren Speicherung entgegenstehen.
          </LegalP>

          <LegalH2>8. Technische Zustellung von Formularnachrichten</LegalH2>
          <LegalP>
            Zur technischen Übermittlung von Nachrichten aus unseren Onlineformularen setzen
            wir einen E-Mail-Versanddienstleister ein. Die eingegebenen Daten werden
            verschlüsselt an dessen Systeme übertragen und dort ausschließlich zum Zweck der
            technischen Zustellung Ihrer Nachricht verarbeitet.
          </LegalP>
          <LegalP>
            Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, soweit die
            Kontaktaufnahme im Zusammenhang mit vorvertraglichen Maßnahmen oder bestehenden
            Vertragsverhältnissen erfolgt, sowie Art. 6 Abs. 1 lit. f DSGVO bei sonstigen
            Anfragen. Unser berechtigtes Interesse liegt in der zuverlässigen und sicheren
            technischen Bereitstellung der Formularfunktionen.
          </LegalP>
          <LegalP>
            Soweit personenbezogene Daten in Drittländer übermittelt werden, erfolgt dies
            ausschließlich unter Beachtung der Anforderungen der Art. 44 ff. DSGVO und auf
            Grundlage geeigneter Garantien, insbesondere Standardvertragsklauseln der
            Europäischen Kommission oder eines bestehenden Angemessenheitsbeschlusses.
          </LegalP>

          <LegalH2>9. Bewerbungen</LegalH2>
          <LegalP>
            Wenn Sie sich bei uns bewerben, verarbeiten wir Ihre personenbezogenen Daten zur
            Durchführung des Bewerbungsverfahrens. Hierzu gehören insbesondere Stammdaten,
            Kontaktdaten, Bewerbungsunterlagen, Zeugnisse und Qualifikationsnachweise.
          </LegalP>
          <LegalP>Rechtsgrundlage ist § 26 BDSG sowie Art. 6 Abs. 1 lit. b DSGVO.</LegalP>
          <LegalP>
            Kommt kein Beschäftigungsverhältnis zustande, werden Bewerbungsunterlagen
            grundsätzlich spätestens sechs Monate nach Abschluss des Bewerbungsverfahrens
            gelöscht. Die Aufbewahrung bis zu diesem Zeitpunkt erfolgt zur Geltendmachung,
            Ausübung oder Verteidigung möglicher Rechtsansprüche nach dem Allgemeinen
            Gleichbehandlungsgesetz (AGG). Bei einer Einstellung werden Ihre Daten in die
            Personalakte übernommen.
          </LegalP>

          <LegalH2>10. Google Maps</LegalH2>
          <LegalP>
            Unsere Website bindet Kartenmaterial des Dienstes Google Maps ein. Anbieter ist
            Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
          </LegalP>
          <LegalP>
            Google Maps wird ausschließlich nach Ihrer ausdrücklichen Einwilligung geladen.
            Die Karte bleibt zunächst deaktiviert und wird erst nach einem Klick auf die
            entsprechende Schaltfläche geladen. Rechtsgrundlage hierfür ist Art. 6 Abs. 1
            lit. a DSGVO.
          </LegalP>
          <LegalP>
            Wenn Sie das Kartenmaterial laden, können Informationen über die Nutzung unserer
            Website an Google übermittelt werden, insbesondere Ihre IP-Adresse, technische
            Geräteinformationen, Browserinformationen sowie Nutzungsdaten im Zusammenhang mit
            der Kartenanzeige. Dabei kann eine Übermittlung personenbezogener Daten an Server
            von Google in den USA nicht ausgeschlossen werden.
          </LegalP>
          <LegalP>
            Eine erteilte Einwilligung kann jederzeit mit Wirkung für die Zukunft widerrufen
            werden — die entsprechende Schaltfläche steht direkt im Kartenrahmen zur
            Verfügung. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt
            hiervon unberührt.
          </LegalP>
          <LegalP>
            Weitere Informationen:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet underline decoration-violet/30 hover:decoration-violet"
            >
              policies.google.com/privacy
            </a>
            .
          </LegalP>

          <LegalH2>11. Empfänger personenbezogener Daten</LegalH2>
          <LegalP>
            Im Rahmen der Bereitstellung unserer Website und unserer Online-Dienste kann eine
            Übermittlung personenbezogener Daten an externe Empfänger oder
            Auftragsverarbeiter erfolgen. Hierzu zählen insbesondere:
          </LegalP>
          <LegalUl
            items={[
              "Vercel Inc. (Hosting)",
              "unser E-Mail-Versanddienstleister (technische Zustellung von Formularnachrichten)",
              "Google Ireland Limited (Kartendarstellung nach Einwilligung)",
              "IT-Dienstleister und technische Serviceanbieter",
              "Behörden oder öffentliche Stellen aufgrund gesetzlicher Verpflichtungen",
            ]}
          />

          <LegalH2>12. Speicherdauer</LegalH2>
          <LegalP>
            Personenbezogene Daten werden nur solange gespeichert, wie dies zur Erfüllung des
            jeweiligen Zwecks erforderlich ist oder gesetzliche Aufbewahrungspflichten
            bestehen. Konkrete Speicherfristen sind bei den jeweiligen
            Verarbeitungsvorgängen erläutert.
          </LegalP>

          <LegalH2>13. Rechte der betroffenen Personen</LegalH2>
          <LegalP>Sie haben das Recht auf:</LegalP>
          <LegalUl
            items={[
              <>
                <strong className="text-ink">Auskunft</strong> über die zu Ihrer Person
                gespeicherten Daten (Art. 15 DSGVO)
              </>,
              <>
                <strong className="text-ink">Berichtigung</strong> unrichtiger
                personenbezogener Daten (Art. 16 DSGVO)
              </>,
              <>
                <strong className="text-ink">Löschung</strong> Ihrer gespeicherten Daten
                (Art. 17 DSGVO)
              </>,
              <>
                <strong className="text-ink">Einschränkung der Verarbeitung</strong> (Art. 18
                DSGVO)
              </>,
              <>
                <strong className="text-ink">Datenübertragbarkeit</strong> (Art. 20 DSGVO)
              </>,
              <>
                <strong className="text-ink">Widerspruch</strong> gegen die Verarbeitung
                (Art. 21 DSGVO)
              </>,
              <>
                <strong className="text-ink">Widerruf erteilter Einwilligungen</strong> (Art.
                7 Abs. 3 DSGVO)
              </>,
            ]}
          />
          <LegalP>
            <strong className="text-ink">Widerrufsrecht:</strong> Sofern die Verarbeitung
            Ihrer personenbezogenen Daten auf einer Einwilligung beruht, können Sie diese
            Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.
          </LegalP>
          <LegalP>
            <strong className="text-ink">Widerspruchsrecht:</strong> Soweit wir
            personenbezogene Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeiten,
            haben Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung einzulegen.
          </LegalP>

          <LegalH2>14. Beschwerderecht bei einer Aufsichtsbehörde</LegalH2>
          <LegalP>
            Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.
            Die für uns zuständige Aufsichtsbehörde ist:
          </LegalP>
          <LegalP>
            Der Hessische Beauftragte für Datenschutz und Informationsfreiheit
            <br />
            Postfach 3163
            <br />
            65021 Wiesbaden
            <br />
            Telefon: 0611 1408-0
            <br />
            Website:{" "}
            <a
              href="https://datenschutz.hessen.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet underline decoration-violet/30 hover:decoration-violet"
            >
              datenschutz.hessen.de
            </a>
          </LegalP>

          <LegalH2>15. Automatisierte Verarbeitung</LegalH2>
          <LegalP>
            Eine automatisierte Entscheidungsfindung einschließlich Profiling im Sinne des
            Art. 22 DSGVO findet nicht statt.
          </LegalP>

          <LegalH2>16. Datensicherheit</LegalH2>
          <LegalP>
            Wir treffen angemessene technische und organisatorische Maßnahmen (TOM) gemäß
            Art. 32 DSGVO, um Ihre personenbezogenen Daten gegen Verlust, Zerstörung,
            Manipulation sowie gegen unbefugten Zugriff zu schützen. Zur Absicherung der
            Datenübertragung zwischen Ihrem Browser und unserer Website verwenden wir eine
            SSL-/TLS-Verschlüsselung; Sie erkennen dies an „https://“ in der Adresszeile
            sowie am Schloss-Symbol Ihres Browsers.
          </LegalP>
          <LegalP>
            Unsere technischen und organisatorischen Sicherheitsmaßnahmen werden regelmäßig
            überprüft und entsprechend der technologischen Entwicklung fortlaufend
            verbessert. Trotz regelmäßiger Kontrollen weisen wir darauf hin, dass die
            Datenübertragung im Internet Sicherheitslücken aufweisen kann. Ein lückenloser
            Schutz der Daten vor dem Zugriff durch Dritte ist daher technisch nicht in allen
            Fällen möglich.
          </LegalP>
          <LegalP>
            Sollten Sie Fragen zur Datensicherheit oder zur Verarbeitung Ihrer
            personenbezogenen Daten haben, können Sie sich jederzeit an uns oder an unseren
            betrieblichen Datenschutzbeauftragten wenden.
          </LegalP>

          <LegalMeta>Stand: September 2026</LegalMeta>
        </Col>
      </Grid>
    </section>
  );
}
