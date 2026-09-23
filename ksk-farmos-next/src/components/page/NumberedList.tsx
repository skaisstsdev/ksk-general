import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/icons";
import { Rule } from "@/components/ui/Rule";

export type NumberedItem = {
  title: string;
  text?: React.ReactNode;
  href?: string;
};

/**
 * Перечень с линейками и номером в своей узкой колонке — приём списков
 * услуг и диагнозов главной, вынесенный для остальных страниц.
 * Линейки выкатываются по очереди сверху вниз, последняя замыкает список.
 * Строка со ссылкой получает стрелку и фиолетовый заголовок на hover.
 */
export function NumberedList({ items }: { items: readonly NumberedItem[] }) {
  return (
    <ul>
      {items.map((item, i) => {
        const body = (
          <>
            <span className="w-[2ch] shrink-0 text-meta tabular-nums text-ink-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-2xs">
              <h3
                className={
                  item.href
                    ? "text-h3 text-ink transition-colors group-hover:text-violet"
                    : "text-h3 text-ink"
                }
              >
                {item.title}
              </h3>
              {item.text ? (
                <div className="text-ui text-ink-soft">{item.text}</div>
              ) : null}
            </div>
          </>
        );

        return (
          <li key={item.title}>
            <Rule index={i} />
            {item.href ? (
              <Link
                href={item.href}
                className="group flex items-baseline gap-md py-md"
              >
                {body}
                <ArrowRight className="ms-auto size-5 shrink-0 self-start text-violet transition-transform duration-200 ease-out-soft group-hover:translate-x-1 rtl:-scale-x-100" />
              </Link>
            ) : (
              <div className="flex items-baseline gap-md py-md">{body}</div>
            )}
          </li>
        );
      })}
      <li aria-hidden="true">
        <Rule index={items.length} />
      </li>
    </ul>
  );
}
