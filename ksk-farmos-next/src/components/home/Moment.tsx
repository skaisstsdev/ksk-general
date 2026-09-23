import { ArrowLink } from "@/components/ui/ArrowLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ExpandingPhoto } from "@/components/ui/ExpandingPhoto";
import { moment } from "@/content/home";

/**
 * Кадр, который раскрывается на весь экран, — с текстом о том, что
 * тяжёлый диагноз не значит клинику. Стоит между вводной фразой
 * и списком диагнозов: сначала «кто мы», потом образ, потом «кого
 * берём». Единственный такой блок на странице — второй превратил бы
 * приём в эффект.
 */
export function Moment() {
  return (
    /* Без верхнего отступа: кадр стоит по центру сцены высотой в экран,
       и до закрепления над ним и так остаётся воздух — пауза заложена
       в самой механике, добавлять её сверху не нужно. */
    <section>
      <ExpandingPhoto
        src="/img/spaziergang.webp"
        width={2488}
        height={1487}
        srcNarrow="/img/spaziergang-hoch.webp"
        widthNarrow={1000}
        heightNarrow={1502}
        alt="Familie mit Pflegekraft beim Spaziergang im Garten"
      >
        <div className="flex max-w-[34rem] flex-col gap-xs">
          <Eyebrow className="text-paper/85">{moment.eyebrow}</Eyebrow>
          <h3 className="text-h2 text-paper">{moment.title}</h3>
          <p className="text-body text-paper/90 lg:text-lead">{moment.text}</p>
          <ArrowLink
            href={moment.href}
            className="mt-xs text-paper decoration-paper/40 hover:decoration-paper"
          >
            {moment.cta}
          </ArrowLink>
        </div>
      </ExpandingPhoto>
    </section>
  );
}
