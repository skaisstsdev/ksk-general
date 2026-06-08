import os
import glob
import re

site_dir = "/Users/skaissts/Desktop/macbook/работа/antigravity/ksk-farmos/site"

facebook_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>'
instagram_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>'

def replace_icons(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.search(r'(<div class="footer-social">[\s\S]*?</div>)', content)
    if not match:
        print(f"Warning: footer-social not found in {os.path.basename(filepath)}")
        return
    
    matched_str = match.group(1)
    
    if '\n' in matched_str:
        start_idx = match.start(1)
        line_start = content.rfind('\n', 0, start_idx) + 1
        indent = ' ' * (start_idx - line_start)
        nested_indent = indent + '  '
        
        new_block = f"""<div class="footer-social">
{nested_indent}<a href="https://www.facebook.com/KSKFarmos" target="_blank" rel="noopener noreferrer" aria-label="Facebook">{facebook_svg}</a>
{nested_indent}<a href="https://www.instagram.com/ksk_farmos/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">{instagram_svg}</a>
{nested_indent}</div>"""
    else:
        new_block = f'<div class="footer-social"><a href="https://www.facebook.com/KSKFarmos" target="_blank" rel="noopener noreferrer" aria-label="Facebook">{facebook_svg}</a><a href="https://www.instagram.com/ksk_farmos/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">{instagram_svg}</a></div>'
        
    content = content[:match.start(1)] + new_block + content[match.end(1):]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated raw SVGs in {os.path.basename(filepath)}")

for filepath in glob.glob(os.path.join(site_dir, "*.html")):
    replace_icons(filepath)
