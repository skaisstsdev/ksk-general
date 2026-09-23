"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/cn";

export type FilterOption<T extends string> = { id: T; label: string };

/**
 * Кнопки-таблетки с общей подложкой, которая скользит к активной —
 * `layoutId` делает переход одним примитивом Motion, без вычисления
 * координат вручную.
 */
export function CategoryFilter<T extends string>({
  options,
  active,
  onChange,
}: {
  options: readonly FilterOption<T>[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2xs" role="group">
      {options.map((option) => {
        const isActive = option.id === active;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative rounded-xs px-sm py-2xs text-meta transition-colors",
              isActive ? "text-white-pure" : "text-ink-soft hover:text-ink",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-xs bg-violet"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : null}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
