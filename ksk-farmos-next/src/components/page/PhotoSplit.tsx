import { Col, Grid } from "@/components/ui/Grid";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";

type PhotoProps = {
  src: string;
  alt: string;
  /** Пропорции на телефоне. */
  ratio: string;
  /** Пропорции от `lg`. */
  ratioLg?: string;
  position?: string;
};

/**
 * Разворот «кадр + текст» — приём блока «Über uns» главной
 * (`AboutPreview`), вынесенный для остальных страниц.
 *
 * Кадр держит колонку сетки и уходит в край экрана своей стороной;
 * въезжает оттуда же вслед за прокруткой. Текст стоит в соседнем
 * слоте сетки — никаких собственных отступов и ширин.
 *
 * `side="start"` — кадр слева (`text`), текст в правой колонке (`aside`).
 * `side="end"`   — текст слева (`text`), кадр справа (`aside`).
 * На телефоне кадр всегда идёт первым: он и есть начало раздела.
 *
 * `align="start"` — для текста, который меняет высоту (аккордеон):
 * при центровке кадр ездил бы вверх-вниз вместе с раскрытием.
 */
export function PhotoSplit({
  photo,
  side = "start",
  align = "center",
  id,
  pause = "break",
  children,
}: {
  photo: PhotoProps;
  side?: "start" | "end";
  align?: "center" | "start";
  id?: string;
  pause?: "beat" | "break" | "turn";
  children: React.ReactNode;
}) {
  const frame = (
    <Photo
      src={photo.src}
      alt={photo.alt}
      ratio={photo.ratio}
      ratioLg={photo.ratioLg}
      position={photo.position}
      sizes="(min-width: 1024px) 55vw, 100vw"
      bleed={side}
      slide
      parallax
    />
  );

  return (
    <section
      id={id}
      className={cn(
        // Кадр, въезжающий справа, до конца въезда выходит за край экрана.
        // На телефоне это раздвигало раскладку шире экрана (прокрутка
        // `html` здесь не спасает: мобильный браузер расширяет само окно).
        // Секция во всю ширину, поэтому обрезка по ней — это обрезка
        // ровно по краю экрана; вылет `bleed` до края не страдает.
        "overflow-x-clip",
        pause === "beat" && "pt-beat",
        pause === "break" && "pt-break",
        pause === "turn" && "pt-turn",
      )}
    >
      <Grid className={align === "center" ? "lg:items-center" : undefined}>
        {side === "start" ? (
          <>
            <Col span="text">{frame}</Col>
            <Col span="aside">{children}</Col>
          </>
        ) : (
          <>
            <Col span="aside" className="lg:order-last">
              {frame}
            </Col>
            <Col span="text">{children}</Col>
          </>
        )}
      </Grid>
    </section>
  );
}
