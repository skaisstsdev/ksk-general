"use client";

import Image from "next/image";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

import { Link, usePathname } from "@/i18n/navigation";
import { mainNav, pagesWithHero, primaryCta } from "@/content/navigation";
import { company } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
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

  const transparent = hasHero && !scrolled;

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
        <div className="flex h-(--header-h) items-center justify-between gap-md">
          <Link
            href="/"
            className="flex items-center gap-xs"
            aria-label={`${company.legalName} — Startseite`}
          >
            <Image
              src="/logo-icon.png"
              alt=""
              width={36}
              height={36}
              priority
              className="size-9 w-auto"
            />
            <span className="flex flex-col leading-tight">
              {/* Полное наименование не помещается в строку на телефоне.
                  Ниже lg показываем короткое имя бренда. */}
              <span
                className={cn(
                  "font-serif text-ui whitespace-nowrap lg:hidden",
                  transparent ? "text-paper" : "text-ink",
                )}
              >
                {company.shortName}
              </span>
              <span
                className={cn(
                  "hidden font-serif text-ui lg:inline",
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
                {company.descriptor}
              </span>
            </span>
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden lg:block">
            <ul className="flex items-center gap-lg">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-ui transition-colors",
                      transparent
                        ? "text-paper/85 hover:text-paper"
                        : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3xs lg:gap-xs">
            {/* Прячем обёрткой, а не классом `hidden` на самой кнопке:
                Button задаёт себе `inline-flex`, и в таблице стилей
                Tailwind оба относятся к display — побеждает не тот,
                что записан последним в атрибуте, а тот, что идёт
                последним в CSS. Обёртка снимает спор целиком. */}
            <div className="hidden lg:block">
              <Button href={primaryCta.href} size="sm">
                {primaryCta.label}
              </Button>
            </div>
            <MobileMenu
              items={mainNav}
              cta={primaryCta}
              tone={transparent ? "paper" : "ink"}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
