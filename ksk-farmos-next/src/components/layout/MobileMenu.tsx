"use client";

import { useEffect, useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
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
 *
 * `open`/`onOpenChange` управляются снаружи (`Header.tsx`), а не внутри:
 * шапке нужно знать, раскрыта ли панель, чтобы на страницах с прозрачной
 * шапкой над хиро перестать быть прозрачной, пока панель открыта —
 * иначе сплошная белая панель начинается не от верхнего края экрана,
 * а от нижнего края всё ещё прозрачной шапки, и между ними виден обрывок
 * фотографии с плавающим крестиком поверх неё.
 */
type MenuItem = { href: string; label: string };

export function MobileMenu({
  items,
  cta,
  tone = "ink",
  open,
  onOpenChange,
  forceVisible = false,
}: {
  items: MenuItem[];
  cta: MenuItem;
  /** `paper` — когда кнопка открытия плавает поверх тёмной фотографии.
   *  Панель, которая раскрывается по клику, всегда светлая и остаётся
   *  на `ink`: тон относится только к закрытой кнопке-гамбургеру. */
  tone?: "ink" | "paper";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** От `lg` кнопка обычно скрыта — на этой ширине помещается десктопная
   *  навигация. `Header.tsx` измеряет, действительно ли она помещается
   *  при текущей длине переведённого текста, и на нетипичных разрешениях,
   *  где строка навигации не влезает даже выше `lg`, включает эту кнопку
   *  и здесь: `lg:hidden` снимается, гамбургер остаётся единственным
   *  рабочим входом в меню вместо не влезающей строки. */
  forceVisible?: boolean;
}) {
  const t = useTranslations("common");
  const panelId = useId();
  const pathname = usePathname();

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
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t("mobileMenu.closeAria") : t("mobileMenu.openAria")}
        className={cn(
          "-me-2xs inline-flex items-center justify-center p-2xs transition-colors",
          !forceVisible && "lg:hidden",
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
            className={cn(
              "fixed inset-x-0 bottom-0 top-(--header-h) z-40 flex flex-col overflow-y-auto border-t border-line bg-paper",
              !forceVisible && "lg:hidden",
            )}
          >
            {/* Пункты сами растягиваются на всю высоту панели
                (`ul` — `flex-1 justify-between`), а не жмутся мелким
                блоком где-то посередине экрана: шесть пунктов достаточно
                крупного кегля (`text-h1`, тот же, что у заголовков
                страниц) с промежутками, которые считает сам flex, сами
                занимают весь телефон от линии под шапкой до кнопки внизу. */}
            <nav className="flex flex-1 flex-col px-gutter py-xl">
              <ul className="flex flex-1 flex-col justify-between">
                {items.map((item, i) => {
                  const active = item.href === pathname;
                  return (
                    <li key={item.href}>
                      <Rule index={i} trigger="mount" />
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        // Меню закрывается по клику, а не эффектом на смену
                        // маршрута: так нет лишнего каскада перерисовок.
                        onClick={() => onOpenChange(false)}
                        className={cn(
                          "block py-2xs font-serif text-h2 font-medium transition-colors hover:text-violet",
                          active ? "text-violet" : "text-ink",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
                <li aria-hidden="true">
                  <Rule index={items.length} trigger="mount" />
                </li>
              </ul>

              {/* `Button` с `href` не принимает `onClick` (см. её типы) —
                  намеренно, чтобы вариант-ссылка не путали с вариантом-
                  действием. Здесь оба нужны разом: переход по ссылке и
                  закрытие панели, поэтому клик ловится на обёртке —
                  событие поднимается от вложенной `<a>`, и `onOpenChange`
                  не мешает переходу, раз не вызывает `preventDefault`.
                  Без этого `Header` (он не пересоздаётся между страницами,
                  живёт в layout) держал панель открытой поверх уже другой
                  страницы после клика по этой самой кнопке. */}
              <div className="mt-xl" onClick={() => onOpenChange(false)}>
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
