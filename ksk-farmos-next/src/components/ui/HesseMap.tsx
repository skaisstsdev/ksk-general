"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  HESSE_DISTRICTS,
  HESSE_PATH,
  HESSE_PLACES,
  HESSE_VIEWBOX,
  type MapPlace,
} from "@/content/hesse-map";
import { locations } from "@/content/site";
import { cn } from "@/lib/cn";
import { LocationCards } from "./LocationCards";

/**
 * Карта Гессена.
 *
 * Рисуется своей графикой по официальным границам земли, а не встраивается
 * из Google Maps. Причина не только эстетическая: встроенная карта передаёт
 * IP посетителя третьей стороне, из-за чего в старом сайте её приходилось
 * прятать за баннером согласия. Здесь передавать нечего — карта работает
 * сразу, без клика и без предупреждения.
 *
 * Контур обводится при появлении: одно движение, которое объясняет, что
 * зона обслуживания — вся земля целиком.
 */

const DURATION = 1.6;

function Place({
  place,
  active,
  onActivate,
}: {
  place: MapPlace;
  active: boolean;
  onActivate: (name: string | null) => void;
}) {
  const own = place.kind === "own";
  const dx = place.anchor === "start" ? 13 : -13;

  return (
    <g
      onMouseEnter={() => onActivate(place.name)}
      onMouseLeave={() => onActivate(null)}
      onFocus={() => onActivate(place.name)}
      onBlur={() => onActivate(null)}
      tabIndex={own ? 0 : -1}
      className={cn(
        "outline-none",
        own && "cursor-default focus-visible:[&>text]:fill-[currentColor]",
      )}
    >
      {own ? (
        <>
          {/* Мягкое кольцо: собственный адрес читается до чтения подписи */}
          <circle
            cx={place.x}
            cy={place.y}
            r={active ? 15 : 12}
            className="fill-violet/12 transition-all duration-300"
          />
          <circle cx={place.x} cy={place.y} r="5" className="fill-violet" />
        </>
      ) : (
        <circle
          cx={place.x}
          cy={place.y}
          r="3"
          className="fill-ink-muted"
        />
      )}

      <text
        x={place.x + dx}
        y={place.y + 5}
        textAnchor={place.anchor === "start" ? "start" : "end"}
        className={cn(
          "select-none transition-colors duration-200",
          own
            ? "fill-ink [font-size:21px] [font-weight:700]"
            : "fill-ink-soft [font-size:18px] [font-weight:500]",
        )}
      >
        {place.name}
      </text>
    </g>
  );
}

type Props = {
  /** Подписи к собственным адресам. */
  ownLabels: Record<string, { role: string; street: string; phone: string }>;
  className?: string;
};

export function HesseMap({ ownLabels, className }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();

  /**
   * Название карты идёт через `aria-label`, а не через <title> внутри SVG.
   * React 19 поднимает <title> в <head> как метаданные документа и не
   * отличает его от заголовка SVG — из-за этого гидратация расходилась
   * на каждой странице сайта.
   */
  const label = `Karte von Hessen mit den Standorten in ${locations.headquarters.city} und ${locations.residence.city}`;

  return (
    <div className={cn("flex flex-col gap-xl", className)}>
      {/* Карта чуть шире колонки — на шаг шкалы в каждую сторону:
          ей нужна площадь, а колонке адресов — тот же край, что у всех
          остальных блоков. */}
      <div className="w-full lg:-mx-2xl lg:w-[calc(100%+2*var(--spacing-2xl))]">
        <svg
          viewBox={`-8 -8 ${HESSE_VIEWBOX.width + 16} ${HESSE_VIEWBOX.height + 16}`}
          role="img"
          aria-label={label}
          className="h-auto w-full overflow-visible"
        >
          {/* Земля залита фиолетовым, а не серым: заливка и есть
              сообщение — обслуживается вся площадь, а не две точки. */}
          <path d={HESSE_PATH} className="fill-violet/10" />

          {/* Границы районов — тоньше и тише контура: это фактура,
              а не сообщение */}
          <path
            d={HESSE_DISTRICTS}
            fill="none"
            className="stroke-violet/35"
            strokeWidth="1.25"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Контур обводится один раз при появлении */}
          <motion.path
            d={HESSE_PATH}
            fill="none"
            className="stroke-violet/50"
            strokeWidth="2.5"
            strokeLinejoin="round"
            initial={reduced ? undefined : { pathLength: 0 }}
            whileInView={reduced ? undefined : { pathLength: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: DURATION, ease: "easeInOut" }}
          />

          {HESSE_PLACES.map((p) => (
            <Place
              key={p.name}
              place={p}
              active={active === p.name}
              onActivate={setActive}
            />
          ))}
        </svg>
      </div>

      <LocationCards
        items={HESSE_PLACES.filter((p) => p.kind === "own")
          .map((p) => {
            const info = ownLabels[p.name];
            return info
              ? { role: info.role, city: p.name, street: info.street, phone: info.phone }
              : null;
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)}
        active={active}
        onActivate={setActive}
      />
    </div>
  );
}
