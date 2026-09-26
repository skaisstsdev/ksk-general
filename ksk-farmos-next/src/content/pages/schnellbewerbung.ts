/**
 * Структурный остаток страницы «Schnellbewerbung» — тексты в
 * `messages/<locale>/schnellbewerbung.json`. Значения полей формы —
 * то, что реально уходит в заявку, а не то, что видит соискатель
 * (подписи — `form.*Options[i]` в словаре, по индексу).
 */
export const qualifikationValues = ["exam", "alten", "helfer", "student", "sonstiges"] as const;
export const erfahrungValues = ["0", "1-2", "3-5", "5+"] as const;
export const fuehrerscheinValues = ["ja", "nein"] as const;
