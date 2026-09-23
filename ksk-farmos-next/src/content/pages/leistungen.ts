/**
 * Тексты страницы «Leistungen».
 *
 * Как и `home.ts`: всё дословно из `_source/i18n/de.json`, исходный
 * ключ — в комментарии рядом. Порядок блоков — как в старом
 * `leistungen.html`. Отступления от `de.json` отмечены отдельно.
 */

export const meta = {
  title: "Leistungen", // nav.leistungen
  // <meta name="description"> старого leistungen.html
  description:
    "Häusliche Intensivpflege, Aufenthaltskonzept Kassel und Fortbildungen. Alle Leistungen von KSK Farmos GmbH & Co. KG.",
} as const;

export const hero = {
  eyebrow: "Leistungen", // lei.tag
  // Три части заголовка склеены, курсив на «Leistungen» снят.
  title: "Unsere medizinischen Leistungen", // srv.h1a + srv.h1b + srv.h1em
  lead: "Häusliche Intensivpflege, ein einzigartiges Aufenthaltskonzept und kontinuierliche Fortbildungen — alles aus einer Hand.", // lei.lead
  beratung: "Kostenlose Beratung", // cta.beratung
  all: "Alle Leistungen", // cta.leistungen
} as const;

/**
 * В словаре это одна строка с разметкой: первая фраза набрана
 * фиолетовым курсивом, после неё `<br>`. Разметка снята, фразы
 * разделены — первая идёт крупно, вторая поясняет её.
 */
export const beatmung = {
  statement: "Die Beatmungspflege ist unsere Kernkompetenz.", // lei.beat (1)
  text: "Die erfahrenen Pflegefachkräfte für außerklinische Beatmung betreuen Klienten mit moderner Technik und in enger Zusammenarbeit mit Fachärzten für Pneumologie.", // lei.beat (2)
} as const;

export const haeuslich = {
  eyebrow: "Häusliche Intensivpflege", // lei.h.tag
  title: "Professionelle Pflege zu Hause", // lei.h.h2
  text: "Wir versorgen Patienten mit schweren Erkrankungen in ihren eigenen vier Wänden — 24 Stunden am Tag, 7 Tage die Woche, 365 Tage im Jahr.", // lei.h.p
  groups: [
    {
      id: "grundversorgung",
      title: "Grundversorgung", // lei.grp1
      items: [
        "Grund- und Behandlungspflege", // lei.grp1.1
        "Medikamentenmanagement", // lei.grp1.2
        "Vitalzeichenkontrolle und Monitoring", // lei.grp1.3
      ],
    },
    {
      id: "therapien",
      title: "Spezielle Therapien", // lei.grp2
      items: [
        "Invasive und nicht-invasive Beatmung", // lei.grp2.1
        "Trachealkanülenmanagement", // lei.grp2.2
        "Wundversorgung und Ernährungstherapie", // lei.grp2.3
      ],
    },
    {
      id: "organisation",
      title: "Organisation", // lei.grp3
      items: [
        "Pflegeplanung und Dokumentation", // lei.grp3.1
        "Koordination mit Ärzten und Therapeuten", // lei.grp3.2
      ],
    },
  ],
} as const;

export const diagnosen = {
  eyebrow: "Krankheitsbild", // idx.diag.tag
  title: "Welche Patienten wir versorgen", // lei.diag.h2
  items: [
    {
      title: "Beatmungsklienten", // idx.diag1
      text: "Spezialisierte Intensivpflege für Menschen, die auf invasive oder nicht-invasive Beatmung angewiesen sind. Wir sichern die lückenlose Überwachung und professionelles Gerätemanagement.", // lei.diag1.desc
    },
    {
      title: "Wachkoma (Apallisches Syndrom)", // idx.diag2
      text: "Ganzheitliche Langzeitversorgung für Patienten mit schweren Bewusstseinsstörungen. Unser Fokus liegt auf basaler Stimulation und der Erhaltung von Körperfunktionen.", // lei.diag2.desc
    },
    {
      title: "ALS / Neurologische Erkrankungen", // idx.diag3
      text: "Individuelle Begleitung bei fortschreitenden neurologischen Veränderungen — empathisch, fachlich fundiert und auf die Erhaltung der Lebensqualität ausgerichtet.", // lei.diag3.desc
    },
    {
      title: "Querschnittslähmung", // idx.diag4
      // В de.json вместо «und» дважды стоит кириллическое «и» — сбой
      // раскладки. «und» — как в HTML старого сайта.
      text: "Professionelle Unterstützung und Pflege für Menschen mit Rückenmarksverletzungen. Wir fördern die Selbstständigkeit und beugen gezielt Komplikationen vor.", // lei.diag4.desc
    },
    {
      title: "Schädel-Hirn-Trauma", // idx.diag5
      // То же кириллическое «и» в de.json; «und» — как в HTML.
      text: "Langfristige Versorgung nach schweren Hirnverletzungen. Zielgerichtet auf die Stabilisierung des Zustands und Unterstützung im Alltag.", // lei.diag5.desc
    },
  ],
} as const;

