import { cn } from "@/lib/cn";

/**
 * Итог отправки — заменяет форму, а не всплывает поверх неё: тот же
 * приём, что в старом сайте (карточка формы сменялась текстом),
 * но набран без `innerHTML`, обычным React-состоянием.
 */
export function FormStatus({
  tone,
  title,
  text,
}: {
  tone: "success" | "error";
  title: string;
  text: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "rounded-xs border px-md py-lg text-center",
        tone === "success"
          ? "border-success/30 bg-success/5"
          : "border-critical/30 bg-critical/5",
      )}
    >
      <p
        className={cn(
          "text-h4",
          tone === "success" ? "text-success" : "text-critical",
        )}
      >
        {title}
      </p>
      <p className="mt-2xs text-ui text-ink-soft">{text}</p>
    </div>
  );
}
