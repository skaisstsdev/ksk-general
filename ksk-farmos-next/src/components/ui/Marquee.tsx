"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/cn";

/**
 * Бегущая строка.
 *
 * Ещё один способ отбить блоки без подложки — и единственный
 * элемент на странице, который движется сам по себе. Именно
 * поэтому он должен встречаться редко: один-два раза на весь сайт.
 * Иначе получается витрина технологического стартапа.
 *
 * При системной настройке «уменьшить движение» превращается
 * в обычную строку — содержание не теряется.
 */
export function Marquee({
  items,
  /** Секунд на полный проход. Больше — спокойнее. */
  duration = 42,
  className,
}: {
  items: readonly string[];
  duration?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  const line = (
    <span className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-md">{item}</span>
          <span aria-hidden="true" className="text-violet">
            ·
          </span>
        </span>
      ))}
    </span>
  );

  if (reduced) {
    return (
      <div
        className={cn(
          "overflow-hidden text-eyebrow uppercase text-ink-muted",
          className,
        )}
      >
        <div className="flex">{line}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden text-eyebrow uppercase text-ink-muted",
        className,
      )}
    >
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {line}
        {/* Копия ради бесшовной петли — для читалок её нет. */}
        <span aria-hidden="true" className="flex shrink-0 items-center">
          {line}
        </span>
      </motion.div>
    </div>
  );
}
