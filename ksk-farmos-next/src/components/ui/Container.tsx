import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  /** `prose` сужает колонку до ≈66 знаков — предел комфортного чтения. */
  width?: "page" | "prose";
  className?: string;
};

export function Container({ children, width = "page", className }: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-gutter",
        width === "page" ? "max-w-page" : "max-w-prose",
        className,
      )}
    >
      {children}
    </div>
  );
}
