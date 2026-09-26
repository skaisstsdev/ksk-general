"use client";

import { useState } from "react";

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/icons";
import { Dialog } from "@/components/ui/Dialog";
import { Rule } from "@/components/ui/Rule";

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
}: {
  items: readonly NumberedItem[];
  moreLabel?: string;
  closeLabel?: string;
}) {
  const [active, setActive] = useState<NumberedItem | null>(null);
  const canOpenDialog = Boolean(moreLabel && closeLabel);

  return (
    <>
      <ul>
        {items.map((item, i) => {
          const body = (
            <>
              <span className="w-[2ch] shrink-0 text-meta tabular-nums text-ink-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2xs">
                <h3
                  className={
                    item.href
                      ? "text-h3 text-ink transition-colors group-hover:text-violet"
                      : "text-h3 text-ink"
                  }
                >
                  {item.title}
                </h3>
                {item.text ? (
                  <div className="text-ui text-ink-soft">{item.text}</div>
                ) : null}
                {canOpenDialog && item.detail ? (
                  <button
                    type="button"
                    onClick={() => setActive(item)}
                    className="self-start text-meta text-violet underline decoration-violet/30 underline-offset-4 transition-colors hover:decoration-violet"
                  >
                    {moreLabel}
                  </button>
                ) : null}
              </div>
            </>
          );

          return (
            <li key={item.title}>
              <Rule index={i} />
              {item.href ? (
                <Link
                  href={item.href}
                  className="group flex items-baseline gap-md py-md"
                >
                  {body}
                  <ArrowRight className="ms-auto size-5 shrink-0 self-start text-violet transition-transform duration-200 ease-out-soft group-hover:translate-x-1 rtl:-scale-x-100" />
                </Link>
              ) : (
                <div className="flex items-baseline gap-md py-md">{body}</div>
              )}
            </li>
          );
        })}
        <li aria-hidden="true">
          <Rule index={items.length} />
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
