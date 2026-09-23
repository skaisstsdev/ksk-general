import { Rule } from "@/components/ui/Rule";

/**
 * Короткие пункты под линейками — как перечни в закрывающем развороте
 * главной. Без галочек и значков: строка отбита линейкой, и этого
 * достаточно — иконка на каждом пункте читалась бы шаблоном.
 */
export function RuledList({
  items,
  title,
  className,
}: {
  items: readonly string[];
  /** Подпись группы над списком. */
  title?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {title ? <h3 className="text-subhead text-ink">{title}</h3> : null}
      <ul className={title ? "mt-xs" : undefined}>
        {items.map((item, i) => (
          <li key={item} className="text-ui text-ink-soft">
            <Rule index={i} />
            <span className="block py-2xs">{item}</span>
          </li>
        ))}
        <li aria-hidden="true">
          <Rule index={items.length} />
        </li>
      </ul>
    </div>
  );
}
