import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";

/**
 * 404 внутри языкового сегмента — единственный `not-found.tsx` в
 * проекте, а не файл на каждый раздел: нужное состоит из шапки/футера
 * (уже даёт `[locale]/layout.tsx`, эта страница рендерится внутри него)
 * и текста на языке текущего сегмента.
 *
 * Раньше такого файла не было вовсе — любой битый адрес (опечатка,
 * снятая с индексации страница старого сайта) отдавал стандартную
 * заглушку Next.js: чёрный экран без бренда, шапки и перевода.
 *
 * `notFound.js` не принимает `params` (см. `node_modules/next/dist/docs/
 * .../not-found.md`) — язык для перевода берётся из контекста
 * `next-intl`, который уже установлен `[locale]/layout.tsx` выше по
 * дереву, а не из пропсов. Next сам добавляет `<meta name="robots"
 * content="noindex">` для любой страницы, отданной через `notFound()`
 * (тот же источник) — здесь это не нужно дублировать.
 */
export default async function NotFound() {
  const t = await getTranslations("common.notFound");

  return (
    <section className="pt-[calc(var(--header-h)+var(--spacing-break))] pb-turn">
      <Grid>
        <Col span="text">
          <Eyebrow className="text-ink-muted">{t("eyebrow")}</Eyebrow>
          <h1 className="mt-2xs text-h1 text-ink">{t("title")}</h1>
          <p className="mt-md max-w-[40ch] text-body text-ink-soft">{t("text")}</p>
          <div className="mt-lg">
            <Button href="/" size="lg">
              {t("cta")}
            </Button>
          </div>
        </Col>
      </Grid>
    </section>
  );
}
