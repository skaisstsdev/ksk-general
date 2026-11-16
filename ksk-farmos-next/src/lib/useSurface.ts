"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

import { CONSENT_CHANGE_EVENT } from "@/lib/consent";

/**
 * Под плавающими кнопками (`LanguageSwitcher`, `ChatWidget`) бывает три
 * вида фона, и каждый помечен в разметке атрибутом `data-tone`:
 * - `photo` — фотография (`Hero`, `PageHero`, `PageBanner`, `Photo`,
 *   `ExpandingPhoto`, `PhotoCarousel`);
 * - `dark` — сплошная тёмная заливка (фиолетовые развороты, `Footer`);
 * - всё остальное — светлое поле страницы (`light`).
 * Решает ближайший помеченный предок: фото внутри фиолетового блока —
 * это `photo`. Кнопки на каждой прокрутке спрашивают `elementsFromPoint`,
 * что лежит под их центром, — вместо порогов по пикселям, которые
 * пришлось бы подбирать заново для каждой страницы.
 *
 * `initial` — чем считать фон до первого измерения (SSR и самый
 * первый рендер на клиенте). На страницах с хиро (`pagesWithHero`) под
 * кнопкой в момент отрисовки уже точно фото — без этого кнопка на первом
 * кадре рендерилась бы светлым вариантом и тут же перекрашивалась.
 */
export type Surface = "photo" | "dark" | "light";

export function useSurface(
  ref: React.RefObject<HTMLElement | null>,
  initial: Surface = "light",
): Surface {
  const [surface, setSurface] = useState<Surface>(initial);
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
      // Другие плавающие слои (`data-floating`: баннер cookie) — не фон
      // страницы: кнопка под ними красится по тому, что лежит под всеми.
      // Значок инструментов разработчика Next (`nextjs-portal`, только
      // в `next dev`) сидит в том же левом нижнем углу, что и кнопка
      // языка, — его тоже пропускаем, иначе на localhost кнопка красилась
      // по нему, а не по странице.
      .find(
        (n) =>
          !el.contains(n) &&
          !n.contains(el) &&
          !n.closest("[data-floating]") &&
          n.tagName !== "NEXTJS-PORTAL",
      );
    const tone = under?.closest("[data-tone]")?.getAttribute("data-tone");
    setSurface(tone === "photo" || tone === "dark" ? tone : "light");
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
  // разовая проверка на монтировании так и осталась бы с `light`
  // до следующего события скролла. `LanguageSwitcher` кнопку не прячет,
  // и для него это просто одно лишнее дешёвое измерение на рендер.
  // Здесь — сразу, не через `scheduleProbe`: рендер уже прошёл, ждать
  // кадр ради того же самого незачем.
  useEffect(() => {
    probe();
  });

  // Фон под кнопкой меняется не только от прокрутки. Страница может
  // дорисоваться уже после первого замера (потоковый рендер, шрифты,
  // фото), Safari может вернуть её из bfcache, а закрытый баннер cookie
  // открывает то, что под ним лежало. Ни одно из этого не двигает
  // `scrollY`, поэтому без отдельных поводов кнопка оставалась в цвете
  // первого замера: например фиолетовой поверх фото хиро Karriere.
  // `ResizeObserver` на `body` ловит любое изменение высоты страницы,
  // `load`/`pageshow` — возврат и догрузку, `CONSENT_CHANGE_EVENT` — баннер.
  useEffect(() => {
    window.addEventListener("resize", scheduleProbe);
    window.addEventListener("load", scheduleProbe);
    window.addEventListener("pageshow", scheduleProbe);
    window.addEventListener(CONSENT_CHANGE_EVENT, scheduleProbe);
    const observer = new ResizeObserver(scheduleProbe);
    observer.observe(document.body);
    // Смена языка подменяет содержимое страницы на месте: высота та же,
    // прокрутки нет, `ResizeObserver` молчит — и кнопка оставалась
    // в цвете прежнего кадра, пока не сдвинешь страницу. Любая замена
    // узлов в документе — тоже повод перемерить (через тот же `rAF`,
    // так что пачка изменений даёт один замер). Только `childList`:
    // анимации Motion меняют атрибуты `style`, их не ловим.
    const mutations = new MutationObserver(scheduleProbe);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("resize", scheduleProbe);
      window.removeEventListener("load", scheduleProbe);
      window.removeEventListener("pageshow", scheduleProbe);
      window.removeEventListener(CONSENT_CHANGE_EVENT, scheduleProbe);
      observer.disconnect();
      mutations.disconnect();
      if (pendingFrame.current !== null) cancelAnimationFrame(pendingFrame.current);
    };
    // `scheduleProbe`/`probe` замыкают только `ref`, чей идентификатор
    // стабилен между рендерами — переподписываться на каждый из них незачем.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return surface;
}
