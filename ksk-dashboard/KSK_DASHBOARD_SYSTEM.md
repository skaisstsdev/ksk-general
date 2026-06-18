# СИСТЕМА УПРАВЛЕНИЯ ЗАЯВКАМИ — KSK Farmos
# Порядок: сначала Шаг 0 (Supabase), потом Промты 1А, 1Б, 2

---

# ═══ ШАГ 0: НАСТРОЙКА SUPABASE (делаешь вручную, 10 минут) ═══

## 1. Создай таблицу в Supabase SQL Editor:

```sql
create table bewerbungen (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  vorname text not null,
  nachname text not null,
  email text,
  telefon text not null,
  qualifikation text,
  erfahrung text,
  fuehrerschein text,
  arbeitszeit text,
  nachricht text,
  status text default 'neu',
  notizen text,
  source text
);

alter table bewerbungen enable row level security;

create policy "Allow anonymous insert"
on bewerbungen for insert
to anon
with check (true);

create policy "Allow anonymous select"
on bewerbungen for select
to anon
using (true);

create policy "Allow anonymous update"
on bewerbungen for update
to anon
using (true);
```

## 2. Включи Realtime:
Supabase Dashboard → Table Editor → bewerbungen → шестерёнка → Enable Realtime → Save

## 3. Возьми ключи:
Supabase Dashboard → Settings → API:
- Project URL → SUPABASE_URL
- anon public → SUPABASE_KEY

Запиши оба — они понадобятся во всех трёх промтах.

---

# ═══ ПРОМТ 1А: ПОДКЛЮЧИТЬ ФОРМУ — jobs.html (лендинг медработников) ═══
# Скормить Antigravity вместе с файлом jobs.html из папки landing-jobs

В файле jobs.html есть wizard форма с data-form="schnellbewerbung".
Нужно подключить её к Supabase — реальная отправка вместо заглушки из main.js.

## Что сделать:

### 1. Добавь в <head>:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### 2. Добавь перед закрывающим </body>:
```html
<script>
const SUPABASE_URL = 'ВАШ_SUPABASE_URL'
const SUPABASE_KEY = 'ВАШ_SUPABASE_ANON_KEY'
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

document.querySelector('[data-form="schnellbewerbung"]').addEventListener('submit', async (e) => {
  e.preventDefault()
  const form = e.target

  const data = {
    vorname: form.querySelector('[name="vorname"]').value.trim(),
    nachname: form.querySelector('[name="nachname"]').value.trim(),
    email: form.querySelector('[name="email"]').value.trim(),
    telefon: form.querySelector('[name="telefon"]').value.trim(),
    qualifikation: form.querySelector('[name="qualifikation"]').value,
    erfahrung: form.querySelector('[name="erfahrung"]').value,
    fuehrerschein: form.querySelector('[name="fuehrerschein"]').value,
    arbeitszeit: form.querySelector('[name="arbeitszeit"]').value,
    nachricht: form.querySelector('[name="nachricht"]').value.trim(),
    status: 'neu',
    source: 'landing-jobs'
  }

  const btn = form.querySelector('[type="submit"]')
  const btnOriginalText = btn.innerHTML
  btn.disabled = true
  btn.innerHTML = 'Wird gesendet... <i data-lucide="loader"></i>'
  lucide.createIcons()

  const { error } = await supabaseClient.from('bewerbungen').insert([data])

  if (error) {
    btn.disabled = false
    btn.innerHTML = btnOriginalText
    lucide.createIcons()
    const errorMsg = document.createElement('p')
    errorMsg.style.cssText = 'color:var(--error,#ef4444);font-size:0.85rem;margin-top:8px;text-align:center'
    errorMsg.textContent = 'Fehler beim Senden. Bitte versuchen Sie es erneut.'
    btn.parentNode.appendChild(errorMsg)
    setTimeout(() => errorMsg.remove(), 5000)
  } else {
    const card = form.closest('.form-card')
    card.innerHTML = `
      <div style="text-align:center;padding:48px 24px">
        <div style="width:72px;height:72px;border-radius:50%;background:var(--violet-pale);display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
          <i data-lucide="check" style="color:var(--violet);width:32px;height:32px"></i>
        </div>
        <h3 style="margin-bottom:12px">Bewerbung eingegangen!</h3>
        <p style="color:var(--text-muted);line-height:1.7;max-width:300px;margin:0 auto">
          Vielen Dank, <strong>${data.vorname}</strong>!<br>
          Wir melden uns innerhalb von 24 Stunden unter<br>
          <strong>${data.telefon}</strong>.
        </p>
      </div>
    `
    lucide.createIcons()
  }
})
</script>
```

