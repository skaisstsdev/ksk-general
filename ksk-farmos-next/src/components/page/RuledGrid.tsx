import { Rule } from "@/components/ui/Rule";

/**
 * Равноправные пункты сеткой — устройство шагов главной (`Steps`),
 * но без номеров: здесь нет последовательности, и номер соврал бы.
 * Над каждым пунктом своя линейка, выкатываются по очереди.
 * Колонок три от `lg`, две от `sm`, на телефоне — столбик.
 */
export function RuledGrid({
  items,
}: {
  items: readonly { title: string; text: string }[];
}) {
  return (
    <ul className="grid gap-x-lg gap-y-xl sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <li key={item.title} className="flex flex-col gap-2xs">
          <Rule index={i % 3} />
          <h3 className="mt-md text-subhead text-ink">{item.title}</h3>
          <p className="text-ui text-ink-soft">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
