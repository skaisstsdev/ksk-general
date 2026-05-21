# ЗАДАЧА: Подключить EmailJS к формам на основном сайте KSK Farmos

Ты работаешь над сайтом KSK Farmos.
В папке уже есть все HTML файлы сайта.

Твоя задача — подключить отправку писем через EmailJS.
Не трогай дизайн, стили, структуру страниц. Только формы.

## ДАННЫЕ EMAILJS
- Service ID: service_ioziuvf
- Template пациенты: template_85bxfic
- Template медработники: template_hmexk4f
- Public Key: FvtHmqXFbDTGygZuv

---

## ШАГ 1 — Добавить EmailJS SDK

В КАЖДЫЙ из этих файлов добавь в <head>:
beratung.html, kontakt.html, schnellbewerbung.html

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script>emailjs.init('FvtHmqXFbDTGygZuv')</script>
```

---

## ШАГ 2 — beratung.html (форма консультации для пациентов)

Найди форму с data-form="beratung".

1. Добавь id на форму:
```html
<form data-form="beratung" id="beratungForm">
```

2. Убедись что у всех полей есть name атрибуты:
- Vorname → name="vorname"
- Nachname → name="nachname"
- E-Mail → name="email"
- Telefon → name="telefon"
- Nachricht textarea → name="nachricht"

3. Добавь скрипт перед закрывающим </body>:

```html
<script>
document.getElementById('beratungForm').addEventListener('submit', async function(e) {
  e.preventDefault()
  const btn = this.querySelector('[type="submit"]')
  const originalHTML = btn.innerHTML
  btn.disabled = true
  btn.innerHTML = 'Wird gesendet...'

  const templateParams = {
    vorname: this.querySelector('[name="vorname"]').value,
    nachname: this.querySelector('[name="nachname"]').value,
    email: this.querySelector('[name="email"]').value,
    telefon: this.querySelector('[name="telefon"]').value,
    nachricht: this.querySelector('[name="nachricht"]').value || '—'
  }

  try {
    await emailjs.send('service_ioziuvf', 'template_85bxfic', templateParams)
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

## ШАГ 3 — kontakt.html (контактная форма)

Найди форму с data-form="kontakt".

1. Добавь id:
```html
<form data-form="kontakt" id="kontaktForm">
```

2. Name атрибуты:
- Vorname → name="vorname"
- Nachname → name="nachname"
- E-Mail → name="email"
- Telefon → name="telefon"
- Betreff select → name="betreff"
- Nachricht textarea → name="nachricht"

3. Добавь скрипт перед </body>:

```html
<script>
document.getElementById('kontaktForm').addEventListener('submit', async function(e) {
  e.preventDefault()
  const btn = this.querySelector('[type="submit"]')
  const originalHTML = btn.innerHTML
  btn.disabled = true
  btn.innerHTML = 'Wird gesendet...'

  const templateParams = {
    vorname: this.querySelector('[name="vorname"]').value,
    nachname: this.querySelector('[name="nachname"]').value,
    email: this.querySelector('[name="email"]').value,
    telefon: this.querySelector('[name="telefon"]').value,
    nachricht: (this.querySelector('[name="betreff"]')?.value || '') + ' — ' + (this.querySelector('[name="nachricht"]').value || '')
  }

  try {
    await emailjs.send('service_ioziuvf', 'template_85bxfic', templateParams)
    const card = this.closest('.form-card')
    card.innerHTML = `
      <div style="text-align:center;padding:48px 24px">
        <div style="width:72px;height:72px;border-radius:50%;background:var(--violet-pale);display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
          <i data-lucide="check" style="color:var(--violet);width:32px;height:32px"></i>
        </div>
        <h3 style="font-family:var(--serif);margin-bottom:12px">Vielen Dank!</h3>
        <p style="color:var(--text-muted);line-height:1.7;max-width:300px;margin:0 auto">
          Ihre Nachricht wurde gesendet.<br>
          Wir melden uns innerhalb von 24 Stunden.
        </p>
      </div>
    `
    if(typeof lucide !== 'undefined') lucide.createIcons()
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

## ШАГ 4 — schnellbewerbung.html (wizard для медработников)

Найди форму с data-form="schnellbewerbung".

1. Добавь id:
```html
<form data-form="schnellbewerbung" id="bewerbungForm">
```

2. Name атрибуты ко всем полям wizard:
Панель 1: name="vorname", name="nachname", name="email", name="telefon"
Панель 2: name="qualifikation", name="erfahrung", name="fuehrerschein"
Панель 3: name="nachricht" на textarea

3. Добавь скрипт перед </body>:

```html
<script>
document.getElementById('bewerbungForm').addEventListener('submit', async function(e) {
  e.preventDefault()
  const btn = this.querySelector('[type="submit"]')
  const originalHTML = btn.innerHTML
  btn.disabled = true
  btn.innerHTML = 'Wird gesendet...'

  const templateParams = {
    vorname: this.querySelector('[name="vorname"]').value,
    nachname: this.querySelector('[name="nachname"]').value,
    email: this.querySelector('[name="email"]').value,
    telefon: this.querySelector('[name="telefon"]').value,
    qualifikation: this.querySelector('[name="qualifikation"]')?.value || '—',
    erfahrung: this.querySelector('[name="erfahrung"]')?.value || '—',
    fuehrerschein: this.querySelector('[name="fuehrerschein"]')?.value || '—',
    arbeitszeit: this.querySelector('[name="arbeitszeit"]')?.value || '—',
    nachricht: this.querySelector('[name="nachricht"]')?.value || '—'
  }

  try {
    await emailjs.send('service_ioziuvf', 'template_hmexk4f', templateParams)
    const card = this.closest('.form-card')
    card.innerHTML = `
      <div style="text-align:center;padding:48px 24px">
        <div style="width:72px;height:72px;border-radius:50%;background:var(--violet-pale);display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
          <i data-lucide="check" style="color:var(--violet);width:32px;height:32px"></i>
        </div>
        <h3 style="font-family:var(--serif);margin-bottom:12px">Bewerbung eingegangen!</h3>
        <p style="color:var(--text-muted);line-height:1.7;max-width:300px;margin:0 auto">
          Vielen Dank, <strong>${templateParams.vorname}</strong>!<br>
          Wir melden uns innerhalb von 24 Stunden unter<br>
          <strong>${templateParams.telefon}</strong>.
        </p>
      </div>
    `
    if(typeof lucide !== 'undefined') lucide.createIcons()
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

## ПРАВИЛА

```
❌ Не трогать дизайн страниц
❌ Не трогать CSS
❌ Не трогать wizard логику (wizardNext должна работать как раньше)
❌ Не трогать lang switcher
✓ Только добавлять name атрибуты и скрипты
```

---

## ЧЕКЛИСТ

```
□ EmailJS SDK добавлен в head всех трёх файлов
□ beratung.html — отправляет на template_85bxfic
□ kontakt.html — отправляет на template_85bxfic
□ schnellbewerbung.html — отправляет на template_hmexk4f
□ У всех полей есть name атрибуты
□ Wizard на schnellbewerbung.html работает как раньше
□ После отправки показывается сообщение об успехе
□ git add . && git commit -m "add emailjs" && git push
```
