import os
import glob
import re

site_dir = "/Users/skaissts/Desktop/macbook/работа/antigravity/ksk-farmos/site"

social_pattern = re.compile(r'\s*<div class="footer-social">[\s\S]*?</div>', re.DOTALL)

for filepath in glob.glob(os.path.join(site_dir, "*.html")):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if footer-social is present
    if "footer-social" in content:
        # First remove it
        content_cleaned = social_pattern.sub("", content)
        
        # Now find where to insert it.
        # We need to insert it inside `<div class="footer-contact"> ... </div>` at the end of the content.
        contact_match = re.search(r'(<div class="footer-contact">[\s\S]*?)(</div>)', content_cleaned)
        if contact_match:
            contact_inner = contact_match.group(1)
            # Check if it has newlines
            if "\n" in contact_inner:
                # Find indentation of the contact div
                start_idx = contact_match.start(1)
                line_start = content_cleaned.rfind('\n', 0, start_idx) + 1
                indent = ' ' * (start_idx - line_start)
                nested_indent = indent + '  '
                
                # Build the new social HTML block with correct indentation
                new_social = f"""
{nested_indent}<div class="footer-social">
{nested_indent}  <a href="https://www.facebook.com/KSKFarmos" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i data-lucide="facebook"></i></a>
{nested_indent}  <a href="https://www.instagram.com/ksk_farmos/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i data-lucide="instagram"></i></a>
{nested_indent}</div>"""
                
                # Replace the closing tag of footer-contact
                replacement = contact_match.group(1) + new_social + "\n" + indent + contact_match.group(2)
                content_new = content_cleaned[:contact_match.start()] + replacement + content_cleaned[contact_match.end():]
            else:
                # Single line
                new_social = '<div class="footer-social"><a href="https://www.facebook.com/KSKFarmos" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i data-lucide="facebook"></i></a><a href="https://www.instagram.com/ksk_farmos/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i data-lucide="instagram"></i></a></div>'
                replacement = contact_match.group(1) + new_social + contact_match.group(2)
                content_new = content_cleaned[:contact_match.start()] + replacement + content_cleaned[contact_match.end():]
                
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content_new)
            print(f"Successfully modified {os.path.basename(filepath)}")
        else:
            print(f"Error: footer-contact not found in {os.path.basename(filepath)}")
    else:
        print(f"Warning: footer-social not found in {os.path.basename(filepath)}")
