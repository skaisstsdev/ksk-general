import Image from "next/image";

import { Container } from "@/components/ui/Container";

/**
 * Мини-хиро: узкая полоса с фотографией и одним заголовком по центру.
 *
 * Для внутренних страниц, которым не нужен полноэкранный хиро с двумя
 * действиями: название раздела и кадр, который задаёт тему. Шапка здесь
 * сплошная (страница не входит в `pagesWithHero`), поэтому полоса
 * начинается прямо под ней.
 *
 * Фотография светлая, поэтому поверх неё ровное затемнение: текст по
 * центру, и направленный градиент ему не нужен.
 */
export function PageBanner({
  title,
  image,
}: {
  title: string;
  image: { src: string; alt: string; position?: string };
}) {
  return (
    <section
      data-tone="photo"
      className="relative mt-(--header-h) flex h-60 items-center justify-center overflow-hidden bg-stand-in lg:h-80"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: image.position ?? "center" }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-ink/55" />

      <Container>
        <div className="relative flex flex-col items-center text-center">
          <h1 className="text-h1 text-paper">{title}</h1>
          <div aria-hidden="true" className="mt-md h-0.5 w-12 bg-paper" />
        </div>
      </Container>
    </section>
  );
}