### 3. Добавь name атрибуты ко всем полям wizard (если их ещё нет):
Панель 1: name="vorname", name="nachname", name="email", name="telefon"
Панель 2: name="qualifikation", name="erfahrung", name="fuehrerschein", name="arbeitszeit"
Панель 3: name="nachricht"

### Не трогать:
- Дизайн страницы
- Структуру wizard и wizardNext()
- Все остальные файлы

---

# ═══ ПРОМТ 1Б: ПОДКЛЮЧИТЬ ФОРМУ — schnellbewerbung.html (основной сайт) ═══
# Скормить Antigravity вместе с файлом schnellbewerbung.html из папки ksk-farmos

В файле schnellbewerbung.html есть wizard форма с data-form="schnellbewerbung".
Нужно подключить её к Supabase — та же таблица что и в jobs.html.

## Что сделать:

### 1. Добавь в <head>:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### 2. Добавь перед закрывающим </body>:
```html
<script>
const SUPABASE_URL = 'ВАШ_SUPABASE_URL'
const SUPABASE_KEY = 'ВАШ_SUPABASE_ANON_KEY'
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

document.querySelector('[data-form="schnellbewerbung"]').addEventListener('submit', async (e) => {
  e.preventDefault()
  const form = e.target

  const data = {
    vorname: form.querySelector('[name="vorname"]').value.trim(),
    nachname: form.querySelector('[name="nachname"]').value.trim(),
    email: form.querySelector('[name="email"]').value.trim(),
    telefon: form.querySelector('[name="telefon"]').value.trim(),
    qualifikation: form.querySelector('[name="qualifikation"]').value,
    erfahrung: form.querySelector('[name="erfahrung"]').value,
    fuehrerschein: form.querySelector('[name="fuehrerschein"]').value,
    arbeitszeit: form.querySelector('[name="arbeitszeit"]').value,
    nachricht: form.querySelector('[name="nachricht"]').value.trim(),
    status: 'neu',
    source: 'hauptseite'
  }

  const btn = form.querySelector('[type="submit"]')
  const btnOriginalText = btn.innerHTML
  btn.disabled = true
  btn.innerHTML = 'Wird gesendet... <i data-lucide="loader"></i>'
  lucide.createIcons()

  const { error } = await supabaseClient.from('bewerbungen').insert([data])

  if (error) {
    btn.disabled = false
    btn.innerHTML = btnOriginalText
    lucide.createIcons()
    const errorMsg = document.createElement('p')
    errorMsg.style.cssText = 'color:var(--error,#ef4444);font-size:0.85rem;margin-top:8px;text-align:center'
    errorMsg.textContent = 'Fehler beim Senden. Bitte versuchen Sie es erneut.'
    btn.parentNode.appendChild(errorMsg)
    setTimeout(() => errorMsg.remove(), 5000)
  } else {
    const card = form.closest('.form-card')
    card.innerHTML = `
      <div style="text-align:center;padding:48px 24px">
        <div style="width:72px;height:72px;border-radius:50%;background:var(--violet-pale);display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
          <i data-lucide="check" style="color:var(--violet);width:32px;height:32px"></i>
        </div>
        <h3 style="margin-bottom:12px">Bewerbung eingegangen!</h3>
        <p style="color:var(--text-muted);line-height:1.7;max-width:300px;margin:0 auto">
          Vielen Dank, <strong>${data.vorname}</strong>!<br>
          Wir melden uns innerhalb von 24 Stunden unter<br>
          <strong>${data.telefon}</strong>.
        </p>
      </div>
    `
    lucide.createIcons()
  }
})
</script>
```

