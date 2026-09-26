import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { contact } from "@/content/site";
import { RuledList } from "./RuledList";

/**
 * Закрывающий разворот внутренней страницы.
 *
 * В старом сайте здесь стояла фиолетовая карточка с заливкой
 * (`cta-card-violet`) — ровно тот приём, от которого бриф уводит:
 * фиолетовый как заливка вместо акцента. Здесь — устройство
 * закрывающего разворота главной (`ClosingCta`), но для одной
 * аудитории: обращение слева, пункты и действие справа, телефон
 * рядом с кнопкой. Телефон показан только от `sm`: на мобильном
 * рядом с кнопкой ему негде встать в один ряд не перенося строку.
 * Никакой подложки — конец страницы задаёт пауза.
 */
export function PageClosing({
  eyebrow,
  title,
  text,
  points,
  action,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  points?: readonly string[];
  action: { href: string; label: string; variant?: "primary" | "secondary" };
}) {
  return (
    <section className="pt-turn pb-turn">
      <Grid className="lg:items-end">
        <Col span="text">
          <Eyebrow className="text-ink-muted">{eyebrow}</Eyebrow>
          <h2 className="mt-2xs max-w-[14ch] text-h1 text-ink">{title}</h2>
          {text ? (
            <p className="mt-md max-w-[36ch] text-lead text-ink-soft">{text}</p>
          ) : null}
        </Col>

        <Col span="aside">
          {points ? <RuledList items={points} /> : null}

          <div className="mt-lg flex flex-wrap items-center gap-x-lg gap-y-md">
            <Button
              href={action.href}
              variant={action.variant ?? "primary"}
              size="lg"
            >
              {action.label}
            </Button>
            <a
              href={contact.phone.href}
              className="hidden text-ui tabular-nums text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-violet sm:inline"
            >
              {contact.phone.display}
            </a>
          </div>
        </Col>
      </Grid>
    </section>
  );
}
