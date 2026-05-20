import os
import json
import re

# Directory of the workspace
WORKSPACE_DIR = "/Users/skaissts/Desktop/macbook/работа/antigravity/ksk-farmos"
SITE_DIR = os.path.join(WORKSPACE_DIR, "site")

# 1. Update de.json
de_json_path = os.path.join(SITE_DIR, "i18n", "de.json")
with open(de_json_path, "r", encoding="utf-8") as f:
    de_translations = json.load(f)

# Update existing keys and add new keys
updates = {
    # Menu and Navigation
    "mega.aufenthalt": "Pflege in Wohnprojekten",
    "mega.aufenthalt.desc": "Pflege im Raum Kassel & Waldeck-Frankenberg",
    "mega.fortbildung": "Pflegeberatung",
    "mega.fortbildung.desc": "Beratung nach §37.3 & §7 SGB XI",
    
    # Startseite
    "idx.lead": "Ambulante Intensivpflege bei Ihnen zu Hause oder in kooperierenden Wohnprojekten im Raum Kassel und Waldeck-Frankenberg — 24 Stunden am Tag, 7 Tage die Woche.",
    "idx.accent": "Seit 2013 versorgen wir Menschen mit schweren Erkrankungen. Mit einem Team aus examinierten Fachkräften garantieren wir eine 24/7-Versorgung auf höchstem Niveau — im eigenen Zuhause oder in kooperierenden Wohnprojekten im Raum Kassel und Waldeck-Frankenberg.",
    "idx.srv2.h3": "Pflege in verschiedenen Wohnprojekten",
    "idx.srv2.p": "Sicher. Vertraut. Mit Herz und Fachkompetenz.",
    "idx.srv3.h3": "Individuelle Pflegeberatung nach § 37.3 SGB XI / nach § 7 SGB XI",
    "idx.srv3.p": "Wir bieten individuelle Pflegeberatungen für Pflegebedürftige und Angehörige zur optimalen Versorgung im häuslichen Umfeld.",
    "idx.diag1": "Beatmungsklienten",
    "idx.diag1.d": "Invasive und nicht-invasive Beatmung",
    "idx.diag6": "Demenz/Alzheimer",
    "idx.diag6.d": "Geduld und wertschätzende Kommunikation",
    "idx.step2.p": "Wir erstellen einen individuellen Versorgungsplan und klären die Kostenübernahme mit Kranken- und Pflegekassen.",
    "idx.step3.p": "Unser Pflegeteam beginnt die Versorgung — professionell und zuverlässig.",
    "idx.about.p": "Der ambulante Intensivpflegedienst KSK Farmos GmbH & Co. KG wurde 2013 von Viktor Beresnev in Volkmarsen gegründet. Seitdem versorgen wir Klienten mit Herz, Fachwissen und modernster Ausstattung.",
    "idx.about.q": "Rund-um-die-Uhr-Versorgung auf höchstem Niveau.",
    
    # Leistungen
    "lei.lead": "Häusliche Intensivpflege, einzigartige Wohnkonzepte und ständige Weiterbildung — alles aus einer Hand.",
    "lei.h.p": "Wir versorgen Menschen mit schweren Erkrankungen in ihrem gewohnten Umfeld — 24 Stunden am Tag, 7 Tage die Woche, 365 Tage im Jahr.",
    "lei.beat": "Die Beatmungspflege ist unsere Kernkompetenz. Erfahrene Pflegefachkräfte für außerklinische Beatmung betreuen Klienten mit moderner Technik und in enger Zusammenarbeit mit Fachärzten für Pneumologie.",
    "lei.a.tag": "Pflege in verschiedenen Wohnprojekten",
    "lei.a.p": "Unser ambulanter Pflegedienst ist auf die Betreuung von Menschen mit Demenz in verschiedenen Wohnprojekten spezialisiert. In einer geschützten, häuslichen Umgebung ermöglichen wir ein würdevolles Leben mit Struktur, Sicherheit und individueller Zuwendung.",
    "lei.a.1": "Zimmer mit eigenen Möbeln",
    "lei.a.2": "Alle notwendigen medizinischen Geräte",
    "lei.a.3": "Großzügiger Garten",
    "lei.a.4": "Bibliothek und Gemeinschaftsräume",
    "lei.a.5": "24h-Betreuung und Überwachung",
    "lei.a.6": "Umfassende pflegerische und medizinische Leistungen",
    "lei.a.7": "Individuell gestalteter Tagesablauf",
    "lei.a.8": "Validation und aktivierende Betreuung",
    "lei.a.9": "Förderung von vorhandenen Fähigkeiten",
    "lei.diag6.desc": "Geduld und wertschätzende Kommunikation im alltäglichen Umgang.",
    "lei.k.lead": "Der Intensivpflegedienst KSK Farmos GmbH & Co. KG übernimmt nach Erhalt einer Vollmacht die Verhandlungen mit den Kostenträgern bezüglich der Kostenübernahme.",
    "lei.k1.p": "Die Krankenkasse zahlt die medizinische Behandlungspflege (z. B. Beatmungspflege, Vitalzeichenkontrolle, Trachealkanülenmanagement, Medikation), unabhängig vom Pflegegrad. Voraussetzung ist eine ärztliche Verordnung nach SGB V.",
    "lei.k2.p": "Die Pflegekasse zahlt pflegerische Unterstützung bei Pflegebedürftigkeit (nach SGB XI) zur Sicherstellung der Grundpflege und hauswirtschaftlichen Versorgung. Voraussetzung ist das Vorliegen eines Pflegegrades.",
    "lei.k3.p": "Bei übersteigenden Kosten des tatsächlichen Pflegebedarfs über die Leistungen der oben genannten Kostenträger (Kranken- und Pflegekasse) hinaus muss der verbleibende Kostenanteil entweder privat getragen oder — sofern die Voraussetzungen gegeben sind — vom Sozialamt, der Beihilfe oder dem Regierungspräsidium übernommen werden.",
    
    # Über uns
    "ub.lead": "Seit 2013 versorgen wir Menschen mit schweren Erkrankungen — professionell, menschlich und verlässlich.",
    "ub.hist.p1": "Der ambulante Intensivpflegedienst KSK Farmos GmbH & Co. KG wurde 2013 von Viktor Beresnev in Volkmarsen gegründet — mit einem klaren Ziel: Menschen mit schweren Erkrankungen ein würdiges und selbstbestimmtes Leben zu ermöglichen.",
    "ub.hist.p2": "Seitdem versorgen wir Klienten mit Herz, Fachwissen und modernster Ausstattung.",
    "ub.team1.role": "Geschäftsführer",
    "ub.team1.desc": "Leitung und Organisation des Unternehmens, Finanz- und Liquiditätsplanung.",
    "ub.team2.role": "Pflegedienstleitung (PDL)",
    "ub.team2.desc": "Pflegeexpertin für außerklinische Beatmung, direkte Ansprechpartnerin für Angehörige. Verantwortlich für die fachliche Leitung und Qualitätssicherung aller Pflegemaßnahmen.",
    "ub.team3.name": "Lidia Zimmermann",
    "ub.team3.role": "Stellvertretende PDL",
    "ub.team3.desc": "Pflegeexpertin für außerklinische Beatmung, Hygienebeauftragte, Koordination der Pflegeteams.",
    "ub.team4.name": "Unser Pflegeteam",
    "ub.team4.role": "Pflegefachkräfte für außerklinische Beatmung",
    "ub.team4.desc": "Rund 30 Mitarbeiter — qualifiziert, empathisch und zuverlässig im Einsatz.",
    "ub.koop.1": "Fachärzten verschiedener Disziplinen",
    "ub.koop.2": "Physiotherapeuten",
    "ub.koop.3": "Logopäden",
    "ub.koop.4": "Ergotherapeuten",
    "ub.koop.5": "Medizintechnik-Unternehmen",
    "ub.koop.6": "Kranken-, Pflege- und Sozialkassen",
    "ub.koop.7": "Sanitätshäuser",
    
    # Karriere
    "kar.lead": "Arbeiten, wo es wirklich zählt. Übertarifliche Bezahlung, kontinuierliche Fort- und Weiterbildung und ein Team, auf das man sich verlassen kann.",
    "kar.b3.p": "Regelmäßige Fort- und Weiterbildungsmöglichkeiten durch Fort- und Weiterbildungsinstitute mit Zertifikatausstellung — voll finanziert vom Unternehmen.",
    "kar.b4.p": "Wir nehmen Rücksicht auf Ihr Privat- und Berufsleben und gestalten unsere Einsatzplanung flexibel.",
    "kar.b6.p": "Aufstiegsmöglichkeiten und Unterstützung bei persönlicher Entwicklung. Ihre Leistung und Ihr Engagement können bei uns zu neuen Karrierechancen führen.",
    "kar.v1": "Pflegefachkraft (w/m/d)",
    "kar.v1.d": "Vollzeit / Teilzeit | Intensivpflege | Führerschein B",
    "kar.v2": "Pflegehelfer (w/m/d)",
    "kar.v2.d": "Vollzeit / Teilzeit | Führerschein B",
    "kar.v3": "Pflegepraktikant (w/m/d)",
    "kar.v3.d": "Vollzeit",
    
    # FAQ & Form
    "faq.q7": "Was beinhaltet das Pflegekonzept in Wohnprojekten?",
    "faq.a7": "Wir betreuen Klienten in verschiedenen kooperierenden Wohnprojekten im Raum Kassel und Waldeck-Frankenberg. Dort ermöglichen wir ein würdevolles Leben in einer geschützten, familiären Umgebung mit 24h-Betreuung.",
    "form.betreff.2": "Pflege in Wohnprojekten"
}

