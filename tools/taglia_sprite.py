"""Ritaglia il foglio del personaggio di Garonio in una striscia di sprite per il gioco.

Uso: python3 tools/taglia_sprite.py
Legge  assets/sprites/garonio_sheet_originale.png
Scrive assets/sprites/garonio.png (13 fotogrammi in fila) e assets/sprites/garonio_ritratto.png
"""
import numpy as np
from PIL import Image

SRC = 'assets/sprites/garonio_sheet_originale.png'
SCALE = 5                 # 5 pixel del disegno = 1 pixel di gioco
CELL_W, CELL_H = 280, 230 # cella in pixel del disegno (diventa 56x46)

# (nome, x0, x1, linea del terreno, y in alto, centro x del corpo)
FRAMES = [
    ('idle', 60, 205, 897, 690, None),
    ('walk1', 300, 422, 897, 690, None), ('walk2', 432, 547, 897, 690, None),
    ('walk3', 551, 655, 897, 690, None), ('walk4', 663, 768, 897, 690, None),
    ('run1', 840, 970, 897, 690, None), ('run2', 972, 1100, 897, 690, None), ('run3', 1104, 1225, 897, 690, None),
    ('jump1', 45, 172, 1197, 975, None), ('jump2', 196, 356, 1197, 975, None), ('jump3', 360, 495, 1197, 975, None),
    ('attack', 612, 878, 1197, 985, 715),
    ('ko', 942, 1210, 1197, 1062, None),
]

a = np.array(Image.open(SRC).convert('RGB')).astype(float)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
bs = np.maximum(b, 1)
# sfondo blu e ombre: stesso colore, più o meno scuro
bg = (b >= 55) & (r / bs > 0.43) & (r / bs < 0.64) & (g / bs > 0.58) & (g / bs < 0.78) & (b <= 150)
alpha = (~bg).astype(float)

def cell(x0, x1, ground, top, cx):
    cx = cx if cx is not None else (x0 + x1) / 2
    out_rgb = np.zeros((CELL_H, CELL_W, 3)); out_a = np.zeros((CELL_H, CELL_W))
    for yy in range(CELL_H):
        sy = ground - CELL_H + yy
        if sy < top or sy >= ground: continue
        for xx in range(CELL_W):
            sx = int(round(cx - CELL_W / 2 + xx))
            if sx < x0 or sx >= x1: continue
            out_rgb[yy, xx] = a[sy, sx]; out_a[yy, xx] = alpha[sy, sx]
    return out_rgb, out_a

def downscale(rgb, al):
    h, w = al.shape[0] // SCALE, al.shape[1] // SCALE
    rgb = (rgb * al[..., None])[:h * SCALE, :w * SCALE].reshape(h, SCALE, w, SCALE, 3).sum((1, 3))
    al = al[:h * SCALE, :w * SCALE].reshape(h, SCALE, w, SCALE).sum((1, 3))
    col = rgb / np.maximum(al, 1)[..., None]
    A = (al / (SCALE * SCALE) >= 0.45)
    out = np.zeros((h, w, 4), np.uint8)
    out[..., :3] = np.clip(col, 0, 255); out[..., 3] = A * 255
    return out

cells = [downscale(*cell(*f[1:])) for f in FRAMES]
strip = np.concatenate(cells, axis=1)
Image.fromarray(strip, 'RGBA').save('assets/sprites/garonio.png')
print('fotogrammi', len(cells), 'cella', cells[0].shape[1], 'x', cells[0].shape[0])

p = Image.open(SRC).convert('RGB').crop((742, 82, 1163, 538))
p.resize((96, 104), Image.BOX).save('assets/sprites/garonio_ritratto.png')
