/**
 * Тексты, повторяющиеся на нескольких внутренних страницах.
 * Формат — как у `home.ts`: дословно из `de.json`, ключ в комментарии.
 */

/**
 * Закрывающий блок для семьи. В старом сайте — фиолетовая карточка
 * `cta-card-violet` в конце Leistungen, Über uns, FAQ и Kontakt.
 */
export const closingFamily = {
  eyebrow: "Für Patienten und Angehörige", // idx.dual.left.tag
  title: "Kostenlose Beratung", // cta.beratung
  text: "Wir beraten Sie persönlich — unverbindlich und kostenfrei.", // cta.beratung.p
  cta: "Sprechen Sie uns an", // cta.sprechen
} as const;

/** Ссылка на Kontakt, которая повторяется вне навигации (хиро Über uns, FAQ). */
export const kontaktCta = "Kontakt aufnehmen"; // cta.kontakt
