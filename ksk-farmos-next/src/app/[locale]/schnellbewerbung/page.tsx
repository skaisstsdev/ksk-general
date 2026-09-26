import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { RuledList } from "@/components/page/RuledList";
import { StickyHeading } from "@/components/page/SectionHeading";
import { Col, Grid } from "@/components/ui/Grid";
import { BewerbungForm } from "@/components/forms/BewerbungForm";
import { contact } from "@/content/site";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/schnellbewerbung">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "schnellbewerbung" });
  return { title: t("meta.title"), description: t("meta.description") };
}

/**
 * Schnellbewerbung. Устройство страницы — как у Beratung (хиро нет,
 * заголовок закреплён слева, форма справа), но справа не одна форма,
 * а мастер в три шага (`BewerbungForm.tsx`) — тем же составом полей,
 * что был на старом сайте (`wiz.*`), без ручного переключения
 * классов панелей.
 */
export default async function SchnellbewerbungPage({
  params,
}: PageProps<"/[locale]/schnellbewerbung">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("schnellbewerbung");
  const hero = t.raw("hero");
  const points: string[] = t.raw("points");

  return (
    <section className="pt-[calc(var(--header-h)+var(--spacing-break))] pb-turn">
      <Grid>
        <Col span="text">
          <StickyHeading eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead}>
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
          <BewerbungForm />
        </Col>
      </Grid>
    </section>
  );
}
