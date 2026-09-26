"use client";

import { useMemo, useState } from "react";

import { Accordion } from "@/components/page/Accordion";
import { CategoryFilter } from "@/components/page/CategoryFilter";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/content/pages/faq";

type QuestionItem = {
  id: string;
  category: Category;
  q: string;
  a: string;
  action?: { href?: string; label: string };
};

/**
 * Фильтр по категориям плюс раскрывающийся перечень — устройство
 * старого «FAQ»: таблетки сверху сужают список вопросов до выбранной
 * темы, «Alle» возвращает все одиннадцать.
 */
export function FaqList({
  categories: options,
  questions: items,
}: {
  categories: { id: Category; label: string }[];
  questions: QuestionItem[];
}) {
  const [active, setActive] = useState<Category>("alle");

  const filtered = useMemo(
    () => (active === "alle" ? items : items.filter((q) => q.category === active)),
    [active, items],
  );

  return (
    <div>
      <CategoryFilter options={options} active={active} onChange={setActive} />

      <Accordion
        className="mt-lg"
        items={filtered.map((item) => ({
          id: item.id,
          title: item.q,
          content: (
            <div className="flex flex-col items-start gap-sm">
              <p>{item.a}</p>
              {item.action ? (
                <Button href={item.action.href} size="sm">
                  {item.action.label}
                </Button>
              ) : null}
            </div>
          ),
        }))}
      />
    </div>
  );
}
