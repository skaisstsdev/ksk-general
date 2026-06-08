import os
import shutil
import glob

root_dir = "/Users/skaissts/Desktop/macbook/работа/antigravity/ksk-farmos"
site_dir = os.path.join(root_dir, "site")
img_dir = os.path.join(site_dir, "img")

# 1. Create target directories
dirs_to_create = [
    os.path.join(img_dir, "common"),
    os.path.join(img_dir, "home"),
    os.path.join(img_dir, "leistungen"),
    os.path.join(img_dir, "ueber-uns"),
    os.path.join(img_dir, "hero"),
    os.path.join(img_dir, "hero", "mobile"),
    os.path.join(img_dir, "hero", "desktop")
]

for d in dirs_to_create:
    os.makedirs(d, exist_ok=True)
    print(f"Created directory: {d}")

# Helper functions to move/copy files safely
def move_file(src, dst):
    if os.path.exists(src):
        # If destination file already exists, remove it first
        if os.path.exists(dst):
            os.remove(dst)
        shutil.move(src, dst)
        print(f"Moved: {os.path.basename(src)} -> {dst}")
    else:
        print(f"Warning: {src} not found")

def copy_file(src, dst):
    if os.path.exists(src):
        # If destination file already exists, remove it first
        if os.path.exists(dst):
            os.remove(dst)
        shutil.copy2(src, dst)
        print(f"Copied: {os.path.basename(src)} -> {dst}")
    else:
        print(f"Warning: {src} not found")

# 2. File movements & copies

# Common logo-icon
move_file(os.path.join(img_dir, "logo-icon.png"), os.path.join(img_dir, "common", "logo-icon.png"))

# Home (index page) images
home_images = [
    "home-service-haeuslich.jpg", "home-service-haeuslich.webp",
    "home-service-aufenthalt.jpg", "home-service-aufenthalt.webp",
    "service-consultation.webp",
    "home-about-team.jpg", "home-about-team.webp",
    "447ef75c-87d7-42b5-b0a5-6a3f84eab8a4.jpg", "447ef75c-87d7-42b5-b0a5-6a3f84eab8a4.webp",
    "hero2.jpg"
]
for img in home_images:
    move_file(os.path.join(img_dir, img), os.path.join(img_dir, "home", img))

# Leistungen page images
leistungen_images = [
    "leistungen-aufenthalt-zimmer.jpg", "leistungen-aufenthalt-zimmer.webp",
    "leistungen-hero.jpg"
]
for img in leistungen_images:
    move_file(os.path.join(img_dir, img), os.path.join(img_dir, "leistungen", img))

# Ueber uns page images
ueber_uns_images = [
    "about-cooperation.jpg", "about-cooperation.webp",
    "about-history-office.jpg", "about-history-office.webp"
]
for img in ueber_uns_images:
    move_file(os.path.join(img_dir, img), os.path.join(img_dir, "ueber-uns", img))

# Hero Mobile images (move used .webp files from site/img/hero-mobile/)
mobile_src_dir = os.path.join(img_dir, "hero-mobile")
mobile_webp_files = [
    "hero1-v2.webp",
    "hero2.webp",
    "hero3.webp",
    "hero4.webp",
    "hero5.webp",
    "hero6.webp"
]
for f in mobile_webp_files:
    move_file(os.path.join(mobile_src_dir, f), os.path.join(img_dir, "hero", "mobile", f))

# Hero Desktop images (copy from root/hero-comp/ and rename to hero1.png .. hero6.png)
comp_src_dir = os.path.join(root_dir, "hero-comp")
desktop_mapping = {
    "hero1.png": "hero1.png",
    "hero2_LE_upscale_prime - 08-06-2026 10-36-31.png": "hero2.png",
    "hero3_LE_upscale_prime - 08-06-2026 10-37-22.png": "hero3.png",
    "hero4_LE_upscale_prime - 08-06-2026 10-39-06.png": "hero4.png",
    "hero5_LE_upscale_prime - 08-06-2026 10-39-51.png": "hero5.png",
    "hero6_LE_upscale_prime.png": "hero6.png"
}
for src_name, dst_name in desktop_mapping.items():
    copy_file(os.path.join(comp_src_dir, src_name), os.path.join(img_dir, "hero", "desktop", dst_name))

# 3. Clean up the unused images in site/img/
unused_in_img = [
    "14.jpg", "14.webp",
    "about-hero.png",
    "faq-hero.jpg", "faq-hero.webp",
    "home-hero-new.jpg", "home-hero.png",
    "karriere-hero.jpg", "karriere-hero.webp",
    "service-consultation.jpg",
    "service-nurse-device.jpg", "service-nurse-device.webp",
    "hero2.webp", "hero3.jpg", "hero3.webp"
]
for img in unused_in_img:
    path = os.path.join(img_dir, img)
    if os.path.exists(path):
        os.remove(path)
        print(f"Removed unused site image: {path}")

