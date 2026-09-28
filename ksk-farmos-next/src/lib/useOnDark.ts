"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

/**
 * Тёмные поверхности сайта помечены `data-tone="dark"` (`Hero`,
 * `PageHero`, `ExpandingPhoto`, `Footer`, фиолетовые развороты на всю
 * ширину — `ServiceList`, Kooperationen/Vakanzen/Wohnprojekte/Kosten).
 * Плавающие элементы, которые остаются на экране поверх разных фонов
 * (`LanguageSwitcher`, `ChatWidget`), на каждой прокрутке спрашивают
 * `elementsFromPoint`, что лежит под их центром, — вместо порогов
 * по пикселям, которые пришлось бы подбирать заново для каждой страницы.
 *
 * `initialDark` — чем считать фон до первого измерения (SSR и самый
 * первый рендер на клиенте, пока `elementsFromPoint` ещё не спросили).
 * На страницах с хиро (`pagesWithHero`) под кнопкой в момент отрисовки
 * уже точно тёмное фото, а не то, что даёт умолчание `false` — без этого
 * кнопка на первом кадре рендерится светлым вариантом поверх фото и тут
 * же перекрашивается, как только сработает `useEffect` ниже.
 */
export function useOnDark(ref: React.RefObject<HTMLElement | null>, initialDark = false) {
  const [onDark, setOnDark] = useState(initialDark);
  const { scrollY } = useScroll();
  // Кадр, на который уже поставлен замер, — пока он не выполнился,
  // новые запросы (следующее `change`/`resize`) не добавляют второй.
  const pendingFrame = useRef<number | null>(null);

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

  // `scrollY` меняется на каждое native-событие скролла — на трекпаде
  // или экране с высокой частотой обновления это заметно чаще, чем раз
  // в кадр, а `elementsFromPoint` — не бесплатный запрос к layout.
  // `requestAnimationFrame` схлопывает всю пачку `change` за один кадр
  // в один настоящий замер: следующий `change` внутри уже запланированного
  // кадра просто ничего не делает, а не ставит второй `rAF` в очередь.
  function scheduleProbe() {
    if (pendingFrame.current !== null) return;
    pendingFrame.current = requestAnimationFrame(() => {
      pendingFrame.current = null;
      probe();
    });
  }

  useMotionValueEvent(scrollY, "change", scheduleProbe);

  // Без зависимостей и без условия — срабатывает после каждого рендера.
  // `ChatWidget` не держит кнопку в DOM до первого скролла (`visible`),
  // поэтому в момент монтирования самого хука `ref.current` ещё `null`;
  // разовая проверка на монтировании так и осталась бы с `onDark: false`
  // до следующего события скролла. `LanguageSwitcher` кнопку не прячет,
  // и для него это просто одно лишнее дешёвое измерение на рендер.
  // Здесь — сразу, не через `scheduleProbe`: рендер уже прошёл, ждать
  // кадр ради того же самого незачем.
  useEffect(() => {
    probe();
  });

  useEffect(() => {
    window.addEventListener("resize", scheduleProbe);
    return () => {
      window.removeEventListener("resize", scheduleProbe);
      if (pendingFrame.current !== null) cancelAnimationFrame(pendingFrame.current);
    };
    // `scheduleProbe`/`probe` замыкают только `ref`, чей идентификатор
    // стабилен между рендерами — переподписываться на каждый из них незачем.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return onDark;
}
