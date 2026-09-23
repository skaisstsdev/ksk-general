"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Plus } from "@/components/ui/icons";
import { Rule } from "@/components/ui/Rule";
import { cn } from "@/lib/cn";

export type AccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

const DURATION = 0.45;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Раскрывающийся перечень.
 *
 * В старом сайте высоту считали трижды по-разному (`scrollHeight`
 * в JS, `grid-template-rows`, Web Animations API) и каждый раз
 * ломались в Safari. Здесь высоту до `auto` доводит Motion —
 * ни замеров, ни таймеров, синхронизированных с CSS.
 *
 * Открыт один пункт; повторный щелчок закрывает его. Строки отбиты
 * теми же выкатывающимися линейками, что и все списки сайта.
 * Заголовок пункта — настоящий заголовок (`h3`) с кнопкой внутри:
 * так перечень читается по заголовкам и с клавиатуры.
 */
export function Accordion({
  items,
  defaultOpen = null,
  className,
}: {
  items: readonly AccordionItem[];
  defaultOpen?: string | null;
  className?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen);
  const reduced = useReducedMotion();
  const base = useId();

  return (
    <ul className={className}>
      {items.map((item, i) => {
        const isOpen = open === item.id;
        const panelId = `${base}-${item.id}`;

        return (
          <li key={item.id}>
            <Rule index={i} />
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="group flex w-full items-baseline justify-between gap-md py-md text-start"
              >
                <span
                  className={cn(
                    "text-h4 transition-colors group-hover:text-violet",
                    isOpen ? "text-violet" : "text-ink",
                  )}
                >
                  {item.title}
                </span>
                <Plus
                  className={cn(
                    "size-5 shrink-0 self-center text-violet transition-transform duration-300 ease-out-soft",
                    isOpen && "rotate-45",
                  )}
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  className="overflow-hidden"
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: DURATION, ease: EASE }}
                >
                  <div className="pb-md text-ui text-ink-soft">
                    {item.content}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
      <li aria-hidden="true">
        <Rule index={items.length} />
      </li>
    </ul>
  );
}