### 3. Добавь name атрибуты ко всем полям wizard (если их ещё нет):
Панель 1: name="vorname", name="nachname", name="email", name="telefon"
Панель 2: name="qualifikation", name="erfahrung", name="fuehrerschein", name="arbeitszeit"
Панель 3: name="nachricht"

### Не трогать:
- Дизайн страницы
- Структуру wizard и wizardNext()
- Все остальные файлы сайта

---

# ═══ ПРОМТ 2: СОЗДАТЬ ДАШБОРД admin.html ═══
# Отдельный файл — отдельный проект на Vercel
# Скормить Antigravity как новое задание без других файлов

Создай файл admin.html — дашборд управления заявками медработников KSK Farmos.
Внутренний инструмент для Виктора (владелец компании).
Один файл, весь CSS и JS инлайн.

## СТЕК
HTML + CSS + vanilla JS + Supabase JS SDK + Lucide icons.
Никаких фреймворков.

## ДИЗАЙН
Тёмная тема, профессиональный интерфейс в стиле Linear/Vercel.

CSS переменные:
```css
--bg: #0f0f14;
--bg-card: #1a1a24;
--bg-hover: #22222e;
--border: rgba(255,255,255,0.08);
--violet: #7c3aed;
--violet-light: #a78bfa;
--text-primary: #f8f8ff;
--text-secondary: rgba(255,255,255,0.5);
--green: #10b981;
--yellow: #f59e0b;
--red: #ef4444;
--blue: #3b82f6;
--radius: 10px;
```

Шрифт: Inter от Google Fonts.

## A. ЭКРАН ВХОДА

Полный экран, тёмный фон.
Центрированная карточка (max-width: 380px):
- "KSK Farmos" логотип текстом + тег "Bewerbungsportal"
- h2: "Anmelden"
- Input type="password" placeholder="Passwort eingeben"
- Кнопка "Anmelden" на всю ширину (фиолетовая)
- При неверном пароле: красный текст под инпутом
- Пароль: "kskfarmos2025"
- При Enter тоже проверять пароль
- Успех: скрыть экран входа, показать дашборд
- Хранить в sessionStorage чтобы не вводить повторно

## B. ДАШБОРД

### HEADER (фиксированный, height: 56px)
Слева: "KSK Farmos" + разделитель + "Bewerbungsportal"
По центру: табы — Alle | Neu | Archiv (с счётчиками)
Справа: бейдж "X neue" (красный, только когда есть новые) + кнопка "Abmelden"

### STATS (4 карточки под хедером)
- Gesamt: все заявки (белый)
- Neu: статус "neu" (фиолетовый)
- In Bearbeitung: статус "bearbeitung" (жёлтый)
- Archiviert: статус "archiv" + "abgelehnt" (серый)

### ФИЛЬТРЫ
Строка под stats:
- Search input (поиск по имени, телефону, email)
- Select: Qualifikation (все варианты)
- Select: Source — Alle Quellen / Hauptseite / Landing Jobs
- Кнопка "Filter zurücksetzen"

### СПИСОК ЗАЯВОК
Карточки. Каждая:

Левая часть:
- Круглый аватар с инициалами (цвет по статусу)
- Имя Фамилия (крупно, белый)
- Qualifikation · Erfahrung (серый, мелко)
- Дата (относительная: "vor 2 Stunden")

Центральная часть:
- Телефон с иконкой (кликабельный tel:)
- Email с иконкой (кликабельный mailto:)
- Arbeitszeit с иконкой clock
- Source бейдж: "Hauptseite" (синий) или "Landing" (фиолетовый)

