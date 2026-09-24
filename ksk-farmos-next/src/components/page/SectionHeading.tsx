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
  className,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  tone?: "ink" | "paper";
  className?: string;
}) {
  const onPaper = tone === "paper";

  return (
    <div className={className}>
      <Eyebrow className={onPaper ? "text-white-pure/90" : "text-ink-muted"}>
        {eyebrow}
      </Eyebrow>
      <h2
        className={cn(
          "mt-2xs max-w-[18ch] text-h1 hyphens-auto",
          onPaper ? "text-white-pure" : "text-ink",
        )}
      >
        {title}
      </h2>
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
