/**
 * Тексты главной страницы.
 *
 * Все строки перенесены дословно из `_source/i18n/de.json` — в комментарии
 * рядом стоит исходный ключ, чтобы этап 6 (подключение словарей на десять
 * языков) был механической заменой источника, а не переписыванием разметки.
 *
 * Ни одна строка здесь не сочинена — кроме `moment`, см. там. Хиро
 * с развилкой на две аудитории собран из блока `idx.dual.*`, который
 * в старом сайте стоял последним блоком страницы: изменилось место,
 * а не текст.
 */

export const hero = {
  eyebrow: "Intensivpflege in Nordhessen", // idx.tag
  // Заголовок в старом сайте был разрезан на две части ради курсива
  // на «die ankommt». Курсив снят, текст склеен без изменений.
  title: "Professionelle Pflege, die ankommt.", // idx.h1 + idx.h1em
  lead: "Ambulante Intensivpflege bei Ihnen zu Hause oder in unserer Einrichtung in Kassel — 24 Stunden am Tag, 7 Tage die Woche.", // idx.lead
} as const;

/** Две двери. До перестановки это был блок `dual-cta` в самом низу страницы. */
export const doors = {
  family: {
    audience: "Für Patienten und Angehörige", // idx.dual.left.tag
    title: "Kostenlose Beratung anfragen", // idx.dual.left.h3
    text: "Wir beraten Sie persönlich — unverbindlich und kostenfrei.", // idx.dual.left.p
    cta: "Beratung anfragen", // idx.dual.left.btn
    callLabel: "Jetzt anrufen", // cta.anrufen
  },
  professional: {
    audience: "Für Pflegekräfte", // idx.dual.right.tag
    title: "Werden Sie Teil unseres Teams", // idx.dual.right.h3
    text: "Übertarifliche Bezahlung, Weiterbildung und Firmenwagen.", // idx.dual.right.p
    cta: "Jetzt bewerben", // idx.dual.right.btn
    note: "Schnell und unkompliziert — kein Anschreiben nötig.", // sb.lead
  },
} as const;

/**
 * Подписи полосы доверия. Четыре ключа, переведённые на все десять языков
 * и ни разу не показанные на старом сайте.
 */
export const stats = {
  years: "Jahre Erfahrung", // idx.stat1
  staffRatio: "Mitarbeiter pro Patient", // idx.stat2
  roundTheClock: "Rund-um-die-Uhr", // idx.stat3
  locations: "Standorte in Hessen", // idx.stat4
  /** Дословно из «Rund 30 Mitarbeiter…» — команда упомянута в блоке
   *  «Seit 2013…» словом «Fachkräfte», а не «Mitarbeiter», поэтому число
   *  рядом не повторяет тот же текст, а подтверждает его. */
  team: "Mitarbeiter", // ub.team3.desc
  /** «Von der ersten Beratung bis zum Versorgungsbeginn vergehen in der
   *  Regel 4 bis 6 Wochen» — число берётся из `company.weeksToStart`. */
  weeksToStart: "Wochen bis Versorgungsbeginn", // faq.a5 / faq.top2.p
  /** Готовая короткая формула для беседы (страница «Beratung»),
   *  здесь распадается на значение «24h» и подпись «Rückmeldung». */
  responseTime: "Rückmeldung", // ber.c3: "Rückmeldung innerhalb 24h"
} as const;

export const intro = {
  text: "Seit 2013 versorgen wir Menschen mit schweren Erkrankungen. Mit einem Team aus examinierten Fachkräften garantieren wir eine 24/7-Versorgung auf höchstem Niveau — im eigenen Zuhause oder in kooperierenden Wohnprojekten im Raum Kassel und Waldeck-Frankenberg.", // idx.accent
} as const;

