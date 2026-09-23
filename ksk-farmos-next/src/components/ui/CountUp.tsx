"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

import { STAGGER } from "./Rule";

/**
 * Число, которое досчитывает до себя, когда до него доходят.
 *
 * Значение приходит готовой строкой из контента — «13», «~30», «4–6»,
 * «24h», — и компонент не разбирает её на смыслы, а только находит
 * в ней цифры. Всё, что между цифрами, остаётся как есть: тильда,
 * тире диапазона, буква часов. Поэтому подпись можно поменять в
 * `content/` и здесь ничего не править, а в других языках знаки
 * вокруг числа тоже сохранятся.
 *
 * Счёт идёт от единицы, а не от нуля: ноль на пути к «4–6» читался
 * бы как «ничего нет», а единица — как «уже считаем».
 *
 * Цифры набраны табличными (`tabular-nums` на родителе), поэтому
 * строка не дёргается по ширине, пока число растёт.
 *
 * Для читалок в разметке остаётся конечное значение: им незачем
 * слушать промежуточные числа.
 */

const DURATION = 1.4;
const EASE = [0.16, 1, 0.3, 1] as const;
const FROM = 1;

export function CountUp({
  value,
  /** Порядковый номер — из него считается очередь, как у линеек. */
  index = 0,
}: {
  value: string;
  index?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-8% 0px -8% 0px" });

  // Строка разбирается на куски: числа и всё, что между ними.
  // Разбор мемоизируется — иначе новый массив на каждый кадр счёта
  // перезапускал бы эффект сам себя.
  const { parts, targets } = useMemo(() => {
    const p = value.split(/(\d+)/);
    return {
      parts: p,
      targets: p.map((x) => (/^\d+$/.test(x) ? Number(x) : null)),
    };
  }, [value]);

  const [current, setCurrent] = useState<number[]>(() =>
    value
      .split(/(\d+)/)
      .map((p) => (/^\d+$/.test(p) ? Math.min(FROM, Number(p)) : 0)),
  );

  useEffect(() => {
    if (!inView || reduced) return;
    const runs = targets.map((target, i) => {
      if (target === null || target <= FROM) return null;
      return animate(FROM, target, {
        duration: DURATION,
        ease: EASE,
        delay: index * STAGGER,
        onUpdate: (v) =>
          setCurrent((prev) => {
            const next = [...prev];
            next[i] = Math.round(v);
            return next;
          }),
      });
    });
    return () => runs.forEach((r) => r?.stop());
  }, [inView, reduced, targets, index]);

  if (reduced) return <span>{value}</span>;

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {parts.map((p, i) =>
          targets[i] === null ? p : String(current[i]),
        )}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
