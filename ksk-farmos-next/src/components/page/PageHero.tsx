import { getImageProps } from "next/image";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Rule } from "@/components/ui/Rule";
import { cn } from "@/lib/cn";

export type HeroAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export type PageHeroImage = {
  /** Горизонтальный кадр, от `lg`. */
  src: string;
  width: number;
  height: number;
  /** Вертикальный кадр для узких экранов. */
  srcNarrow: string;
  widthNarrow: number;
  heightNarrow: number;
  alt: string;
  position?: string;
};

/**
 * Два кадра с затемнением на весь экран — тот же приём art direction,
 * что у `ExpandingPhoto` (горизонтальный снимок от `lg`, вертикальный
 * до), но без сцены со скроллом: кадр здесь стоит на месте.
 */
function HeroPicture({ image }: { image: PageHeroImage }) {
  // Как и на главной (`home/Hero.tsx`): `priority`/`preload` предзагрузил
  // бы оба кадра `<picture>` разом, поэтому вместо него —
  // `fetchPriority="high"` плюс `loading: "eager"` на самом `<img>`
  // (без `eager` картинка по умолчанию ленивая и ждёт близости к вьюпорту,
  // даже с высоким fetchPriority).
  const common = { alt: image.alt, sizes: "100vw", loading: "eager" as const };
  const {
    props: { srcSet: wide },
  } = getImageProps({
    ...common,
    src: image.src,
    width: image.width,
    height: image.height,
  });
  const {
    props: { srcSet: narrow, ...img },
  } = getImageProps({
    ...common,
    src: image.srcNarrow,
    width: image.widthNarrow,
    height: image.heightNarrow,
  });

  return (
    <picture>
      <source media="(min-width: 64rem)" srcSet={wide} />
      <source srcSet={narrow} />
      <img
        {...img}
        alt={image.alt}
        fetchPriority="high"
        className="size-full object-cover"
        style={{
          objectPosition: image.position ?? "center",
          filter: "brightness(0.5)",
        }}
      />
    </picture>
  );
}

/**
 * Хиро внутренних страниц.
 *
 * Собран по устройству хиро главной (`home/Hero.tsx` + `hero/HeroCopy.tsx`),
 * но отдельным компонентом: главная закончена и не меняется, а здесь
 * текст приходит пропсами. Всё, что там измерено и объяснено, повторено
 * буквально — высота экрана, центр «от низа шапки до низа экрана»,
 * поправка `--hero-bias` на узких экранах, колонка `wide`, одна правая
 * граница у заголовка и лида, линейка перед кнопками.
 *
 * Пока `image` не задан, под текстом лежит подложка `stand-in` — той
 * же глубины, что притемнённый снимок на главной, поэтому текст,
 * кнопки и переключатель языка (`data-tone="dark"`) уже стоят в своём
 * окончательном цвете. С `image` — тот же приём, что на главной:
 * снимок и то же затемнение (`brightness(0.5)` + `bg-ink/32`).
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  actions = [],
  image,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  actions?: HeroAction[];
  image?: PageHeroImage;
}) {
  return (
    <section
      data-tone="dark"
      className="relative flex min-h-svh flex-col overflow-hidden bg-stand-in"
    >
      {image ? (
        <div className="absolute inset-0">
          <HeroPicture image={image} />
          <div aria-hidden="true" className="absolute inset-0 bg-ink/32" />
        </div>
      ) : null}

      <div className="relative flex flex-1 flex-col justify-center pt-[var(--header-h)] pb-[var(--hero-bias)]">
        <Grid>
          <Col span="wide">
            <div className="flex flex-col">
              <Eyebrow className="text-paper/90">{eyebrow}</Eyebrow>

              <h1 className="mt-sm text-wrap text-display text-paper">
                {title}
              </h1>

              {lead ? (
                <p className="mt-md max-w-[27ch] text-lead text-paper/90 lg:max-w-none">
                  {lead}
                </p>
              ) : null}

              <Rule trigger="mount" tone="paper" className="mt-lg" />

              {actions.length > 0 ? (
                <div className="mt-lg flex flex-wrap items-center gap-x-md gap-y-sm">
                  {actions.map((action) => (
                    <Button
                      key={action.href}
                      href={action.href}
                      variant={action.variant ?? "primary"}
                      size="lg"
                      className={cn(
                        action.variant === "secondary" &&
                          "border-paper/60 text-paper hover:border-paper hover:bg-paper/10",
                        action.className,
                      )}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              ) : null}
            </div>
          </Col>
        </Grid>
      </div>
    </section>
  );
}