Правая часть:
- Статус бейдж
- Кнопка "Details →"

Hover: подсветка, cursor pointer. Клик → модал.

Статусы:
- neu → фиолетовый "Neu"
- bearbeitung → жёлтый "In Bearbeitung"
- angenommen → зелёный "Angenommen"
- abgelehnt → красный "Abgelehnt"
- archiv → серый "Archiviert"

### МОДАЛЬНОЕ ОКНО

Оверлей + карточка (max-width: 580px, скроллится если длинная).
Закрытие: крестик + клик на оверлей + ESC.

Содержимое модала сверху вниз:

1. ШАПКА:
   Большой аватар с инициалами + Имя Фамилия (h2) + Qualifikation + дата подачи

2. КОНТАКТЫ (два ряда кнопок):
   "Anrufen" (зелёный, tel:) | "E-Mail" (синий, mailto:)

3. ДЕТАЛИ (сетка 2 колонки):
   Erfahrung | Führerschein B | Arbeitszeit | Quelle

4. NACHRICHT (если есть):
   Серый блок с текстом. Если нет — не показывать блок.

5. СТАТУС:
   Label "Status" + Select со всеми статусами.
   Автосохранение при изменении (без кнопки).
   Показывать spinner на время сохранения.

6. NOTIZEN:
   Label "Interne Notizen" + textarea (4 строки).
   Кнопка "Speichern".
   При успехе: иконка check на 2 секунды вместо кнопки.

7. DANGER ZONE (снизу, с разделителем):
   Кнопка "Archivieren" (серая) — меняет статус на archiv, закрывает модал.
   Кнопка "Ablehnen" (красная, outline) — confirm() → статус abgelehnt, закрывает модал.

## ФУНКЦИОНАЛ JS

### Supabase init:
```javascript
const SUPABASE_URL = 'ВАШ_URL'
const SUPABASE_KEY = 'ВАШ_ANON_KEY'
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
```

### Загрузка:
```javascript
const { data } = await db
  .from('bewerbungen')
  .select('*')
  .order('created_at', { ascending: false })
```

### Realtime:
```javascript
db.channel('bewerbungen-changes')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'bewerbungen' },
    (payload) => {
      bewerbungen.unshift(payload.new)
      renderList()
      updateStats()
      showToast(`Neue Bewerbung — ${payload.new.vorname} ${payload.new.nachname}`)
    }
  )
  .subscribe()
```

### Toast:
Фиксированный снизу справа. Фиолетовый фон. Автозакрытие 5 сек. Анимация slide-up.

### Относительное время:
```javascript
function timeAgo(date) {
  const diff = Date.now() - new Date(date)
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1) return 'gerade eben'
  if (m < 60) return `vor ${m} Min.`
  if (h < 24) return `vor ${h} Std.`
  return `vor ${d} Tagen`
}
```

### Инициалы:
```javascript
function initials(vorname, nachname) {
  return (vorname[0] + nachname[0]).toUpperCase()
}
```

### Цвет аватара по статусу:
- neu: #7c3aed
- bearbeitung: #d97706
- angenommen: #059669
- abgelehnt: #dc2626
- archiv: #6b7280

### Фильтрация (на фронте):
Фильтровать массив bewerbungen по:
- searchQuery (имя + фамилия + телефон + email)
- selectedQualifikation
- selectedSource
- activeTab (alle / neu / archiv)

### Табы:
- alle: все статусы
- neu: статус "neu" или "bearbeitung"
- archiv: статус "archiv" или "abgelehnt"

### Loading state:
3 skeleton карточки (серые блоки с пульсацией) пока данные грузятся.

### Empty state:
Центрированный текст + иконка когда нет результатов.

## МЕТА
```html
<title>Bewerbungsportal — KSK Farmos</title>
<meta name="robots" content="noindex, nofollow">
```

## ДЕПЛОЙ
Отдельный репо: ksk-farmos-admin
Отдельный Vercel проект.
URL: ksk-farmos-admin.vercel.app
