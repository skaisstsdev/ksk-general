"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLocale } from "next-intl";

import { localeDir } from "@/i18n/routing";
import { useIsLg } from "@/lib/useIsLg";

/**
 * Выезд из-за края экрана вслед за прокруткой — тот же приём, что у
 * фотографии в разворотах (`Photo`, `slide`): пока блок поднимается
 * от низа экрана к середине, он сдвинут на треть своей ширины за край
 * и по мере прокрутки встаёт на место. Движение привязано к прокрутке,
 * а не ко времени.
 *
 * Только от `lg`: на телефоне блок стоит на месте. При «уменьшить
 * движение» тоже. `from` — с какой стороны выезжает; в RTL сторона
 * зеркалится сама.
 */
export function SlideIn({
  from = "start",
  className,
  children,
}: {
  from?: "start" | "end";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isLg = useIsLg();
  const ltr = localeDir(useLocale()) === "ltr";

  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start center", "center center"],
  });
  const side = (from === "start" ? -1 : 1) * (ltr ? 1 : -1);
  const x = useTransform(p, (v) => `${side * 33 * (1 - v)}%`);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ x: isLg && !reduced ? x : "0%" }}>{children}</motion.div>
    </div>
  );
}
