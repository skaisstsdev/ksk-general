import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { ArrowLink } from "@/components/ui/ArrowLink";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrustBar } from "@/components/ui/TrustBar";
import { company, contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

/* ── вспомогательное для этой страницы ─────────────────────── */

function Row({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-sm border-t border-line py-lg lg:grid-cols-[13rem_1fr] lg:gap-lg">
      <div>
        <p className="text-meta font-semibold text-ink">{label}</p>
        {note ? (
          <p className="mt-3xs text-meta text-ink-muted">{note}</p>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Swatch({
  name,
  value,
  contrast,
  usage,
  border,
}: {
  name: string;
  value: string;
  contrast?: string;
  usage: string;
  border?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div
        className={border ? "h-16 border border-line" : "h-16"}
        style={{ backgroundColor: value }}
      />
      <div className="mt-xs flex flex-col gap-3xs">
        <span className="text-meta font-medium text-ink">{name}</span>
        <span className="text-meta tabular-nums text-ink-muted">{value}</span>
        {contrast ? (
          <span className="text-meta tabular-nums text-ink-muted">
            {contrast}
          </span>
        ) : null}
        <span className="mt-3xs text-meta leading-snug text-ink-muted">
          {usage}
        </span>
      </div>
    </div>
  );
}

export default async function StyleguidePage({
  params,
}: PageProps<"/[locale]/styleguide">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Section pause="beat">
        <SectionHeader
          as="h1"
          eyebrow="Etappe 2"
          title="Дизайн-система"
          lead="Всё, из чего собираются страницы. Компоненты не содержат литеральных цветов и размеров — только токены из globals.css."
        />
      </Section>

      {/* ── ЦВЕТ ─────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          eyebrow="01 · Цвет"
          title="Палитра"
          lead="Цвета зафиксированы брифом. Изменилось распределение: фиолетовый — акцент примерно на 3–5% площади, а не заливка."
        />

        <div className="mt-xl grid grid-cols-2 gap-md sm:grid-cols-3 lg:grid-cols-6">
          <Swatch
            name="paper"
            value="#fdfaf7"
            usage="Фон страниц"
            border
          />
          <Swatch name="surface" value="#f6efe9" usage="Чередование секций" />
          <Swatch name="line" value="#e3d8cd" usage="Волосяные разделители" />
          <Swatch
            name="violet"
            value="#6b3fa0"
            contrast="7.1 : 1"
            usage="Ссылки, метки, одна кнопка на экран"
          />
          <Swatch
            name="violet-light"
            value="#9d76d4"
            contrast="3.4 : 1"
            usage="Только границы и плоскости — не текст"
          />
          <Swatch
            name="ink"
            value="#0d0d18"
            contrast="18.6 : 1"
            usage="Заголовки и основной текст"
          />
        </div>

        <div className="mt-2xl border-t border-line pt-lg">
          <Eyebrow>Три правила</Eyebrow>
          <ul className="mt-sm grid gap-md lg:grid-cols-3">
            <li>
              <p className="font-semibold text-ink">Никаких градиентов</p>
              <p className="mt-2xs text-ui text-ink-soft">
                Фиолетовый — плоская заливка или ничего. Именно градиент
                лаванда→индиго и читается как AI-стартап.
              </p>
            </li>
            <li>
              <p className="font-semibold text-ink">
                Разделители вместо теней
              </p>
              <p className="mt-2xs text-ui text-ink-soft">
                Тень в системе ровно одна и предназначена одному элементу
                на экран — тому, что действительно поднят над плоскостью.
              </p>
            </li>
            <li>
              <p className="font-semibold text-ink">
                Текст не лежит на фотографии
              </p>
              <p className="mt-2xs text-ui text-ink-soft">
                Отсюда брались тяжёлые тени и свечение. Текст живёт на
                плашке, фотография — рядом, в своих границах.
              </p>
            </li>
          </ul>
        </div>

        <div className="mt-xl border-s-2 border-violet bg-violet-pale px-md py-sm">
          <p className="text-ui text-ink-soft">
            <span className="font-semibold text-ink">
              Одно отступление от брифа.
            </span>{" "}
            Приглушённый текст задан как{" "}
            <span className="tabular-nums">#6b6b85</span> (4.97 : 1) вместо{" "}
            <span className="tabular-nums">#7a7a94</span> (4.0 : 1) — второй
            не проходит порог WCAG AA для основного текста. На глаз разница
            неразличима, откат — одна строка в{" "}
            <span className="font-medium text-ink">globals.css</span>. Жду
            подтверждения.
          </p>
        </div>
      </Section>

      {/* ── ТИПОГРАФИКА ──────────────────────────────────── */}
      <Section>
        <SectionHeader
          eyebrow="02 · Типографика"
          title="Шкала"
          lead="Playfair Display и Inter, оба self-hosted, плюс Noto для арабицы. Заголовок уменьшен почти вдвое, на уровне h3 — переход с serif на sans."
        />

        <div className="mt-xl">
          <Row
            label="Метка"
            note="Inter 600 · 12px · трекинг .09em"
          >
            <Eyebrow>Häusliche Intensivpflege</Eyebrow>
          </Row>

          <Row
            label="H1"
            note="Playfair 600 · 36→56px. Было: до 83px с JS-подгонкой ширины"
          >
            <p className="font-serif text-h1 text-ink">
              Intensivpflege, die zu Hause funktioniert
            </p>
          </Row>

          <Row label="H2" note="Playfair 600 · 28→36px">
            <p className="font-serif text-h2 text-ink">Wer die Kosten trägt</p>
          </Row>

          <Row
            label="H3"
            note="Inter 600 · 18px — переход на sans"
          >
            <p className="text-subhead text-ink">Trachealkanülenmanagement</p>
          </Row>

          <Row label="Лид" note="Inter 400 · 19px">
            <p className="max-w-prose text-lead text-ink-soft">
              Beatmung, Wachkoma, ALS — rund um die Uhr, bei Ihnen zu Hause
              oder in unserem Wohnprojekt in Kassel.
            </p>
          </Row>

          <Row
            label="Основной текст"
            note="Inter 400 · 17px · строка ≈66 знаков"
          >
            <p className="max-w-prose text-body text-ink-soft">
              Die Kosten für die 24-Stunden-Intensivpflege werden in der Regel
              vollständig von der Krankenkasse und der Pflegekasse übernommen.
              Nach Erhalt einer Vollmacht übernehmen wir die Verhandlungen mit
              den Kostenträgern.
            </p>
          </Row>

          <Row
            label="Многоязычность"
            note="Одна шкала на десять языков и четыре письменности"
          >
            <div className="flex flex-col gap-xs">
              <p className="font-serif text-h2 text-ink">
                Интенсивный уход на дому
              </p>
              <p className="font-serif text-h2 text-ink">
                Yoğun bakım — evinizde
              </p>
              <p className="font-serif text-h2 text-ink" lang="ar" dir="rtl">
                رعاية مركزة في المنزل — 05693 / 9189907
              </p>
              <p className="max-w-prose text-meta text-ink-muted">
                Арабский набран Noto Naskh Arabic — он подключён вторым
                в стеке <span className="text-ink">font-serif</span>, поэтому
                браузер подставляет его поглифно: телефон в той же строке
                остаётся в Inter. Интерлиньяж для арабицы увеличен на 0.24em
                по результату замера высоты знаков, трекинг снят — письмо
                связное.
              </p>
            </div>
          </Row>

          <Row
            label="Смена гарнитуры"
            note="Компоненты знают роли, а не названия"
          >
            <div className="max-w-prose">
              <p className="text-ui text-ink-soft">
                В разметке нет ни одного упоминания Playfair или Inter — только{" "}
                <span className="text-ink">font-serif</span> и{" "}
                <span className="text-ink">font-sans</span>. Замена гарнитуры
                трогает три файла:
              </p>
              <ul className="mt-xs flex flex-col gap-2xs text-ui text-ink-soft">
                <li className="border-s border-line ps-xs">
                  <span className="text-ink">globals.css</span> — два стека
                </li>
                <li className="border-s border-line ps-xs">
                  <span className="text-ink">fonts.css</span> — блоки
                  @font-face
                </li>
                <li className="border-s border-line ps-xs">
                  <span className="text-ink">lib/fonts.ts</span> — карта
                  предзагрузки
                </li>
              </ul>
              <p className="mt-xs text-ui text-ink-soft">
                Файлы названы по семейству и письменности
                (<span className="text-ink">playfair-cyrillic.woff2</span>),
                а не font-0…font-14.
              </p>
            </div>
          </Row>
        </div>
      </Section>

      {/* ── КОМПОНЕНТЫ ───────────────────────────────────── */}
      <Section>
        <SectionHeader
          eyebrow="03 · Компоненты"
          title="Базовый набор"
          lead="Радиус 2px и отсутствие тени — намеренно: крупное скругление считывается как конструктор."
        />

        <div className="mt-xl">
          <Row label="Кнопки" note="primary — одна на экран">
            <div className="flex flex-wrap items-center gap-xs">
              <Button href="/beratung" size="lg">
                Kostenlose Beratung
              </Button>
              <Button href="/schnellbewerbung" variant="secondary" size="lg">
                In 3 Minuten bewerben
              </Button>
              <Button href={contact.phone.href} variant="quiet">
                {contact.phone.display}
              </Button>
            </div>
          </Row>

          <Row label="Размеры" note="sm · md · lg">
            <div className="flex flex-wrap items-center gap-xs">
              <Button href="/kontakt" size="sm">
                Klein
              </Button>
              <Button href="/kontakt" size="md">
                Mittel
              </Button>
              <Button href="/kontakt" size="lg">
                Groß
              </Button>
              <Button disabled>Deaktiviert</Button>
            </div>
          </Row>

          <Row label="Ссылка со стрелкой">
            <ArrowLink href="/ueber-uns">Mehr über uns</ArrowLink>
          </Row>

          <Row
            label="Полоса доверия"
            note="Табличные цифры: столбцы не дышат при смене языка"
          >
            <TrustBar
              items={[
                { value: String(company.foundedYear), label: "gegründet" },
                { value: `~${company.staffCount}`, label: "Fachkräfte" },
                {
                  value: String(company.staffPerPatient).replace(".", ","),
                  label: "Mitarbeiter pro Patient",
                },
                { value: "24/7", label: "erreichbar" },
              ]}
            />
          </Row>

          <Row
            label="Поля ввода"
            note="Граница снизу активна фиолетовым, ошибка — текстом, не цветом рамки"
          >
            <div className="flex max-w-md flex-col gap-sm">
              <label className="flex flex-col gap-2xs">
                <span className="text-meta text-ink-soft">Vorname</span>
                <input
                  type="text"
                  defaultValue="Maria"
                  className="border border-line-strong bg-paper px-xs py-xs text-ui text-ink outline-none transition-colors focus:border-violet"
                />
              </label>
              <label className="flex flex-col gap-2xs">
                <span className="text-meta text-ink-soft">Nachricht</span>
                <textarea
                  rows={3}
                  defaultValue="Mein Vater wird nächste Woche aus der Klinik entlassen."
                  className="resize-y border border-line-strong bg-paper px-xs py-xs text-ui text-ink outline-none transition-colors focus:border-violet"
                />
              </label>
            </div>
          </Row>
        </div>
      </Section>

      {/* ── СЕТКА ────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          eyebrow="04 · Раскладка"
          title="Контейнеры и ритм"
          lead="Ширина страницы 1180px, поля clamp(20px, 5vw, 64px), вертикальный ритм секций clamp(56px, 7vw, 104px)."
        />

        <div className="mt-xl">
          <Row label="max-w-page" note="1180px — общая ширина">
            <div className="border border-dashed border-line-strong bg-surface px-sm py-xs text-meta text-ink-muted">
              Полная ширина контейнера
            </div>
          </Row>
          <Row label="max-w-prose" note="≈66 знаков — предел чтения">
            <div className="max-w-prose border border-dashed border-line-strong bg-surface px-sm py-xs text-meta text-ink-muted">
              Колонка для длинного текста: Impressum, Datenschutz, ответы FAQ
            </div>
          </Row>
        </div>
      </Section>

      <Section pause="beat" contained={false}>
        <Container>
          <p className="text-meta text-ink-muted">
            Этап 2 из 7. Дальше — этап 3: главная страница, приоритет хиро.
          </p>
        </Container>
      </Section>
    </>
  );
}
