# ЗАДАЧА: Создать продающий лендинг intensivpflege.html

Ты получил папку с готовым сайтом KSK Farmos GmbH & Co. KG.
Изучи css/style.css, index.html, beratung.html — это твои референсы по дизайну.
Все фото уже лежат в img/.

Создай ОДИН файл intensivpflege.html в корне папки.

---

## ДИЗАЙН

Полностью идентичен основному сайту:
- Те же CSS переменные и токены из style.css
- Те же компоненты: .hero, .section, .card, .check-list, .form-card, .process-steps
- Те же шрифты: Playfair Display для заголовков, Inter для текста
- Те же цвета: белый фон, фиолетовые акценты, серые секции

Единственные отличия от обычной страницы:
- Нет .nav меню — header содержит только логотип и кнопку звонка
- Нет ссылок на другие страницы сайта кроме Impressum и Datenschutz
- Footer минимальный: логотип + две ссылки

---

## АУДИТОРИЯ И ПСИХОЛОГИЯ

Человек только что кликнул на рекламу.
Это взрослый ребёнок или супруг/супруга тяжелобольного человека.
Он устал. Он напуган. Он не знает с чего начать.
Ему нужно три вещи: убедиться что это правильное место, понять что это бесплатно, и легко связаться.

Каждый элемент страницы должен снимать тревогу и вести к форме.

---

## СТРУКТУРА И СОДЕРЖАНИЕ

### 1. HEADER
Фиксированный, стеклянный (как .header.scrolled).
Слева: логотип с img/logo-icon.png.
Справа: кнопка .btn.btn-primary.btn-sm с текстом "05693 / 9189907" и href="tel:056939189907".
Никакого меню, никаких nav-link.

---

### 2. HERO
Используй тот же .hero с .hero-inner как на index.html.
Светлый фон (белый или off-white) — как на основном сайте.
Левая колонка текст, правая колонка фото 4:5.
Выбери лучшее фото из img/ которое показывает заботу о пациенте.

Заголовок (h1 с em как на index.html):
  Ihr Angehöriger braucht Pflege?
  Wir sind für Sie da.

"Wir sind für Sie da." — em, курсив, фиолетовый.

Подзаголовок (hero-subtitle):
  Kostenlose Erstberatung zur ambulanten Intensivpflege in Nordhessen.
  Wir klären die Finanzierung — die Krankenkasse übernimmt die Kosten.

Кнопки (hero-actions):
- .btn.btn-primary.btn-lg → href="#formular" → "Kostenlose Beratung anfragen"
- .btn.btn-outline.btn-lg → href="tel:056939189907" → "Jetzt anrufen"

Hero-badge (как на index.html):
  "Seit 2013 · Nordhessen"

---

### 3. TRUST BAR
Сразу после hero, узкая полоса на --violet-pale фоне.
Четыре цифры в ряд — большие, serif, фиолетовые:

  2013          5,5              24/7          100%
  Gegründet     Mitarbeiter      Betreuung     Krankenkasse
                pro Patient      täglich       übernimmt

На мобиле: 2×2.

---

### 4. EDITORIAL ACCENT
Как на index.html — большой абзац с border-left фиолетовым.
Класс .editorial-accent уже есть в style.css.

Текст:
  Die Krankenkasse übernimmt die Kosten für die Intensivpflege in der Regel vollständig.
  Wir kümmern uns um die gesamte Kommunikation mit den Kostenträgern —
  Sie müssen sich um nichts kümmern.

---

### 5. SPLIT: ПРЕИМУЩЕСТВА + ФОРМА (id="formular")
Класс .grid-2, белый фон, .section.

Левая колонка:
  section-tag: "Was wir für Sie tun"
  h2: "Wir nehmen Ihnen alles ab"

  check-list (.check-list из style.css):
  - Kostenlose Erstberatung — unverbindlich und persönlich
  - Kostenübernahme durch Krankenkasse — wir übernehmen die Kommunikation
  - Pflege bei Ihnen zu Hause — oder in unserer Einrichtung in Kassel
  - Examinierte Pflegefachkräfte — 5,5 Mitarbeiter pro Patient
  - Rückmeldung innerhalb 24 Stunden — garantiert
  - Versorgung in ganz Hessen — seit 2013

  Под check-list — quote-block:
  "Das Wohl des Patienten ist oberstes Gesetz."
  — Unser Leitbild

  Под quote-block — прямой звонок:
  h4: "Lieber direkt anrufen?"
  Кнопка .btn.btn-outline.btn-lg: "05693 / 9189907"
  Кнопка .btn.btn-outline: "0170 / 7652593 (Mobil)"

