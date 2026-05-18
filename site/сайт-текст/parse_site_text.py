import json
import os
from bs4 import BeautifulSoup
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

# Style parameters
FONT_TITLE = 'Georgia'
FONT_BODY = 'Arial'
COLOR_VIOLET = RGBColor(76, 43, 115)     # Deep luxury violet
COLOR_CHARCOAL = RGBColor(44, 44, 44)    # Dark charcoal body
COLOR_MUTED = RGBColor(110, 110, 110)    # Muted gray

def clean_html_text(text):
    if not text:
        return ""
    text = text.replace("<br>", " ").replace("<br/>", " ").replace("<br />", " ")
    text = text.replace("<em>", "").replace("</em>", "")
    text = text.replace("<strong>", "").replace("</strong>", "")
    text = text.replace("&copy;", "©")
    return " ".join(text.split())

def add_docx_page_content(doc, title, subtitle, sections):
    # Add page title
    p_title = doc.add_paragraph()
    run_title = p_title.add_run(title.upper())
    run_title.font.name = FONT_TITLE
    run_title.font.size = Pt(15)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_VIOLET
    p_title.paragraph_format.space_before = Pt(20)
    p_title.paragraph_format.space_after = Pt(4)

    if subtitle:
        p_sub = doc.add_paragraph()
        run_sub = p_sub.add_run(subtitle)
        run_sub.font.name = FONT_TITLE
        run_sub.font.size = Pt(11)
        run_sub.font.italic = True
        run_sub.font.color.rgb = COLOR_MUTED
        p_sub.paragraph_format.space_after = Pt(10)

    for sec_title, sec_items in sections:
        if not sec_items:
            continue
        
        # Block Title
        p_sec = doc.add_paragraph()
        run_sec = p_sec.add_run(f"Block: {sec_title}")
        run_sec.font.name = FONT_TITLE
        run_sec.font.size = Pt(11.5)
        run_sec.font.bold = True
        run_sec.font.color.rgb = COLOR_CHARCOAL
        p_sec.paragraph_format.space_before = Pt(12)
        p_sec.paragraph_format.space_after = Pt(6)

        # Block Items
        for item in sec_items:
            item_clean = clean_html_text(item)
            if not item_clean:
                continue
            
            p_item = doc.add_paragraph()
            if item_clean.startswith('"') or item_clean.startswith('«'):
                run_item = p_item.add_run(f"   {item_clean}")
                run_item.font.name = FONT_BODY
                run_item.font.size = Pt(10)
                run_item.font.italic = True
            else:
                run_item = p_item.add_run(f"•  {item_clean}")
                run_item.font.name = FONT_BODY
                run_item.font.size = Pt(10)
            
            run_item.font.color.rgb = COLOR_CHARCOAL
            p_item.paragraph_format.space_after = Pt(3)

