import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Rule } from "@/components/ui/Rule";
import { applyCta, primaryCta } from "@/content/navigation";
import { contact } from "@/content/site";

/**
 * Закрывающий разворот: два обращения рядом, без карточек и без подложки.
 * Их разводит вертикальная линейка — она внутри одного блока, поэтому
 * правилу о разделителях не противоречит.
 *
 * Две половины намеренно зеркальны: одинаковые колонки, по три пункта,
 * кнопка и телефон — чтобы ни одна аудитория не читалась как главная.
 * Телефон показан только от `sm`: на мобильном рядом с кнопкой ему негде
 * встать в один ряд не перенося строку (см. историю правок этого файла),
 * а превращать кнопку с телефоном в две строки на телефоне — тот приём,
 * от которого уже один раз отказались. Пунктов у соискателя пять,
 * показываем первые три.
 */
export async function ClosingCta() {
  const t = await getTranslations("home");
  const closingPoints: string[] = t.raw("closing.points");
  const conditions: string[] = t.raw("conditions");
  const phone = (
    <a
      href={contact.phone.href}
      className="hidden text-ui tabular-nums text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-violet sm:inline"
    >
      {contact.phone.display}
    </a>
  );

  return (
    <section id="kontakt" className="pt-turn pb-turn">
      <Grid>
        <Col span="text" className="lg:pe-xl">
          <Eyebrow className="text-ink-muted">{t("doors.family.audience")}</Eyebrow>
          <h2 className="mt-2xs max-w-[13ch] text-h2 text-ink">
            {t("closing.title")}
          </h2>

          <ul className="mt-md">
            {closingPoints.map((c, i) => (
              <li key={c} className="text-ui text-ink-soft">
                <Rule index={i} />
                <span className="block py-2xs">{c}</span>
              </li>
            ))}
            <li aria-hidden="true">
              <Rule index={closingPoints.length} />
            </li>
          </ul>

          <div className="mt-lg flex flex-wrap items-center gap-x-lg gap-y-md">
            <Button href={primaryCta.href} size="lg">
              {t("closing.beratungCta")}
            </Button>
            {phone}
          </div>
        </Col>

        {/* Вертикальная линейка стоит ровно посередине промежутка сетки,
            а не на краю колонки: отступ от неё до текста одинаков
            с обеих сторон. Ниже `lg` колонки идут друг под другом,
            и их разделяет обычная выкатывающаяся линейка. */}
        <Col
          span="text"
          className="relative lg:ps-xl lg:before:absolute lg:before:inset-y-0 lg:before:-start-[calc(var(--spacing-lg)/2)] lg:before:w-px lg:before:bg-line lg:before:content-['']"
        >
          <Rule className="lg:hidden" />
          <div className="pt-lg lg:pt-0">
            <Eyebrow className="text-ink-muted">
              {t("doors.professional.audience")}
            </Eyebrow>
            <h2 className="mt-2xs max-w-[13ch] text-h2 text-ink">
              {t("doors.professional.title")}
            </h2>

            <ul className="mt-md">
              {conditions.slice(0, 3).map((c, i) => (
                <li key={c} className="text-ui text-ink-soft">
                  <Rule index={i} />
                  <span className="block py-2xs">{c}</span>
                </li>
              ))}
              <li aria-hidden="true">
                <Rule index={3} />
              </li>
            </ul>

            <div className="mt-lg flex flex-wrap items-center gap-x-lg gap-y-md">
              <Button href={applyCta.href} variant="secondary" size="lg">
                {t("doors.professional.cta")}
              </Button>
              {phone}
            </div>
          </div>
        </Col>
      </Grid>
    </section>
  );
}
