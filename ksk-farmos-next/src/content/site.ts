/**
 * Единственный источник правды по реквизитам компании.
 *
 * В старом сайте header и footer были скопированы вручную в каждый из
 * десяти HTML-файлов — из-за этого телефон в футере разошёлся с телефоном
 * в Impressum. Здесь любое число живёт ровно в одном месте.
 *
 * ВНИМАНИЕ по телефонам. В исходных материалах два разных набора номеров:
 * Impressum и Datenschutz используют одни, все остальные страницы, футер,
 * JSON-LD и промпт чат-бота — другие. По решению владельца оба набора
 * переносятся как есть и разделены по назначению: `contact` — то, что
 * показывается посетителю, `impressum` — то, что стоит в юридическом
 * документе. Разъехаться дальше они технически уже не могут.
 */

export const company = {
  legalName: "KSK Farmos GmbH & Co. KG",
  fullLegalName: "Intensivpflegedienst KSK Farmos GmbH & Co. KG",
  shortName: "KSK Farmos",
  foundedYear: 2013,
  founder: "Viktor Beresnev",
  staffCount: 30,
  /** Среднее число сотрудников на пациента в жилом проекте Кассель. */
  staffPerPatient: 5.5,
  /** Недель от первого разговора до старта ухода. */
  weeksToStart: [4, 6] as const,
} as const;

/** Контакты, которые видит посетитель сайта. */
export const contact = {
  phone: { display: "05693 / 9189907", href: "tel:+4956939189907" },
  mobile: { display: "0170 / 7652593", href: "tel:+491707652593" },
  email: "pflege@ksk-farmos.de",
} as const;

/** Реквизиты для Impressum. Юридический документ — трогать только по указанию владельца. */
export const impressum = {
  phone: { display: "05693 / 9915666", href: "tel:+4956939915666" },
  fax: { display: "05693 / 3599847", href: "tel:+4956933599847" },
  mobile: { display: "0173 / 5119338", href: "tel:+491735119338" },
  email: "pflege@ksk-farmos.de",
  generalPartner: "KSK Farmos Verwaltungs GmbH",
  registerCourt: "Amtsgericht Korbach",
  registerGmbH: "HRB 2614",
  registerKG: "HRA 1913",
  managingDirector: "Viktor Beresnev",
  taxNumber: "2622930465",
  operatingNumber: "72283398",
  ikNumber: "460623855",
} as const;

/** Betrieblicher Datenschutzbeauftragter — контакт для Datenschutzerklärung. */
export const dataProtectionOfficer = {
  name: "Klaus Moldenhauer",
  email: "system@ksk-farmos.de",
} as const;

export const locations = {
  headquarters: {
    id: "volkmarsen",
    street: "Ehringer Weg 2b",
    postalCode: "34471",
    city: "Volkmarsen",
    country: "DE",
    geo: { lat: 51.41164, lng: 9.11586 },
    phone: contact.phone,
  },
  /**
   * Жилой проект в Касселе. В старом сайте этот адрес не встречался
   * ни на одной странице — только в промпте чат-бота, хотя это
   * физический объект в городе, дающий основной поисковый трафик.
   */
  residence: {
    id: "kassel",
    street: "Sommerbergstraße 14",
    postalCode: "34123",
    city: "Kassel",
    country: "DE",
    phone: contact.mobile,
  },
} as const;

export const social = {
  facebook: "https://www.facebook.com/share/19BqxGqfLy/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/ksk.farmos.intensivpflege/",
  /** Карточка компании на Google Maps — профиль, а не форма отзыва. */
  googleProfile: "https://maps.app.goo.gl/SZm7uaePevYGcMJaA?g_st=ic",
  googleReview: "https://g.page/r/Cd6hNIICJQRSEBM/review",
} as const;

export const siteUrl = "https://ksk-farmos.de";