de_translations.update(updates)

with open(de_json_path, "w", encoding="utf-8") as f:
    json.dump(de_translations, f, ensure_ascii=False, indent=2)
print("Updated de.json successfully.")

# 2. Add keys to other language JSON files to maintain layout consistency (with appropriate translations)
lang_translations = {
    "en": {
        "idx.diag6": "Dementia/Alzheimer's",
        "idx.diag6.d": "Patience and appreciative communication",
        "lei.diag6.desc": "Patience and appreciative communication in daily interaction.",
        "form.betreff.2": "Care in Residential Projects"
    },
    "ru": {
        "idx.diag6": "Деменция/Альцгеймер",
        "idx.diag6.d": "Терпение и уважительное общение",
        "lei.diag6.desc": "Терпение и уважительное общение в повседневном уходе.",
        "form.betreff.2": "Уход в жилых проектах"
    },
    "tr": {
        "idx.diag6": "Demans/Alzheimer",
        "idx.diag6.d": "Sabır ve saygılı iletişim",
        "lei.diag6.desc": "Günlük etkileşimde sabır ve saygılı iletişim.",
        "form.betreff.2": "Ortak Yaşam Projelerinde Bakım"
    },
    "pl": {
        "idx.diag6": "Demencja/Alzheimer",
        "idx.diag6.d": "Cierpliwość i pełna szacunku komunikacja",
        "lei.diag6.desc": "Cierpliwość i pełna szacunku komunikacja w codziennej opiece.",
        "form.betreff.2": "Opieka w projektach mieszkaniowych"
    },
    "ro": {
        "idx.diag6": "Demență/Alzheimer",
        "idx.diag6.d": "Răbdare și comunicare apreciativă",
        "lei.diag6.desc": "Răbdare și comunicare apreciativă în interacțiunea zilnică.",
        "form.betreff.2": "Îngrijire în proiecte rezidențiale"
    },
    "bg": {
        "idx.diag6": "Деменция/Алцхаймер",
        "idx.diag6.d": "Търпение и уважителна комуникация",
        "lei.diag6.desc": "Търпение и уважителна комуникация в ежедневната грижа.",
        "form.betreff.2": "Грижи в съвместни жилищни проекти"
    },
    "ua": {
        "idx.diag6": "Деменція/Альцгеймер",
        "idx.diag6.d": "Терпіння та шанобливе спілкування",
        "lei.diag6.desc": "Терпіння та шанобливе спілкування у щоденному догляді.",
        "form.betreff.2": "Догляд у житлових проектах"
    },
    "ar": {
        "idx.diag6": "الخرف/الزهايمر",
        "idx.diag6.d": "الصبر والتواصل التقديري",
        "lei.diag6.desc": "الصبر والتواصل التقديري في التعامل اليومي.",
        "form.betreff.2": "الرعاية في المشاريع السكنية"
    },
    "bs": {
        "idx.diag6": "Demencija/Alzheimer",
        "idx.diag6.d": "Strpljenje i komunikacija puna poštovanja",
        "lei.diag6.desc": "Strpljenje i komunikacija puna poštovanja u svakodnevnom radu.",
        "form.betreff.2": "Njega u stambenim projektima"
    }
}

