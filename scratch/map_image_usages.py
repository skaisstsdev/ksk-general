import os
import glob
import re

img_dir = "/Users/skaissts/Desktop/macbook/работа/antigravity/ksk-farmos/site/img"
site_dir = "/Users/skaissts/Desktop/macbook/работа/antigravity/ksk-farmos/site"

# Get all files in img_dir (ignoring subdirectories for now)
images = []
for f in os.listdir(img_dir):
    if os.path.isfile(os.path.join(img_dir, f)) and not f.startswith('.'):
        images.append(f)

print(f"Total images found in site/img: {len(images)}")

# We will scan all HTML files and CSS files in site/
html_files = glob.glob(os.path.join(site_dir, "*.html"))
css_files = glob.glob(os.path.join(site_dir, "css", "*.css"))
all_source_files = html_files + css_files

usage_map = {img: [] for img in images}

for filepath in all_source_files:
    rel_path = os.path.relpath(filepath, site_dir)
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    for img in images:
        # Check if the image name is in the content
        if img in content:
            usage_map[img].append(rel_path)

print("\n--- IMAGE USAGE MAP ---")
unused_images = []
for img, files in sorted(usage_map.items()):
    if files:
        print(f"{img} -> used in: {', '.join(files)}")
    else:
        print(f"{img} -> UNUSED")
        unused_images.append(img)

print(f"\nUnused images total: {len(unused_images)}")
