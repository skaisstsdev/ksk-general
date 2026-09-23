import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ReviewMarquee } from "@/components/home/ReviewMarquee";
import { reviews } from "@/content/home";
import { social } from "@/content/site";

/**
 * Отзывы. Заголовок стоит в сетке, карточки бегут строкой во всю
 * ширину экрана — второе и последнее самодвижущееся место на странице
 * после полосы в хиро. Линеек над карточками нет: границу задаёт
 * само движение.
 */
export function Reviews() {
  return (
    <section id="erfahrungen" className="pt-break">
      <Container>
        <Eyebrow className="text-ink-muted">{reviews.eyebrow}</Eyebrow>
        <h2 className="mt-2xs text-h2 text-ink">{reviews.title}</h2>
      </Container>

      <ReviewMarquee items={reviews.items} className="mt-xl" />

      <Container>
        {/* Призыв — после отзывов, а не рядом с заголовком: сначала
            читают чужие слова, потом решают написать свои. По центру —
            он относится ко всей строке, а не к первой карточке. */}
        <div className="mt-xl flex justify-center">
          <Button href={social.googleReview} variant="secondary">
            {reviews.cta}
          </Button>
        </div>
      </Container>
    </section>
  );
}
