"use client";

import { motion, useReducedMotion } from "motion/react";

import { Rule } from "@/components/ui/Rule";

export type StepItem = { title: string; text: string };

const DURATION = 1.2;
const EASE = [0.16, 1, 0.3, 1] as const;
const DIM = 0.28;
const STEP_STAGGER = 0.7;

/**
 * Последовательность шагов — то же устройство, что у «In 3 Schritten
 * zur Versorgung» главной (`home/Steps.tsx`), но без собственного
 * заголовка: страница кладёт его сама через `SectionHeading`, а этот
 * компонент отвечает только за пронумерованный перечень. Номер здесь
 * оправдан — это настоящая последовательность, а не список пунктов.
 */
export function StepsGrid({ items }: { items: readonly StepItem[] }) {
  const reduced = useReducedMotion();

  return (
    <ol className="mt-xl grid gap-x-lg gap-y-xl sm:grid-cols-3">
      {items.map((item, i) => (
        <li key={item.title} className="flex flex-col gap-2xs">
          <Rule index={i} stagger={STEP_STAGGER} />
          <motion.span
            className="mt-md font-serif text-h2 leading-none tabular-nums text-violet"
            initial={reduced ? undefined : { opacity: DIM }}
            whileInView={reduced ? undefined : { opacity: 1 }}
            viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
            transition={{ duration: DURATION, ease: EASE, delay: i * STEP_STAGGER }}
          >
            {String(i + 1).padStart(2, "0")}
          </motion.span>
          <h3 className="mt-2xs text-subhead text-ink">{item.title}</h3>
          <p className="text-ui text-ink-soft">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}