/**
 * Текст поверх раскрывающегося кадра после списка услуг.
 *
 * Единственный новый текст на странице: написан 22.09.2026 по просьбе
 * владельца, в старом сайте аналога нет. Пересказывает то, что уже
 * сказано на «Leistungen» и в FAQ: тяжёлые диагнозы можно вести дома,
 * фахкрафт рядом круглосуточно, платит касса, старт за 4–6 недель.
 * На этапе 6 переводится на остальные девять языков вместе со всем.
 */
export const moment = {
  eyebrow: "Intensivpflege zu Hause",
  title: "Das Leben bleibt dort, wo es hingehört.",
  text: "Beatmung, Tracheostoma, Wachkoma — auch schwere Krankheitsbilder lassen sich in den eigenen vier Wänden versorgen. Eine examinierte Fachkraft ist rund um die Uhr da, die Kosten übernehmen in der Regel Kranken- und Pflegekasse.",
  cta: "Wie der Einstieg abläuft",
  href: "/leistungen#haeuslich",
} as const;

export const services = {
  eyebrow: "Unsere Leistungen", // idx.srv.tag
  title: "Wie wir helfen", // idx.srv.h2
  items: [
    {
      title: "Häusliche Intensivpflege", // idx.srv1.h3
      text: "Professionelle Versorgung in Ihren eigenen vier Wänden — rund um die Uhr.", // idx.srv1.p
      href: "/leistungen#haeuslich",
    },
    {
      title: "Pflege in verschiedenen Wohnprojekten", // idx.srv2.h3
      text: "Sicher. Vertraut. Mit Herz und Fachkompetenz.", // idx.srv2.p
      href: "/leistungen#wohnprojekte",
    },
    {
      title: "Individuelle Pflegeberatung nach § 37.3 SGB XI / nach § 7 SGB XI", // idx.srv3.h3
      text: "Wir bieten individuelle Pflegeberatungen für Pflegebedürftige und Angehörige zur optimalen Versorgung im häuslichen Umfeld.", // idx.srv3.p
      href: "/leistungen#beratung",
    },
  ],
} as const;

export const diagnoses = {
  eyebrow: "Krankheitsbild", // idx.diag.tag
  title: "Wen versorgen wir", // idx.diag.h2
  items: [
    {
      title: "Beatmungsklienten", // idx.diag1
      text: "Invasive und nicht-invasive Beatmung", // idx.diag1.d
    },
    {
      title: "Wachkoma (Apallisches Syndrom)", // idx.diag2
      text: "Langzeitversorgung und Stimulation", // idx.diag2.d
    },
    {
      title: "ALS / Neurologische Erkrankungen", // idx.diag3
      text: "Progressive Begleitung", // idx.diag3.d
    },
    {
      title: "Querschnittslähmung", // idx.diag4
      text: "Ganzheitliche Pflege", // idx.diag4.d
    },
    {
      title: "Schädel-Hirn-Trauma", // idx.diag5
      text: "Rehabilitation und Stabilisierung", // idx.diag5.d
    },
    {
      title: "Demenz/Alzheimer", // idx.diag6
      text: "Geduld und wertschätzende Kommunikation", // idx.diag6.d
    },
  ],
  quote: "Das Wohl des Patienten ist oberstes Gesetz.", // idx.quote
  quoteCite: "Unser Leitbild", // idx.quote.cite
} as const;

export const steps = {
  eyebrow: "So funktioniert es", // idx.steps.tag
  title: "In 3 Schritten zur Versorgung", // idx.steps.h2
  items: [
    {
      title: "Erstes Gespräch", // idx.step1.h3
      text: "Kostenlos und unverbindlich — wir lernen Ihre Situation kennen und beraten Sie persönlich.", // idx.step1.p
    },
    {
      title: "Individuelle Planung", // idx.step2.h3
      text: "Wir erstellen einen individuellen Versorgungsplan und klären die Kostenübernahme mit Kranken- und Pflegekassen.", // idx.step2.p
    },
    {
      title: "Versorgungsbeginn", // idx.step3.h3
      text: "Unser Pflegeteam beginnt die Versorgung — professionell und zuverlässig.", // idx.step3.p
    },
  ],
} as const;

