import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Rule } from "@/components/ui/Rule";
import { cn } from "@/lib/cn";

export type HeroAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

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
 * Пока фотографий нет, под текстом лежит подложка `stand-in` — той же
 * глубины, что притемнённый снимок на главной, поэтому текст, кнопки
 * и переключатель языка (`data-tone="dark"`) уже стоят в своём
 * окончательном цвете. Фото добавляется одним пропом `image` и получает
 * то же затемнение, что на главной.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  actions = [],
  image,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  actions?: HeroAction[];
  image?: { src: string; alt: string; position?: string };
}) {
  return (
    <section
      data-tone="dark"
      className="relative flex min-h-svh flex-col overflow-hidden bg-stand-in"
    >
      {image ? (
        <div className="absolute inset-0">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: image.position ?? "center",
              filter: "brightness(0.5)",
            }}
          />
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
