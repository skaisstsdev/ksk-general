"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLocale } from "next-intl";

import { localeDir } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { useIsLg } from "@/lib/useIsLg";

/**
 * Фотография в композиции.
 *
 * Пришла на смену серой плашке: та же геометрия, вылеты и движение,
 * но внутри `next/image` — отсюда современные форматы, нужные размеры
 * и отсутствие сдвига раскладки при загрузке.
 *
 * Снимков мало, и это позиция: каждая работает знаком препинания,
 * поэтому умеет разделять блоки — вылетать в край, подниматься снизу —
 * и тем самым заменяет собой смену подложки.
 *
 * Выезд (`slide`) — только на десктопе (`isLg`): на телефоне пока
 * не приживается, кадр там сразу стоит в конечном положении.
 * Параллакс — на обоих экранах, как и было всегда.
 */

const DURATION = 0.6;
const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  src: string;
  alt: string;
  /** Пропорции кадра на узком экране. */
  ratio: string;
  /**
   * Пропорции от `lg`. Широкая полоса, годная на десктопе, на телефоне
   * вырождается в щель: 1600/760 при ширине 375 даёт 178 пикселей высоты.
   * Игнорируется, если задан `fillLg`.
   */
  ratioLg?: string;
  /**
   * От `lg` кадр перестаёт держать фиксированную пропорцию и растягивается
   * на всю высоту родителя — родитель обязан её задавать.
   *
   * Нужно для хиро A/B: сначала фотография там стояла полосой ниже
   * текста и на 1440×900 упиралась в дыру 228px пустоты под текстом,
   * прежде чем начинался кадр. `fillLg` кладёт фотографию в ту же
   * колонку сетки, что и текст (см. `Grid`/`Col`): CSS Grid растягивает
   * оба элемента строки на одну высоту без вычислений вручную.
   */
  fillLg?: boolean;
  /** Куда смещён кадр внутри рамки — важно, когда обрезка сильная. */
  position?: string;
  bleed?: "none" | "start" | "end" | "both";
  parallax?: boolean;
  rise?: boolean;
  /**
   * Кадр въезжает со стороны своего вылета, и движение привязано
   * к прокрутке, а не ко времени: начинается, когда верх кадра доходит
   * до середины экрана, и заканчивается, когда кадр стоит по центру.
   * Пока кадр ниже середины, он ждёт сдвинутым на треть за край.
   * Только на десктопе — см. комментарий над компонентом.
   */
  slide?: boolean;
  priority?: boolean;
  /**
   * Затемнение снизу под текст. Нужно только варианту хиро, где текст
   * лежит на кадре: без него контраст на светлых участках снимка
   * падает ниже порога читаемости.
   */
  overlay?: boolean;
  sizes?: string;
  caption?: React.ReactNode;
  className?: string;
};

export function Photo({
  src,
  alt,
  ratio,
  ratioLg,
  fillLg = false,
  position = "center",
  bleed = "none",
  parallax = false,
  rise = false,
  slide = false,
  priority = false,
  overlay = false,
  sizes = "100vw",
  caption,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isLg = useIsLg();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-4.5%", "4.5%"]);
  const moving = parallax && !reduced;

  // Въезд: отдельный отсчёт, потому что у него другие границы —
  // от середины экрана до положения «кадр по центру».
  const { scrollYProgress: slideProgress } = useScroll({
    target: ref,
    offset: ["start center", "center center"],
  });
  // Со стороны вылета: в RTL «start» — правый край, и кадр идёт справа.
  // Кадр с вылетом в конец строки въезжает с противоположной стороны.
  const fromStart = localeDir(useLocale()) === "ltr" ? -1 : 1;
  const fromBleed = bleed === "end" ? -fromStart : fromStart;
  const x = useTransform(slideProgress, (v) => `${fromBleed * 33 * (1 - v)}%`);
  const sliding = slide && !reduced && isLg;

  const frame = (
    <div
      ref={ref}
      data-tone="dark"
      className={cn(
        "relative overflow-hidden bg-sunken",
        (bleed === "end" || bleed === "both") && "bleed-end",
        (bleed === "start" || bleed === "both") && "bleed-start",
        fillLg
          ? "aspect-[var(--ar)] lg:aspect-auto lg:h-full"
          : "aspect-[var(--ar)] lg:aspect-[var(--ar-lg)]",
        className,
      )}
      style={
        {
          "--ar": ratio,
          "--ar-lg": ratioLg ?? ratio,
        } as React.CSSProperties
      }
    >
      <motion.div
        style={
          moving
            ? { y, position: "absolute", inset: "-5% 0", height: "110%" }
            : { position: "absolute", inset: 0 }
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </motion.div>

      {overlay ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/5"
        />
      ) : null}
    </div>
  );

  // Обёртка существует, пока задан сам проп `slide` (он не меняется
  // после монтирования), а не пока `sliding` (в котором есть isLg —
  // на первом рендере всегда false, обновляется чуть позже). Если бы
  // обёртка появлялась только после того, как isLg станет true, React
  // видел бы это как смену типа элемента на месте `frame` и пересоздал
  // бы его DOM-узел заново — а `useScroll` продолжал бы слушать старый,
  // уже удалённый узел, и `x` застывал бы навсегда. Так обёртка не
  // пересоздаётся никогда; меняется только сам `x` — `0%` (на месте),
  // пока `sliding` не станет true.
  const body = slide ? (
    <motion.div style={{ x: sliding ? x : "0%" }} className={fillLg ? "lg:h-full" : undefined}>
      {frame}
    </motion.div>
  ) : rise && !reduced ? (
      <motion.div
        initial={{ y: 44 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
        transition={{ duration: DURATION, ease: EASE }}
        // Высота должна дойти до `frame` по цепочке: без неё `lg:h-full`
        // у frame ссылается на автоматическую (нулевую) высоту обёртки.
        className={fillLg ? "lg:h-full" : undefined}
      >
        {frame}
      </motion.div>
    ) : fillLg ? (
      <div className="lg:h-full">{frame}</div>
    ) : (
      frame
    );

  if (!caption) return body;

  return (
    <figure className="flex flex-col gap-xs">
      {body}
      <figcaption className="text-meta text-ink-muted">{caption}</figcaption>
    </figure>
  );
}
