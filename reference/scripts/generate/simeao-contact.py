from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[3]
out = root / 'reference/streets/simeao-de-macedo/comparacoes'
out.mkdir(parents=True, exist_ok=True)
directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']
folders = [p for p in sorted((root / 'maps/simeao-de-macedo').glob('ponto-*')) if int(p.name[6:]) >= 18]
# Keep the historical comparison sheets for points 01–17 intact.
for folder in folders:
    sheet = Image.new('RGB', (1200, 1720), '#192320')
    draw = ImageDraw.Draw(sheet)
    for i, direction in enumerate(directions):
        with Image.open(folder / f'{i+1}.jpg') as photo:
            photo.thumbnail((600, 400))
            x, y = (i % 2) * 600, (i // 2) * 430
            sheet.paste(photo, (x, y + 28))
            draw.text((x + 12, y + 7), f'{folder.name} / {i+1} - {direction}', fill='#efe1af')
    sheet.save(out / f'{folder.name}.jpg', quality=88)
print(f'{len(folders)} pranchas da extensão preparadas.')
for start in range(0, len(folders), 4):
    group = folders[start:start+4]
    sheet = Image.new('RGB', (1200, 430 * len(group)), '#192320')
    draw = ImageDraw.Draw(sheet)
    for row, folder in enumerate(group):
        for col, direction in enumerate([7, 3]):
            with Image.open(folder / f'{direction}.jpg') as photo:
                photo.thumbnail((600, 400))
                sheet.paste(photo, (col * 600, row * 430 + 28))
            draw.text((col * 600 + 12, row * 430 + 7), f'{folder.name} / {direction}', fill='#efe1af')
    sheet.save(out / f'extensao-{start//4+1}.jpg', quality=90)
