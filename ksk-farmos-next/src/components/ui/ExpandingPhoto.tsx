"use client";

import { getImageProps } from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";

import { cn } from "@/lib/cn";

/**
 * Фотография, которая раскрывается прокруткой.
 *
 * Входит в экран кадром посреди страницы — примерно в ширину правой
 * колонки — и, пока её проезжают, замирает на месте и растёт, пока не
 * займёт всё поле под шапкой от края до края. Потом уходит вверх
 * вместе со страницей.
 *
 * Это самый сильный знак препинания на странице, поэтому он один:
 * второй такой рядом превратит приём в эффект.
 *
 * Движение построено на `position: sticky` и одном числе — доле
 * прокрутки `--p` от 0 до 1, которое Motion пишет в CSS-переменную.
 * Ширину и высоту из него считает CSS: стартовые значения заданы
 * там же (`--w0`, `--h0`), поэтому переломы остаются в разметке,
 * а не в скрипте. Без скриптов `--p` равен единице — кадр стоит
 * во всю ширину, как обычная фотография.
 *
 * Два кадра: горизонтальный от `lg` и вертикальный до — тот же
 * механизм art direction, что рекомендует next/image.
 */

type Props = {
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
  /**
   * Текст, который проявляется на кадре, пока тот растёт. Появляется
   * на второй трети движения: сначала кадр, потом слово.
   */
  children?: React.ReactNode;
  className?: string;
};

export function ExpandingPhoto({
  src,
  width,
  height,
  srcNarrow,
  widthNarrow,
  heightNarrow,
  alt,
  position = "center",
  children,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Ноль — верх сцены дошёл до верха экрана (кадр только что закрепился),
  // единица — низ сцены дошёл до низа экрана (кадр отпускает).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const common = { alt, sizes: "100vw" };
  const {
    props: { srcSet: wide },
  } = getImageProps({ ...common, src, width, height });
  const {
    props: { srcSet: narrow, ...img },
  } = getImageProps({
    ...common,
    src: srcNarrow,
    width: widthNarrow,
    height: heightNarrow,
  });

  const picture = (
    <picture className="contents">
      <source media="(min-width: 64rem)" srcSet={wide} />
      <source srcSet={narrow} />
      <img
        {...img}
        alt={alt}
        className="size-full object-cover"
        style={{ objectPosition: position }}
      />
    </picture>
  );

  /* Затемнение и текст. Оба привязаны к `--t` — доле появления,
     которую CSS считает из `--p`: до 0.45 текста нет, к 0.8 он на
     месте. Затемнение растёт вместе с ним, поэтому маленький кадр
     в начале движения остаётся чистым снимком. */
  const copy = children ? (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-ink/0"
        style={{ opacity: "var(--t)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 px-gutter pb-3xl lg:pb-4xl"
        style={{
          opacity: "var(--t)",
          transform: "translateY(calc((1 - var(--t)) * 1.5rem))",
        }}
      >
        <div className="mx-auto max-w-page">{children}</div>
      </div>
    </>
  ) : null;

  // Без движения — просто широкий кадр с текстом, без закрепления
  // и без сцены в два экрана: закреплять нечего.
  if (reduced) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-sunken aspect-[4/5] lg:aspect-[5/3] [--t:1]",
          className,
        )}
      >
        {picture}
        {copy}
      </div>
    );
  }

  return (
    /* Сцена в два экрана: первый — пока кадр растёт, второй — пока
       стоит раскрытым. Высота сцены и есть длина движения. */
    <div ref={ref} className={cn("relative h-[200svh]", className)}>
      <motion.div
        style={{ "--p": scrollYProgress } as React.CSSProperties}
        className="sticky top-(--header-h) flex h-[calc(100svh-var(--header-h))] items-center justify-center [--w0:82%] [--h0:56%] lg:[--w0:44%] lg:[--h0:54%]"
      >
        <div
          data-tone="dark"
          className="relative overflow-hidden bg-sunken"
          style={
            {
              width: "calc(var(--w0) * (1 - var(--p)) + 100% * var(--p))",
              height: "calc(var(--h0) * (1 - var(--p)) + 100% * var(--p))",
              "--t": "clamp(0, (var(--p) - 0.45) / 0.35, 1)",
            } as React.CSSProperties
          }
        >
          {picture}
          {copy}
        </div>
      </motion.div>
    </div>
  );
}
