import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Rule } from "@/components/ui/Rule";
import { StickyCol } from "@/components/ui/StickyCol";
import { diagnoses } from "@/content/home";

/**
 * «Кого мы обслуживаем» — первый вопрос семьи: берёте ли вы такой случай.
 * Диагнозы названы прямо, а не спрятаны за «schwerste Erkrankungen».
 *
 * Заголовок закреплён: он держится, пока читается весь перечень.
 */
export function Diagnoses() {
  return (
    <section id="krankheitsbild" className="pt-turn">
      <Grid>
        <Col span="text">
          <StickyCol>
            <Eyebrow className="text-ink-muted">{diagnoses.eyebrow}</Eyebrow>
            <h2 className="mt-2xs max-w-[12ch] text-h1 text-ink">
              {diagnoses.title}
            </h2>
          </StickyCol>
        </Col>

        <Col span="aside">
          {/* Те же линейки, что в списке услуг: приём один на весь сайт */}
          <ul>
            {diagnoses.items.map((item, i) => (
              <li key={item.title}>
                <Rule index={i} />
                <div className="flex items-baseline gap-md py-md">
                  {/* Та же колонка номера, что в списке услуг */}
                  <span className="w-[2ch] shrink-0 text-meta tabular-nums text-ink-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2xs">
                    <h3 className="text-h3 text-ink">{item.title}</h3>
                    <p className="text-ui text-ink-soft">{item.text}</p>
                  </div>
                </div>
              </li>
            ))}
            <li aria-hidden="true">
              <Rule index={diagnoses.items.length} />
            </li>
          </ul>
        </Col>
      </Grid>
    </section>
  );
}
