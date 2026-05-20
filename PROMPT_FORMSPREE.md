# ЗАДАЧА: Подключить Formspree к формам на основном сайте KSK Farmos

Ты работаешь над сайтом KSK Farmos.
В папке уже есть все HTML файлы сайта.

Твоя задача — подключить реальную отправку форм через Formspree.
Не трогай дизайн, стили, структуру страниц. Только формы.

---

## ЧТО НУЖНО СДЕЛАТЬ

### ФОРМА 1 — beratung.html (консультация для пациентов)

Найди форму с `data-form="beratung"`.

1. Замени открывающий тег формы:
```html
<!-- БЫЛО -->
<form data-form="beratung">

<!-- СТАЛО -->
<form action="https://formspree.io/f/mjgzyvyg" method="POST" id="beratungForm">
```

2. Добавь name атрибуты ко всем полям если их нет:
- Vorname → name="vorname"
- Nachname → name="nachname"
- E-Mail → name="email"
- Telefon → name="telefon"
- Nachricht → name="nachricht"
- Checkbox Datenschutz → name="datenschutz" value="ja"

3. Добавь скрытые поля сразу после открывающего тега формы:
```html
<input type="hidden" name="_subject" value="Neue Beratungsanfrage — KSK Farmos">
<input type="hidden" name="_language" value="de">
<input type="text" name="_gotcha" style="display:none">
```

4. Добавь обработчик отправки перед закрывающим </body>:
```html
<script>
document.getElementById('beratungForm').addEventListener('submit', async function(e) {
  e.preventDefault()
  const btn = this.querySelector('[type="submit"]')
  const originalHTML = btn.innerHTML
  btn.disabled = true
  btn.innerHTML = 'Wird gesendet... <i data-lucide="loader"></i>'
  if(typeof lucide !== 'undefined') lucide.createIcons()

  try {
    const response = await fetch(this.action, {
      method: 'POST',
      body: new FormData(this),
      headers: { 'Accept': 'application/json' }
    })

    if (response.ok) {
      const card = this.closest('.form-card')
      card.innerHTML = `
        <div style="text-align:center;padding:48px 24px">
          <div style="width:72px;height:72px;border-radius:50%;background:var(--violet-pale);display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
            <i data-lucide="check" style="color:var(--violet);width:32px;height:32px"></i>
          </div>
          <h3 style="font-family:var(--serif);margin-bottom:12px">Vielen Dank!</h3>
          <p style="color:var(--text-muted);line-height:1.7;max-width:300px;margin:0 auto">
            Ihre Anfrage wurde erfolgreich gesendet.<br>
            Wir melden uns innerhalb von 24 Stunden.
          </p>
        </div>
      `
      if(typeof lucide !== 'undefined') lucide.createIcons()
    } else {
      btn.disabled = false
      btn.innerHTML = originalHTML
      if(typeof lucide !== 'undefined') lucide.createIcons()
      alert('Fehler beim Senden. Bitte rufen Sie uns an: 05693 / 9189907')
    }
  } catch(err) {
    btn.disabled = false
    btn.innerHTML = originalHTML
    if(typeof lucide !== 'undefined') lucide.createIcons()
    alert('Fehler beim Senden. Bitte rufen Sie uns an: 05693 / 9189907')
  }
})
</script>
```

---

### ФОРМА 2 — kontakt.html (контактная форма)

Найди форму с `data-form="kontakt"`.

1. Замени открывающий тег:
```html
<!-- БЫЛО -->
<form data-form="kontakt">

<!-- СТАЛО -->
<form action="https://formspree.io/f/mjgzyvyg" method="POST" id="kontaktForm">
```

2. Добавь name атрибуты:
- Vorname → name="vorname"
- Nachname → name="nachname"
- E-Mail → name="email"
- Telefon → name="telefon"
- Betreff (select) → name="betreff"
- Nachricht → name="nachricht"
- Checkbox → name="datenschutz" value="ja"

3. Добавь скрытые поля:
```html
<input type="hidden" name="_subject" value="Neue Kontaktanfrage — KSK Farmos">
<input type="hidden" name="_language" value="de">
<input type="text" name="_gotcha" style="display:none">
```

