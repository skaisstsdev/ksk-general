/**
 * Тексты страницы «Karriere». Дословно из `_source/i18n/de.json`,
 * исходный ключ — в комментарии. Порядок блоков — как в старом
 * `karriere.html`. Отступления отмечены отдельно.
 */

export const meta = {
  title: "Karriere", // nav.karriere
  description:
    "Karriere bei KSK Farmos GmbH & Co. KG — übertarifliche Bezahlung, Weiterbildung und ein starkes Team. Jetzt bewerben.", // <meta description>
} as const;

export const hero = {
  eyebrow: "Karriere", // kar.tag
  title: "Arbeiten, wo es wirklich zählt.", // kar.h1a (de.json) + окончание из HTML, см. ниже
  lead: "Übertarifliche Bezahlung, kontinuierliche Weiterbildung und ein Team, das zusammenhält.", // kar.lead
  bewerben: "Jetzt bewerben", // kar.cta1
  vakanzen: "Offene Stellen", // kar.cta2
} as const;

/**
 * `kar.h1a` в словаре — «Arbeiten, wo es», как и в HTML. Вторая часть
 * заголовка (`kar.h1em`) в словаре — устаревший вариант «es zählt.»:
 * склеенная с первой частью, она даёт «Arbeiten, wo es es zählt.» —
 * повтор «es». Вторая часть, набранная в старом HTML («wirklich
 * zählt.»), даёт верную фразу — она и используется в `hero.title` выше.
 */

export const benefits = {
  eyebrow: "Was wir Ihnen bieten", // kar.ben.tag (в словаре капсом)
  title: "Ihre Vorteile bei KSK Farmos GmbH & Co. KG", // kar.ben.h2
  items: [
    {
      title: "Übertarifliche Bezahlung", // kar.b1.h3
      text: "Wir zahlen deutlich über Tarif — weil uns Ihre Arbeit viel wert ist.", // kar.b1.p
    },
    {
      title: "Starkes Team", // kar.b2.h3
      // В словаре опечатка «Atmosphere» вместо «Atmosphäre» — перенесена
      // как есть, отмечена владельцу.
      text: "Freundliche Atmosphäre, gegenseitige Unterstützung und echte Wertschätzung.", // kar.b2.p
    },
    {
      title: "Fort-Weiterbildungen", // kar.b3.h3
      text: "Regelmäßige Fort-Weiterbildung Möglichkeiten durch Fort- und Weiterbildungsinstitute mit Zertifikatausstellung — voll finanziert vom Unternehmen.", // kar.b3.p
    },
    {
      title: "Flexibilität", // kar.b4.h3
      text: "Wir nehmen Rücksicht auf Ihr Privat und Berufsleben und gestalten unsere Einsatzplanung flexibel.", // kar.b4.p
    },
    {
      title: "Sinnvolle Arbeit", // kar.b5.h3
      text: "Sie machen täglich einen echten Unterschied im Leben schwerkranker Menschen.", // kar.b5.p
    },
    {
      title: "Karrierechancen", // kar.b6.h3
      text: "Aufstiegsmöglichkeiten und Unterstützung bei persönlicher Entwicklung. Ihre Leistung und Ihr Engagement können bei uns zu neuen Karrierechancen führen.", // kar.b6.p
    },
  ],
} as const;

export const vakanzen = {
  eyebrow: "Stellenangebote", // kar.vac.tag
  title: "Offene Stellen", // kar.vac.h2
  bewerben: "Bewerben", // kar.vac.btn
  items: [
    {
      title: "Pflegefachkraft (w/m/d)", // kar.v1
      tags: ["Vollzeit / Teilzeit", "Intensivpflege", "Führerschein B"], // kar.tag.vt, kar.tag.ip, kar.tag.fs
    },
    {
      title: "Pflegehelfer (w/m/d)", // kar.v2
      tags: ["Vollzeit / Teilzeit", "Führerschein B"], // kar.tag.vt, kar.tag.fs
    },
    {
      title: "Pflegepraktikant (w/m/d)", // kar.v3
      tags: ["Vollzeit"], // kar.tag.vz
    },
  ],
} as const;

export const bewerbung = {
  eyebrow: "Bewerbung", // kar.bew.tag
  title: "So bewerben Sie sich", // kar.bew.h2
  steps: [
    {
      title: "Bewerbung einreichen", // kar.bew1.h3
      text: "Per Formular, E-Mail oder Telefon.", // kar.bew1.p
    },
    {
      title: "Persönliches Gespräch", // kar.bew2.h3
      text: "Wir lernen Sie kennen — locker und auf Augenhöhe.", // kar.bew2.p
    },
    {
      title: "Willkommen im Team", // kar.bew3.h3
      text: "Einarbeitung, Fortbildungen und Unterstützung.", // kar.bew3.p
    },
  ],
} as const;

export const closing = {
  eyebrow: "Für Pflegekräfte", // idx.dual.right.tag
  title: "Bereit für den nächsten Schritt?", // kar.cta.h2
  text: "Bewerben Sie sich jetzt — unkompliziert und schnell.", // kar.cta.p
  cta: "Jetzt bewerben", // kar.cta.btn
} as const;
