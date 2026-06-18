# ЗАДАЧА: Создать лендинг jobs.html для медработников

В папке проекта уже есть готовый лендинг intensivpflege.html — это лендинг для пациентов.
Изучи его полностью: структуру, CSS классы, inline стили, компоненты, анимации.
Твоя задача — сделать jobs.html который выглядит АБСОЛЮТНО ИДЕНТИЧНО по стилю и качеству,
но весь контент заменён на привлечение медработников.

Копируй структуру блок за блоком, меняй только тексты, иконки и логику контента.

---

## АУДИТОРИЯ

Медработник. Уже работает где-то, но хочет лучше.
Смотрит с телефона после смены.
Главные вопросы: сколько платят, есть ли машина, легко ли подать заявку.
Не хочет писать резюме и сопроводительное письмо.

---

## СТРУКТУРА — копируй из intensivpflege.html, меняй контент

### 1. HEADER
Идентичен. Только кнопка справа:
- Текст: "Jetzt bewerben"
- href: "#bewerbung"
- Класс: btn btn-primary btn-sm

### 2. HERO
Та же структура hero-cutout, те же классы, те же анимации.
Фото: используй лучшее фото медработника из img/ — photo-nurse-iv.jpg или photo-nurse-device.jpg.

Заголовок h1:
  Arbeiten, wo es
  wirklich zählt.

"wirklich zählt." — em, курсив, фиолетовый — точно как в intensivpflege.html.

Подзаголовок:
  Übertarifliche Bezahlung, Firmenwagen und ein Team auf das Sie sich verlassen können.
  Bewerbung in 2 Minuten — kein Anschreiben, kein Lebenslauf.

Кнопки:
- btn-primary btn-lg → href="#bewerbung" → "Jetzt bewerben"
- btn-outline btn-lg → href="#stellen" → "Offene Stellen ansehen"

### 3. TRUST BAR
Та же полоса на --violet-pale, те же 4 цифры:
- 2013 · Gegründet
- 30+ · Mitarbeiter im Team
- 24/7 · Einsatz möglich
- 100% · Weiterbildung finanziert

### 4. EDITORIAL ACCENT
Та же карточка по центру с иконкой и курсивным текстом.
Иконка: trending-up

Текст:
  Wir zahlen deutlich über Tarif — weil gute Pflege faire Bezahlung verdient.
  Dazu Firmenwagen, bezahlte Weiterbildungen und ein Team das wirklich zusammenhält.

### 5. SPLIT: ПРЕИМУЩЕСТВА + ФОРМА (id="bewerbung")
Левая колонка — те же классы что в intensivpflege.html:

section-tag: "Warum KSK Farmos?"
h2: "Was wir Ihnen bieten"

check-list (6 пунктов):
- Übertarifliche Vergütung — sofort ab Vertragsbeginn
- Firmenwagen — auch zur privaten Nutzung ab dem ersten Tag
- Bezahlte Weiterbildungen — durch Fachärzte, während der Arbeitszeit
- Flexible Arbeitszeiten — Vollzeit, Teilzeit oder Minijob
- 30 Tage Urlaub
- Kollegiales Team — über 30 Mitarbeiter, kein Einzelkämpfer

Quote block (та же карточка что в intensivpflege.html):
  "Egal woher Sie kommen — wir freuen uns auf Sie."
  — Unser Versprechen

Телефонный блок (та же карточка):
  h4: "Lieber direkt anrufen?"
  Кнопки: 05693 / 9189907 и 0170 / 7652593

Правая колонка — WIZARD вместо обычной формы.
Скопируй структуру wizard из schnellbewerbung.html который есть в папке сайта:
wizard-steps, wizard-dot, wizard-line, wizard-panel, wizardNext().

Карточка формы та же .form-card с теми же стилями что в intensivpflege.html.

h3: "Schnellbewerbung"
p: "Kein Anschreiben. Kein Lebenslauf. In 3 Schritten zum neuen Job."

Шаг 1 "Persönliche Daten":
  Vorname + Nachname (form-row)
  E-Mail + Telefon (form-row)
  Кнопка 100% ширина → wizardNext(2) → "Weiter"

Шаг 2 "Qualifikation":
  Select Qualifikation: Examinierte Pflegefachkraft / Altenpfleger / Pflegehelfer / Medizinstudent / Sonstiges
  Select Erfahrung: Keine / 1-2 Jahre / 3-5 Jahre / Über 5 Jahre
  Select Führerschein B: Ja / Nein
  Select Arbeitszeit: Vollzeit / Teilzeit / Minijob / Flexibel
  Кнопки: Zurück | Weiter →

