"use client";

import { useEffect, useState } from "react";

import { usePathname } from "@/i18n/navigation";

/**
 * Ушёл ли полноэкранный хиро (`[data-hero]`: `Hero`, `PageHero`) выше
 * нижнего края экрана, где живут плавающие кнопки.
 *
 * На телефоне `LanguageSwitcher` и `ChatWidget` над хиро не показываются:
 * первый экран — фото, заголовок и две кнопки, третьей и четвёртой там
 * некуда встать красиво. Кнопки появляются, когда низ хиро поднялся над
 * ними. `null` — на странице нет хиро, решает обычное правило первого
 * скролла (`useScrolledOnce`).
 *
 * Перепроверяется на прокрутке, изменении размера и смене страницы:
 * при переходе по меню новая страница начинается сверху, и хиро снова
 * под кнопками — без замера по `pathname` они остались бы видимыми.
 */
export function useHeroPassed(): boolean | null {
  const pathname = usePathname();
  const [passed, setPassed] = useState<boolean | null>(null);

  useEffect(() => {
    let frame: number | null = null;

    function measure() {
      frame = null;
      const hero = document.querySelector("[data-hero]");
      if (!hero) {
        setPassed(null);
        return;
      }
      // Нижние кнопки занимают ~4rem над краем экрана (отступ `md` +
      // высота 40px) — хиро считается пройденным, когда ушёл выше них.
      const reserve = 4 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      setPassed(hero.getBoundingClientRect().bottom <= window.innerHeight - reserve);
    }

    function schedule() {
      if (frame === null) frame = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return passed;
}
