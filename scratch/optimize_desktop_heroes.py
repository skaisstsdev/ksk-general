import os
import glob
from PIL import Image

root_dir = "/Users/skaissts/Desktop/macbook/работа/antigravity/ksk-farmos"
site_dir = os.path.join(root_dir, "site")
desktop_dir = os.path.join(site_dir, "img", "hero", "desktop")

# Convert PNGs to WebP with high quality (92)
for i in range(1, 7):
    png_path = os.path.join(desktop_dir, f"hero{i}.png")
    webp_path = os.path.join(desktop_dir, f"hero{i}.webp")
    
    if os.path.exists(png_path):
        img = Image.open(png_path)
        # WebP at quality=92 is visually lossless but extremely small
        img.save(webp_path, "WEBP", quality=92)
        
        old_size = os.path.getsize(png_path) / 1024 / 1024
        new_size = os.path.getsize(webp_path) / 1024 / 1024
        print(f"Compressed hero{i}.png ({old_size:.2f} MB) -> hero{i}.webp ({new_size:.2f} MB) | Reduction: {(1 - new_size/old_size)*100:.1f}%")
        
        # Delete original large PNG
        os.remove(png_path)
    else:
        print(f"Warning: {png_path} not found")

# Update all references in the HTML files
html_files = glob.glob(os.path.join(site_dir, "*.html"))

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    for i in range(1, 7):
        old_ref = f"img/hero/desktop/hero{i}.png"
        new_ref = f"img/hero/desktop/hero{i}.webp"
        
        if old_ref in content:
            content = content.replace(old_ref, new_ref)
            modified = True
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated image paths to webp in: {os.path.basename(filepath)}")

print("Optimization and references update completed successfully!")
