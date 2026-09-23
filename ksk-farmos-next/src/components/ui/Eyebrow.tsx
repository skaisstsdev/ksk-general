import { cn } from "@/lib/cn";

/** Надзаголовочная метка. Единственное место, где используется uppercase. */
export function Eyebrow({
  children,
  as: Tag = "p",
  className,
}: {
  children: React.ReactNode;
  as?: "p" | "span" | "div";
  className?: string;
}) {
  return (
    <Tag className={cn("text-eyebrow uppercase text-violet", className)}>
      {children}
    </Tag>
  );
}
