import { Eyebrow } from "@/components/ui/Eyebrow";
import { StickyCol } from "@/components/ui/StickyCol";
import { cn } from "@/lib/cn";

/**
 * Начало раздела внутренней страницы — то же, что у разделов главной:
 * приглушённая метка и заголовок в размере `h1`, под ним при нужде
 * вводный абзац.
 *
 * `hyphens-auto` — только здесь, а не в базовом слое: немецкие
 * составные слова («Pflegeberatung», «Kostenübernahme») в узкой правой
 * колонке иначе ломаются посреди слова без дефиса. Базовый слой общий
 * с главной, и перенос в нём изменил бы уже выверенные заголовки.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Eyebrow className="text-ink-muted">{eyebrow}</Eyebrow>
      <h2 className="mt-2xs max-w-[14ch] text-h1 text-ink hyphens-auto">
        {title}
      </h2>
      {lead ? (
        <p className="mt-md max-w-[40ch] text-body text-ink-soft">{lead}</p>
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
