import { getTranslations } from "next-intl/server";

import { ArrowLink } from "@/components/ui/ArrowLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Photo } from "@/components/ui/Photo";
import { company } from "@/content/site";

/**
 * Кто мы. Снимок основателя — настоящий, не постановочный, и это ровно
 * тот регистр, который просил бриф. Кадр въезжает из левого края
 * экрана вслед за прокруткой, текст держит правую колонку сетки
 * и стоит по центру кадра.
 */
export async function AboutPreview() {
  const t = await getTranslations("home.about");

  return (
    <section id="ueber-uns" className="pt-turn">
      <Grid className="lg:items-center">
        <Col span="text">
          <Photo
            src="/img/home/gruender.webp"
            alt={t("alt", { founder: company.founder, legalName: company.legalName })}
            ratio="4 / 3"
            ratioLg="3 / 2"
            sizes="(min-width: 1024px) 55vw, 100vw"
            bleed="start"
            slide
            parallax
          />
        </Col>

        <Col span="aside">
          <Eyebrow className="text-ink-muted">{t("eyebrow")}</Eyebrow>
          <h2 className="mt-2xs text-h1 text-ink">{t("title")}</h2>
          <p className="mt-md text-body text-ink-soft">{t("text")}</p>

          <ArrowLink href="/ueber-uns" className="mt-lg">
            {t("link")}
          </ArrowLink>
        </Col>
      </Grid>
    </section>
  );
}
