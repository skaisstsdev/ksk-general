/**
 * Проверка шкалы.
 *
 * Ловит то, за чем невозможно уследить глазами: размер или отступ,
 * взятый мимо токенов. Раньше в разметке жили 51 разное значение
 * отступов и `text-[0.9375rem]` двадцать пять раз — ровно потому,
 * что нарушение ничем не отличалось от нормы.
 *
 * Запуск: npm run check:scale
 */
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";

const FILES = globSync("src/**/*.tsx");

const RULES = [
  {
    id: "произвольный размер шрифта",
    re: /\btext-\[[^\]]+\]/g,
    hint: "используйте ступень: text-eyebrow · caption · meta · ui · body · lead · subhead · h4 · h3 · h2 · h1",
    // цвет в той же записи ловится следующим правилом
    skip: (m) => /^text-\[(#|rgb|hsl|oklch|var)/.test(m),
  },
  {
    id: "цвет мимо палитры",
    re: /\b(text|bg|border|fill|stroke|decoration)-\[(#|rgb|hsl|oklch)[^\]]*\]/g,
    hint: "используйте токен: ink · ink-soft · ink-muted · violet · line · surface · paper · critical · success",
  },
  {
    id: "размер шрифта мимо шкалы",
    re: /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/g,
    hint: "числовые ступени Tailwind не используются — берите роль из шкалы проекта",
  },
  {
    id: "отступ мимо шкалы",
    re: /\b(m|p)(t|b|s|e|x|y)?-\d+(\.\d+)?\b/g,
    hint: "используйте 3xs 2xs xs sm md lg xl 2xl 3xl 4xl (нулевой отступ -0 разрешён)",
    skip: (m) => /-0$/.test(m),
  },
  {
    id: "gap мимо шкалы",
    re: /\bgap(-x|-y)?-\d+(\.\d+)?\b/g,
    hint: "используйте 3xs 2xs xs sm md lg xl 2xl 3xl 4xl",
    skip: (m) => /-0$/.test(m),
  },
  {
    id: "дробный размер иконки",
    re: /\bsize-\d+\.\d+\b/g,
    hint: "иконки только целыми ступенями: size-4 · size-5 · size-6",
  },
  {
    id: "подложка как разделитель",
    re: /\bbg-(paper|surface|sunken)\b/g,
    hint: "смена фона не разделяет блоки — разделяют пауза, выключка и масштаб (см. Section)",
    // ловим только фон, поставленный на саму секцию
    skipLine: (line) => !/<section|<Section/.test(line),
  },
  {
    id: "разделитель между блоками",
    re: /\bdivide-[xy]\b/g,
    hint: "линейка работает внутри блока, но не между блоками — и divide-* уже один раз молча не сработал",
  },
  {
    id: "сетка мимо примитива",
    re: /\bgrid-cols-12\b|\bcol-start-\d+\b/g,
    hint: "двенадцатиколоночная сетка живёт только в Grid.tsx — иначе промежутки и вертикали разъезжаются",
    skipFile: (f) => f.endsWith("Grid.tsx"),
  },
  {
    id: "брейкпоинт md",
    re: /\bmd:[a-z[]/g,
    hint: "в проекте два перелома: sm (списки в две колонки) и lg (десктопная композиция)",
    // `md:` в начале строки — ключ объекта (размер кнопки), а не брейкпоинт
    skipLine: (line) => /^\s*(sm|md|lg):\s/.test(line),
  },
];

let problems = 0;
for (const file of FILES) {
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  for (const rule of RULES) {
    if (rule.skipFile?.(file)) continue;
    lines.forEach((line, i) => {
      // комментарии не проверяем: в них специально цитируются старые значения
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
      if (rule.skipLine?.(line)) return;
      for (const m of line.matchAll(rule.re)) {
        if (rule.skip?.(m[0])) continue;
        problems++;
        console.log(`${file}:${i + 1}  ${m[0]}  — ${rule.id}`);
        console.log(`    ${rule.hint}`);
      }
    });
  }
}

if (problems) {
  console.log(`\n✗ нарушений шкалы: ${problems}`);
  process.exit(1);
}
console.log(`✓ шкала соблюдена — проверено файлов: ${FILES.length}`);
