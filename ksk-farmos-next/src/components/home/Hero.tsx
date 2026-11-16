import { getImageProps } from "next/image";
import { getTranslations } from "next-intl/server";

import { Col, Grid } from "@/components/ui/Grid";
import { HeroCopy } from "@/components/hero/HeroCopy";

/**
 * Два кадра хиро — тот же приём art direction, что у `PageHero.tsx`
 * (`<picture>` + `getImageProps`, брейкпоинт `lg`): горизонтальный кадр
 * от `lg`, отдельный вертикальный кадр уже — телефон снят отдельно,
 * а не обрезан из горизонтального по центру.
 */
function HeroPicture({ alt }: { alt: string }) {
  // `priority` (`preload`) не подходит для этого `<picture>`: он бы
  // включил предзагрузку обоих кадров разом — ровно то, от чего
  // предостерегает свой же пример art direction в доке Next.js
  // (`node_modules/next/dist/docs/.../image.md`, раздел «Theme image»).
  // Вместо этого — `fetchPriority="high"` прямо на итоговом `<img>`,
  // и `loading: "eager"` в общих пропсах: без него `<img>` по умолчанию
  // ленивый (грузится только у границы вьюпорта), даже с высоким
  // fetchPriority — а этот кадр виден сразу, ждать нечего.
  const common = { alt, sizes: "100vw", quality: 90, loading: "eager" as const };
  const {
    props: { srcSet: wide },
  } = getImageProps({
    ...common,
    src: "/img/home/hero-auto-2000.webp",
    width: 2000,
    height: 1331,
  });
  const {
    props: { srcSet: narrow, ...img },
  } = getImageProps({
    ...common,
    src: "/img/home/hero-auto-hoch-le.webp",
    width: 1032,
    height: 1938,
  });

  return (
    <picture>
      <source media="(min-width: 64rem)" srcSet={wide} />
      <source srcSet={narrow} />
      <img
        {...img}
        alt={alt}
        fetchPriority="high"
        className="size-full object-cover"
      />
    </picture>
  );
}

/**
 * Хиро — фото фоном, текст поверх.
 *
 * Полноэкранный на всех устройствах (`min-h-svh`) — не только на
 * десктопе: раньше мобильная версия была ниже и обрезана снизу
 * произвольным числом, теперь высота одна и та же логика для всех.
 *
 * **Вертикаль.** Шапка снята из потока (см. `Header.tsx`) и лежит
 * поверх фотографии, поэтому центрировать содержимое относительно
 * всего экрана неверно — часть этого экрана визуально занята шапкой.
 * Вместо этого `padding-top: var(--header-h)` без парного отступа
 * снизу: это ровно тот сдвиг, что превращает центр «весь экран»
 * в центр «от низа шапки до низа экрана», и работает на любой высоте
 * экрана без отдельных чисел под десктоп и телефон.
 *
 * На узких экранах к этому центру добавляется `--hero-bias` (снизу,
 * см. `globals.css`) — небольшой сдвиг вверх.
 *
 * **Горизонталь.** Колонка текста — `Col span="wide"` из общей сетки
 * сайта: тот самый слот, который `Grid.tsx` называет «только для
 * крупного заголовка первого экрана». Левый край — общая вертикаль
 * страницы (194px при 1440); правый останавливается немного дальше
 * середины экрана, а не тянется во весь экран.
 *
 * Горизонтальный кадр (`hero-auto-2000.webp`) и вертикальный
 * (`hero-auto-hoch-le.webp`) — отдельные фото под широкий и узкий экран,
 * а не один кадр, сжатый по центру. Никаких CSS-якорей и трансформаций
 * (`scale`, `objectPosition`, `filter`) поверх — только `object-cover`
 * и направленное затемнение под текстом (см. разметку ниже).
 *
 * Числа доверия («13 Jahre Erfahrung» и так далее) в хиро больше нет —
 * по решению владельца они переехали в инфографику блока `Intro.tsx`
 * сразу под хиро (`TrustBar`), где для них есть место и воздух, а не
 * одна строка поверх фотографии. Хиро заканчивается на кнопке и телефоне.
 */
export async function Hero() {
  const t = await getTranslations("home");

  return (
    <section
      data-tone="photo"
      data-hero
      className="relative flex min-h-svh flex-col overflow-hidden bg-stand-in"
    >
      <div className="absolute inset-0">
        <HeroPicture alt={t("hero.alt")} />
        {/* Телефон: затемнение снизу вверх, верх кадра с лицом чистый. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/90 from-30% via-ink/70 via-60% to-ink/0 to-90% lg:hidden"
        />
        {/* Десктоп: затемнение только под текстом; к 58% ширины сходит на нет, на девушке (от ~65%) кадр совсем чистый. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-r from-ink/65 via-ink/50 via-25% to-ink/0 to-58% lg:block rtl:bg-gradient-to-l"
        />
        {/* Короткая полоса под шапкой, чтобы светлая навигация читалась. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[calc(var(--header-h)*2)] bg-gradient-to-b from-ink/50 to-ink/0"
        />
      </div>

      <div className="relative flex flex-1 flex-col justify-center pt-[calc(var(--header-h)+var(--spacing-3xl)+10svh)] lg:pt-[var(--header-h)]">
        <Grid>
          <Col span="wide">
            <HeroCopy tone="paper" />
          </Col>
        </Grid>
      </div>
    </section>
  );
}
