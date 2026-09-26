/**
 * Типографские блоки для Impressum и Datenschutz.
 *
 * Текст этих двух страниц — юридический документ, а не маркетинговый
 * текст: он сознательно остаётся только на немецком на всех языках
 * сайта (то же самое делал старый сайт — `data-i18n` там стоял только
 * на заголовке страницы, ни разу на теле документа). Переведённая
 * версия юридического текста рискует разойтись с оригиналом по
 * смыслу — единственный безопасный вариант почти всегда один язык
 * оригинала. Меняется только раскладка и токены, не структура текста.
 */

export function LegalH2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-2xl text-h3 text-ink first:mt-0">{children}</h2>;
}

export function LegalH3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-lg text-subhead text-ink">{children}</h3>;
}

export function LegalP({ children }: { children: React.ReactNode }) {
  return <p className="mt-sm text-body text-ink-soft">{children}</p>;
}

export function LegalUl({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-sm flex list-disc flex-col gap-2xs ps-md text-body text-ink-soft">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function LegalMeta({ children }: { children: React.ReactNode }) {
  return <p className="mt-2xl text-meta text-ink-muted">{children}</p>;
}
