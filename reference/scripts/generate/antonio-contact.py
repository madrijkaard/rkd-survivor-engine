from pathlib import Path
from PIL import Image, ImageDraw
root = Path(__file__).resolve().parents[3]
out = root / 'reference' / 'streets' / 'antonio-alexandre' / 'comparacoes'
out.mkdir(parents=True, exist_ok=True)
directions = ['N','NE','L','SE','S','SO','O','NO']
for folder in sorted((root/'maps'/'antonio-alexandre').glob('ponto-*')):
    sheet = Image.new('RGB',(1200,1720),'#192320')
    draw = ImageDraw.Draw(sheet)
    for i, direction in enumerate(directions):
        photo = Image.open(folder/f'{i+1}.jpg')
        photo.thumbnail((600,400))
        x, y = (i%2)*600, (i//2)*430
        sheet.paste(photo,(x,y+28))
        draw.text((x+12,y+7),f'{folder.name} / {i+1} - {direction}',fill='#efe1af')
    sheet.save(out/f'{folder.name}.jpg',quality=88)
print(f'{len(list(out.glob("ponto-*.jpg")))} pranchas de 8 direções preparadas.')
