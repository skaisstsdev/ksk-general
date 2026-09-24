"use client";

import { cn } from "@/lib/cn";

export type LocationCardItem = {
  role: string;
  city: string;
  street: string;
  phone: string;
};

/**
 * Карточка адреса — эйбров, город, улица, телефон под линейкой слева.
 * Вынесено из `HesseMap`: там та же карточка ещё и подсвечивается при
 * наведении синхронно с точкой на карте (`active`/`onActivate`,
 * управляется снаружи). Без карты рядом (Kontakt) синхронизировать
 * не с чем — `onActivate` не передан, и линейка светлеет от обычного
 * CSS `hover`, без состояния.
 */
export function LocationCards({
  items,
  active,
  onActivate,
  className,
}: {
  items: readonly LocationCardItem[];
  /** Имя активного города — задаётся только вместе с `onActivate`. */
  active?: string | null;
  /** Есть — карточки управляются снаружи (см. `HesseMap`). Нет — сами по себе, через `hover`. */
  onActivate?: (name: string | null) => void;
  className?: string;
}) {
  const controlled = onActivate !== undefined;

  return (
    <dl className={cn("grid gap-lg sm:grid-cols-2", className)}>
      {items.map((item) => {
        const isActive = controlled && active === item.city;
        return (
          <div
            key={item.city}
            onMouseEnter={controlled ? () => onActivate(item.city) : undefined}
            onMouseLeave={controlled ? () => onActivate(null) : undefined}
            className={cn(
              "border-s-2 ps-md transition-colors duration-200",
              controlled
                ? isActive
                  ? "border-violet"
                  : "border-line"
                : "border-line hover:border-violet",
            )}
          >
            <dt className="text-eyebrow uppercase text-ink-muted">{item.role}</dt>
            <dd className="mt-3xs flex flex-col gap-3xs">
              <span className="text-h4 text-ink">{item.city}</span>
              <span className="text-ui text-ink-soft">{item.street}</span>
              <a
                href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}
                className="text-ui tabular-nums text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-violet"
              >
                {item.phone}
              </a>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
