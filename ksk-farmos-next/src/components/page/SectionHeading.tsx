import { Eyebrow } from "@/components/ui/Eyebrow";
import { StickyCol } from "@/components/ui/StickyCol";
import { cn } from "@/lib/cn";

/**
 * Начало раздела внутренней страницы — то же, что у разделов главной:
 * приглушённая метка и заголовок в размере `h1`, под ним при нужде
 * вводный абзац.
 *
 * Ширина заголовка ограничена `18ch` — запас на случай, если колонка
 * шире, чем самое длинное слово заголовка. Если слово всё равно не
 * помещается (было с «Pflegeberatung» в узкой колонке `aside`,
 * 444px слова против 420px места), дело не в этом пределе — не в
 * ch и не в переносе, а в самой колонке; чинить нужно её, не здесь.
 *
 * `tone="paper"` — для заголовка на фиолетовом поле (Vakanzen на
 * Karriere), тем же приёмом, что у `RuledList`.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  children,
  tone = "ink",
  /**
   * Тег заголовка. По умолчанию `h2` — раздел внутри страницы, у которой
   * `h1` уже стоит в другом месте (хиро). Первый заголовок страницы,
   * у которой нет хиро (Leistungen, Beratung, Kontakt, FAQ, Über uns,
   * Schnellbewerbung), обязан быть ровно одним `h1` на документ —
   * вызывающая страница передаёт `as="h1"` именно туда и только туда.
   */
  as: Tag = "h2",
  className,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  tone?: "ink" | "paper";
  as?: "h1" | "h2";
  className?: string;
}) {
  const onPaper = tone === "paper";

  return (
    <div className={className}>
      <Eyebrow className={onPaper ? "text-white-pure/90" : "text-ink-muted"}>
        {eyebrow}
      </Eyebrow>
      <Tag
        className={cn(
          "mt-2xs max-w-[18ch] text-h1 hyphens-auto",
          onPaper ? "text-white-pure" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {lead ? (
        <p
          className={cn(
            "mt-md max-w-[40ch] text-body",
            onPaper ? "text-white-pure/90" : "text-ink-soft",
          )}
        >
          {lead}
        </p>
      ) : null}
      {children}
    </div>
  );
}

/**
 * Тот же заголовок, закреплённый: стоит на месте, пока справа
 * проезжает список, — как у услуг и диагнозов главной.
 */
export function StickyHeading(props: React.ComponentProps<typeof SectionHeading>) {
  const { className, ...rest } = props;
  return (
    <StickyCol className={cn(className)}>
      <SectionHeading {...rest} />
    </StickyCol>
  );
}
