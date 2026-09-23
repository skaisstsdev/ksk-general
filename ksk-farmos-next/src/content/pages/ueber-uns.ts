/**
 * Тексты страницы «Über uns». Дословно из `_source/i18n/de.json`,
 * исходный ключ — в комментарии. Порядок блоков — как в старом
 * `ueber-uns.html`. Отступления отмечены отдельно.
 */

export const meta = {
  title: "Über uns", // nav.ueber
  description:
    "Lernen Sie KSK Farmos GmbH & Co. KG kennen — unsere Geschichte, unser Leitbild, unser Team und unsere Partner.", // <meta description>
} as const;

export const hero = {
  eyebrow: "Über uns", // ub.tag
  title: "Erfahrung und Fürsorge seit 2013", // ub.h1a + ub.h1b + ub.h1em
  lead: "Seit 2013 versorgen wir Menschen mit schweren Erkrankungen — professionell, menschlich und zuverlässig.", // ub.lead
  beratung: "Kostenlose Beratung", // cta.beratung
  kontakt: "Kontakt aufnehmen", // cta.kontakt
} as const;

export const leitbild = {
  eyebrow: "Unser Leitbild", // ub.lb.tag
  title: "Woran wir uns orientieren", // ub.lb.h2
  items: [
    {
      title: "Lebensprozesse unterstützen", // ub.lb1.h3
      text: "Selbstständigkeit fördern und natürliche Prozesse begleiten.", // ub.lb1.p
    },
    {
      title: "Körperfunktionen fördern", // ub.lb2.h3
      text: "Gezielte Pflege zur Erhaltung körperlicher Funktionen.", // ub.lb2.p
    },
    {
      title: "Krankheit kontrollieren", // ub.lb3.h3
      text: "Verläufe überwachen, frühzeitig reagieren.", // ub.lb3.p
    },
    {
      title: "Wohlbefinden fördern", // ub.lb4.h3
      text: "Emotionales und körperliches Wohlbefinden im Fokus.", // ub.lb4.p
    },
    {
      title: "Komplikationen verhindern", // ub.lb5.h3
      text: "Prophylaxen und kontinuierliche Überwachung.", // ub.lb5.p
    },
  ],
} as const;

/**
 * В словаре этот блок называется `ub.hist.*` (с «t»); в HTML старого
 * сайта тот же блок стоял под ключом `ub.his.*` — с другим, более
 * старым текстом. По решению владельца источник — словарь.
 */
export const geschichte = {
  eyebrow: "Unsere Geschichte", // ub.hist.tag
  title: "Gegründet aus Überzeugung", // ub.hist.h2
  paragraphs: [
    "Der ambulante Intensivpflegedienst KSK Farmos GmbH & Co. KG wurde 2013 von Viktor Beresnev in Volkmarsen gegründet — mit einem klaren Ziel: Menschen mit schweren Erkrankungen ein würdevolles, selbstbestimmtes Leben zu ermöglichen.", // ub.hist.p1
    "Seitdem versorgen wir Patienten hessenweit — in ihrem eigenen Zuhause oder in unserer Einrichtung in Kassel.", // ub.hist.p2
  ],
} as const;

export const team = {
  eyebrow: "Unser Team", // ub.team.tag
  title: "Die Menschen hinter KSK Farmos GmbH & Co. KG", // ub.team.h2
  members: [
    {
      // Имена в словаре не хранятся — собственные имена, перенесены
      // из разметки старого сайта дословно.
      name: "Viktor Beresnev",
      role: "Geschäftsführer", // ub.team0.role
      desc: "Leitung und Organisation des Unternehmens", // ub.team0.desc (1)
      desc2: "Finanz- und Liquiditätsplanung", // ub.team0.desc (2)
    },
    {
      name: "Olga Korp",
      role: "Pflegedienstleitung (PDL)", // ub.team1.role
      desc: "Pflegeexperte für außerklinische Beatmung, direkte Ansprechpartnerin für Angehörige.", // ub.team1.desc (1+2)
      desc2: "Verantwortlich für die fachliche Leitung und Qualitätssicherung aller Pflegemaßnahmen.", // ub.team1.desc (3)
    },
    {
      name: "Lidia Zimmermann",
      role: "Stellvertretende PDL", // ub.team2.role
      desc: "Pflegeexperte für außerklinische Beatmung, Hygienebeauftragte.", // ub.team2.desc (1+2)
      desc2: "Koordination der Pflegeteams.", // ub.team2.desc (3)
    },
    {
      name: "Unser Pflegeteam", // ub.team3.name
      role: "Pflegefachkräfte für außerklinische Beatmung", // ub.team3.p
      desc: "Rund 30 Mitarbeiter — qualifiziert, empathisch und zuverlässig im Einsatz.", // ub.team3.desc
    },
  ],
} as const;

export const kooperationen = {
  eyebrow: "Kooperationen", // ub.koop.tag
  title: "Wir kooperieren eng mit:", // ub.koop.h2
  items: [
    "Fachärzten verschiedener Disziplin", // ub.koop.1
    "Physiotherapeuten", // ub.koop.2
    "Logopäden", // ub.koop.3
    "Ergotherapeuten", // ub.koop.4
    "Medizintechnik-Unternehmen", // ub.koop.5
    "Kranken-, Pflege- und Sozialkassen", // ub.koop.6
    "Sanitätshäuser", // ub.koop.7
  ],
} as const;

export const social = {
  eyebrow: "Social Media", // ub.social.tag
  title: "Folgen Sie uns", // ub.social.h2
  text: "Bleiben Sie auf dem Laufenden! Auf unseren Social-Media-Kanälen teilen wir Einblicke in unseren Alltag, nützliche Tipps und aktuelle Neuigkeiten aus der Pflege.", // ub.social.p
} as const;