export const about = {
  eyebrow: "Über uns", // idx.about.tag
  title: "Wer wir sind", // idx.about.h2
  text: "Der ambulante Intensivpflegedienst KSK Farmos GmbH & Co. KG wurde 2013 von Viktor Beresnev in Volkmarsen gegründet. Seitdem versorgen wir Klienten mit Herz, Fachwissen und modernster Ausstattung.", // idx.about.p
  // Сильнейший числовой аргумент компании. Ключ существовал,
  // был переведён на десять языков и нигде не выводился.
  highlight: "5,5 Mitarbeiter pro Patient — weit über dem Branchendurchschnitt.", // idx.about.q
  link: "Mehr über uns", // idx.about.link
} as const;

export const reviews = {
  eyebrow: "Erfahrungen", // idx.reviews.tag
  title: "Das sagen unsere Patienten", // idx.reviews.h2
  cta: "Bewertung abgeben", // idx.reviews.btn
  items: [
    {
      text: "\"Sehr kompetentes und einfühlsames Team. Die 24h-Betreuung in Kassel ist eine enorme Entlastung für unsere Familie. Wir fühlen uns perfekt aufgehoben.\"", // idx.review1.text
      name: "Familie M.", // idx.review1.author
      role: "Angehörige, Kassel", // idx.review1.author
    },
    {
      text: "\"Dank der häuslichen Intensivpflege von KSK Farmos GmbH & Co. KG kann mein Vater in seiner gewohnten Umgebung bleiben. Zuverlässig und stets freundlich.\"", // idx.review2.text
      name: "Thomas W.", // idx.review2.author
      role: "Angehöriger, Volkmarsen", // idx.review2.author
    },
    {
      text: "\"Vom ersten Gespräch bis zur Umsetzung der Pflege lief alles reibungslos. Die Pflegekräfte sind hochqualifiziert und arbeiten sehr professionell.\"", // idx.review3.text
      name: "Sabine K.", // idx.review3.author
      role: "Patientin, Korbach", // idx.review3.author
    },
  ],
} as const;

export const closing = {
  title: "Sprechen Sie uns an", // cta.sprechen
  text: "Kostenlos und unverbindlich.", // cta.sprechen.p
  callCta: "Jetzt anrufen", // cta.anrufen
  beratungCta: "Kostenlose Beratung", // cta.beratung
  /** Три пункта под обращением к семье — со страницы «Beratung». */
  points: [
    "Kostenlos und unverbindlich", // ber.c1
    "Persönlich oder telefonisch", // ber.c2
    "Rückmeldung innerhalb 24h", // ber.c3
  ],
} as const;

/**
 * Блок карты. Строки существуют в словаре и до сих пор не показывались:
 * `ub.loc.*` описывали страницу «О нас», а адрес в Касселе не встречался
 * на сайте ни разу.
 */
export const map = {
  eyebrow: "Standorte", // ub.loc.tag
  title: "Wo Sie uns finden", // ub.loc.h2
  coverage:
    "Wir versorgen Patienten in ganz Hessen — von Volkmarsen und Kassel bis Frankfurt und darüber hinaus.", // faq.a2
  headquartersRole: "Hauptzentrale Volkmarsen", // ub.loc1.h3
  residenceRole: "Aufenthaltskonzept Kassel", // ub.loc2.h3
} as const;

export const servicesLink = "Alle Leistungen"; // cta.leistungen

/** Условия работы — короткие пункты для закрывающего разворота. */
export const conditions = [
  "Übertarifliche Vergütung", // sb.c1
  "Firmenwagen zur privaten Nutzung", // sb.c2
  "Bezahlte Weiterbildungen", // sb.c3
  "30 Tage Urlaub", // sb.c4
  "Kollegiales Team und Wertschätzung", // sb.c5
] as const;