for lang, trans in lang_translations.items():
    lang_json_path = os.path.join(SITE_DIR, "i18n", f"{lang}.json")
    if os.path.exists(lang_json_path):
        with open(lang_json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        # Merge translations
        data.update(trans)
        
        # Also update other mega menus or headings if we renamed them in main
        # But we only add these 4 keys to make sure the pages render correctly for diag6
        with open(lang_json_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {lang}.json successfully.")

# 3. Update HTML files (footer kassel address removal)
html_files = [f for f in os.listdir(SITE_DIR) if f.endswith(".html")]

footer_old_pattern = r'<p>\s*Sommerbergstraße\s+14\s*<br>\s*34123\s+Kassel\s*</p>'

for html_file in html_files:
    path = os.path.join(SITE_DIR, html_file)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace the Kassel address in footer
    new_content = re.sub(footer_old_pattern, "", content)
    if new_content != content:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Removed Kassel footer address from {html_file}")

# 4. Modify index.html
index_path = os.path.join(SITE_DIR, "index.html")
with open(index_path, "r", encoding="utf-8") as f:
    index_content = f.read()

# Update the third card href on homepage
index_content = index_content.replace(
    '<a href="leistungen.html#fortbildung" class="card card-img reveal reveal-d3">',
    '<a href="beratung.html" class="card card-img reveal reveal-d3">'
)

# Update Diagnosen list in index.html to add 6th diagnosis
diag5_pattern = r'(<li><span class="check-icon"><i data-lucide="check"></i></span><div><strong data-i18n="idx.diag5">Schädel-Hirn-Trauma</strong><span data-i18n="idx.diag5.d">Rehabilitation und Stabilisierung</span></div></li>)'
diag6_html = '\n          <li><span class="check-icon"><i data-lucide="check"></i></span><div><strong data-i18n="idx.diag6">Demenz/Alzheimer</strong><span data-i18n="idx.diag6.d">Geduld und wertschätzende Kommunikation</span></div></li>'

index_content = re.sub(diag5_pattern, r'\1' + diag6_html, index_content)

with open(index_path, "w", encoding="utf-8") as f:
    f.write(index_content)
print("Updated index.html elements.")

# 5. Modify leistungen.html
leistungen_path = os.path.join(SITE_DIR, "leistungen.html")
with open(leistungen_path, "r", encoding="utf-8") as f:
    lei_content = f.read()

# Remove the third anchor link to fortbildung
lei_content = lei_content.replace(
    '<a href="#fortbildung" class="anchor-link" data-i18n="lei.anc3">Fortbildungen</a>',
    ''
)

# Add 6th diagnosis card
diag_card5_pattern = r'(<div class="card card-centered">\s*<div class="card-graphic"><i data-lucide="stethoscope"></i></div>\s*<h3 data-i18n="idx.diag5">Schädel-Hirn-Trauma</h3>\s*<p data-i18n="lei.diag5.desc">[^<]*</p>\s*</div>)'
diag_card6_html = '''
      <div class="card card-centered">
        <div class="card-graphic"><i data-lucide="heart"></i></div>
        <h3 data-i18n="idx.diag6">Demenz/Alzheimer</h3>
        <p data-i18n="lei.diag6.desc">Geduld und wertschätzende Kommunikation im alltäglichen Umgang.</p>
      </div>'''

lei_content = re.sub(diag_card5_pattern, r'\1' + diag_card6_html, lei_content)

# Update Wohnprojekte list to have 9 items matching the new translations
old_list_pattern = r'<ul class="check-list">.*?</ul>'
new_list_html = '''<ul class="check-list">
          <li><span class="check-icon"><i data-lucide="check"></i></span><div><span data-i18n="lei.a.1">Zimmer mit eigenen Möbeln</span></div></li>
          <li><span class="check-icon"><i data-lucide="check"></i></span><div><span data-i18n="lei.a.2">Alle notwendigen medizinischen Geräte</span></div></li>
          <li><span class="check-icon"><i data-lucide="check"></i></span><div><span data-i18n="lei.a.3">Großzügiger Garten</span></div></li>
          <li><span class="check-icon"><i data-lucide="check"></i></span><div><span data-i18n="lei.a.4">Bibliothek und Gemeinschaftsräume</span></div></li>
          <li><span class="check-icon"><i data-lucide="check"></i></span><div><span data-i18n="lei.a.5">24h-Betreuung und Überwachung</span></div></li>
          <li><span class="check-icon"><i data-lucide="check"></i></span><div><span data-i18n="lei.a.6">Umfassende pflegerische und medizinische Leistungen</span></div></li>
          <li><span class="check-icon"><i data-lucide="check"></i></span><div><span data-i18n="lei.a.7">Individuell gestalteter Tagesablauf</span></div></li>
          <li><span class="check-icon"><i data-lucide="check"></i></span><div><span data-i18n="lei.a.8">Validation und aktivierende Betreuung</span></div></li>
          <li><span class="check-icon"><i data-lucide="check"></i></span><div><span data-i18n="lei.a.9">Förderung von vorhandenen Fähigkeiten</span></div></li>
        </ul>'''

# Wait, we want to replace only the list inside the Aufenthaltskonzept section (after id="aufenthalt")
section_aufenthalt_start = lei_content.find('id="aufenthalt"')
if section_aufenthalt_start != -1:
    section_part = lei_content[section_aufenthalt_start:]
    updated_section_part = re.sub(old_list_pattern, new_list_html, section_part, count=1)
    lei_content = lei_content[:section_aufenthalt_start] + updated_section_part

# Remove Section 3 (Fortbildungen)
fortbildung_section_pattern = r'<!-- SEKTION 3: FORTBILDUNGEN -->\s*<section class="section" id="fortbildung">.*?</section>'
lei_content = re.sub(fortbildung_section_pattern, "", lei_content, flags=re.DOTALL)

with open(leistungen_path, "w", encoding="utf-8") as f:
    f.write(lei_content)
print("Updated leistungen.html elements & removed fortbildungen.")

# 6. Modify ueber-uns.html to update the team grid with Viktor Beresnev (4 items)
ueber_uns_path = os.path.join(SITE_DIR, "ueber-uns.html")
with open(ueber_uns_path, "r", encoding="utf-8") as f:
    ub_content = f.read()

# Update history section text where it mentioned "Kassel"
ub_content = ub_content.replace(
    'in ihrer Einrichtung in Kassel',
    'in kooperierenden Wohnprojekten'
)

# Update grid class to grid-4
ub_content = ub_content.replace(
    '<div class="grid-3">',
    '<div class="grid-4">'
)

# Replace the team cards
old_team_pattern = r'<div class="card reveal reveal-d1">.*?</div>\s*</div>'
new_team_html = '''<div class="card reveal reveal-d1">
        <div class="card-icon"><i data-lucide="award"></i></div>
        <h3>Viktor Beresnev</h3>
        <p data-i18n="ub.team1.role">Geschäftsführer</p>
        <p data-i18n="ub.team1.desc" style="margin-top:8px;font-size:0.88rem">Leitung und Organisation des Unternehmens, Finanz- und Liquiditätsplanung.</p>
      </div>
      <div class="card reveal reveal-d2">
        <div class="card-icon"><i data-lucide="shield-check"></i></div>
        <h3>Olga Korp</h3>
        <p data-i18n="ub.team2.role">Pflegedienstleitung (PDL)</p>
        <p data-i18n="ub.team2.desc" style="margin-top:8px;font-size:0.88rem">Pflegeexpertin für außerklinische Beatmung, direkte Ansprechpartnerin für Angehörige. Verantwortlich für die fachliche Leitung und Qualitätssicherung aller Pflegemaßnahmen.</p>
      </div>
      <div class="card reveal reveal-d3">
        <div class="card-icon"><i data-lucide="heart-handshake"></i></div>
        <h3>Lidia Zimmermann</h3>
        <p data-i18n="ub.team3.role">Stellvertretende PDL</p>
        <p data-i18n="ub.team3.desc" style="margin-top:8px;font-size:0.88rem">Pflegeexpertin für außerklinische Beatmung, Hygienebeauftragte, Koordination der Pflegeteams.</p>
      </div>
      <div class="card reveal reveal-d4">
        <div class="card-icon"><i data-lucide="users"></i></div>
        <h3 data-i18n="ub.team4.name">Unser Pflegeteam</h3>
        <p data-i18n="ub.team4.role">Pflegefachkräfte für außerklinische Beatmung</p>
        <p data-i18n="ub.team4.desc" style="margin-top:8px;font-size:0.88rem">Rund 30 Mitarbeiter — qualifiziert, empathisch und zuverlässig im Einsatz.</p>
      </div>
    </div>'''

team_start = ub_content.find('class="section-tag" data-i18n="ub.team.tag"')
if team_start != -1:
    team_part = ub_content[team_start:]
    # Replace from the first <div class="grid-4"> or <div class="grid-3"> card to the end of the grid row
    grid_start = team_part.find('<div class="grid-4">')
    if grid_start != -1:
        grid_end = team_part.find('</div>\n  </div>\n</section>', grid_start)
        if grid_end != -1:
            team_part = team_part[:grid_start] + '<div class="grid-4">\n      ' + new_team_html + team_part[grid_end + 7:]
            ub_content = ub_content[:team_start] + team_part

with open(ueber_uns_path, "w", encoding="utf-8") as f:
    f.write(ub_content)
print("Updated ueber-uns.html team section to grid-4 with Viktor Beresnev.")

# 7. Modify kontakt.html
kontakt_path = os.path.join(SITE_DIR, "kontakt.html")
with open(kontakt_path, "r", encoding="utf-8") as f:
    kon_content = f.read()

# Replace option 2 in Betreff select
kon_content = kon_content.replace(
    '<option value="Aufenthaltskonzept Kassel" data-i18n="form.betreff.2">Aufenthaltskonzept Kassel</option>',
    '<option value="Pflege in Wohnprojekten" data-i18n="form.betreff.2">Pflege in Wohnprojekten</option>'
)

# Remove Kassel card from Standorte, center the Volkmarsen card
standorte_old_pattern = r'<div class="grid-2">\s*<div class="card reveal reveal-d1">.*?</div>\s*<div class="card reveal reveal-d2">.*?</div>\s*</div>'
standorte_new_html = '''<div style="max-width: 600px; margin: 0 auto;">
      <div class="card reveal reveal-d1">
        <h3 data-i18n="ub.loc1.h3">Zentrale Volkmarsen</h3>
        <p>Ehringer Weg 2b<br>34471 Volkmarsen</p>
        <p><a href="tel:056939189907">05693 / 9189907</a></p>
        <div class="map-embed" style="margin-top:16px">
          <iframe src="https://maps.google.com/maps?q=Ehringer%20Weg%202b,%2034471%20Volkmarsen&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=&amp;output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
      </div>
    </div>'''

kon_content = re.sub(standorte_old_pattern, standorte_new_html, kon_content, flags=re.DOTALL)

with open(kontakt_path, "w", encoding="utf-8") as f:
    f.write(kon_content)
print("Updated kontakt.html select and standorte card.")

# 8. Modify style.css grid-4 mobile rule
style_css_path = os.path.join(SITE_DIR, "css", "style.css")
with open(style_css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

css_content = css_content.replace(
    "  .grid-3{grid-template-columns:1fr}",
    "  .grid-3,.grid-4{grid-template-columns:1fr}"
)

with open(style_css_path, "w", encoding="utf-8") as f:
    f.write(css_content)
print("Updated style.css for responsive grid-4.")
