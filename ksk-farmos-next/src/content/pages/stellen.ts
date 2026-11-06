/**
 * Вакансии. Порядок совпадает с `karriere.vakanzen.items` в словарях:
 * подпись и теги строки берутся оттуда по индексу, полный текст —
 * из `messages/de/stellen.json` по `slug`.
 *
 * Значения `employmentType` и `baseSalaryPerHour` идут только в разметку
 * `JobPosting`: то, что видит кандидат, написано в словаре. При смене
 * зарплаты менять нужно и здесь, и в обоих словарях (`karriere`, `stellen`).
 */
export const stellen = [
  {
    slug: "pflegefachkraft-intensivpflege",
    employmentType: ["FULL_TIME", "PART_TIME"],
    baseSalaryPerHour: 28,
  },
  {
    slug: "pflegehelfer",
    employmentType: ["FULL_TIME", "PART_TIME"],
  },
  {
    slug: "pflegepraktikum",
    employmentType: ["INTERN"],
  },
] as const satisfies readonly {
  slug: string;
  employmentType: readonly string[];
  baseSalaryPerHour?: number;
}[];

export type StelleSlug = (typeof stellen)[number]["slug"];

/** Дата публикации для `JobPosting`. Меняется только при новой вакансии. */
export const stellenDatePosted = "2026-11-06";

export function isStelleSlug(value: unknown): value is StelleSlug {
  return stellen.some((stelle) => stelle.slug === value);
}
