import { cn } from "@/lib/cn";
import { Rule } from "./Rule";

export type TrustItem = { value: string; label: string };

/**
 * Полоса сигналов доверия. Числа набираются табличными цифрами,
 * чтобы столбцы не «дышали» при смене языка.
 */
export function TrustBar({
  items,
  className,
}: {
  items: TrustItem[];
  className?: string;
}) {
  return (
    <dl className={cn("flex flex-wrap", className)}>
      <Rule className="basis-full" />
      {items.map((item) => (
        <div
          key={item.label}
          // Разделители рисуются явной границей, а не `divide-x`:
          // логические границы и flex-wrap вместе ведут себя непредсказуемо.
          className="border-s border-line py-sm pe-md ps-md first:border-s-0 first:ps-0"
        >
          <dt className="sr-only">{item.label}</dt>
          <dd className="flex flex-col">
            <span className="font-serif text-h4 leading-tight text-ink tabular-nums">
              {item.value}
            </span>
            <span className="text-meta text-ink-muted">{item.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
