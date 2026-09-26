"use client";

import { useEffect, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

/**
 * Тёмные поверхности сайта помечены `data-tone="dark"` (`Hero`,
 * `PageHero`, `ExpandingPhoto`, `Footer`, фиолетовые развороты на всю
 * ширину — `ServiceList`, Kooperationen/Vakanzen/Wohnprojekte/Kosten).
 * Плавающие элементы, которые остаются на экране поверх разных фонов
 * (`LanguageSwitcher`, `ChatWidget`), на каждой прокрутке спрашивают
 * `elementsFromPoint`, что лежит под их центром, — вместо порогов
 * по пикселям, которые пришлось бы подбирать заново для каждой страницы.
 */
export function useOnDark(ref: React.RefObject<HTMLElement | null>) {
  const [onDark, setOnDark] = useState(false);
  const { scrollY } = useScroll();

  function probe() {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // `elementsFromPoint` возвращает не только то, что реально видно под
    // элементом, но и весь его собственный стек: значок, кнопку — а следом,
    // раз кнопка сама сидит в `position: fixed`-обёртке, ещё и саму эту
    // обёртку (она не «внутри» кнопки, а снаружи, поэтому `el.contains`
    // её не ловил, и именно её код принимал за фон страницы). Пропускаем
    // всё, что с `el` в родстве в любую сторону — потомков и предков, —
    // и берём первый по-настоящему посторонний узел.
    const under = document
      .elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      .find((n) => !el.contains(n) && !n.contains(el));
    setOnDark(Boolean(under?.closest('[data-tone="dark"]')));
  }

  useMotionValueEvent(scrollY, "change", probe);

  // Без зависимостей и без условия — срабатывает после каждого рендера.
  // `ChatWidget` не держит кнопку в DOM до первого скролла (`visible`),
  // поэтому в момент монтирования самого хука `ref.current` ещё `null`;
  // разовая проверка на монтировании так и осталась бы с `onDark: false`
  // до следующего события скролла. `LanguageSwitcher` кнопку не прячет,
  // и для него это просто одно лишнее дешёвое измерение на рендер.
  useEffect(() => {
    probe();
  });

  useEffect(() => {
    window.addEventListener("resize", probe);
    return () => window.removeEventListener("resize", probe);
    // `probe` замыкает только `ref`, чей идентификатор стабилен между
    // рендерами — переподписываться на каждый из них незачем.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return onDark;
}
