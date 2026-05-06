# KSK FARMOS — MASTER PROMPT FOR ANTIGRAVITY (Claude Opus)
# Redesign eines medizinischen Intensivpflege-Websites
# Version: Final · Май 2025

---

## 1. KONTEKT UND ZIEL

Du arbeitest am vollständigen Redesign der Website **ksk-farmos.de** — einem spezialisierten ambulanten Intensivpflegedienst in Nordhessen (Deutschland), gegründet 2013.

**Zwei Zielgruppen gleichzeitig:**
- Primär: Patienten und ihre Familien — Menschen in schwieriger Lage, die Vertrauen, Klarheit und schnelle Antworten brauchen
- Sekundär: Pflegefachkräfte auf Jobsuche — Menschen die übertarifliche Bezahlung, Weiterbildung und ein starkes Team suchen

**Kernbotschaft:** Professionell, menschlich, zuverlässig. Kein Krankenhaus-Feeling, kein Corporate-Modus. Wärme + Kompetenz.

**Kontakte und echte Daten die du verwenden sollst:**
- Tel: 05693/9189907 · Mobil: 0170/7652593
- Email: pflege@ksk-farmos.de
- Volkmarsen: Ehringer Weg 2b, 34471
- Kassel: Sommerbergstraße 14, 34123
- Viktor Beresnev (Inhaber), Olga Korp (PDL), Lidia Zimmermann (Stellv. PDL)

---

## 2. WAS DU BEKOMMST

Du bekommst folgende Dateien:
- `css/style.css` — fertiges, kalibriertes CSS v3.0 (NICHT ändern ohne triftigen Grund)
- `js/main.js` — fertiges JavaScript für Animationen, Akkordeon, Wizard, Lang-Switcher
- Alle HTML-Dateien — strukturell korrekt, brauchen visuellen Feinschliff

**Außerdem:** Eine visuelle Sitemap und Wireframes aller Seiten als HTML-Referenzdokument.

---

## 3. ABSOLUTES NO-LIST (niemals, unter keinen Umständen)

```
❌ Keine Emojis irgendwo — weder in Text, noch als Icons
❌ Keine Inline-Styles (style="...") außer für absolute Ausnahmen
❌ Kein stats-bar / keine 4-Zellen-Statistik-Zeile im Hero
❌ Keine Python-Skripte, keine Build-Skripte — direkt HTML editieren
❌ Kein dunkler Hintergrund im Hero (nur weißer/off-white)
❌ Keine Lucide-Icons in Karten auf weißem Hintergrund (dachte Icon = PowerPoint)
❌ Keine separaten Unterseiten für haeusliche-pflege, wohnkonzept, fortbildungen
   (alles ist in leistungen.html mit Anker-Navigation integriert)
❌ Kein !important außer für kritische mobile overrides
❌ Keine Tabellen für Layout
❌ Kein jQuery oder andere Libraries außer Lucide
```

---

## 4. DESIGN-PRINZIPIEN (dein kreativer Spielraum)

### Typographie
- H1: groß, serif (Playfair Display), ein Wort/Phrase **kursiv und violett**
- H2: klar, serif, nicht übertrieben
- Body: Inter, 16px, line-height 1.8
- Section-Tags: Uppercase, 0.7rem, violett, 0.12em letter-spacing
- **Zahlen wie "5,5 Mitarbeiter" oder "2013"** = im Fließtext, nicht in Boxen

### Farben — NUR diese drei Paletten
```
Weiß/Hellgrau: #ffffff, #f9f9fb, #f4f4f7
Schwarz/Text:  #0d0d18, #5c5c78, #9898b0
Violett:       #6b3fa0, #7c50b5, #f0eaf9
```
**Kein Grün, kein Blau, kein Orange als Akzentfarbe.**

### Buttons — genau 3 Arten, nie mehr
1. **btn-primary** — solid violett, für Patienten-CTAs
2. **btn-outline** — transparent mit Border, für sekundäre Aktionen
3. **btn-glass-dark** — frosted glass NUR auf violettem Hintergrund (Section-CTA)

Alle Buttons: border-radius full (pill-form), Shimmer-Effekt beim Hover bereits im CSS.

### Hero — ALLER SEITEN (universelle Regel)
```
Desktop: 2 Spalten — Text links (1.1fr), Foto rechts (0.9fr) ohne Rahmen
         Unter den Buttons: 3 Zahlen frei angeordnet als typografischer Akzent
         Badge "Seit 2013" schwebt unten-links am Foto (bereits animiert im CSS)

Mobile:  Text oben → Kein-Abstand → Foto unten mit negativem margin-top
         Das Foto überlappt die CTA-Schaltfläche von unten (z-index: Btn > Foto)
         Foto: aspect-ratio 16/9, volle Breite
```

