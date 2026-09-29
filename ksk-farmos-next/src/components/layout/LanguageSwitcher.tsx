"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { Link, usePathname } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import { Globe, ICON_STROKE_ACCENT } from "@/components/ui/icons";
import { pagesWithHero } from "@/content/navigation";
import { cn } from "@/lib/cn";
import {
  getMobileMenuOpen,
  getServerMobileMenuOpen,
  subscribeMobileMenu,
} from "@/lib/mobileMenuState";
import { useOnDark } from "@/lib/useOnDark";

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
 * Прозрачная рамка в цвет текста, без заливки и тени. Цвет — тот же приём,
 * что у `ChatWidget`: фиолетовый на светлом поле, `paper` на тёмном (фото
 * хиро, раскрытый кадр, футер) — она смотрит, что под ней, через
 * `useOnDark`. Никаких порогов по пикселям — поверхность сама говорит,
 * какая она.
 */
export function LanguageSwitcher() {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();
  const ref = useRef<HTMLDivElement>(null);
  const onDark = useOnDark(ref, pagesWithHero.includes(pathname));
  const mobileMenuOpen = useSyncExternalStore(
    subscribeMobileMenu,
    getMobileMenuOpen,
    getServerMobileMenuOpen,
  );

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

  // Раскрытая панель мобильного меню занимает тот же нижний угол —
  // кнопка выходит из потока незакрытой, а не просто гаснет визуально,
  // чтобы не оставлять в разметке живой, но перекрытый интерактивный
  // элемент.
  if (mobileMenuOpen) return null;

  return (
    // `env(safe-area-inset-bottom)` в довесок к отступу — на телефоне
    // компактная нижняя панель Safari плавает поверх страницы, а не
    // сдвигает её содержимое, и без этой добавки кнопка на часть своей
    // высоты пряталась под ней.
    <div
      ref={ref}
      className="fixed bottom-[calc(var(--spacing-md)+env(safe-area-inset-bottom))] start-md z-50"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("lang.title")}
        style={{ borderWidth: ICON_STROKE_ACCENT }}
        className={cn(
          "inline-flex h-10 items-center gap-2xs rounded-xs bg-transparent px-sm text-meta font-medium transition-colors duration-300",
          onDark
            ? "border-paper text-paper hover:bg-paper/10"
            : "border-violet text-violet hover:bg-violet/5",
        )}
      >
        {/* Контур, который сравнивают с чат-кнопкой, — border пилюли выше
            (общая переменная `ICON_STROKE_ACCENT`), не эта иконка: она
            рядом с текстом и мельче обычной `size-4…6` не читается. */}
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
              onDark ? "border-paper bg-night" : "border-violet bg-paper",
            )}
          >
            {(Object.keys(localeMeta) as Locale[]).map((code) => (
              <li key={code}>
                {/* Настоящая ссылка, не кнопка с `onClick`: с прошлым
                    вариантом `router.replace` переключатель для краулера
                    не существовал — в разметке не было ни одного `href`
                    на другие девять языковых версий страницы, только
                    JS-обработчик. Клик и вид не изменились, `scroll={false}`
                    сохраняет прежнее поведение (не возвращать наверх). */}
                <Link
                  // @ts-expect-error — pathname здесь типизирован как конкретный
                  // маршрут, а мы переносим его без изменений вместе с параметрами.
                  href={{ pathname, params }}
                  locale={code}
                  scroll={false}
                  role="option"
                  aria-selected={code === locale}
                  lang={code}
                  dir={localeMeta[code].dir}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex w-full items-center justify-between gap-sm px-sm py-2xs text-start text-meta transition-colors",
                    onDark
                      ? cn(
                          "hover:bg-paper/10",
                          code === locale ? "text-paper" : "text-paper/70",
                        )
                      : cn(
                          "hover:bg-violet/5",
                          code === locale ? "text-violet" : "text-ink-soft",
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
                </Link>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
