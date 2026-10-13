"""Pranchas das oito direções da Coelho Neto (Python + Pillow)."""
from pathlib import Path
from PIL import Image, ImageDraw
import json

root = Path(__file__).resolve().parents[3]
folder = root / "maps/coelho-neto"
out = root / "reference/streets/coelho-neto/comparacoes"
out.mkdir(parents=True, exist_ok=True)
manifest = json.loads((folder / "manifest.json").read_text(encoding="utf-8"))
for point in manifest["points"]:
    nn = f'{point["id"]:02d}'
    sheet = Image.new("RGB", (1200, 1720), "#192320")
    draw = ImageDraw.Draw(sheet)
    for i, direction in enumerate(manifest["directions"], 1):
        with Image.open(folder / f"ponto-{nn}/{i}.jpg") as photo:
            photo.load()
            assert photo.size == (900, 600)
            x, y = (i - 1) % 2 * 600, (i - 1) // 2 * 430
            sheet.paste(photo.resize((600, 400)), (x, y + 28))
            draw.text((x + 12, y + 8), f"Coelho {nn} / {i} {direction}", fill="#eee1bc")
    sheet.save(out / f"ponto-{nn}.jpg", quality=90)