Шаг 3 "Fast geschafft":
  Textarea Nachricht (optional) 4 строки
  Checkbox Datenschutz
  Кнопки: Zurück | "Bewerbung absenden" с иконкой send

Под формой мелко: "Ihre Daten sind sicher. Keine Weitergabe an Dritte."

data-form="schnellbewerbung" на форме.

### 6. OFFENE STELLEN (id="stellen")
Вместо секции DIAGNOSEN — секция с вакансиями.
Те же классы section section-gray, та же структура section-header centered.

section-tag: "Stellenangebote"
h2: "Wir suchen Sie"

Используй .vacancy-list и .vacancy-item из style.css — они там есть.

3 вакансии:
1. Examinierte Pflegefachkraft (w/m/d)
   Теги: Vollzeit / Teilzeit · Intensivpflege · Hessen · Führerschein B
   Кнопка → #bewerbung

2. Pflegehelfer / Altenpfleger (w/m/d)
   Теги: Vollzeit / Teilzeit · Intensivpflege · Hessen
   Кнопка → #bewerbung

3. Medizinstudenten — Pflegepraktikum
   Теги: Praktikum · Medizin / Pflege
   Кнопка → #bewerbung

Под списком — та же карточка editorial что в intensivpflege.html:
Иконка: mail
Текст курсивом:
  "Ihren Wunschjob nicht dabei? Schreiben Sie uns trotzdem —
  wir finden gemeinsam eine Lösung."

### 7. WIE ES FUNKTIONIERT
Та же секция process-steps, те же классы и анимации.

section-tag: "So einfach geht es"
h2: "3 Schritte bis zum neuen Job"

01 Formular ausfüllen
   "2 Minuten. Kein Lebenslauf, kein Anschreiben — versprochen."

02 Persönliches Gespräch
   "Wir melden uns innerhalb von 24 Stunden — entspannt und auf Augenhöhe."

03 Willkommen im Team
   "Einarbeitung, Schulungen und ein Team das Sie von Anfang an unterstützt."

### 8. CTA СЕКЦИЯ
Идентична intensivpflege.html — section section-violet, та же анимация градиента.

h2: "Ihr nächster Schritt wartet"
p: "Bewerben Sie sich jetzt — schnell, einfach und ohne Verpflichtung."

Кнопки:
- btn-glass-dark btn-xl → href="#bewerbung" → "Jetzt bewerben"
- btn-glass-dark btn-lg → href="tel:056939189907" → иконка phone + "05693 / 9189907"

### 9. MORE INFO SECTION
Идентична intensivpflege.html — та же карточка, тот же стиль, та же анимация иконки.

h2: "Erfahren Sie mehr über uns"
p: "Besuchen Sie unsere Hauptseite für ausführliche Informationen zu unserem Team, unseren Leistungen und unserer Philosophie."
Кнопка → href="https://ksk-farmos.vercel.app" target="_blank" → "Zur Hauptseite →"

### 10. FOOTER
Идентичен intensivpflege.html.
Текст под логотипом: "Wir wachsen — kommen Sie mit."

### 11. LANG SWITCHER + BACK TO TOP + JS
Скопируй точно из intensivpflege.html — те же классы, тот же инлайн скрипт в конце.
Добавь в скрипт обработку ссылок href="#bewerbung" и href="#stellen" аналогично href="#formular".

---

## МЕТА-ТЕГИ

title: Pflegekraft gesucht in Hessen — Übertariflich · KSK Farmos
description: Übertarifliche Bezahlung, Firmenwagen und Weiterbildung. Schnellbewerbung in 2 Minuten — kein Anschreiben nötig. Jetzt bewerben bei KSK Farmos.
robots: noindex, nofollow

---

## ТЕХНИЧЕСКИЕ ПРАВИЛА

- Wizard: функция wizardNext() уже в main.js — используй onclick="wizardNext(2)" как в schnellbewerbung.html
- Все inline стили копируй из intensivpflege.html — не придумывай новые
- Все анимации и hover эффекты — идентичны intensivpflege.html
- data-i18n атрибуты с новыми ключами (lp2.hero.title, lp2.trust.1 и т.д.)
- Не трогать другие файлы
- Файл называется jobs.html

---

## РЕЗУЛЬТАТ

jobs.html выглядит как родной брат intensivpflege.html.
Тот же дизайн, те же эффекты, та же структура.
Wizard переключается между шагами. Форма с data-form="schnellbewerbung".
На мобиле выглядит так же чисто как intensivpflege.html.
