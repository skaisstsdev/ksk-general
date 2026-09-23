"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/cn";

/**
 * Линейка, которая выкатывается от начала строки.
 *
 * Все горизонтальные линейки сайта — этот компонент и только он:
 * приём один, значит и скорость одна. Границу блока рисует движение,
 * а не смена подложки; в списках линейки выкатываются строго по
 * очереди сверху вниз — глаз читает список в том же порядке,
 * в каком он написан.
 *
 * Анимируется `scaleX`, а не `width`: масштаб считает композитор,
 * не задевая раскладку соседей. Точка отсчёта — начало строки,
 * поэтому в арабской версии линия едет справа налево сама.
 *
 * Движение нарочито медленное и без разгона в конце (`easeOut` с
 * длинным хвостом): линия должна читаться как движение, а не как
 * мгновенное появление.
 */

const DURATION = 1.1;
/** Медленное торможение: почти вся дистанция проходится в начале. */
const EASE = [0.16, 1, 0.3, 1] as const;
/** Шаг между соседними линейками списка — следующая ждёт очереди. */
export const STAGGER = 0.4;

export function Rule({
  /** Порядковый номер в списке — из него считается задержка. */
  index = 0,
  /** Шаг очереди. Переопределяется там, где очередь должна идти реже. */
  stagger = STAGGER,
  /** `mount` — сразу при загрузке (первый экран), `view` — при появлении. */
  trigger = "view",
  /** `paper` — на тёмном поле. */
  tone = "ink",
  className,
}: {
  index?: number;
  stagger?: number;
  trigger?: "mount" | "view";
  tone?: "ink" | "paper";
  className?: string;
}) {
  const reduced = useReducedMotion();

  const line = cn(
    "h-px w-full origin-[left_center] rtl:origin-[right_center]",
    tone === "paper" ? "bg-paper/30" : "bg-line",
    className,
  );

  if (reduced) return <div aria-hidden="true" className={line} />;

  const motionProps =
    trigger === "mount"
      ? { animate: { scaleX: 1 } }
      : {
          whileInView: { scaleX: 1 },
          viewport: { once: true, margin: "-8% 0px -8% 0px" },
        };

  return (
    <motion.div
      aria-hidden="true"
      className={line}
      initial={{ scaleX: 0 }}
      transition={{ duration: DURATION, ease: EASE, delay: index * stagger }}
      {...motionProps}
    />
  );
}
