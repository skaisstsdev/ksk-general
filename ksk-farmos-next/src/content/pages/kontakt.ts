/**
 * Тексты страницы «Kontakt». Дословно из `_source/i18n/de.json`,
 * исходный ключ — в комментарии.
 */

export const meta = {
  title: "Kontakt", // nav.kontakt
  description:
    "Kontaktieren Sie KSK Farmos GmbH & Co. KG — kostenlos, unverbindlich, menschlich. Telefon, E-Mail oder Kontaktformular.", // <meta description>
} as const;

export const hero = {
  eyebrow: "Kontakt", // kon.tag
  title: "Sprechen Sie uns an", // kon.h1 + kon.h1em
  lead: "Kostenlos. Unverbindlich. Menschlich.", // kon.lead
} as const;

export const form = {
  eyebrow: "Schreiben Sie uns", // kon.form.tag
  title: "Kontaktformular", // kon.form.h2
  text: "Füllen Sie das Formular aus und wir melden uns innerhalb von 24 Stunden.", // kon.form.p
  callLabel: "Sie können uns auch direkt anrufen:", // kon.form.call
  fields: {
    vorname: "Vorname", // form.vorname
    nachname: "Nachname", // form.nachname
    email: "E-Mail", // form.email
    telefon: "Telefon", // form.telefon
    betreff: "Betreff", // form.betreff
    betreffPlaceholder: "Bitte wählen", // form.bitte
    nachricht: "Nachricht", // form.nachricht.req
    consentPrefix: "Ich habe die ", // form.datenschutz (1)
    consentLink: "Datenschutzerklärung", // form.datenschutz (2)
    consentSuffix: " gelesen und stimme zu.", // form.datenschutz (3)
    submit: "Nachricht senden", // form.senden
  },
  betreffOptions: [
    { value: "beratung", label: "Beratung zur Intensivpflege" }, // form.betreff.1
    { value: "wohnprojekte", label: "Wohnprojekte" }, // form.betreff.2
    { value: "karriere", label: "Bewerbung / Karriere" }, // form.betreff.3
    { value: "sonstiges", label: "Sonstiges" }, // form.betreff.4
  ],
  success: {
    title: "Vielen Dank!", // отсутствует отдельным ключом в словаре, короткая типографская фраза
    text: "Ihre Nachricht wurde gesendet. Wir melden uns innerhalb von 24 Stunden.", // старый текст успеха kontakt.html
  },
  error: {
    title: "Etwas ist schiefgelaufen.",
    text: "Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.",
  },
} as const;

export const cards = {
  headquarters: "Zentrale Volkmarsen", // kon.card1
  mobile: "Mobil / 24h", // kon.card2
  email: "E-Mail", // kon.card3
  fax: "Fax", // kon.card4
} as const;

export const standorte = {
  eyebrow: "Standorte", // ub.loc.tag
  title: "Wo Sie uns finden", // ub.loc.h2
  headquartersRole: "Hauptzentrale Volkmarsen", // ub.loc1.h3
  residenceRole: "Aufenthaltskonzept Kassel", // ub.loc2.h3
} as const;

export const map = {
  consent: "Um die interaktive Google-Karte zu sehen, stimmen Sie bitte der Übertragung Ihrer Daten (inkl. IP-Adresse) an Google zu.", // map.consent
  load: "Karte laden & zustimmen", // map.load
  loading: "Karte wird geladen…", // map.loading
  revoke: "Zustimmung widerrufen", // neu — Link im Kartenrahmen, um die Einwilligung zurückzunehmen
} as const;
