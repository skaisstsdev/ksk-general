"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";

import { usePathname, useRouter } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import { Globe } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/**
 * Переключатель языков.
 *
 * В старом сайте язык хранился в `localStorage`, а адрес не менялся —
 * поэтому для поиска существовала только немецкая версия. Здесь выбор
 * языка меняет URL, то есть у каждой языковой версии свой адрес.
 *
 * Живёт в левом нижнем углу экрана, а не в шапке — как на старом сайте:
 * шапке это освобождает место, а десять языков в одном списке всё равно
 * удобнее раскрывать снизу вверх, у большого пальца. Рендерится один
 * раз в корневом layout, поверх всех страниц.
 *
 * Прозрачная рамка в цвет текста, без заливки и тени. Чтобы она читалась и
 * на светлом поле, и на тёмном (фото хиро, раскрытый кадр, футер), он
 * смотрит, что под ним: тёмные поверхности помечены `data-tone="dark"`,
 * и при каждой прокрутке `elementsFromPoint` проверяет, лежит ли под
 * центром кнопки такая поверхность. Никаких порогов по пикселям —
 * поверхность сама говорит, какая она.
 */
export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const probe = () => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const under = document
      .elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      .find((n) => !el.contains(n));
    setOnDark(Boolean(under?.closest('[data-tone="dark"]')));
  };
  useMotionValueEvent(scrollY, "change", probe);
  useEffect(() => {
    probe();
    window.addEventListener("resize", probe);
    return () => window.removeEventListener("resize", probe);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function switchTo(next: Locale) {
    setOpen(false);
    // Тот же маршрут, другой язык: динамические сегменты переносятся как есть.
    router.replace(
      // @ts-expect-error — pathname здесь типизирован как конкретный маршрут,
      // а мы переносим его без изменений вместе с параметрами.
      { pathname, params },
      { locale: next },
    );
  }

  return (
    <div ref={ref} className="fixed bottom-md start-md z-50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Sprache wählen"
        className={cn(
          "inline-flex h-10 items-center gap-2xs rounded-xs border bg-transparent px-sm text-meta font-medium transition-colors duration-300",
          onDark
            ? "border-paper text-paper hover:bg-paper/10"
            : "border-ink text-ink hover:bg-ink/5",
        )}
      >
        <Globe className="size-4" />
        <span className="uppercase tracking-[0.06em]">{locale}</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute bottom-full start-0 z-50 mb-2xs min-w-48 rounded-xs border py-xs",
              onDark ? "border-paper bg-night" : "border-ink bg-paper",
            )}
          >
            {(Object.keys(localeMeta) as Locale[]).map((code) => (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={code === locale}
                  lang={code}
                  dir={localeMeta[code].dir}
                  onClick={() => switchTo(code)}
                  className={cn(
                    "flex w-full items-center justify-between gap-sm px-sm py-2xs text-start text-meta transition-colors",
                    onDark
                      ? cn(
                          "hover:bg-paper/10",
                          code === locale ? "text-paper" : "text-paper/70",
                        )
                      : cn(
                          "hover:bg-ink/5",
                          code === locale ? "text-ink" : "text-ink-soft",
                        ),
                  )}
                >
                  <span>{localeMeta[code].label}</span>
                  <span
                    className={cn(
                      "text-caption uppercase",
                      onDark ? "text-paper/50" : "text-ink-muted",
                    )}
                  >
                    {code}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
