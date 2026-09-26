/**
 * Структурный остаток страницы «Über uns» — тексты в
 * `messages/<locale>/ueberUns.json`. Собственные имена команды не
 * переводятся ни на один язык (перенесены из разметки старого сайта
 * дословно) — `null` у четвёртого места означает generic-запись
 * («Unser Pflegeteam»/«Our care team»…), чьё имя, наоборот, приходит
 * из словаря. Порядок и индекс должны совпадать с `team.members`
 * в словаре.
 */
export const teamMemberNames: readonly (string | null)[] = [
  "Viktor Beresnev",
  "Olga Korp",
  "Lidia Zimmermann",
  null,
];
