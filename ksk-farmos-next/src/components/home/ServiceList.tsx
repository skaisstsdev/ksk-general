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
 * Заголовок закреплён и стоит на месте, пока справа проезжает список —
 * тем же приёмом, что и раньше. Кадр во весь экран, который раньше
 * закрывал этот раздел, стоит отдельным блоком (`Moment`) после
 * вводной фразы.
 *
 * **Исключение из двух правил, по прямому решению владельца.**
 * Раздел закрашен фиолетовым (`bg-violet`) во всю ширину экрана —
 * то самое «подложка не разделяет блоки», от которого уводит бриф,
 * здесь нарушено намеренно и точечно, не как общий приём (см. тот же
 * разбор на `/leistungen#kosten`). Здесь же — единственное место,
 * где меняется уже сданная и выверенная главная: решение принято
 * отдельно и после того, как главная была подтверждена готовой.
 *
 * Текст — `white-pure`, как и на кнопках и на фиолетовой плашке
 * Leistungen: 7.4:1 у заголовка и заголовков строк, не ниже 4.9:1
 * у приглушённых через прозрачность (номер, описание). Линейки — тона
 * `paper`, а не `ink`: на фиолетовом поле тёмная линия не видна.
 * Стрелка и заголовок строки при наведении раньше меняли цвет на
 * фиолетовый — на фиолетовом поле это исчезающая подсказка, поэтому
 * обратная связь при наведении теперь — подчёркивание, а не цвет.
 */
export function ServiceList() {
  return (
    <section id="leistungen" className="pt-break">
      <div className="bg-violet">
        <Grid className="py-2xl lg:py-3xl">
          <Col span="text">
            <StickyCol>
              <Eyebrow className="text-white-pure/90">{services.eyebrow}</Eyebrow>
              <h2 className="mt-2xs text-h1 text-white-pure">{services.title}</h2>
            </StickyCol>
          </Col>

          <Col span="aside">
            {/* Линейки выкатываются по очереди сверху вниз — этим список
                и открывается, без появления самих строк */}
            <ul>
              {services.items.map((item, i) => (
                <li key={item.href}>
                  <Rule index={i} tone="paper" />
                  <Link
                    href={item.href}
                    className="group flex items-baseline gap-md py-md transition-colors"
                  >
                    {/* Номер — своя узкая колонка: заголовок и подпись
                        начинаются с одной вертикали, а не подпись под номером */}
                    <span className="w-[2ch] shrink-0 text-meta tabular-nums text-white-pure/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex flex-col gap-2xs">
                      <span className="text-h3 text-white-pure underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-white-pure/50">
                        {item.title}
                      </span>
                      <span className="text-ui text-white-pure/85">{item.text}</span>
                    </span>
                    <ArrowRight className="ms-auto size-5 shrink-0 self-start text-white-pure transition-transform duration-200 ease-out-soft group-hover:translate-x-1 rtl:-scale-x-100" />
                  </Link>
                </li>
              ))}
              <li aria-hidden="true">
                <Rule index={services.items.length} tone="paper" />
              </li>
            </ul>
          </Col>
        </Grid>
      </div>
    </section>
  );
}
