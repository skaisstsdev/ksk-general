import { cn } from "@/lib/cn";

/**
 * Цитата. Отбивается вертикальной линией, а не кавычками-картинками
 * и не заливкой: тот же приём, что и у остальных разделителей.
 */
export function Quote({
  children,
  cite,
  className,
}: {
  children: React.ReactNode;
  cite?: string;
  className?: string;
}) {
  return (
    <figure className={cn("border-s-2 border-violet ps-md", className)}>
      <blockquote className="font-serif text-h4 leading-snug text-ink">
        {children}
      </blockquote>
      {cite ? (
        <figcaption className="mt-xs text-meta text-ink-muted">{cite}</figcaption>
      ) : null}
    </figure>
  );
}
