"use client";

import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rule } from "@/components/ui/Rule";
import { steps } from "@/content/home";

/**
 * Нумерация здесь несёт смысл: это реальная последовательность.
 * Именно поэтому номера уместны — в остальных списках сайта их нет.
 *
 * Шаги и загораются последовательно: под каждым выкатывается линейка,
 * и вместе с ней из приглушённого в полный цвет выходит номер. Приём
 * тот же, что в списках выше, но здесь он ещё и означает порядок.
 *
 * Очередь задаёт не один общий таймер, а собственное появление каждого
 * шага (`whileInView` на самом шаге) плюс задержка по номеру.
 * Поэтому на десктопе, где три шага видны разом, они зажигаются один
 * за другим, а на телефоне, где они идут столбиком, очередь задаёт
 * прокрутка — каждый ждёт, пока до него дойдут.
 */

const DURATION = 1.2;
const EASE = [0.16, 1, 0.3, 1] as const;
/** Приглушённое состояние номера до того, как до него дошла очередь. */
const DIM = 0.28;
/** Пауза между шагами: номера зажигаются один за другим, не пачкой. */
const STEP_STAGGER = 0.7;

export function Steps() {
  const reduced = useReducedMotion();

  return (
    <section id="ablauf" className="pt-break">
      <Container>
        <Eyebrow className="text-ink-muted">{steps.eyebrow}</Eyebrow>
        <h2 className="mt-2xs text-h2 text-ink">{steps.title}</h2>

        <ol className="mt-xl grid gap-x-lg gap-y-xl sm:grid-cols-3">
          {steps.items.map((item, i) => (
            <li key={item.title} className="flex flex-col gap-2xs">
              <Rule index={i} stagger={STEP_STAGGER} />
              <motion.span
                className="mt-md font-serif text-h2 leading-none tabular-nums text-violet"
                initial={reduced ? undefined : { opacity: DIM }}
                whileInView={reduced ? undefined : { opacity: 1 }}
                viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
                transition={{
                  duration: DURATION,
                  ease: EASE,
                  delay: i * STEP_STAGGER,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </motion.span>
              <h3 className="mt-2xs text-subhead text-ink">{item.title}</h3>
              <p className="text-ui text-ink-soft">{item.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
