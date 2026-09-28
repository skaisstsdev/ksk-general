import { company, contact, locations, siteUrl, social } from "@/content/site";

/**
 * Структурированные данные. Один компонент, а не JSON-строка в каждом
 * файле, где она нужна — сериализация (`JSON.stringify` с экранированием
 * `<` в довесок к стандартному, чтобы `</script>` в контенте не мог
 * преждевременно закрыть тег) остаётся в одном месте.
 */
function JsonLdScript({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/**
 * Круглосуточная служба — часы работы одни на оба адреса: `hero.eyebrow`
 * и `moment.text` на каждом языке сайта прямо говорят «24 часа в сутки,
 * 7 дней в неделю» (см. словари `home.json` для каждого языка), это
 * не предположение.
 */
const ALWAYS_OPEN = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
];

/**
 * Два адреса — два `MedicalBusiness` в одном графе, не одна запись
 * с двумя адресами: у Schema.org `address` — ровно одно значение на
 * запись, а Volkmarsen (центральный офис) и Kassel (жилой проект)
 * физически разные объекты, оба с собственным телефоном (см.
 * комментарий в `content/site.ts` про два разных набора номеров).
 *
 * Рендерится один раз в `[locale]/layout.tsx` — сайт целиком описывает
 * одну и ту же компанию вне зависимости от текущего языка.
 */
export function MedicalBusinessJsonLd() {
  const image = new URL("/logo-icon.png", siteUrl).toString();
  const sameAs = [social.facebook, social.instagram, social.googleProfile];

  const graph = [
    {
      "@type": "MedicalBusiness",
      "@id": `${siteUrl}/#${locations.headquarters.id}`,
      name: company.legalName,
      image,
      url: siteUrl,
      telephone: locations.headquarters.phone.href.replace("tel:", ""),
      address: {
        "@type": "PostalAddress",
        streetAddress: locations.headquarters.street,
        postalCode: locations.headquarters.postalCode,
        addressLocality: locations.headquarters.city,
        addressCountry: locations.headquarters.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: locations.headquarters.geo.lat,
        longitude: locations.headquarters.geo.lng,
      },
      openingHoursSpecification: ALWAYS_OPEN,
      sameAs,
      email: contact.email,
      foundingDate: String(company.foundedYear),
    },
    {
      "@type": "MedicalBusiness",
      "@id": `${siteUrl}/#${locations.residence.id}`,
      name: `${company.shortName} — ${locations.residence.city}`,
      image,
      url: siteUrl,
      telephone: locations.residence.phone.href.replace("tel:", ""),
      address: {
        "@type": "PostalAddress",
        streetAddress: locations.residence.street,
        postalCode: locations.residence.postalCode,
        addressLocality: locations.residence.city,
        addressCountry: locations.residence.country,
      },
      openingHoursSpecification: ALWAYS_OPEN,
      sameAs,
      email: contact.email,
      parentOrganization: { "@id": `${siteUrl}/#${locations.headquarters.id}` },
    },
  ];

  return <JsonLdScript data={{ "@context": "https://schema.org", "@graph": graph }} />;
}

/**
 * Вопросы-ответы FAQ-страницы. Принимает уже переведённые пары —
 * текст не удваивается словарём, он приходит из того же `t.raw("questions")`,
 * что рисует список на странице.
 */
export function FaqJsonLd({ questions }: { questions: { q: string; a: string }[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }}
    />
  );
}
