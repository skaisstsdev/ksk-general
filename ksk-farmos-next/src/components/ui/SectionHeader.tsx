import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

/**
 * Шапка секции. Выравнивание по левому краю — по умолчанию:
 * центрированный текст на всю ширину читается медленнее и
 * был одной из причин «шаблонного» вида старого сайта.
 */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-xs", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag
        className={cn(
          "font-serif text-ink",
          Tag === "h1" ? "text-h1" : "text-h2",
        )}
      >
        {title}
      </Tag>
      {lead ? (
        <p className="max-w-prose text-lead text-ink-soft">{lead}</p>
      ) : null}
    </header>
  );
}
