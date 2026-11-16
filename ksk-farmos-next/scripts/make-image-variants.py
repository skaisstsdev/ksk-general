#!/usr/bin/env python3
"""
Готовит размеры фотографий для сайта и записывает список размеров в
`src/lib/imageWidths.json` — его читает загрузчик картинок
(`src/lib/imageLoader.ts`).

Зачем. Встроенный оптимизатор Next.js ужимает картинку «на лету» и при
этом заметно теряет резкость: на замерах уменьшение до 1920px давало
почти вдвое меньше мелкого контраста, чем обычный Lanczos, а перекодирование
в WebP добавляло своё. Здесь размеры готовятся заранее хорошим
уменьшением (Lanczos и лёгкая резкость на выходе) и отдаются как есть.

Запуск из корня проекта:  python3 scripts/make-image-variants.py
Нужны Pillow. Исходники («мастера») не трогаются: рядом с `name.webp`
появляются `name-w480.webp`, `name-w640.webp` и так далее. Самый большой
размер — сам мастер.

Правило имён: заменяя фото, меняйте имя файла (например, `-v2`), иначе
браузеры и CDN покажут старое.
"""
import json, os, re, glob, io
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
BUCKETS = [480, 640, 828, 1080, 1280, 1600, 1920, 2400, 3000]
QUALITY = 90

# Какие мастера нужны сайту: всё, что упомянуто в коде как /img/….webp,
# плюс кадры ленты Wohnprojekte, имя которых собирается в шаблоне.
used = set()
for f in glob.glob(os.path.join(ROOT, "src", "**", "*.ts*"), recursive=True):
    used.update(re.findall(r'/img/[A-Za-z0-9_./-]+?\.webp', open(f, encoding="utf-8").read()))
for n in ("lounge", "kueche", "treppenlift", "flur", "wohnraum"):
    used.add(f"/img/leistungen/wohnen-{n}-hd.webp")

manifest = {}
for src in sorted(used):
    master = os.path.join(PUBLIC, src.lstrip("/"))
    if not os.path.exists(master) or re.search(r"-w\d+\.webp$", src):
        continue
    im = Image.open(master)
    icc = im.info.get("icc_profile")
    im = im.convert("RGB")
    W, H = im.size
    widths = [b for b in BUCKETS if b < W] + [W]
    for w in widths[:-1]:
        h = round(H * w / W)
        out = im.resize((w, h), Image.LANCZOS)
        out = out.filter(ImageFilter.UnsharpMask(radius=0.5, percent=35, threshold=1))
        dst = master[:-5] + f"-w{w}.webp"
        kw = {"quality": QUALITY, "method": 6}
        if icc: kw["icc_profile"] = icc
        out.save(dst, "WEBP", **kw)
    manifest[src] = widths
    print(f"{src:55s} {W}x{H}  {widths}")

with open(os.path.join(ROOT, "src", "lib", "imageWidths.json"), "w") as f:
    json.dump(manifest, f, indent=1, sort_keys=True)
print(len(manifest), "фото")