Правая колонка — .form-card:
  h3: "Jetzt Beratung anfragen"
  p: "Kostenlos. Unverbindlich. Wir melden uns innerhalb von 24 Stunden."

  Поля формы (data-form="beratung"):
  - Vorname + Nachname в одну строку (.form-row)
  - Telefon (обязательное)
  - E-Mail (необязательное)
  - Textarea "Diagnose oder Situation" (необязательное, 4 строки)
    placeholder: "z.B. Beatmungspatient, suchen häusliche Pflege in Kassel..."
  - Checkbox Datenschutz
  - Кнопка .btn.btn-primary.btn-lg на 100% ширину:
    "Beratung anfragen — kostenlos"

  Под кнопкой мелкий текст:
  "Keine Werbung. Keine Datenweitergabe. DSGVO-konform."

---

### 6. DIAGNOSEN
.section.section-gray
section-tag: "Diagnosen"
h2: "Welche Patienten wir versorgen"

Чипы .diagnose-chip в .diagnosen-row:
Beatmungspatienten · Wachkoma (Apallisches Syndrom) · ALS · Neurologische Erkrankungen · Querschnittslähmung · Schädel-Hirn-Trauma

Под чипами — маленький текст:
"Nicht sicher ob wir helfen können? Rufen Sie uns an — kostenlos und unverbindlich."
Ссылка: href="tel:056939189907"

---

### 7. WIE ES FUNKTIONIERT
.section, белый фон.
section-tag: "So funktioniert es"
h2: "In 3 Schritten zur Versorgung"

.process-steps (класс из style.css):
01 Kostenloses Erstgespräch
   "Wir lernen Ihre Situation kennen — telefonisch oder persönlich."

02 Individuelle Planung
   "Wir erstellen den Pflegeplan und klären die Kostenübernahme mit der Kasse."

03 Versorgungsbeginn
   "Ihr persönliches Pflegeteam beginnt die Betreuung — zuverlässig und menschlich."

---

### 8. ПОВТОРНЫЙ CTA
.section.section-violet (фиолетовый фон как на ueber-uns.html).
Большой заголовок по центру:
h2: "Jetzt kostenlos anfragen"
p: "Wir sind für Sie da — persönlich, schnell und ohne Verpflichtung."

Две кнопки .flex-center:
- .btn.btn-glass-dark.btn-xl → href="#formular" → "Beratung anfragen"
- .btn.btn-glass-dark.btn-lg → href="tel:056939189907" → иконка phone + "05693 / 9189907"

---

### 9. FOOTER
Тёмный фон как .footer на основном сайте.
Слева: логотип + "Intensivpflegedienst in Nordhessen seit 2013"
Справа: только две ссылки — Impressum · Datenschutz
Снизу строка копирайта как на основном сайте.

Никаких колонок навигации. Никаких контактных блоков с несколькими телефонами.

---

### 10. LANG SWITCHER + BACK TO TOP
Скопируй из index.html:
- .lang-float с .lang-float-dropdown (не lang-modal — именно dropdown)
- .back-to-top кнопка

---

## МЕТА-ТЕГИ

title: Häusliche Intensivpflege Nordhessen — KSK Farmos GmbH & Co. KG
description: Kostenlose Beratung zur ambulanten Intensivpflege. Krankenkasse übernimmt die Kosten. Seit 2013 in Nordhessen. Jetzt unverbindlich anfragen.
robots: noindex, nofollow

---

## ТЕХНИЧЕСКИЕ ПРАВИЛА

- data-lucide иконки на всех элементах где они есть на основном сайте
- Все reveal / reveal-left / reveal-right классы на секциях
- Форма: data-form="beratung" — main.js обрабатывает автоматически
- Скролл к #formular: main.js делает это через a[href^="#"]
- Wizard не нужен — только обычная форма
- Не создавать новый CSS файл
- Не трогать другие файлы сайта
