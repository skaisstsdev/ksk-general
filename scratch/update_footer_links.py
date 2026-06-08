import os
import glob

site_dir = "/Users/skaissts/Desktop/macbook/работа/antigravity/ksk-farmos/site"

old_fb = "https://www.facebook.com/KSKFarmos"
new_fb = "https://www.facebook.com/share/1UM6QWWDnx/"

old_ig = "https://www.instagram.com/ksk_farmos/"
new_ig = "https://www.instagram.com/ksk.farmos.intensivpflege/"

for filepath in glob.glob(os.path.join(site_dir, "*.html")):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace Facebook link in footer social
    content = content.replace(old_fb, new_fb)
    # Replace Instagram link in footer social
    content = content.replace(old_ig, new_ig)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated footer links for: {os.path.basename(filepath)}")
