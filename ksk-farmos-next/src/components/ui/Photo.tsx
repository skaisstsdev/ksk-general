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
 * **Выезд и параллакс — два механизма.** На десктопе `x`/`y` считает
 * JS на каждый тик скролла — так было исходно, и мощности десктопа
 * хватает. На телефоне тот же JS на главном потоке отстаёт от пальца
 * (мобильный браузер прокручивает страницу в отдельном потоке), поэтому
 * там `transform` привязан к невидимым «датчикам» (`slideSensorRef`/
 * `parallaxSensorRef`), чьи размеры и отступы внутри кадра подобраны
 * так, что именованный пресет Motion (`Enter`/`All`) даёт те же моменты
 * начала и конца движения, что и старые ручные границы, — но браузер
 * ведёт эту анимацию сам, через `ViewTimeline`, в обход JS.
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
  const slideSensorRef = useRef<HTMLDivElement>(null);
  const parallaxSensorRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isLg = useIsLg();

  const moving = parallax && !reduced;
  const sliding = slide && !reduced;

  // Десктоп (старый механизм): те же границы, что были всегда — от
  // самого кадра, JS считает x/y на каждый тик.
  const { scrollYProgress: legacyParallaxP } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const legacyY = useTransform(legacyParallaxP, [0, 1], ["-4.5%", "4.5%"]);

  const { scrollYProgress: legacySlideP } = useScroll({
    target: ref,
    offset: ["start center", "center center"],
  });
  // Со стороны вылета: в RTL «start» — правый край, и кадр идёт справа.
  // Кадр с вылетом в конец строки въезжает с противоположной стороны.
  const fromStart = localeDir(useLocale()) === "ltr" ? -1 : 1;
  const fromBleed = bleed === "end" ? -fromStart : fromStart;
  const legacyX = useTransform(legacySlideP, (v) => `${fromBleed * 33 * (1 - v)}%`);

  // Мобилка (новый механизм): те же моменты начала и конца, но через
  // датчики и `transform`, чтобы анимацию вёл браузер, а не JS.
  const { scrollYProgress: slideP } = useScroll({
    target: slideSensorRef,
    offset: ["start end", "end end"],
  });
  const nativeX = useTransform(slideP, [0, 1], [
    `translateX(${fromBleed * 33}%)`,
    "translateX(0%)",
  ]);

  const { scrollYProgress: parallaxP } = useScroll({
    target: parallaxSensorRef,
    offset: ["start start", "end end"],
  });
  const nativeY = useTransform(parallaxP, [0, 1], [
    "translateY(-4.5%)",
    "translateY(4.5%)",
  ]);

  const frame = (
    <div
      ref={ref}
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
      {sliding ? (
        <div
          ref={slideSensorRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[50svh] h-1/2"
        />
      ) : null}
      {moving ? (
        <div
          ref={parallaxSensorRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-[100svh] -bottom-[100svh]"
        />
      ) : null}

      <motion.div
        style={
          moving
            ? isLg
              ? { y: legacyY, position: "absolute", inset: "-5% 0", height: "110%" }
              : { transform: nativeY, position: "absolute", inset: "-5% 0", height: "110%" }
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

  const body = sliding ? (
    <motion.div
      style={isLg ? { x: legacyX } : { transform: nativeX }}
      className={fillLg ? "lg:h-full" : undefined}
    >
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
