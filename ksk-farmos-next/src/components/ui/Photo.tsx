"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLocale } from "next-intl";

import { localeDir } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { useIsLg } from "@/lib/useIsLg";

/**
 * Фотография в композиции.
 *
 * Пришла на смену серой плашке: та же геометрия, вылеты и движение,
 * но внутри `next/image` — отсюда современные форматы, нужные размеры
 * и отсутствие сдвига раскладки при загрузке.
 *
 * Снимков мало, и это позиция: каждая работает знаком препинания,
 * поэтому умеет разделять блоки — вылетать в край, подниматься снизу —
 * и тем самым заменяет собой смену подложки.
 *
 * **Выезд — только на десктопе**, параллакс — оба экрана. На телефоне
 * въезд от края пока не приживается (временно, до отдельного решения) —
 * там кадр сразу стоит в конечном положении, без вылета и без движения.
 *
 * **Выезд переключается туда-обратно по входу/выходу из экрана**
 * (`whileInView` без `once`, тот же датчик-механизм, что у `rise`
 * в этом же файле, только без `once: true`) — кадр выезжает при
 * скролле вниз и уезжает обратно за край при скролле вверх, а не
 * играет один раз и остаётся. Пробовали два варианта, привязанных
 * к точной доле прокрутки (`useScroll` прямо на `ref` кадра —
 * JS-коллбэк на каждый тик; датчик с именованным пресетом Motion —
 * `ViewTimeline`): первый на проде не реагировал на скролл вообще,
 * второй завершался не в той точке, что задумано (нативный диапазон
 * браузера для пресета не совпал с посчитанным вручную).
 * `whileInView` через `IntersectionObserver` — самый скучный из трёх
 * способов и поэтому самый надёжный.
 */

const DURATION = 0.6;
const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  src: string;
  alt: string;
  /** Пропорции кадра на узком экране. */
  ratio: string;
  /**
   * Пропорции от `lg`. Широкая полоса, годная на десктопе, на телефоне
   * вырождается в щель: 1600/760 при ширине 375 даёт 178 пикселей высоты.
   * Игнорируется, если задан `fillLg`.
   */
  ratioLg?: string;
  /**
   * От `lg` кадр перестаёт держать фиксированную пропорцию и растягивается
   * на всю высоту родителя — родитель обязан её задавать.
   *
   * Нужно для хиро A/B: сначала фотография там стояла полосой ниже
   * текста и на 1440×900 упиралась в дыру 228px пустоты под текстом,
   * прежде чем начинался кадр. `fillLg` кладёт фотографию в ту же
   * колонку сетки, что и текст (см. `Grid`/`Col`): CSS Grid растягивает
   * оба элемента строки на одну высоту без вычислений вручную.
   */
  fillLg?: boolean;
  /** Куда смещён кадр внутри рамки — важно, когда обрезка сильная. */
  position?: string;
  bleed?: "none" | "start" | "end" | "both";
  parallax?: boolean;
  rise?: boolean;
  /**
   * Кадр въезжает со стороны своего вылета при входе в экран и уезжает
   * обратно при выходе (`whileInView` без `once`; десктоп — на телефоне
   * пока отключено, см. комментарий над компонентом).
   */
  slide?: boolean;
  priority?: boolean;
  /**
   * Затемнение снизу под текст. Нужно только варианту хиро, где текст
   * лежит на кадре: без него контраст на светлых участках снимка
   * падает ниже порога читаемости.
   */
  overlay?: boolean;
  sizes?: string;
  caption?: React.ReactNode;
  className?: string;
};

export function Photo({
  src,
  alt,
  ratio,
  ratioLg,
  fillLg = false,
  position = "center",
  bleed = "none",
  parallax = false,
  rise = false,
  slide = false,
  priority = false,
  overlay = false,
  sizes = "100vw",
  caption,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const parallaxSensorRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isLg = useIsLg();

  const moving = parallax && !reduced;
  // Пока только десктоп: см. комментарий над компонентом.
  const sliding = slide && !reduced && isLg;

  // Со стороны вылета: в RTL «start» — правый край, и кадр идёт справа.
  // Кадр с вылетом в конец строки въезжает с противоположной стороны.
  const fromStart = localeDir(useLocale()) === "ltr" ? -1 : 1;
  const fromBleed = bleed === "end" ? -fromStart : fromStart;

  // Датчик, расширяющий кадр на 100svh в обе стороны: пресет `All`
  // («start start» → «end end») на нём срабатывает там же, где раньше
  // «верх кадра у низа экрана» → «низ кадра у верха экрана» — весь
  // путь кадра через экран.
  const { scrollYProgress: parallaxP } = useScroll({
    target: parallaxSensorRef,
    offset: ["start start", "end end"],
  });
  const nativeY = useTransform(parallaxP, [0, 1], [
    "translateY(-4.5%)",
    "translateY(4.5%)",
  ]);

  const frame = (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-sunken",
        (bleed === "end" || bleed === "both") && "bleed-end",
        (bleed === "start" || bleed === "both") && "bleed-start",
        fillLg
          ? "aspect-[var(--ar)] lg:aspect-auto lg:h-full"
          : "aspect-[var(--ar)] lg:aspect-[var(--ar-lg)]",
        className,
      )}
      style={
        {
          "--ar": ratio,
          "--ar-lg": ratioLg ?? ratio,
        } as React.CSSProperties
      }
    >
      {/* Датчик рендерится по самому пропу (`parallax`), не по `moving`:
          тот включает `isLg`/`reduced`, а на первом рендере `isLg`
          всегда `false` (см. `useIsLg`) и обновляется чуть позже. Если
          датчик на первом рендере не смонтирован, а `useScroll` его уже
          ждёт, — `ref` не успевает «гидратироваться» к повторной
          проверке, и Motion бросает рантайм-ошибку («Target ref is
          defined but not hydrated»). Датчик сам по себе ничего не весит
          и не виден, поэтому держать его смонтированным всегда —
          не проблема; используется его результат только когда
          `moving` истинно. */}
      {parallax ? (
        <div
          ref={parallaxSensorRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-[100svh] -bottom-[100svh]"
        />
      ) : null}

      <motion.div
        style={
          moving
            ? { transform: nativeY, position: "absolute", inset: "-5% 0", height: "110%" }
            : { position: "absolute", inset: 0 }
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </motion.div>

      {overlay ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/5"
        />
      ) : null}
    </div>
  );

  const body = sliding ? (
    <motion.div
      initial={{ x: `${fromBleed * 33}%` }}
      whileInView={{ x: "0%" }}
      viewport={{ margin: "-8% 0px -8% 0px" }}
      transition={{ duration: DURATION, ease: EASE }}
      className={fillLg ? "lg:h-full" : undefined}
    >
      {frame}
    </motion.div>
  ) : rise && !reduced ? (
      <motion.div
        initial={{ y: 44 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
        transition={{ duration: DURATION, ease: EASE }}
        // Высота должна дойти до `frame` по цепочке: без неё `lg:h-full`
        // у frame ссылается на автоматическую (нулевую) высоту обёртки.
        className={fillLg ? "lg:h-full" : undefined}
      >
        {frame}
      </motion.div>
    ) : fillLg ? (
      <div className="lg:h-full">{frame}</div>
    ) : (
      frame
    );

  if (!caption) return body;

  return (
    <figure className="flex flex-col gap-xs">
      {body}
      <figcaption className="text-meta text-ink-muted">{caption}</figcaption>
    </figure>
  );
}
