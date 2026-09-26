"use client";

import { getImageProps } from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/cn";
import { useIsLg } from "@/lib/useIsLg";

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
 * **Два механизма, не один.** На десктопе кадр буквально меняет
 * `width`/`height` (`--p`, записанный Motion, читает CSS `calc()`) —
 * так было исходно, мощности десктопа для этого достаточно, и это
 * ровно тот рисунок движения, который так и задуман. На телефоне то же
 * самое — раскладка на каждый тик скролла — не поспевает за пальцем:
 * кадр дёргался, а текст внутри переносил строки на ходу. Там кадр
 * стоит на месте, а «маленькое окно» имитирует `clip-path`, который
 * (вместе с `scale`, см. `computeFrames`) браузер умеет анимировать
 * в обход JS, через `ViewTimeline`.
 *
 * Два кадра: горизонтальный от `lg` и вертикальный до — тот же
 * механизм art direction, что рекомендует next/image.
 */

// Доли поля сцены, которые окно занимает в начале движения (p = 0).
const NARROW = { w0: 0.82, h0: 0.56 };
const WIDE = { w0: 0.44, h0: 0.54 };

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

function cover(w: number, h: number, iw: number, ih: number) {
  return Math.max(w / iw, h / ih);
}

/**
 * `clip-path` окна и `scale` снимка как функции доли прокрутки `p` —
 * только для мобильного механизма (см. верхний комментарий).
 *
 * Проценты выреза линейны по `p` (окно растёт с постоянной скоростью),
 * поэтому им хватает двух ключевых кадров. Поправочный масштаб —
 * отношение старого `object-cover` (для окна размера `W(p)×H(p)`)
 * к новому (для окна на весь контейнер): `cover(p)` — максимум двух
 * линейных по `p` функций, а значит сам кусочно-линеен с одним изломом
 * `pb` — местом, где одна из двух линий обгоняет другую. Три ключевых
 * кадра `[0, pb, 1]` в этой точке дают точное совпадение со старой
 * формулой на любом `p`, а не только в начале и в конце.
 */
function computeFrames(
  w0: number,
  h0: number,
  cw: number,
  ch: number,
  iw: number,
  ih: number,
) {
  const insetX0 = ((1 - w0) / 2) * 100;
  const insetY0 = ((1 - h0) / 2) * 100;
  const clipPath = [`inset(${insetY0}% ${insetX0}%)`, "inset(0% 0%)"];

  if (cw <= 0 || ch <= 0) {
    return { clipPath, times: [0, 1], scale: [1, 1] };
  }

  const aw = (w0 * cw) / iw;
  const bw = ((1 - w0) * cw) / iw;
  const ah = (h0 * ch) / ih;
  const bh = ((1 - h0) * ch) / ih;
  const full = cover(cw, ch, iw, ih);
  const scaleAt = (p: number) => Math.max(aw + bw * p, ah + bh * p) / full;

  const pb = bw !== bh ? (ah - aw) / (bw - bh) : -1;
  const times = pb > 0 && pb < 1 ? [0, pb, 1] : [0, 1];

  return { clipPath, times, scale: times.map(scaleAt) };
}

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
  const sceneRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isLg = useIsLg();

  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      setSize({ w, h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress: p } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const { w0, h0 } = isLg ? WIDE : NARROW;
  const iw = isLg ? width : widthNarrow;
  const ih = isLg ? height : heightNarrow;

  const { clipPath, times, scale } = useMemo(
    () => computeFrames(w0, h0, size.w, size.h, iw, ih),
    [w0, h0, size.w, size.h, iw, ih],
  );

  const clipPathMV = useTransform(p, [0, 1], clipPath);
  const scaleMV = useTransform(p, times, scale.map((s) => `scale(${s})`));
  // Кадр раньше рос из центра, поэтому его нижний край смещался вниз по
  // мере роста — а текст был приклеен к этому краю (`bottom: 0` внутри
  // растущего бокса). Окно теперь стоит на месте, так что тот же путь
  // нижнего края воспроизводит этот слой отдельным `translateY`.
  const liftMV = useTransform(
    p,
    [0, 1],
    [`translateY(-${((1 - h0) / 2) * 100}%)`, "translateY(0%)"],
  );
  const tKeyframes = [0, 0.45, 0.8, 1];
  const opacityMV = useTransform(p, tKeyframes, [0, 0, 1, 1]);
  const revealMV = useTransform(p, tKeyframes, [
    "translateY(1.5rem)",
    "translateY(1.5rem)",
    "translateY(0rem)",
    "translateY(0rem)",
  ]);

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

  // Старый механизм: --t читает CSS напрямую из --p, кадр (ниже)
  // растёт вокруг этого же текста через width/height.
  const legacyCopy = children ? (
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
        {legacyCopy}
      </div>
    );
  }

  if (isLg) {
    return (
      /* Сцена в два экрана: первый — пока кадр растёт, второй — пока
         стоит раскрытым. Высота сцены и есть длина движения. */
      <div ref={sceneRef} className={cn("relative h-[200svh]", className)}>
        <motion.div
          style={{ "--p": p } as React.CSSProperties}
          className="sticky top-(--header-h) flex h-[calc(100svh-var(--header-h))] items-center justify-center [--w0:44%] [--h0:54%]"
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
            {legacyCopy}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={sceneRef} className={cn("relative h-[200svh]", className)}>
      <div
        ref={stickyRef}
        className="sticky top-(--header-h) h-[calc(100svh-var(--header-h))]"
      >
        <motion.div
          data-tone="dark"
          style={{ clipPath: clipPathMV }}
          className="absolute inset-0 overflow-hidden bg-sunken"
        >
          <motion.div style={{ transform: scaleMV }} className="absolute inset-0">
            {picture}
          </motion.div>

          {children ? (
            <motion.div style={{ transform: liftMV }} className="absolute inset-0">
              <motion.div
                aria-hidden="true"
                style={{ opacity: opacityMV }}
                className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-ink/0"
              />
              <motion.div
                style={{ opacity: opacityMV, transform: revealMV }}
                className="absolute inset-x-0 bottom-0 px-gutter pb-3xl lg:pb-4xl"
              >
                <div className="mx-auto max-w-page">{children}</div>
              </motion.div>
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
