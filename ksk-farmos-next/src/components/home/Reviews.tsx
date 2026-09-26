import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ReviewMarquee } from "@/components/home/ReviewMarquee";
import { social } from "@/content/site";

/**
 * Отзывы. Заголовок стоит в сетке, карточки бегут строкой во всю
 * ширину экрана — второе и последнее самодвижущееся место на странице
 * после полосы в хиро. Линеек над карточками нет: границу задаёт
 * само движение.
 */
export async function Reviews() {
  const t = await getTranslations("home.reviews");
  const items = t.raw("items");

  return (
    <section id="erfahrungen" className="pt-break">
      <Container>
        <Eyebrow className="text-ink-muted">{t("eyebrow")}</Eyebrow>
        <h2 className="mt-2xs text-h2 text-ink">{t("title")}</h2>
      </Container>

      <ReviewMarquee items={items} className="mt-xl" />

      <Container>
        {/* Призыв — после отзывов, а не рядом с заголовком: сначала
            читают чужие слова, потом решают написать свои. По центру —
            он относится ко всей строке, а не к первой карточке. */}
        <div className="mt-xl flex justify-center">
          <Button href={social.googleReview} variant="secondary">
            {t("cta")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
