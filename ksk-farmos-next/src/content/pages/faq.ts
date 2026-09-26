/**
 * Структурный остаток страницы «FAQ» — тексты (вопросы, ответы, метки
 * категорий) в `messages/<locale>/faq.json`. Здесь только то, что не
 * переводится: id категорий, id/категория и ссылка действия у вопроса.
 * Порядок и индекс должны совпадать с `faq.categories`/`faq.questions`
 * в словаре.
 */

export type Category = "alle" | "pat" | "kost" | "abl" | "kar";

export const categoryIds: readonly Category[] = ["alle", "pat", "kost", "abl", "kar"];

export const questionsMeta: readonly {
  id: string;
  category: Category;
  actionHref?: string;
}[] = [
  { id: "q1", category: "pat", actionHref: "/beratung" },
  { id: "q2", category: "pat" },
  { id: "q3", category: "kost", actionHref: "/beratung" },
  { id: "q4", category: "kost" },
  { id: "q5", category: "abl" },
  { id: "q6", category: "abl" },
  { id: "q7", category: "pat" },
  { id: "q8", category: "kar", actionHref: "/schnellbewerbung" },
  { id: "q9", category: "pat" },
  { id: "q10", category: "kost" },
  { id: "q11", category: "abl" },
];
