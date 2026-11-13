"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { ArrowRight } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export type CarouselSlide = {
  src: string;
  alt: string;
  position?: string;
};

type Labels = {
  region: string;
  prev: string;
  next: string;
  /** Подпись точки; `{n}` заменяется номером кадра. */
  goTo: string;
};

const FADE = 0.8;
const EASE = [0.22, 1, 0.36, 1] as const;
/** Сдвиг пальцем или мышью, после которого кадр листается. */
const SWIPE = 60;

/**
 * Листающаяся лента кадров. Размер ей задаёт родитель (`className`).
 *
 * Кадры сменяются сами раз в `interval` мс и держатся друг над другом,
 * переходя через прозрачность. Листать можно и вручную: стрелки, точки,
 * стрелки клавиатуры и свайп. Автосмена стоит на паузе, пока на ленту
 * наведён курсор, лежит палец или внутри фокус, пока она вне экрана
 * и при «уменьшить движение» (WCAG 2.2.2). Ручной выбор сбрасывает
 * отсчёт: следующий кадр не сменится сразу после клика.
 *
 * Закрепляет её родитель (`position: sticky`) — см. Wohnprojekte
 * на Leistungen: лента стоит в левой колонке, пока справа проезжает
 * текст.
 */
export function PhotoCarousel({
  slides,
  labels,
  interval = 6000,
  className,
}: {
  slides: readonly CarouselSlide[];
  labels: Labels;
  interval?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { amount: 0.3 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  const go = (i: number) => setIndex(((i % n) + n) % n);

  useEffect(() => {
    if (reduced || paused || !inView || n < 2) return;
    // Зависимость от `index`: ручной выбор пересоздаёт таймер.
    const id = setInterval(() => setIndex((i) => (i + 1) % n), interval);
    return () => clearInterval(id);
  }, [index, paused, inView, reduced, n, interval]);

  return (
    <div
      ref={ref}
      data-tone="dark"
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.region}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className={cn("relative overflow-hidden bg-sunken", className)}
    >
      <motion.div
        drag={n > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragStart={() => setPaused(true)}
        onDragEnd={(_, info) => {
          setPaused(false);
          if (info.offset.x < -SWIPE) go(index + 1);
          else if (info.offset.x > SWIPE) go(index - 1);
        }}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      >
        {slides.map((slide, i) => (
          <motion.div
            key={slide.src}
            aria-hidden={i !== index}
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : FADE, ease: EASE }}
            className="absolute inset-0"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              draggable={false}
              className="object-cover"
              style={{ objectPosition: slide.position ?? "center" }}
            />
          </motion.div>
        ))}
      </motion.div>

      {n > 1 ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/55 to-ink/0"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-sm px-2xs pb-2xs text-paper">
            <ul className="flex items-center">
              {slides.map((slide, i) => (
                <li key={slide.src}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={labels.goTo.replace("{n}", String(i + 1))}
                    aria-current={i === index ? "true" : undefined}
                    className="group flex size-11 items-center justify-center"
                  >
                    <span
                      className={cn(
                        "h-1 rounded-full bg-paper transition-all duration-300",
                        i === index
                          ? "w-6"
                          : "w-3 opacity-60 group-hover:opacity-100",
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label={labels.prev}
                className="flex size-11 items-center justify-center rounded-xs transition-colors hover:bg-paper/15"
              >
                <ArrowRight className="size-5 -scale-x-100 rtl:scale-x-100" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label={labels.next}
                className="flex size-11 items-center justify-center rounded-xs transition-colors hover:bg-paper/15"
              >
                <ArrowRight className="size-5 rtl:-scale-x-100" />
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
