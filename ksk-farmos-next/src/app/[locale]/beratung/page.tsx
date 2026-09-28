import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { RuledList } from "@/components/page/RuledList";
import { StickyHeading } from "@/components/page/SectionHeading";
import { Col, Grid } from "@/components/ui/Grid";
import { BeratungForm } from "@/components/forms/BeratungForm";
import { contact } from "@/content/site";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/beratung">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "beratung" });
  return buildPageMetadata({
    locale,
    path: "/beratung",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

/**
 * Beratung. Тот же приём, что на Kontakt: хиро нет, шапка сразу
 * сплошная, заголовок закреплён слева, форма справа. В отличие от
 * Kontakt — под заголовком три пункта-заверения (`ber.c1–3`, те же,
 * что в закрывающих разворотах остальных страниц) и прямые контакты:
 * эта страница и есть целевое действие, а не общая форма связи.
 */
export default async function BeratungPage({
  params,
}: PageProps<"/[locale]/beratung">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("beratung");
  const hero = t.raw("hero");
  const points: string[] = t.raw("points");

  return (
    <section className="pt-[calc(var(--header-h)+var(--spacing-break))] pb-turn">
      <Grid>
        <Col span="text">
          <StickyHeading as="h1" eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead}>
            <RuledList className="mt-lg" items={points} />
            <div className="mt-lg flex flex-col items-start gap-xs">
              <a
                href={contact.phone.href}
                className="text-ui tabular-nums text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-violet"
              >
                {contact.phone.display}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="text-ui text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-violet"
              >
                {contact.email}
              </a>
            </div>
          </StickyHeading>
        </Col>

        <Col span="aside">
          <BeratungForm />
        </Col>
      </Grid>
    </section>
  );
}
