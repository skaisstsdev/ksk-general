import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/icons";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Rule } from "@/components/ui/Rule";
import { StickyCol } from "@/components/ui/StickyCol";
import { services } from "@/content/home";

/**
 * Услуги.
 *
 * Заголовок закреплён и стоит на месте, пока справа проезжает список, —
 * этим раздел и отбит, без смены подложки. Кадр во весь экран,
 * который раньше закрывал этот раздел, стоит отдельным блоком
 * (`Moment`) после вводной фразы.
 */
export function ServiceList() {
  return (
    <section id="leistungen" className="pt-break">
      <Grid>
        <Col span="text">
          <StickyCol>
            <Eyebrow className="text-ink-muted">{services.eyebrow}</Eyebrow>
            <h2 className="mt-2xs text-h1 text-ink">{services.title}</h2>
          </StickyCol>
        </Col>

        <Col span="aside">
          {/* Линейки выкатываются по очереди сверху вниз — этим список
              и открывается, без появления самих строк */}
          <ul>
            {services.items.map((item, i) => (
              <li key={item.href}>
                <Rule index={i} />
                <Link
                  href={item.href}
                  className="group flex items-baseline gap-md py-md transition-colors"
                >
                  {/* Номер — своя узкая колонка: заголовок и подпись
                      начинаются с одной вертикали, а не подпись под номером */}
                  <span className="w-[2ch] shrink-0 text-meta tabular-nums text-ink-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-2xs">
                    <span className="text-h3 text-ink transition-colors group-hover:text-violet">
                      {item.title}
                    </span>
                    <span className="text-ui text-ink-soft">{item.text}</span>
                  </span>
                  <ArrowRight className="ms-auto size-5 shrink-0 self-start text-violet transition-transform duration-200 ease-out-soft group-hover:translate-x-1 rtl:-scale-x-100" />
                </Link>
              </li>
            ))}
            <li aria-hidden="true">
              <Rule index={services.items.length} />
            </li>
          </ul>
        </Col>
      </Grid>
    </section>
  );
}
