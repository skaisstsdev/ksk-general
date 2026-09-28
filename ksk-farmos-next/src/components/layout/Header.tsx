"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { mainNav, pagesWithHero, primaryCta } from "@/content/navigation";
import { company } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { setMobileMenuOpen } from "@/lib/mobileMenuState";
import { MobileMenu } from "./MobileMenu";

/**
 * Шапка — компонент, а не копия в каждом файле.
 *
 * В старом сайте header и footer были продублированы вручную в десяти
 * HTML-файлах; отсюда и брались расхождения между страницами.
 *
 * Шапка снята с потока (`fixed`, а не `sticky`): на главной она должна
 * плавать прозрачно поверх фотографии хиро, а не сидеть сплошной
 * полосой над ней — иначе те же 72px просто отрезаются от фотографии
 * и превращаются в мёртвую полосу над ней, а не в часть кадра.
 *
 * Отсюда следствие для всех будущих страниц: раз шапка убрана из
 * потока, верхний отступ под неё каждая страница задаёт себе сама
 * (`pt-(--header-h)` — обычная страница; хиро на фотографии считает
 * этот отступ внутри себя, как здесь). Общего отступа на `<main>`
 * нет специально — иначе фотографии хиро было бы нечем зайти под шапку.
 *
 * Прозрачной шапка становится только на страницах с хиро во весь
 * экран (`pagesWithHero`) и только в самом верху: как только страница
 * начинает скроллиться, шапка становится непрозрачной — иначе тот же
 * светлый текст, что читается на тёмном фото, окажется нечитаемым
 * на светлом фоне следующего блока.
 */
