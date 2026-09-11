import os
import shutil
import pymupdf
from PIL import Image

def render_poster(pdf_path, output_jpg_path, target_width=1600, quality=90):
    doc = pymupdf.open(pdf_path)
    page = doc[0]
    # We want width = target_width
    rect = page.rect
    zoom = target_width / rect.width
    mat = pymupdf.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)
    
    # Convert pixmap to PIL Image
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    img.save(output_jpg_path, "JPEG", quality=quality)
    print(f"Rendered {output_jpg_path}: {img.size}, file size={os.path.getsize(output_jpg_path):,} bytes")

# 1. Seok Jae-won files
seok_dir = r"C:\Users\mello\Downloads\drive-download-20260909T131445Z-1-001\추가\2026 개인탐구과제 로봇초급 석재원"
seok_rep = os.path.join(seok_dir, "2026년 개인주제탐구발표대회 보고서(로봇초급 석재원).pdf")
seok_man = os.path.join(seok_dir, "2026년 개인주제탐구발표대회 작품설명서(로봇초급_석재원).pdf")

dest_seok_rep = "public/uploads/reports/recycling-cleaning-robot-319-report.pdf"
dest_seok_man = "public/uploads/manuals/recycling-cleaning-robot-319-manual.pdf"
dest_seok_pos = "public/posters/recycling-cleaning-robot-319.jpg"

shutil.copy2(seok_rep, dest_seok_rep)
print(f"Copied report to {dest_seok_rep}")
shutil.copy2(seok_man, dest_seok_man)
print(f"Copied manual to {dest_seok_man}")
render_poster(seok_man, dest_seok_pos)

# 2. Pyo Si-yeon report
pyo_rep = r"C:\Users\mello\Downloads\drive-download-20260909T131445Z-1-001\추가\2026년 개인주제탐구발표대회 보고서(로봇고급 표시연).pdf"
dest_pyo_rep = "public/uploads/reports/smart-planter-751-report.pdf"
shutil.copy2(pyo_rep, dest_pyo_rep)
print(f"Copied Pyo Si-yeon report to {dest_pyo_rep}")

# 3. Kim Joo-won manual & poster
kim_man = r"C:\Users\mello\Downloads\drive-download-20260909T131445Z-1-001\추가\2026년 개인주제탐구발표대회 작품설명서(.SW고급 김주원.pdf"
dest_kim_man = "public/uploads/manuals/emotion-diary-340-manual.pdf"
dest_kim_pos = "public/posters/emotion-diary-340.jpg"
shutil.copy2(kim_man, dest_kim_man)
print(f"Copied Kim Joo-won manual to {dest_kim_man}")
render_poster(kim_man, dest_kim_pos)

# 4. Lee Su-ah manual & poster
lee_man = r"C:\Users\mello\Downloads\drive-download-20260909T131445Z-1-001\추가\2026년 개인주제탐구발표대회 작품설명서(로봇고급 이수아).pdf"
dest_lee_man = "public/uploads/manuals/project-941-manual.pdf"
dest_lee_pos = "public/posters/project-941.jpg"
shutil.copy2(lee_man, dest_lee_man)
print(f"Copied Lee Su-ah manual to {dest_lee_man}")
render_poster(lee_man, dest_lee_pos)

print("\nAll files copied and posters generated successfully!")
