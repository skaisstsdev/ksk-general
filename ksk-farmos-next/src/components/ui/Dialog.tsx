"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Close } from "@/components/ui/icons";
import { Rule } from "@/components/ui/Rule";

/**
 * Модальное окно — единственное место на сайте, где контент
 * показывается поверх страницы, а не в её потоке. Тот же приём
 * блокировки скролла и закрытия по Escape, что у `MobileMenu`.
 *
 * `shadow-lifted` — токен, который до этого нигде не использовался:
 * «единственная тень на весь сайт для того элемента, что действительно
 * поднят над плоскостью» (см. комментарий в `globals.css`). Диалог —
 * ровно такой элемент.
 *
 * Заголовок крупнее обычного `h3`, тем же гротеском, что и весь сайт
 * (без `font-serif` — по решению владельца засечки не вписывались
 * в остальную типографику), и под ним та же выкатывающаяся линейка,
 * что и везде на сайте: карточка читается как
 * отдельная «страница внутри страницы», а не просто увеличенный тултип.
 * Кнопка закрытия — квадрат с рамкой у верхнего края карточки, от `sm`
 * чуть вынесенный за её угол (`-top-3 -end-3`): заголовок и линейка не
 * скроллятся вместе с телом (шапка — `shrink-0`, тело — `overflow-y-auto`
 * само по себе), поэтому вынос кнопки за пределы шапки не обрезается
 * скроллом. Заглавных букв в заголовке нет по тому же правилу, что
 * и везде на сайте: uppercase — только у `Eyebrow`.
 */
export function Dialog({
  open,
  onClose,
  title,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 bg-ink/40"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative flex h-[92vh] w-full flex-col rounded-t-xs bg-paper shadow-lifted sm:h-auto sm:max-h-[88vh] sm:max-w-[52rem] sm:rounded-xs"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute end-lg top-lg flex size-9 shrink-0 items-center justify-center rounded-xs border border-line-strong bg-paper text-ink-muted transition-colors hover:border-ink hover:text-ink sm:-end-3 sm:-top-3 sm:size-10"
            >
              <Close className="size-4 sm:size-5" />
            </button>

            <div className="shrink-0 p-lg pb-0 sm:p-2xl sm:pb-0">
              <h3 className="max-w-[26ch] pe-2xl text-h2 text-ink sm:pe-0">
                {title}
              </h3>
              <Rule trigger="mount" className="mt-md" />
            </div>

            <div className="flex flex-col gap-sm overflow-y-auto p-lg pt-md text-body text-ink-soft sm:p-2xl sm:pt-md">
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
