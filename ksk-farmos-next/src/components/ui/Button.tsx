import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "quiet";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  /** Одна на экран. Плоская заливка — никаких градиентов. */
  primary:
    "bg-violet text-white-pure hover:bg-violet-mid active:bg-violet-mid border border-transparent",
  /** Соседствует с primary, не соревнуясь с ней. */
  secondary:
    "bg-transparent text-ink border border-line-strong hover:border-ink hover:bg-surface",
  /** Ссылка, которая ведёт себя как кнопка по цели, но не по весу. */
  quiet:
    "bg-transparent text-ink border border-transparent underline decoration-line-strong underline-offset-4 hover:decoration-ink px-0",
};

const sizes: Record<Size, string> = {
  sm: "text-meta px-xs py-2xs",
  md: "text-ui px-md py-xs",
  lg: "text-ui px-lg py-sm",
};

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type Props = CommonProps &
  (
    | { href: string; type?: never; disabled?: never; onClick?: never }
    | {
        href?: undefined;
        type?: "button" | "submit";
        disabled?: boolean;
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
      }
  );

/**
 * Радиус 2px и отсутствие тени — намеренно: крупное скругление
 * и «свечение» считываются как шаблон конструктора (раздел 4 брифа).
 */
function classes(variant: Variant, size: Size, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2xs rounded-xs font-medium",
    "transition-colors duration-150 ease-out-soft",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    variant === "quiet" ? "py-3xs" : sizes[size],
    className,
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: Props) {
  const cls = classes(variant, size, className);

  if (rest.href !== undefined) {
    const { href } = rest;
    // tel:, mailto: и внешние адреса не проходят через локализованный роутер.
    const isExternal = /^(https?:|tel:|mailto:)/.test(href);

    if (isExternal) {
      const isHttp = href.startsWith("http");
      return (
        <a
          href={href}
          className={cls}
          {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={rest.type ?? "button"}
      disabled={rest.disabled}
      onClick={rest.onClick}
      className={cls}
    >
      {children}
    </button>
  );
}
