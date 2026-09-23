import { cn } from "@/lib/cn";

/**
 * Колонка, которая замирает, пока соседняя проезжает мимо.
 *
 * Это способ отбить раздел движением, а не подложкой: заголовок стоит
 * на месте всё время, пока читается список, и уходит только вместе
 * с разделом. Сделано на `position: sticky` — без скриптов, без
 * замеров и без наблюдателей, поэтому работает и при отключённом JS.
 *
 * Включается только с `lg`: на телефоне закрепление съедает экран.
 */
export function StickyCol({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "lg:sticky lg:top-[calc(var(--header-h)+var(--spacing-2xl))] lg:self-start",
        className,
      )}
    >
      {children}
    </div>
  );
}
