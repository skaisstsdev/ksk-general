import { cn } from "@/lib/cn";
import { Container } from "./Container";

type Pause = "beat" | "break" | "turn";

type Props = {
  children: React.ReactNode;
  /**
   * Величина паузы перед блоком.
   *
   * `beat`  — смена темы внутри одного разговора
   * `break` — новый раздел
   * `turn`  — смена интонации (от семьи к соискателю)
   */
  pause?: Pause;
  /** `false` — секция сама управляет шириной (полоса во всю ширину). */
  contained?: boolean;
  id?: string;
  className?: string;
};

const pauses: Record<Pause, string> = {
  beat: "pt-beat",
  break: "pt-break",
  turn: "pt-turn",
};

/**
 * Блок страницы.
 *
 * Здесь больше нет ни `tone`, ни `divided` — и это главное правило
 * грамматики: **смена подложки не разделяет блоки**. Страница живёт
 * на одном поле, а границу задают пауза, смена выключки и масштаб.
 *
 * Линейка остаётся внутриблочным инструментом (таблица, список),
 * но между блоками не ставится. Запрет проверяется `npm run check:scale`.
 */
export function Section({
  children,
  pause = "break",
  contained = true,
  id,
  className,
}: Props) {
  return (
    <section id={id} className={cn(pauses[pause], className)}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
