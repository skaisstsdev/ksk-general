import { getTranslations } from "next-intl/server";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Rule } from "@/components/ui/Rule";
import { StickyCol } from "@/components/ui/StickyCol";

/**
 * «Кого мы обслуживаем» — первый вопрос семьи: берёте ли вы такой случай.
 * Диагнозы названы прямо, а не спрятаны за «schwerste Erkrankungen».
 *
 * Заголовок закреплён: он держится, пока читается весь перечень.
 */
export async function Diagnoses() {
  const t = await getTranslations("home.diagnoses");
  const items: { title: string; text: string }[] = t.raw("items");

  return (
    <section id="krankheitsbild" className="pt-turn">
      <Grid>
        <Col span="text">
          <StickyCol>
            <Eyebrow className="text-ink-muted">{t("eyebrow")}</Eyebrow>
            <h2 className="mt-2xs max-w-[12ch] text-h1 text-ink">
              {t("title")}
            </h2>
          </StickyCol>
        </Col>

        <Col span="aside">
          {/* Те же линейки, что в списке услуг: приём один на весь сайт */}
          <ul>
            {items.map((item, i) => (
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
              <Rule index={items.length} />
            </li>
          </ul>
        </Col>
      </Grid>
    </section>
  );
}