### Hero CTA — zwei Buttons, zwei Zielgruppen
```html
<a href="beratung.html" class="btn btn-primary btn-lg">Kostenlose Beratung</a>
<a href="karriere.html" class="btn btn-outline btn-lg">Für Pflegekräfte</a>
```

### Nach dem Hero — Editorial-Akzent statt Stats-Bar
Kein Raster, keine Zahlen in Boxen. Stattdessen ein großer, ruhiger Absatz:
```html
<div class="editorial-accent">
  <p>Seit <strong>2013</strong> versorgen wir Menschen mit schweren Erkrankungen
  in ganz Hessen. Mit durchschnittlich <strong>5,5 Mitarbeitern pro Patient</strong>
  und <strong>24/7</strong>-Betreuung — zuhause oder in Kassel.</p>
</div>
```

### Leistungen-Seite — Besonderes Prinzip
Die Leistungen sind in **EINER** langen Seite mit 3 Anker-Sektionen:
```
leistungen.html#haeuslich
leistungen.html#aufenthalt
leistungen.html#fortbildung
```
Sticky Anker-Navigation oben. Dienstleistungen in **3 Gruppen** ohne Liste-Ästhetik:
- GRUNDVERSORGUNG (micro-label violett, uppercase, 0.68rem)
- SPEZIELLE THERAPIEN
- ORGANISATION & BEGLEITUNG

### Karriere-Seite — Vakanzen als Liste, nicht als Karten
```html
<div class="vacancy-list">
  <div class="vacancy-item">
    <div class="vacancy-info">
      <h3>Examinierte Pflegefachkraft (w/m/d)</h3>
      <div class="vacancy-tags">
        <span class="vacancy-tag">Vollzeit</span>
        <span class="vacancy-tag">Intensivpflege</span>
      </div>
    </div>
    <a href="schnellbewerbung.html" class="btn btn-primary btn-sm">Bewerben</a>
  </div>
</div>
```

### FAQ — Interaktiv und konvertierend
- Suchfeld oben (JS-Filter bereits in main.js)
- Kategorie-Pills: Alle · Patienten · Kosten · Ablauf · Karriere
- Innerhalb eines offenen Antwort-Blocks: **Mini-CTA** direkt einbauen
- 3 häufige Fragen als Karten unten (immer sichtbar ohne Klick)

### Dual CTA am Ende jeder Seite — Pflicht auf index.html
```html
<div class="dual-cta">
  <div class="dual-cta-left">   <!-- violetter Block: für Patienten -->
  <div class="dual-cta-right">  <!-- heller Block: für Pflegekräfte -->
```

---

## 5. ANIMATIONEN — Kreativität erlaubt, Maß halten

Das CSS hat bereits:
- `.reveal` `.reveal-left` `.reveal-right` `.reveal-scale` — Scroll-Animationen
- `.reveal-d1` bis `.reveal-d5` — gestaffelte Delays (90ms pro Schritt)
- `badgeFloat` — Hero-Badge schwebt sanft
- `pulseDot` — Punkt im Hero-Overline pulsiert
- Button-Shimmer via `::after` pseudo-element

**Du darfst hinzufügen:**
- Hover-Microinteraktionen auf Karten (bereits `translateY(-6px)` + shadow)
- Entrance-Animationen auf Seitenwechsel (optional, subtil)
- Smooth Scroll zwischen Anker-Sektionen (bereits in HTML)
- Staggered reveals für Grid-Elemente (nutze `reveal-d1` bis `reveal-d5`)

**Regel:** Animationen müssen `prefers-reduced-motion` respektieren.
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. FOTO-PLATZHALTER — Einheitliches Format

Alle echten Fotos kommen später. Platzhalter so strukturieren:
```html
<!-- Hero: 4:5 Hochformat -->
<div class="photo-placeholder ph-4-5">Beschreibung was hier zu sehen sein soll</div>

<!-- Karten: 4:3 Querformat -->
<div class="photo-placeholder ph-4-3">Beschreibung</div>

<!-- Team: Quadratisch -->
<div class="photo-placeholder ph-1-1">Name — Rolle</div>
```

Wenn echte `<img>` eingebaut werden: immer `loading="lazy"` + `alt` + `object-fit:cover`.

---

## 7. SEITENSTRUKTUR (Vollständige Liste)

### Hauptseiten (alle brauchen Hero mit Foto-Spalte):
- `index.html` — Startseite mit Dual CTA
- `leistungen.html` — Einheitliche Seite mit 3 Anker-Sektionen
- `ueber-uns.html` — Geschichte, Leitbild, Team, Partner, Standorte
- `karriere.html` — Vorteile, Vakanzen-Liste, Bewerbungs-Wizard
- `faq.html` — Suche, Kategorien, Akkordeon, Top-3-Karten
- `kontakt.html` — 2 Büro-Karten, Maps, Formular