4. Добавь обработчик (аналогично beratung но для id="kontaktForm" и текст "Kontaktanfrage"):
Скопируй тот же скрипт что для beratungForm, замени только id формы на kontaktForm.

---

### ФОРМА 3 — schnellbewerbung.html (быстрая заявка для медработников)

Найди форму с `data-form="schnellbewerbung"`.

1. Замени открывающий тег:
```html
<!-- БЫЛО -->
<form data-form="schnellbewerbung">

<!-- СТАЛО -->
<form action="https://formspree.io/f/mzdwebej" method="POST" id="bewerbungForm">
```

2. Добавь name атрибуты ко всем полям wizard:
Панель 1:
- Vorname → name="vorname"
- Nachname → name="nachname"
- E-Mail → name="email"
- Telefon → name="telefon"

Панель 2:
- Qualifikation (select) → name="qualifikation"
- Erfahrung (select) → name="erfahrung"
- Führerschein (select) → name="fuehrerschein"

Панель 3:
- Nachricht (textarea) → name="nachricht"
- File input → name="lebenslauf"
- Checkbox → name="datenschutz" value="ja"

3. Добавь скрытые поля после открывающего тега формы:
```html
<input type="hidden" name="_subject" value="Neue Bewerbung — KSK Farmos">
<input type="hidden" name="_language" value="de">
<input type="text" name="_gotcha" style="display:none">
```

4. Добавь обработчик отправки:
```html
<script>
document.getElementById('bewerbungForm').addEventListener('submit', async function(e) {
  e.preventDefault()
  const btn = this.querySelector('[type="submit"]')
  const originalHTML = btn.innerHTML
  btn.disabled = true
  btn.innerHTML = 'Wird gesendet... <i data-lucide="loader"></i>'
  if(typeof lucide !== 'undefined') lucide.createIcons()

  try {
    const response = await fetch(this.action, {
      method: 'POST',
      body: new FormData(this),
      headers: { 'Accept': 'application/json' }
    })

    if (response.ok) {
      const card = this.closest('.form-card')
      card.innerHTML = `
        <div style="text-align:center;padding:48px 24px">
          <div style="width:72px;height:72px;border-radius:50%;background:var(--violet-pale);display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
            <i data-lucide="check" style="color:var(--violet);width:32px;height:32px"></i>
          </div>
          <h3 style="font-family:var(--serif);margin-bottom:12px">Bewerbung eingegangen!</h3>
          <p style="color:var(--text-muted);line-height:1.7;max-width:300px;margin:0 auto">
            Vielen Dank für Ihre Bewerbung!<br>
            Wir melden uns innerhalb von 24 Stunden.
          </p>
        </div>
      `
      if(typeof lucide !== 'undefined') lucide.createIcons()
    } else {
      btn.disabled = false
      btn.innerHTML = originalHTML
      if(typeof lucide !== 'undefined') lucide.createIcons()
      alert('Fehler beim Senden. Bitte rufen Sie uns an: 05693 / 9189907')
    }
  } catch(err) {
    btn.disabled = false
    btn.innerHTML = originalHTML
    if(typeof lucide !== 'undefined') lucide.createIcons()
    alert('Fehler beim Senden. Bitte rufen Sie uns an: 05693 / 9189907')
  }
})
</script>
```

---

## ВАЖНЫЕ ПРАВИЛА

```
❌ Не трогать дизайн страниц
❌ Не трогать CSS
❌ Не трогать wizard логику (wizardNext функция должна работать как раньше)
❌ Не трогать lang switcher и другие скрипты
✓ Только менять теги форм и добавлять name атрибуты и скрипты
```

---

## ЧЕКЛИСТ ПОСЛЕ

```
□ beratung.html — форма отправляет на mjgzyvyg
□ kontakt.html — форма отправляет на mjgzyvyg
□ schnellbewerbung.html — форма отправляет на mzdwebej
□ У всех полей есть name атрибуты
□ Скрытые поля _subject и _gotcha добавлены
□ После успешной отправки показывается сообщение об успехе
□ Wizard на schnellbewerbung.html работает как раньше
□ Запушить: git add . && git commit -m "add formspree" && git push
```