export const wohnprojekte = {
  eyebrow: "Pflege in verschiedenen Wohnprojekten", // lei.a.tag
  title: "Was Sie erwartet", // lei.a.h2
  text: "Unser ambulanter Pflegedienst ist auf die Betreuung von Menschen mit Demenz in verschiedenen Wohnprojekten spezialisiert. In einer geschützten, häuslichen Umgebung ermöglichen wir ein würdevolles Leben mit Struktur, Sicherheit und individueller Zuwendung.", // lei.a.p
  groups: [
    {
      title: "Wohnen & Ausstattung", // lei.a.grp1
      items: [
        "Zimmer mit eigenen Möbeln", // lei.a.1
        "Alle notwendigen medizinischen Geräte", // lei.a.2
        "Großzügigen Garten", // lei.a.3
        "Bibliothek und Gemeinschaftsräume", // lei.a.4
      ],
    },
    {
      title: "Betreuung & Service", // lei.a.grp2
      items: [
        "24h Betreuung und Überwachung", // lei.a.5
        "Umfassende pflegerische und medizinische Leistungen", // lei.a.6
        "Individuell gestalteter Tagesablauf", // lei.a.7
        "Validation und aktivierende Betreuung", // lei.a.8
        "Förderung von vorhandenen Fähigkeiten.", // lei.a.9
      ],
    },
  ],
} as const;

export const beratung = {
  eyebrow: "Pflegeberatung", // lei.f.tag
  title: "Individuelle Pflegeberatung", // lei.f.h2
  text: "Wir bieten individuelle Pflegeberatungen für Pflegebedürftige und Angehörige zur optimalen Versorgung im häuslichen Umfeld.", // lei.f.p
  items: [
    {
      title: "Pflegegrade & Leistungen", // lei.f1.h3
      text: "Beratung zu Pflegegraden und Leistungen der Pflegekasse.", // lei.f1.p
    },
    {
      title: "Anleitung für Angehörige", // lei.f2.h3
      text: "Anleitung von Angehörigen zur häuslichen Pflege.", // lei.f2.p
    },
    {
      title: "Hilfsmittel-Organisation", // lei.f3.h3
      text: "Hilfe bei der Organisation von Hilfsmitteln (Pflegebett, Rollatoren etc.).", // lei.f3.p
    },
    {
      title: "Demenz & Verhalten", // lei.f4.h3
      text: "Beratung zu Demenz und Umgang mit herausforderndem Verhalten.", // lei.f4.p
    },
    {
      title: "Entlastungsangebote", // lei.f5.h3
      text: "Aufklärung und Erklärung über Entlastungsangebote für pflegende Angehörige.", // lei.f5.p
    },
    {
      title: "Wohnraumanpassung", // lei.f6.h3
      text: "Beratung zur Wohnraumanpassung und Barrierefreiheit.", // lei.f6.p
    },
  ],
} as const;

export const kosten = {
  eyebrow: "Kostenübernahme", // lei.k.tag (в словаре капсом; метка набирается капсом сама)
  title: "Wer die Kosten trägt", // lei.k.h2
  text: "Intensivpflegedienst KSK Farmos GmbH & Co. KG übernehmen nach Erhalt einer Vollmacht die Verhandlungen mit den Kostenträgern bezüglich Kostenübernahme.", // lei.k.lead
  items: [
    {
      title: "Krankenkasse (SGB V)", // lei.k1.h3
      // lei.k1.p — в словаре абзац и список одной строкой с разметкой.
      text: "Die Krankenkasse zahlt medizinische Behandlung, unabhängig vom Pflegegrad:",
      list: [
        "Arztbesuche und Therapien (Physio-, Ergo-, Logopädie)",
        "Krankenhausbehandlung",
        "Arznei-, Heil- und Hilfsmittel (z. B. Rollstuhl, Pflegebett – mit Genehmigung)",
        "Häusliche Krankenpflege bei akuter Krankheit oder nach Krankenhaus",
      ],
    },
    {
      title: "Pflegekasse (SGB XI)", // lei.k2.h3
      // Фраза заканчивается двоеточием, а списка после неё нет ни в словаре,
      // ни в HTML — перенесено как есть, вопрос к владельцу.
      text: "Die Pflegekasse zahlt pflegerische Unterstützung bei Pflegebedürftigkeit (Pflegegrad nötig):", // lei.k2.p
    },
    {
      title: "Sozialamt", // lei.k3.h3
      text: "Bei übersteigenden Kosten des tatsächlichen Pflegebedarfs die Leistungen der oben genannten Kostenträger (Pflegekasse) muss der verbleibende Kostenanteil entweder privat getragen werden oder — sofern die Voraussetzungen gegeben sind — von unterschiedlichen Ämtern (Übernehmen Sozialamt, Beihilfe, Regierungspräsidium) übernommen werden.", // lei.k3.p
    },
    {
      title: "Private Versicherung", // lei.k4.h3
      text: "Eine zusätzlich abgeschlossene Kranken- oder Unfallversicherung kann je nach Prüfung einen Anteil der anfallenden Kosten übernehmen.", // lei.k4.p
    },
  ],
} as const;
