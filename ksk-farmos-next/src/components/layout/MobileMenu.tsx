"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Link } from "@/i18n/navigation";
import type { NavItem } from "@/content/navigation";
import { Button } from "@/components/ui/Button";
import { Close, Menu } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { Rule } from "@/components/ui/Rule";

/**
 * Раскрытие делает Motion, а не ручной расчёт высоты.
 *
 * В старом сайте эту задачу пробовали решать тремя способами
 * (`max-height` + замер `scrollHeight`, CSS Grid `0fr→1fr`, Web Animations
 * API) — все давали сбои в Safari, а таймаут `setTimeout(…, 450)` в JS
 * должен был вручную совпадать с 400ms перехода в CSS и расходился при
 * любой правке. Здесь длительность существует ровно в одном месте.
 */
export function MobileMenu({
  items,
  cta,
  tone = "ink",
}: {
  items: NavItem[];
  cta: NavItem;
  /** `paper` — когда кнопка открытия плавает поверх тёмной фотографии.
   *  Панель, которая раскрывается по клику, всегда светлая и остаётся
   *  на `ink`: тон относится только к закрытой кнопке-гамбургеру. */
  tone?: "ink" | "paper";
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Пока панель открыта, фон под ней не прокручивается.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        className={cn(
          "-me-2xs inline-flex items-center justify-center p-2xs transition-colors lg:hidden",
          // Как только панель открыта, за иконкой уже не фото, а собственная
          // светлая панель — цвет возвращается к обычному вне зависимости
          // от того, что было снаружи.
          !open && tone === "paper" ? "text-paper" : "text-ink",
        )}
      >
        {open ? <Close className="size-6" /> : <Menu className="size-6" />}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 top-(--header-h) z-40 overflow-y-auto border-t border-line bg-paper lg:hidden"
          >
            <nav className="px-gutter py-md">
              <ul className="flex flex-col">
                {items.map((item, i) => (
                  <li key={item.href}>
                    <Rule index={i} trigger="mount" />
                    <Link
                      href={item.href}
                      // Меню закрывается по клику, а не эффектом на смену
                      // маршрута: так нет лишнего каскада перерисовок.
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block py-sm font-serif text-h4 text-ink",
                        "transition-colors hover:text-violet",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li aria-hidden="true">
                  <Rule index={items.length} trigger="mount" />
                </li>
              </ul>

              <div className="mt-lg">
                <Button href={cta.href} size="lg" className="w-full">
                  {cta.label}
                </Button>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
