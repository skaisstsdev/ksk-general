"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/Dialog";

/**
 * Содержимое одной панели аккордеона на Leistungen: плоский список
 * пунктов группы (`Grundversorgung` и т.п.) и одна кнопка «Подробнее»
 * на всю группу — не на каждый пункт. Раньше кнопка стояла под каждым
 * пунктом (8 штук на три группы), но пункты — это перечисление того,
 * что входит в группу, а не отдельные самостоятельные темы; подробный
 * текст один на группу и достаточно длинный, чтобы обосновать
 * отдельное окно (`detail` — несколько абзацев, склеенных `\n\n`).
 */
export function DetailList({
  title,
  items,
  detail,
  moreLabel,
  closeLabel,
}: {
  title: string;
  items: readonly string[];
  detail: string;
  moreLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const paragraphs = detail.split("\n\n");

  return (
    <>
      <ul className="flex flex-col gap-3xs">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-sm text-meta text-violet underline decoration-violet/30 underline-offset-4 transition-colors hover:decoration-violet"
      >
        {moreLabel}
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        closeLabel={closeLabel}
      >
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </Dialog>
    </>
  );
}
