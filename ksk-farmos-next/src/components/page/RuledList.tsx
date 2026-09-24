import { Rule } from "@/components/ui/Rule";
import { cn } from "@/lib/cn";

/**
 * Короткие пункты под линейками — как перечни в закрывающем развороте
 * главной. Без галочек и значков: строка отбита линейкой, и этого
 * достаточно — иконка на каждом пункте читалась бы шаблоном.
 *
 * `tone="paper"` — для текста на фиолетовом поле (Wohnprojekte на
 * Leistungen): линейка и текст светлеют, как у `Rule`.
 */
export function RuledList({
  items,
  title,
  tone = "ink",
  className,
}: {
  items: readonly string[];
  /** Подпись группы над списком. */
  title?: string;
  tone?: "ink" | "paper";
  className?: string;
}) {
  const onPaper = tone === "paper";

  return (
    <div className={className}>
      {title ? (
        <h3 className={cn("text-subhead", onPaper ? "text-white-pure" : "text-ink")}>
          {title}
        </h3>
      ) : null}
      <ul className={title ? "mt-xs" : undefined}>
        {items.map((item, i) => (
          <li
            key={item}
            className={cn("text-ui", onPaper ? "text-white-pure/90" : "text-ink-soft")}
          >
            <Rule index={i} tone={onPaper ? "paper" : "ink"} />
            <span className="block py-2xs">{item}</span>
          </li>
        ))}
        <li aria-hidden="true">
          <Rule index={items.length} tone={onPaper ? "paper" : "ink"} />
        </li>
      </ul>
    </div>
  );
}
