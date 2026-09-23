import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { ArrowRight } from "./icons";

/** Текстовая ссылка со стрелкой. Стрелка сдвигается на hover — единственная микроанимация в наборе. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2xs text-ui font-medium text-violet",
        "underline decoration-violet/30 underline-offset-4 transition-colors hover:decoration-violet",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100" />
    </Link>
  );
}
