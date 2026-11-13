"use client";

import { useState } from "react";

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/icons";
import { Dialog } from "@/components/ui/Dialog";
import { Rule } from "@/components/ui/Rule";
import { cn } from "@/lib/cn";

export type NumberedItem = {
  title: string;
  text?: React.ReactNode;
  href?: string;
  /** Текст окна «Подробнее» — если задан вместе с `moreLabel`/`closeLabel`
   *  на компоненте, под пунктом появляется кнопка, открывающая диалог. */
  detail?: string;
};

/**
 * Перечень с линейками и номером в своей узкой колонке — приём списков
 * услуг и диагнозов главной, вынесенный для остальных страниц.
 * Линейки выкатываются по очереди сверху вниз, последняя замыкает список.
 * Строка со ссылкой получает стрелку и фиолетовый заголовок на hover.
 *
 * `moreLabel`/`closeLabel` — переводы для диалога; без них `detail`
 * пунктов игнорируется, и список ведёт себя как раньше (`Über uns`,
 * `Karriere` эти пропсы не передают).
 */
export function NumberedList({
  items,
  moreLabel,
  closeLabel,
  tone = "ink",
}: {
  items: readonly NumberedItem[];
  moreLabel?: string;
  closeLabel?: string;
  /** `paper` — на фиолетовом поле. Окно с подробностями остаётся светлым. */
  tone?: "ink" | "paper";
}) {
  const onPaper = tone === "paper";
  const [active, setActive] = useState<NumberedItem | null>(null);
  const canOpenDialog = Boolean(moreLabel && closeLabel);

  return (
    <>
      <ul>
        {items.map((item, i) => {
          const body = (
            <>
              <span
                className={cn(
                  "w-[2ch] shrink-0 text-meta tabular-nums",
                  onPaper ? "text-white-pure/80" : "text-ink-muted",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2xs">
                <h3
                  className={cn(
                    "text-h3",
                    onPaper ? "text-white-pure" : "text-ink",
                    item.href &&
                      (onPaper
                        ? "transition-colors group-hover:text-white-pure/80"
                        : "transition-colors group-hover:text-violet"),
                  )}
                >
                  {item.title}
                </h3>
                {item.text ? (
                  <div
                    className={cn(
                      "text-ui",
                      onPaper ? "text-white-pure/90" : "text-ink-soft",
                    )}
                  >
                    {item.text}
                  </div>
                ) : null}
                {canOpenDialog && item.detail ? (
                  <button
                    type="button"
                    onClick={() => setActive(item)}
                    className={cn(
                      "self-start text-meta underline underline-offset-4 transition-colors",
                      onPaper
                        ? "text-white-pure decoration-white-pure/40 hover:decoration-white-pure"
                        : "text-violet decoration-violet/30 hover:decoration-violet",
                    )}
                  >
                    {moreLabel}
                  </button>
                ) : null}
              </div>
            </>
          );

          return (
            <li key={item.title}>
              <Rule index={i} tone={onPaper ? "paper" : "ink"} />
              {item.href ? (
                <Link
                  href={item.href}
                  className="group flex items-baseline gap-md py-md"
                >
                  {body}
                  <ArrowRight
                    className={cn(
                      "ms-auto size-5 shrink-0 self-start transition-transform duration-200 ease-out-soft group-hover:translate-x-1 rtl:-scale-x-100",
                      onPaper ? "text-white-pure" : "text-violet",
                    )}
                  />
                </Link>
              ) : (
                <div className="flex items-baseline gap-md py-md">{body}</div>
              )}
            </li>
          );
        })}
        <li aria-hidden="true">
          <Rule index={items.length} tone={onPaper ? "paper" : "ink"} />
        </li>
      </ul>

      {canOpenDialog ? (
        <Dialog
          open={active !== null}
          onClose={() => setActive(null)}
          title={active?.title ?? ""}
          closeLabel={closeLabel as string}
        >
          {active?.detail?.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </Dialog>
      ) : null}
    </>
  );
}
