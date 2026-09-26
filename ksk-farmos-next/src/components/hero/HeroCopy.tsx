import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rule } from "@/components/ui/Rule";
import { karriereNav, primaryCta } from "@/content/navigation";
import { cn } from "@/lib/cn";

/**
 * Текстовая часть хиро. Одна на все три варианта — так сравнение
 * показывает разницу композиции, а не разницу набора.
 *
 * Заголовок остаётся дословным по решению владельца. Он слоган: не
 * сообщает ни что за услуга, ни для кого, ни где. Поэтому подзаголовок
 * стоит вплотную и набран крупно — объяснять приходится ему.
 *
 * Под лидом две кнопки — по одной на аудиторию: заполненная для
 * семьи, прозрачная для соискателя. Телефон из хиро убран по решению
 * владельца: он остаётся в шапке и в закрывающем развороте.
 *
 * Заголовок ширины колонки не сужает сам — она приходит снаружи из
 * `Col span="wide"` (см. `Hero.tsx`). Лид сужает своей `max-w`: это
 * отдельная типографическая роль (короткий вводный абзац, а не
 * растянутая на всю колонку строка). На телефоне лида вообще нет —
 * по решению владельца, от слогана сразу к кнопкам, без текста между
 * ними; он показывается только от `lg`.
 *

 * У заголовка намеренно снят общий для всех заголовков сайта
 * `text-wrap: balance` (см. `globals.css`, слой `base`) — измерено, что
 * именно на этом тексте он работает хуже обычного переноса: слово
 * «Professionelle» не разбивается, и балансировка, пытаясь уравнять
 * строки вокруг этого слова, на 393px даёт разрыв 273/135/260 (последнее
 * слово почти в одиночестве), тогда как обычный перенос на той же
 * ширине — 273/201/195, заметно ровнее. `text-wrap: wrap` возвращает
 * обычный перенос только этому заголовку, не трогая остальной сайт.
 */
export async function HeroCopy({
  tone = "ink",
  className,
}: {
  /** `paper` — когда текст лежит на фотографии. */
  tone?: "ink" | "paper";
  className?: string;
}) {
  const t = await getTranslations("home");
  const onPhoto = tone === "paper";

  return (
    <div className={cn("flex flex-col", className)}>
      <Eyebrow className={onPhoto ? "text-paper/90" : "text-ink-muted"}>
        {t("hero.eyebrow")}
      </Eyebrow>

      <h1
        className={cn(
          "mt-sm text-wrap text-display",
          onPhoto ? "text-paper" : "text-ink",
        )}
      >
        {t("hero.title")}
      </h1>

      {/* На телефоне под заголовком сразу кнопки — лид только от `lg`:
          владелец решил, что на узком экране это лишний текст между
          слоганом и дверями. */}
      <p
        className={cn(
          "mt-md hidden text-lead lg:block",
          onPhoto ? "text-paper/90" : "text-ink-soft",
        )}
      >
        {t("hero.lead")}
      </p>

      {/* Две двери — по одной на аудиторию. Линейка над ними отделяет
          действие от объяснения; на фотографии она из `paper`. */}
      <Rule
        trigger="mount"
        tone={onPhoto ? "paper" : "ink"}
        className="mt-lg"
      />

      <div className="mt-lg flex flex-wrap items-center gap-x-md gap-y-sm">
        <Button href={primaryCta.href} size="lg">
          {t("doors.family.cta")}
        </Button>

        {/* Ширина зафиксирована по первой кнопке (`min-w`, не `w-full`
            контейнера): вторая кнопка короче по тексту и без этого
            заметно уже. Два числа, не одно, — текст кнопок в хиро
            мельче на телефоне (см. `globals.css`, `[data-hero]`), так
            что и первая кнопка на телефоне уже, чем от `lg`. */}
        <Button
          href={karriereNav.href}
          variant="secondary"
          size="lg"
          className={cn(
            "min-w-[189px] justify-center lg:min-w-[198px]",
            onPhoto &&
              "border-paper/60 text-paper hover:border-paper hover:bg-paper/10",
          )}
        >
          {t("doors.professional.audience")}
        </Button>
      </div>
    </div>
  );
}