export function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const hasHero = pagesWithHero.includes(pathname);

  // Прокрутка отслеживается на любой странице, а не только там, где
  // шапка прозрачна: иначе при переходе со страницы без хиро на главную
  // состояние «прокручено» оставалось от прошлой страницы, и шапка
  // стояла залитой поверх фотографии, пока не сдвинешь экран.
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 8);
  });

  // Состояние мобильного меню живёт здесь, а не внутри `MobileMenu`:
  // пока панель раскрыта, прозрачная шапка должна стать сплошной, иначе
  // под ней остаётся видна фотография хиро — обрывок кадра между верхним
  // краем экрана и белой панелью меню, начинающейся ниже шапки.
  const [menuOpen, setMenuOpenState] = useState(false);
  // Переключатель языка и кнопка чата сидят в тех же нижних углах,
  // что и открытая панель меню (`MobileMenu.tsx`) — без этого сигнала
  // они торчали из-за её края, наполовину перекрывая кнопку внизу
  // панели. `setMobileMenuOpen` — тот же стейт, что читают оба через
  // `useSyncExternalStore` (см. `lib/mobileMenuState.ts`).
  function setMenuOpen(next: boolean) {
    setMenuOpenState(next);
    setMobileMenuOpen(next);
  }

  const transparent = hasHero && !scrolled && !menuOpen;

  const navItems = mainNav.map((item) => ({
    href: item.href,
    label: t(`nav.${item.key}`),
  }));
  const ctaItem = { href: primaryCta.href, label: t("nav.primaryCta") };

  // `lg` — фиксированный порог, а строка навигации — нет: её ширина
  // зависит от длины переведённого текста (10 языков) и от того, как
  // именно окно браузера сузили (разделённый экран, нестандартный зум).
  // Один и тот же брейкпоинт где-то оставляет запас, а где-то кнопка
  // переносится на вторую строку — сам перелом этого не видит, он знает
  // только ширину окна, не ширину содержимого.
  //
  // Поэтому рядом с видимой строкой рендерится её точная копия — то же
  // лого, тот же список, та же кнопка, но `absolute` и `invisible`, вне
  // потока и без переноса (`whitespace-nowrap`): её естественная ширина
  // и есть ответ на вопрос «поместится ли строка без переноса». Ниже
  // `lg` копия не нужна — там уже мобильная раскладка по брейкпоинту,
  // а `compact` в её разметку не подмешивается никак.
  const [compact, setCompact] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const measure = measureRef.current;
    if (!row || !measure) return;

    const check = () => {
      setCompact(measure.scrollWidth > row.clientWidth);
    };
    check();

    const ro = new ResizeObserver(check);
    ro.observe(row);
    ro.observe(measure);
    return () => ro.disconnect();
  }, [navItems.length, ctaItem.label]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-line bg-paper",
      )}
    >
      <Container>
        <div
          ref={rowRef}
          className="relative flex h-(--header-h) items-center justify-between gap-md"
        >
          {/* Невидимая копия десктопной строки — то же лого, список
              и кнопка, но `absolute`/`invisible`/`whitespace-nowrap`.
              Её натуральная ширина (без переноса) и решает, включать
              ли `compact` — см. комментарий у `useLayoutEffect` выше. */}
          <div
            ref={measureRef}
            aria-hidden="true"
            className="pointer-events-none invisible absolute start-0 top-0 flex items-center gap-md whitespace-nowrap"
          >
            <span className="flex items-center gap-xs">
              <span className="size-9" />
              <span className="text-ui">{company.legalName}</span>
            </span>
            <ul className="flex items-center gap-lg">
              {mainNav.map((item) => (
                <li key={item.href} className="pb-3xs text-ui">
                  {t(`nav.${item.key}`)}
                </li>
              ))}
            </ul>
            <span className="inline-flex rounded-xs px-xs py-2xs text-meta font-medium">
              {ctaItem.label}
            </span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-xs"
            aria-label={`${company.legalName} — ${t("nav.start")}`}
          >
            <Image
              src="/logo-icon.png"
              alt=""
              // Настоящий файл — 300×259, не квадрат: пропорция здесь
              // ровно та же (42×36), чтобы Next резервировал место под
              // картинку без сдвига раскладки после загрузки, а не квадрат
              // по неверной подсказке (предупреждение в консоли билда).
              width={42}
              height={36}
              preload
              className="size-9 w-auto"
            />
            <span className="flex flex-col leading-tight">
              {/* Полное наименование не помещается в строку на телефоне.
                  Ниже lg показываем короткое имя бренда. */}
              <span
                className={cn(
                  "text-ui whitespace-nowrap lg:hidden",
                  transparent ? "text-paper" : "text-ink",
                )}
              >
                {company.shortName}
              </span>
              <span
                className={cn(
                  "hidden text-ui lg:inline",
                  transparent ? "text-paper" : "text-ink",
                )}
              >
                {company.legalName}
              </span>
              <span
                className={cn(
                  "text-caption",
                  transparent ? "text-paper/70" : "text-ink-muted",
                )}
              >
                {t("brand.descriptor")}
              </span>
            </span>
          </Link>

          <nav
            aria-label={t("header.mainNavAria")}
            className={cn("hidden", !compact && "lg:block")}
          >
            <ul className="flex items-center gap-lg">
              {mainNav.map((item) => {
                const active = item.href === pathname;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        // Линия снизу — общий маркер текущей страницы;
                        // на прозрачной шапке фиолетовый текст сам по
                        // себе плохо виден на затемнённом фото (7.1:1
                        // у violet посчитан против paper, не против
                        // тёмного кадра), поэтому текущий пункт красится
                        // тем же цветом, что при наведении, а не violet.
                        "border-b-2 pb-3xs text-ui transition-colors",
                        transparent
                          ? active
                            ? "border-violet text-paper"
                            : "border-transparent text-paper/85 hover:text-paper"
                          : active
                            ? "border-violet text-ink"
                            : "border-transparent text-ink-soft hover:text-ink",
                      )}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3xs lg:gap-xs">
            {/* Прячем обёрткой, а не классом `hidden` на самой кнопке:
                Button задаёт себе `inline-flex`, и в таблице стилей
                Tailwind оба относятся к display — побеждает не тот,
                что записан последним в атрибуте, а тот, что идёт
                последним в CSS. Обёртка снимает спор целиком.

                На прозрачной шапке кнопки не видно и она не кликабельна
                (`invisible`, не `hidden`) — место под неё остаётся, иначе
                `justify-between` пересчитывает зазоры и логотип с меню
                съезжают вправо при каждом появлении/исчезновении кнопки. */}
            <div
              className={cn(
                "hidden",
                !compact && "lg:block",
                transparent && "invisible",
              )}
            >
              <Button href={ctaItem.href} size="sm">
                {ctaItem.label}
              </Button>
            </div>
            <MobileMenu
              items={navItems}
              cta={ctaItem}
              tone={transparent ? "paper" : "ink"}
              open={menuOpen}
              onOpenChange={setMenuOpen}
              forceVisible={compact}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