### Conversion-Seiten (kompakter Hero, sofort zur Aktion):
- `beratung.html` — Split: Text+Vorteile links / Formular rechts
- `schnellbewerbung.html` — Split: Text links / 3-Schritt-Wizard rechts

### Rechtliches (nur Text, kein Foto-Hero):
- `datenschutz.html` — max-width 800px, H2/H3 Struktur
- `impressum.html` — max-width 800px, H2/H3 Struktur

---

## 8. SPRACH-SYSTEM

Alle translatierbaren Elemente haben `data-i18n="schlüssel"` Attribut.
Das JavaScript in `main.js` übernimmt die Übersetzung automatisch.
**Nicht entfernen, nicht umbenennen.**

Sprachauswahl: Floating Pill links unten (bereits implementiert).
Sprachen: DE · EN · RU · TR · PL · RO · BG · UA · AR · BS

---

## 9. MOBILE-REGELN (Pflicht, nicht optional)

```
✓ Hero: Text → Btn (volle Breite, z-index:2) → Foto überlappt von unten
✓ grid-3 → 1 Spalte vertikal ODER horizontaler snap-scroll (Klasse: .snap)
✓ grid-2 → 1 Spalte, Foto zuerst dann Text
✓ CTA-Buttons → width:100%, gestapelt
✓ Footer → 1 Spalte mit Trennlinien
✓ Anker-Navigation → horizontaler scroll, overflow-x:auto
✓ FAQ Suche + Filter → beide bleiben sichtbar, volle Breite
✓ Forms → alle Felder 100% Breite, Label über Input
✓ Wizard → eine Panel-Ansicht pro Schritt, kein horizontales Scrollen
✓ Google Maps → height von 400px → 220px
✓ Touch targets → mindestens 44px Höhe für alle klickbaren Elemente
```

---

## 10. AUFGABE — SO ARBEITEST DU

1. **Eine Datei nach der anderen.** Fange mit `index.html` an.
2. **Zeige das Ergebnis im Browser-Preview** bevor du zur nächsten Datei gehst.
3. **Frage mich** wenn du dir bei einem Design-Entscheidung nicht sicher bist.
4. **Kein Python, kein Build-Tool** — direkt in den HTML-Dateien arbeiten.
5. **CSS-Klassen** — nutze was in `style.css` vorhanden ist. Neue Klassen nur wenn wirklich nötig, dann direkt in `style.css` anhängen.
6. **JavaScript** — `main.js` reicht für alles. Keine weiteren JS-Libraries.

### Arbeitsreihenfolge (empfohlen):
```
1. index.html        ← Hero, Editorial, Cards, Steps, Dual CTA
2. leistungen.html   ← Anker-Nav, 3 Sektionen, Fortbildungs-Grid
3. karriere.html     ← Vakanzen-Liste, Wizard-Form
4. ueber-uns.html    ← Leitbild-Row, Team-Cards, Maps
5. faq.html          ← Suche, Kategorien, Akkordeon
6. kontakt.html      ← Maps, Split-Formular
7. beratung.html     ← Conversion-Formular
8. schnellbewerbung.html ← 3-Schritt-Wizard
9. datenschutz.html + impressum.html ← Text-Layout
```

---

## 11. QUALITÄTSKRITERIEN

Bevor du eine Seite als "fertig" markierst, prüfe:

```
□ Alle Klassen existieren in style.css?
□ Hero hat 2 Spalten desktop / gestapelt mobile?
□ Alle CTA-Buttons nutzen die richtigen Klassen?
□ data-i18n Attribute sind nicht entfernt worden?
□ Keine Emojis, kein inline style?
□ Foto-Platzhalter haben beschreibenden Text?
□ reveal/reveal-left/reveal-right Klassen auf Elementen?
□ Footer auf jeder Seite identisch?
□ Lang-Float-Pill und Back-to-Top auf jeder Seite?
□ Mobile: Buttons volle Breite? Hero richtig gestapelt?
```

---

## 12. DEIN SPIELRAUM

Innerhalb dieser Regeln hast du volle kreative Freiheit:

- **Wähle welche H2-Formulierungen wirkungsvoll sind** (du kennst Deutsch besser als meine Vorgaben)
- **Entscheide wo Zitat-Blöcke am besten wirken** (nicht auf jeder Seite nötig)
- **Baue Micro-Interaktionen ein** die noch nicht im CSS sind — wenn sie subtil und professionell sind
- **Optimiere die Texthierarchie** — manchmal ist weniger Text mehr Wirkung
- **Schlage vor** wenn du eine bessere Strukturlösung siehst als in den Wireframes beschrieben

Du machst eine Pflege-Website zu einem Premium-Produkt das Vertrauen weckt und konvertiert.
Denk wie ein Medical UX Designer, nicht wie ein Formular-Ausfüller.

---

*Ende des Prompts. Starte mit `index.html`.*