# Remove the original site/img/hero-mobile/ folder
if os.path.exists(mobile_src_dir):
    shutil.rmtree(mobile_src_dir)
    print(f"Removed original folder: {mobile_src_dir}")

# 4. Clean up root directory folders/files
root_unnecessary = [
    "14.jpg", "4.JPG", "447ef75c-87d7-42b5-b0a5-6a3f84eab8a4.JPG", "5.JPG",
    "C0066D66-6D27-45A3-8992-A2930215054A.PNG", "hero2.JPG", "hero3.JPG",
    "home-hero-new.jpg", "og-image.jpg"
]
for f in root_unnecessary:
    path = os.path.join(root_dir, f)
    if os.path.exists(path):
        os.remove(path)
        print(f"Removed root file: {path}")

root_dirs_unnecessary = [
    "beauty_glanz — копия", "hero mobile", "hero-comp"
]
for d in root_dirs_unnecessary:
    path = os.path.join(root_dir, d)
    if os.path.exists(path):
        shutil.rmtree(path)
        print(f"Removed root directory: {path}")

# 5. In all HTML files, replace references with the new paths!
html_files = glob.glob(os.path.join(site_dir, "*.html"))

# We will define a list of string replacements
replacements = [
    # common
    ('img/logo-icon.png', 'img/common/logo-icon.png'),
    
    # home
    ('img/home-service-haeuslich.jpg', 'img/home/home-service-haeuslich.jpg'),
    ('img/home-service-haeuslich.webp', 'img/home/home-service-haeuslich.webp'),
    ('img/home-service-aufenthalt.jpg', 'img/home/home-service-aufenthalt.jpg'),
    ('img/home-service-aufenthalt.webp', 'img/home/home-service-aufenthalt.webp'),
    ('img/service-consultation.webp', 'img/home/service-consultation.webp'),
    ('img/home-about-team.jpg', 'img/home/home-about-team.jpg'),
    ('img/home-about-team.webp', 'img/home/home-about-team.webp'),
    ('img/447ef75c-87d7-42b5-b0a5-6a3f84eab8a4.jpg', 'img/home/447ef75c-87d7-42b5-b0a5-6a3f84eab8a4.jpg'),
    ('img/447ef75c-87d7-42b5-b0a5-6a3f84eab8a4.webp', 'img/home/447ef75c-87d7-42b5-b0a5-6a3f84eab8a4.webp'),
    ('img/hero2.jpg', 'img/home/hero2.jpg'),
    
    # leistungen
    ('img/leistungen-aufenthalt-zimmer.jpg', 'img/leistungen/leistungen-aufenthalt-zimmer.jpg'),
    ('img/leistungen-aufenthalt-zimmer.webp', 'img/leistungen/leistungen-aufenthalt-zimmer.webp'),
    ('img/leistungen-hero.jpg', 'img/leistungen/leistungen-hero.jpg'),
    
    # ueber-uns
    ('img/about-cooperation.jpg', 'img/ueber-uns/about-cooperation.jpg'),
    ('img/about-cooperation.webp', 'img/ueber-uns/about-cooperation.webp'),
    ('img/about-history-office.jpg', 'img/ueber-uns/about-history-office.jpg'),
    ('img/about-history-office.webp', 'img/ueber-uns/about-history-office.webp'),
    
    # hero
    ('img/hero-mobile/hero1-v2.webp', 'img/hero/mobile/hero1-v2.webp'),
    ('img/hero-mobile/hero1-v2.png', 'img/hero/desktop/hero1.png'),
    
    ('img/hero-mobile/hero2.webp', 'img/hero/mobile/hero2.webp'),
    ('img/hero-mobile/hero2.png', 'img/hero/desktop/hero2.png'),
    
    ('img/hero-mobile/hero3.webp', 'img/hero/mobile/hero3.webp'),
    ('img/hero-mobile/hero3.jpg', 'img/hero/desktop/hero3.png'), # Note the extension change .jpg -> .png!
    
    ('img/hero-mobile/hero4.webp', 'img/hero/mobile/hero4.webp'),
    ('img/hero-mobile/hero4.png', 'img/hero/desktop/hero4.png'),
    
    ('img/hero-mobile/hero5.webp', 'img/hero/mobile/hero5.webp'),
    ('img/hero-mobile/hero5.png', 'img/hero/desktop/hero5.png'),
    
    ('img/hero-mobile/hero6.webp', 'img/hero/mobile/hero6.webp'),
    ('img/hero-mobile/hero6.png', 'img/hero/desktop/hero6.png'),
]

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            modified = True
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated image paths in HTML: {os.path.basename(filepath)}")

print("Asset reorganization completed successfully!")