def parse_html_page(html_path, de_dict):
    with open(html_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    # Decompose Header, Footer, and Navigation
    for el in soup.find_all(['header', 'footer', 'script', 'style']):
        el.decompose()
    for el in soup.find_all(class_=['mobile-menu', 'lang-float', 'cookie-consent', 'back-to-top', 'lang-float-dropdown']):
        el.decompose()

    sections_data = []
    
    # Find all <section> elements or split elements
    sections = soup.find_all(['section', 'div'], class_=lambda c: c and 'section' in c)
    if not sections:
        sections = soup.find_all('section')
    if not sections:
        sections = [soup.find('main') or soup.find('body')]

    seen_sections = set()

    for i, sec in enumerate(sections):
        if not sec or id(sec) in seen_sections:
            continue
        seen_sections.add(id(sec))
        
        # Determine section title (Block name)
        sec_title = ""
        
        # Check comments right before this section
        prev = sec.previous_sibling
        for _ in range(5): # Check up to 5 siblings back for comments
            if not prev:
                break
            if prev.name is not None:
                # If we hit another tag, stop looking back
                break
            if getattr(prev, 'type', None) == 'comment':
                comment_val = prev.strip()
                if comment_val and not comment_val.startswith('style') and not comment_val.startswith('css'):
                    sec_title = comment_val
                    break
            prev = prev.previous_sibling

        # Fallback to ID
        if not sec_title and sec.get('id'):
            sec_title = sec.get('id').replace("-", " ").replace("_", " ").capitalize()

        # Fallback to heading
        if not sec_title:
            h = sec.find(['h1', 'h2', 'h3'])
            if h:
                if h.get('data-i18n'):
                    sec_title = de_dict.get(h.get('data-i18n'), h.text.strip())
                else:
                    sec_title = h.text.strip()

        # Fallback to default
        if not sec_title:
            sec_title = f"Bereich {i+1}"

        # Clean title
        sec_title = clean_html_text(sec_title)

        sec_items = []
        
        # Gather all visible texts inside descendants
        # BS4 descendants loops over every sub-node in preorder
        for child in sec.descendants:
            if child.name in ['script', 'style', 'noscript', 'header', 'footer']:
                continue
            
            # Check data-i18n
            if child.name and (child.get('data-i18n') or child.get('data-i18n-ph')):
                key = child.get('data-i18n') or child.get('data-i18n-ph')
                val = de_dict.get(key)
                if val:
                    val_clean = clean_html_text(val)
                    if val_clean and val_clean not in sec_items:
                        sec_items.append(val_clean)
            
            # Check text nodes
            elif not child.name and child.string and child.string.strip():
                parent = child.parent
                # Ensure it's inside a standard text element and parent doesn't have data-i18n
                if parent.name in ['p', 'span', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'strong', 'em', 'cite', 'a', 'div']:
                    if not parent.get('data-i18n') and not parent.get('data-i18n-ph'):
                        text_val = child.string.strip()
                        text_clean = clean_html_text(text_val)
                        # Filter out very short things or structural boilerplate
                        if len(text_clean) > 2 and text_clean not in sec_items:
                            # Verify it's not a translation key or JS string
                            if not text_clean.startswith('lp.') and not text_clean.startswith('idx.'):
                                sec_items.append(text_clean)

        if sec_items:
            sections_data.append((sec_title, sec_items))

    return sections_data

def generate_docs():
    # Absolute paths
    corp_site_dir = "/Users/skaissts/Desktop/macbook/работа/antigravity/ksk-farmos/site"
    corp_de_json = os.path.join(corp_site_dir, 'i18n/de.json')
    output_corp_docx = "/Users/skaissts/Desktop/macbook/работа/antigravity/ksk-farmos/site/сайт-текст/KSK-Farmos-Website-Text-DE.docx"

    print("Generating Corporate Website Docx...")
    if os.path.exists(corp_de_json):
        with open(corp_de_json, 'r', encoding='utf-8') as f:
            corp_de_dict = json.load(f)

        doc_corp = Document()
        for section in doc_corp.sections:
            section.top_margin = Inches(1.0)
            section.bottom_margin = Inches(1.0)
            section.left_margin = Inches(1.0)
            section.right_margin = Inches(1.0)

        # Title Page
        p_spacer = doc_corp.add_paragraph()
        p_spacer.paragraph_format.space_before = Pt(80)
        
        p_title = doc_corp.add_paragraph()
        run_title = p_title.add_run("KSK Farmos GmbH & Co. KG")
        run_title.font.name = FONT_TITLE
        run_title.font.size = Pt(26)
        run_title.font.bold = True
        run_title.font.color.rgb = COLOR_VIOLET
        p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
        
        p_sub = doc_corp.add_paragraph()
        run_sub = p_sub.add_run("Inhalt der Website (Deutsch / Original)")
        run_sub.font.name = FONT_TITLE
        run_sub.font.size = Pt(13)
        run_sub.font.italic = True
        run_sub.font.color.rgb = COLOR_CHARCOAL
        p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_sub.paragraph_format.space_after = Pt(200)

        p_meta = doc_corp.add_paragraph()
        run_meta = p_meta.add_run("Dokumententyp: Website-Textgliederung (ohne Menü und Fußzeile)\nGeneriert am: 18. Mai 2026\nIntensivpflegedienst Nordhessen")
        run_meta.font.name = FONT_BODY
        run_meta.font.size = Pt(9.5)
        run_meta.font.color.rgb = COLOR_MUTED
        p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER

        doc_corp.add_page_break()

        # Corporate pages list in logical order
        corp_pages = [
            ('index.html', 'Startseite', 'Hauptseite des Unternehmens'),
            ('leistungen.html', 'Leistungen', 'Medizinische Leistungen & Pflegekonzepte'),
            ('ueber-uns.html', 'Über uns', 'Unternehmensphilosophie & Team'),
            ('karriere.html', 'Karriere', 'Stellenangebote & Arbeitgeberleistungen'),
            ('schnellbewerbung.html', 'Schnellbewerbung', 'Interaktiver Bewerbungsprozess'),
            ('faq.html', 'FAQ', 'Häufig gestellte Fragen'),
            ('kontakt.html', 'Kontakt', 'Standorte & Kontaktaufnahme'),
            ('beratung.html', 'Beratung', 'Kostenloses Erstgespräch anfordern')
        ]

        for filename, title, subtitle in corp_pages:
            filepath = os.path.join(corp_site_dir, filename)
            if os.path.exists(filepath):
                print(f"Parsing {filename}...")
                sec_data = parse_html_page(filepath, corp_de_dict)
                if sec_data:
                    add_docx_page_content(doc_corp, title, subtitle, sec_data)
                    doc_corp.add_page_break()

        doc_corp.save(output_corp_docx)
        print(f"Corporate document created successfully: {output_corp_docx}")
    else:
        print(f"Warning: Corporate de.json not found at {corp_de_json}")

    # ─────────────────────────────────────────────────────────
    # DOCUMENT 2: KSK PATIENTS LANDING PAGE (GERMAN)
    # ─────────────────────────────────────────────────────────
    pat_site_dir = "/Users/skaissts/Desktop/macbook/работа/antigravity/ksk-patients/landing-intensivpflege"
    pat_de_json = os.path.join(pat_site_dir, 'i18n/de.json')
    output_pat_docx = "/Users/skaissts/Desktop/macbook/работа/antigravity/ksk-farmos/site/сайт-текст/KSK-Patients-Landing-Text-DE.docx"

    print("Generating Patients Landing Page Docx...")
    if os.path.exists(pat_de_json):
        with open(pat_de_json, 'r', encoding='utf-8') as f:
            pat_de_dict = json.load(f)

        doc_pat = Document()
        for section in doc_pat.sections:
            section.top_margin = Inches(1.0)
            section.bottom_margin = Inches(1.0)
            section.left_margin = Inches(1.0)
            section.right_margin = Inches(1.0)

        # Title Page
        p_spacer = doc_pat.add_paragraph()
        p_spacer.paragraph_format.space_before = Pt(80)
        
        p_title = doc_pat.add_paragraph()
        run_title = p_title.add_run("KSK Farmos — Intensivpflege")
        run_title.font.name = FONT_TITLE
        run_title.font.size = Pt(26)
        run_title.font.bold = True
        run_title.font.color.rgb = COLOR_VIOLET
        p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
        
        p_sub = doc_pat.add_paragraph()
        run_sub = p_sub.add_run("Inhalt der Patienten-Landingpage (Deutsch / Original)")
        run_sub.font.name = FONT_TITLE
        run_sub.font.size = Pt(13)
        run_sub.font.italic = True
        run_sub.font.color.rgb = COLOR_CHARCOAL
        p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_sub.paragraph_format.space_after = Pt(200)

        p_meta = doc_pat.add_paragraph()
        run_meta = p_meta.add_run("Dokumententyp: Landingpage-Textgliederung (ohne Menü und Fußzeile)\nGeneriert am: 18. Mai 2026\nPatienten-Werbelandingpage Nordhessen")
        run_meta.font.name = FONT_BODY
        run_meta.font.size = Pt(9.5)
        run_meta.font.color.rgb = COLOR_MUTED
        p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER

        doc_pat.add_page_break()

        # Patients Landing index page
        pat_filepath = os.path.join(pat_site_dir, 'index.html')
        if os.path.exists(pat_filepath):
            print(f"Parsing landing page index.html...")
            sec_data = parse_html_page(pat_filepath, pat_de_dict)
            if sec_data:
                add_docx_page_content(doc_pat, 'Patienten-Landingpage', 'Ambulante Intensivpflege Nordhessen', sec_data)

        doc_pat.save(output_pat_docx)
        print(f"Patients Landing document created successfully: {output_pat_docx}")
    else:
        print(f"Warning: Patients de.json not found at {pat_de_json}")

if __name__ == '__main__':
    generate_docs()
