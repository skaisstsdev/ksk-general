import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { NumberedList } from "@/components/page/NumberedList";
import { PageClosing } from "@/components/page/PageClosing";
import { RuledList } from "@/components/page/RuledList";
import { SectionHeading, StickyHeading } from "@/components/page/SectionHeading";
import { JobPostingJsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { ArrowRight } from "@/components/ui/icons";
import { Rule } from "@/components/ui/Rule";
import { isStelleSlug, stellen, stellenDatePosted } from "@/content/pages/stellen";
import { contact } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/metadata";

type StelleContent = {
  meta: { title: string; description: string };
  title: string;
  claim: string;
  intro: string[];
  facts: { label: string; value: string }[];
  benefitsEyebrow: string;
  benefitsTitle: string;
  benefits: { title: string; text: string }[];
  profileEyebrow: string;
  profileTitle: string;
  requirementsTitle: string;
  requirements: string[];
  niceTitle: string;
  nice: string[];
  niceNote: string;
  closingTitle: string;
  closingText: string;
};

export function generateStaticParams() {
  return stellen.map(({ slug }) => ({ slug }));
}

/**
 * Каждый язык — самостоятельная индексируемая страница: свой текст, свой
 * canonical на себя и полный набор hreflang (`buildPageMetadata`), как у
 * остальных страниц сайта. Ссылку на немецкую версию в canonical не ставим:
 * тексты переведены, это не дубли.
 */
export async function generateMetadata({
  params,
}: PageProps<"/[locale]/karriere/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isStelleSlug(slug)) return {};

  const t = await getTranslations({ locale, namespace: "stellen" });
  const content: StelleContent = t.raw(`items.${slug}`);

  return buildPageMetadata({
    locale,
    path: `/karriere/${slug}`,
    title: content.meta.title,
    description: content.meta.description,
    image: "/img/karriere/karriere-hero.webp",
  });
}

/**
 * Страница вакансии. Сверху справа — короткая сводка («Auf einen Blick»):
 * зарплата и условия видны без прокрутки. Дальше у каждого раздела своё
 * устройство, по просьбе владельца, чтобы одинаковые блоки не шли подряд:
 *
 *   1. преимущества — закреплённый заголовок и нумерованный перечень
 *   2. профиль — фиолетовый разворот, два списка рядом (по образцу
 *      Wohnprojekte на Leistungen и Vakanzen на Karriere)
 *
 * Фотографий и блока задач здесь нет: их пробовали, владелец попросил
 * убрать. Текст задач остался в словаре (`tasks*`), на странице не выводится.
 *
 * `/schnellbewerbung?stelle=…` подставляет вакансию в форму отклика.
 */
export default async function StellePage({
  params,
}: PageProps<"/[locale]/karriere/[slug]">) {
  const { locale, slug } = await params;
  if (!isStelleSlug(slug)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("stellen");
  const shared = t.raw("shared");
  const content: StelleContent = t.raw(`items.${slug}`);
  const stelle = stellen.find((item) => item.slug === slug)!;
  const applyHref = `/schnellbewerbung?stelle=${slug}`;

  return (
    <>
      <JobPostingJsonLd
        slug={slug}
        title={content.title}
        intro={content.intro}
        sections={[
          {
            title: content.benefitsTitle,
            items: content.benefits.map((b) => `${b.title}. ${b.text}`),
          },
          { title: content.requirementsTitle, items: content.requirements },
          { title: content.niceTitle, items: content.nice },
        ]}
        datePosted={stellenDatePosted}
        employmentType={stelle.employmentType}
        baseSalaryPerHour={"baseSalaryPerHour" in stelle ? stelle.baseSalaryPerHour : undefined}
      />

      <section className="pt-[calc(var(--header-h)+var(--spacing-break))]">
        <Grid>
          <Col>
            <Link
              href="/karriere#vakanzen"
              className="group inline-flex items-center gap-2xs text-ui text-ink-soft transition-colors hover:text-violet"
            >
              <ArrowRight className="size-4 rotate-180 transition-transform duration-200 ease-out-soft group-hover:-translate-x-0.5" />
              {shared.back}
            </Link>
          </Col>

          <Col span="text">
            <SectionHeading
              as="h1"
              eyebrow={shared.eyebrow}
              title={content.title}
            >
              <p className="mt-md max-w-[28ch] text-subhead text-violet">{content.claim}</p>
              <div className="mt-md flex max-w-[60ch] flex-col gap-sm text-body text-ink-soft">
                {content.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </SectionHeading>
          </Col>

          <Col span="aside">
            <Eyebrow className="text-ink-muted">{shared.factsTitle}</Eyebrow>
            <dl className="mt-xs">
              {content.facts.map((fact, i) => (
                <div key={fact.label}>
                  <Rule index={i} />
                  <div className="flex flex-col gap-3xs py-xs">
                    <dt className="text-meta text-ink-muted">{fact.label}</dt>
                    <dd className="text-subhead text-ink">{fact.value}</dd>
                  </div>
                </div>
              ))}
              <div aria-hidden="true">
                <Rule index={content.facts.length} />
              </div>
            </dl>
            <div className="mt-lg flex flex-wrap items-center gap-x-lg gap-y-md">
              <Button href={applyHref} size="lg">
                {shared.apply}
              </Button>
              <a
                href={contact.phone.href}
                className="text-ui tabular-nums text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-violet"
                aria-label={`${shared.phoneLabel} ${contact.phone.display}`}
              >
                {contact.phone.display}
              </a>
            </div>
          </Col>
        </Grid>
      </section>

      <section className="pt-turn">
        <Grid>
          <Col span="text">
            <StickyHeading eyebrow={content.benefitsEyebrow} title={content.benefitsTitle} />
          </Col>
          <Col span="aside">
            <NumberedList items={content.benefits} />
          </Col>
        </Grid>
      </section>

      <section className="pt-turn">
        <div data-tone="dark" className="bg-violet">
          <Grid className="py-2xl lg:py-3xl">
            <Col>
              <SectionHeading
                eyebrow={content.profileEyebrow}
                title={content.profileTitle}
                tone="paper"
              />
            </Col>
            <Col span="text">
              <RuledList
                title={content.requirementsTitle}
                items={content.requirements}
                tone="paper"
              />
            </Col>
            <Col span="aside">
              <RuledList title={content.niceTitle} items={content.nice} tone="paper" />
              <p className="mt-md text-ui text-white-pure/90">{content.niceNote}</p>
            </Col>
          </Grid>
        </div>
      </section>

      <PageClosing
        eyebrow={shared.closingEyebrow}
        title={content.closingTitle}
        text={content.closingText}
        points={shared.closingPoints}
        action={{ href: applyHref, label: shared.apply }}
      />
    </>
  );
}
