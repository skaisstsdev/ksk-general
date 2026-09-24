import { CountUp } from "@/components/ui/CountUp";
import { Col, Grid } from "@/components/ui/Grid";
import { intro, stats } from "@/content/home";
import { company } from "@/content/site";

/**
 * Одна крупная фраза после хиро. Не раздел, а переход: объясняет, кто мы,
 * прежде чем начнётся перечисление услуг. Строка не сужена искусственной
 * `max-w` в знаках — ширину держит сама колонка, и это `Col span="wide"`
 * (семь колонок, тот же слот, что и у заголовка хиро), а не обычная
 * `"text"` в шесть: с шестью строка почти не отличалась от прежней
 * с `max-w-[42ch]` — сама колонка была той же ширины, что и упразднённый
 * предел.
 *
 * Справа — не пересказ той же фразы числами (первая версия так и делала:
 * «24/7» и «2 Standorte» дублировали то, что фраза слева уже произносит
 * словами, в одном и том же блоке), а то, что фраза только называет,
 * не подтверждая. Четыре пункта, и у каждого — своя причина стоять
 * именно здесь, а не как попало:
 * — «Team aus examinierten Fachkräften» не называет число — здесь оно
 *   есть: `~30 Mitarbeiter`, дословно из «Rund 30 Mitarbeiter…» (`stats.team`).
 * — «Seit 2013» слева не арифметика — справа то же самое, но посчитанное:
 *   `13 Jahre Erfahrung`.
 * — Сколько ждать от разговора до начала ухода, фраза не говорит вовсе —
 *   это отдельный факт из FAQ: `4–6 Wochen bis Versorgungsbeginn`
 *   (`company.weeksToStart`).
 * — Как быстро отвечаем — тоже нигде рядом не сказано: `24h Rückmeldung`,
 *   готовая формула со страницы «Beratung» (`stats.responseTime`).
 *
 * Числа досчитывают до себя, когда до блока доходят (`CountUp`):
 * очередь та же, что у линеек, — по одному, слева направо и сверху вниз.
 *
 * Оформление — тонкая фиолетовая черта слева от каждого пункта
 * (`border-s border-violet`, не `border-s-2`: акцент, а не рамка).
 * Число набрано тем же гротеском, что и остальной текст (никакого
 * `font-serif` — антиква на четырёх фактах подряд читалась бы уже
 * орнаментом, а не цитатой).
 *
 * Сетка `grid-cols-2` без брейкпоинта — два ряда по два уже на телефоне,
 * а не столбик в четыре: по решению владельца это два ряда всегда,
 * а не только от `sm` и шире (как в похожих сетках `Footer.tsx`/
 * `ServiceList.tsx`/`HesseMap.tsx` — там колонка на телефоне уместна,
 * здесь нет). `lg:items-center` центрирует блок по вертикали
 * относительно фразы слева, а не по верхней строке.
 *
 * `gap-y-xl` между рядами (не `lg`, как в самой сетке страницы) —
 * при `lg` черта одного пункта визуально доходила почти до черты
 * следующего под ним, и пара читалась как один пункт с двумя числами;
 * при `2xl` они, наоборот, разъезжались уже слишком далеко друг от
 * друга для одной смысловой группы.
 */
export function Intro() {
  const items = [
    {
      value: String(new Date().getFullYear() - company.foundedYear),
      label: stats.years,
    },
    {
      value: `~${company.staffCount}`,
      label: stats.team,
    },
    {
      value: `${company.weeksToStart[0]}–${company.weeksToStart[1]}`,
      label: stats.weeksToStart,
    },
    {
      value: "24h",
      label: stats.responseTime,
    },
  ];

  return (
    <section className="pt-break">
      <Grid className="lg:items-center">
        <Col span="wide">
          <p className="text-h3 leading-snug text-ink">{intro.text}</p>
        </Col>

        <Col span="aside" className="grid grid-cols-2 gap-x-lg gap-y-xl">
          {items.map((item, i) => (
            <div key={item.label} className="border-s border-violet ps-md">
              <p className="text-h3 text-ink tabular-nums">
                <CountUp value={item.value} index={i} />
              </p>
              <p className="mt-3xs text-ui text-ink-muted">{item.label}</p>
            </div>
          ))}
        </Col>
      </Grid>
    </section>
  );
}
