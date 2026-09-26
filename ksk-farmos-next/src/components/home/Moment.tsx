import { getTranslations } from "next-intl/server";

import { ArrowLink } from "@/components/ui/ArrowLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ExpandingPhoto } from "@/components/ui/ExpandingPhoto";

/**
 * Кадр, который раскрывается на весь экран, — с текстом о том, что
 * тяжёлый диагноз не значит клинику. Стоит между вводной фразой
 * и списком диагнозов: сначала «кто мы», потом образ, потом «кого
 * берём». Единственный такой блок на странице — второй превратил бы
 * приём в эффект.
 */
export async function Moment() {
  const t = await getTranslations("home.moment");
  return (
    /* Без верхнего отступа: кадр стоит по центру сцены высотой в экран,
       и до закрепления над ним и так остаётся воздух — пауза заложена
       в самой механике, добавлять её сверху не нужно. */
    <section>
      <ExpandingPhoto
        src="/img/home/spaziergang.webp"
        width={2488}
        height={1487}
        srcNarrow="/img/home/spaziergang-hoch.webp"
        widthNarrow={1000}
        heightNarrow={1502}
        alt={t("alt")}
      >
        <div className="flex max-w-[34rem] flex-col gap-xs">
          <Eyebrow className="text-paper/85">{t("eyebrow")}</Eyebrow>
          <h3 className="text-h2 text-paper">{t("title")}</h3>
          <p className="text-body text-paper/90 lg:text-lead">{t("text")}</p>
          <ArrowLink
            href="/leistungen#haeuslich"
            className="mt-xs text-paper decoration-paper/40 hover:decoration-paper"
          >
            {t("cta")}
          </ArrowLink>
        </div>
      </ExpandingPhoto>
    </section>
  );
}
