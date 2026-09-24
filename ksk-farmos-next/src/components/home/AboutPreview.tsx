import { ArrowLink } from "@/components/ui/ArrowLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Photo } from "@/components/ui/Photo";
import { about } from "@/content/home";
import { company } from "@/content/site";

/**
 * Кто мы. Настоящий снимок, не постановочный, и это ровно тот регистр,
 * который просил бриф. Кадр въезжает из левого края экрана вслед
 * за прокруткой, текст держит правую колонку сетки и стоит по центру
 * кадра.
 *
 * По просьбе владельца — командное фото вместо портрета основателя
 * с сотрудницей: та же история («кто мы»), но лицом всей команды,
 * а не одного человека.
 */
export function AboutPreview() {
  return (
    <section id="ueber-uns" className="pt-turn">
      <Grid className="lg:items-center">
        <Col span="text">
          <Photo
            src="/img/about-team.webp"
            alt={`Das Team von ${company.legalName}`}
            ratio="4 / 3"
            ratioLg="3 / 2"
            sizes="(min-width: 1024px) 55vw, 100vw"
            bleed="start"
            slide
            parallax
          />
        </Col>

        <Col span="aside">
          <Eyebrow className="text-ink-muted">{about.eyebrow}</Eyebrow>
          <h2 className="mt-2xs text-h1 text-ink">{about.title}</h2>
          <p className="mt-md text-body text-ink-soft">{about.text}</p>

          <ArrowLink href="/ueber-uns" className="mt-lg">
            {about.link}
          </ArrowLink>
        </Col>
      </Grid>
    </section>
  );
}
