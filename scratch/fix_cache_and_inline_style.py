import os
import glob

site_dir = "/Users/skaissts/Desktop/macbook/работа/antigravity/ksk-farmos/site"

for filepath in glob.glob(os.path.join(site_dir, "*.html")):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update style.css version to bust cache
    content = content.replace("css/style.css?v=161", "css/style.css?v=162")
    
    # 2. Inject inline styling to prevent collapsing if CSS is cached
    content = content.replace('<i data-lucide="facebook"></i>', '<i data-lucide="facebook" style="width:20px;height:20px"></i>')
    content = content.replace('<i data-lucide="instagram"></i>', '<i data-lucide="instagram" style="width:20px;height:20px"></i>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated cache-buster and inline styles for: {os.path.basename(filepath)}")
