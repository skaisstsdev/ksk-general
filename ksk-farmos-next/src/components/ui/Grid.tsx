import { cn } from "@/lib/cn";
import { Container } from "./Container";

/**
 * Сетка страницы.
 *
 * Двенадцать колонок и **один** промежуток на весь сайт. Раньше сетка
 * собиралась в каждой секции руками, и промежуток гулял между 32 и 48
 * пикселями — из-за этого правая колонка начиналась то на 917, то на 927,
 * то на 706, то на 744, то на 793. Пять разных вертикалей на одной
 * странице; глаз читает это как кривизну, и он прав.
 *
 * Теперь левый край содержания всегда один, правой колонки — тоже один.
 * Меняться может только ширина блока, но не место, где он начинается.
 */
export function Grid({
  children,
  contained = true,
  className,
}: {
  children: React.ReactNode;
  contained?: boolean;
  className?: string;
}) {
  const grid = (
    <div className={cn("grid gap-x-lg gap-y-xl lg:grid-cols-12", className)}>
      {children}
    </div>
  );
  return contained ? <Container>{grid}</Container> : grid;
}

/**
 * Допустимые места в сетке. Список закрытый: произвольные `col-start`
 * в разметке — это и есть тот способ, которым сетка разъезжается.
 *
 * При 1440: содержание начинается на 194, правая колонка — на 826.
 *
 * `asideStart`/`wideEnd` — зеркало `aside`/`wide` для композиций, где
 * фотография открывает разворот слева, а текст стоит справа (хиро B).
 * CSS Grid нумерует колонки по направлению письма, поэтому в RTL
 * зеркалирование остаётся корректным без отдельного кода.
 */
const spans = {
  /** Вся ширина. */
  full: "lg:col-span-12",
  /** Основная колонка: заголовки, списки, длинный текст. */
  text: "lg:col-span-6",
  /**
   * Широкая: только для крупного заголовка первого экрана.
   * Ровно семь колонок — восьмая занята правой колонкой, и span 8
   * с ней перекрывался, из-за чего правый блок падал на строку ниже.
   */
  wide: "lg:col-span-7",
  /** Правая колонка. Единственная возможная — начинается на восьмой. */
  aside: "lg:col-span-5 lg:col-start-8",
  /** Текст справа, когда фотография стоит в `asideStart` слева. */
  wideEnd: "lg:col-span-7 lg:col-start-6",
  /** Фотография слева, зеркально к `aside`. */
  asideStart: "lg:col-span-5 lg:col-start-1",
  /**
   * Основная колонка справа, зеркально к `text` — для разворотов
   * «заголовок и текст», где перечень (`asideStart`) стоит слева.
   */
  textEnd: "lg:col-span-6 lg:col-start-7",
} as const;

export function Col({
  children,
  span = "full",
  className,
}: {
  children: React.ReactNode;
  span?: keyof typeof spans;
  className?: string;
}) {
  return <div className={cn(spans[span], className)}>{children}</div>;
}
