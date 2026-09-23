"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/cn";

/**
 * Отзывы бегущей строкой.
 *
 * Та же механика, что у `Marquee`: одна дорожка, линейное движение
 * на половину своей ширины и бесшовный повтор. Отзывов пока три,
 * поэтому список повторён дважды внутри дорожки — иначе на широком
 * экране между концом и началом петли зияла бы пустота. Когда отзывов
 * станет больше шести, повтор можно убрать.
 *
 * Края растворяются маской, а не подложкой: карточки уходят в поле
 * страницы, а не упираются в границу.
 *
 * При «уменьшить движение» — обычный горизонтальный ряд с прокруткой.
 */

type Review = { text: string; name: string; role: string };

const DURATION = 70;

function Card({ review }: { review: Review }) {
  return (
    <li className="flex w-[24rem] shrink-0 flex-col gap-md">
      <span
        className="text-meta tracking-[0.2em] text-violet"
        role="img"
        aria-label="5 von 5 Sternen"
      >
        ★★★★★
      </span>
      <blockquote className="font-serif text-ui leading-relaxed text-ink-soft">
        {review.text}
      </blockquote>
      <div className="mt-auto flex flex-col">
        <span className="text-ui font-medium text-ink">{review.name}</span>
        <span className="text-meta text-ink-muted">{review.role}</span>
      </div>
    </li>
  );
}

export function ReviewMarquee({
  items,
  className,
}: {
  items: readonly Review[];
  className?: string;
}) {
  const reduced = useReducedMotion();

  // До шести карточек — удваиваем, чтобы дорожка была шире экрана.
  const filled = items.length < 6 ? [...items, ...items] : [...items];

  const track = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 gap-2xl pe-2xl"
    >
      {filled.map((r, i) => (
        <Card key={`${r.name}-${i}`} review={r} />
      ))}
    </ul>
  );

  if (reduced) {
    return (
      <div className={cn("overflow-x-auto px-gutter", className)}>
        <ul className="flex gap-2xl">
          {items.map((r) => (
            <Card key={r.name} review={r} />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: DURATION, ease: "linear", repeat: Infinity }}
      >
        {track(false)}
        {/* Копия ради бесшовной петли — для читалок её нет. */}
        {track(true)}
      </motion.div>
    </div>
  );
}
