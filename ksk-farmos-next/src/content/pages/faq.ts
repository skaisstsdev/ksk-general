/**
 * Тексты страницы «FAQ». Дословно из `_source/i18n/de.json`,
 * исходный ключ — в комментарии. Порядок вопросов и категории —
 * как в старом `faq.html` (атрибуты `data-category`).
 */

export const meta = {
  title: "FAQ", // nav.faq
  description:
    "Häufig gestellte Fragen zur Intensivpflege, Kosten, Ablauf und Karriere bei KSK Farmos GmbH & Co. KG.", // <meta description>
} as const;

export const hero = {
  eyebrow: "FAQ", // faq.tag
  title: "Häufige Fragen", // faq.h1 + faq.h1em
  lead: "Antworten auf die wichtigsten Fragen rund um unsere Intensivpflege.", // faq.lead
} as const;

export type Category = "alle" | "pat" | "kost" | "abl" | "kar";

export const categories: readonly { id: Category; label: string }[] = [
  { id: "alle", label: "Alle" }, // faq.cat.alle
  { id: "pat", label: "Patienten" }, // faq.cat.pat
  { id: "kost", label: "Kosten" }, // faq.cat.kost
  { id: "abl", label: "Ablauf" }, // faq.cat.abl
  { id: "kar", label: "Karriere" }, // faq.cat.kar
] as const;

/**
 * `action` воспроизводит кнопку под ответом в старом сайте: у трёх
 * вопросов из одиннадцати она есть.
 */
export const questions: readonly {
  id: string;
  category: Category;
  q: string;
  a: string;
  action?: { href: string; label: string };
}[] = [
  {
    id: "q1",
    category: "pat",
    q: "Ist Intensivpflege zu Hause wirklich möglich?",
    a: "Ja — in vielen Fällen ist eine vollständige intensivpflegerische Versorgung in den eigenen vier Wänden möglich. Voraussetzung ist eine ärztliche Verordnung für häusliche Krankenpflege.",
    action: { href: "/beratung", label: "Jetzt beraten lassen" }, // jetzt.beraten
  },
  {
    id: "q2",
    category: "pat",
    q: "In welchen Regionen sind Sie tätig?",
    a: "Wir versorgen Patienten in ganz Hessen — von Volkmarsen und Kassel bis Frankfurt und darüber hinaus.",
  },
  {
    id: "q3",
    category: "kost",
    q: "Wer trägt die Kosten der Intensivpflege?",
    a: "Die Kosten werden in der Regel vollständig von der Krankenkasse und der Pflegekasse übernommen. Wir kümmern uns um die gesamte Kommunikation mit den Kostenträgern.",
    action: { href: "/beratung", label: "Jetzt beraten lassen" }, // jetzt.beraten
  },
  {
    id: "q4",
    category: "kost",
    q: "Ist der Pflegegrad für 24h-Pflege relevant?",
    a: "Die 24h-Intensivversorgung wird primär über §37 SGB V finanziert und ist nicht direkt an den Pflegegrad gebunden. Ein höherer Pflegegrad ermöglicht zusätzliche Leistungen.",
  },
  {
    id: "q5",
    category: "abl",
    q: "Wie lange dauert es bis zum Versorgungsbeginn?",
    a: "Von der ersten Beratung bis zum Versorgungsbeginn vergehen in der Regel 4 bis 6 Wochen.",
  },
  {
    id: "q6",
    category: "abl",
    q: "Welche Qualifikation hat Ihr Pflegepersonal?",
    a: "Alle ärztlich verordneten Maßnahmen werden ausschließlich von examinierten Pflegefachkräften durchgeführt, die regelmäßig durch Fachärzte geschult werden.",
  },
  {
    id: "q7",
    category: "pat",
    q: "Was beinhaltet das Aufenthaltskonzept?",
    a: "In den betreuten Wohnprojekten bieten wir Klienten eigene Zimmer, einen Garten, eine Bibliothek und 24h-Betreuung mit 5,5 Mitarbeitern pro Klienten.",
  },
  {
    id: "q8",
    category: "kar",
    q: "Wie kann ich mich bewerben?",
    a: "Über das Schnellbewerbungsformular auf unserer Website, telefonisch oder per E-Mail an pflege@ksk-farmos.de.",
    action: { href: "/schnellbewerbung", label: "Jetzt bewerben" }, // kar.cta1
  },
  {
    id: "q9",
    category: "pat",
    q: "Wie funktioniert der Wechsel aus dem Krankenhaus nach Hause?",
    a: "Wir kümmern uns um das komplette Überleitungsmanagement. Unser Team koordiniert den reibungslosen Übergang in enger Absprache mit dem Klinikpersonal und organisiert alle benötigten Hilfsmittel.",
  },
  {
    id: "q10",
    category: "kost",
    q: "Müssen wir medizinische Geräte selbst kaufen?",
    a: "Nein. Alle medizinischen Geräte wie Beatmungsgeräte oder Monitore werden von der Krankenkasse gestellt. Wir arbeiten hier eng mit spezialisierten Medizintechnik-Unternehmen zusammen.",
  },
  {
    id: "q11",
    category: "abl",
    q: "Sind auch nachts Pflegekräfte vor Ort?",
    a: "Ja. Bei der 24-Stunden-Intensivpflege ist immer eine examinierte Pflegefachkraft bei Ihnen vor Ort — auch nachts —, um eine lückenlose und sichere Überwachung zu gewährleisten.",
  },
] as const;

export const topCards = [
  { title: "Kosten", text: "Die Intensivpflege wird in der Regel vollständig von der Krankenkasse übernommen." }, // faq.top1
  { title: "Ablauf", text: "Vom Erstgespräch bis zum Versorgungsbeginn vergehen ca. 4-6 Wochen." }, // faq.top2
  { title: "Qualifikation", text: "Alle Leistungen werden von examinierten, fortgebildeten Fachkräften erbracht." }, // faq.top3
] as const;

export const closing = {
  title: "Ihre Frage war nicht dabei?", // faq.cta.h2
  text: "Kontaktieren Sie uns direkt — wir helfen Ihnen gerne.", // faq.cta.p
} as const;
