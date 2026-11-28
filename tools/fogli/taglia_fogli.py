"""Ritaglia i fogli disegnati (sfondo magenta) in un atlante unico per il gioco.

Uso: python3 tools/fogli/taglia_fogli.py
Legge  assets/sprites/originali/fogli_*.png|jpg
Scrive assets/sprites/fogli.png e src/data/sprite_fogli.js

Ogni voce: (nome, foglio, rettangolo nel foglio, larghezza finale in pixel | ('scala', k) | 'casella')
- gli sprite si rimpiccioliscono alla risoluzione del gioco (media dei colori, alfa netto);
- le caselle del terreno diventano 32x32 ripetibili (i bordi si fondono col centro).
"""
import sys, os, json
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
sys.path.insert(0, os.path.dirname(__file__))
from maschera import maschera

O = 'assets/sprites/originali/'
FOGLI = {  # nome: (file, soglia del magenta, togli le ombre viola)
    'F': ('fogli_facciate.png', 200, False),
    'P': ('fogli_facciate_paese.png', 200, False),
    'A': ('fogli_facciate_azienda.png', 200, False),
    'S': ('fogli_scena.jpg', 110, True),
    'I': ('fogli_interni.jpg', 150, False),
}
FPX = 24  # pixel per casella delle facciate
def fac(nome, f, r, larghezza):  # facciata: larghezza in caselle dell'edificio in src/map.js
    return (nome, f, r, round(larghezza * FPX), 'facciata')

VOCI = [
    # ---- facciate (foglio 1) ----
    fac('f:chiesa', 'F', (14, 12, 246, 270), 8), fac('f:farmacia', 'F', (264, 31, 502, 270), 6),
    fac('f:dottore', 'F', (512, 23, 739, 270), 6), fac('f:pizzeria', 'F', (753, 23, 1003, 270), 6),
    fac('f:kebab', 'F', (1022, 51, 1258, 270), 4), fac('f:paradiso', 'F', (1274, 25, 1521, 270), 8),
    fac('f:magazzino', 'F', (14, 288, 281, 535), 8), fac('f:tabacchi', 'F', (292, 290, 518, 535), 6),
    fac('f:alimentari', 'F', (529, 290, 753, 534), 7), fac('f:municipio', 'F', (767, 277, 995, 535), 5),
    fac('f:consorzio', 'F', (1004, 290, 1271, 535), 10), fac('f:cascina-patata', 'F', (1285, 286, 1523, 541), 8),
    fac('f:cascina-postino', 'F', (33, 544, 346, 812), 7), fac('f:ranch-frank', 'F', (366, 551, 665, 811), 9),
    fac('f:salici-casa', 'F', (687, 547, 960, 812), 7), fac('f:castello', 'F', (981, 561, 1323, 812), 9),
    # ---- facciate (fogli di prima) ----
    fac('f:bar', 'P', (21, 205, 535, 604), 7), fac('f:meccanico', 'P', (566, 138, 1091, 604), 8),
    fac('f:palestra', 'P', (1123, 175, 1662, 606), 7), fac('f:benzinaio', 'P', (1694, 74, 2116, 607), 5),
    fac('f:casa', 'A', (19, 163, 536, 577), 7), fac('f:officina', 'A', (548, 187, 962, 577), 7),
    fac('f:fienile', 'A', (982, 154, 1430, 580), 7), fac('f:maiali', 'A', (1436, 246, 2124, 583), 12),
    # ---- mezzi (larghezze dei corpi in src/hd/mezzi.js, 20 px a casella) ----
    ('m:vespaLato', 'F', (33, 829, 206, 937), 46), ('m:vespaDavanti', 'F', (391, 827, 456, 937), 22),
    ('m:vespaDietro', 'F', (391, 946, 456, 1021), 22),
    ('m:puntoLato', 'F', (523, 836, 745, 930), 90), ('m:puntoDavanti', 'F', (777, 836, 900, 930), 48),
    ('m:puntoDietro', 'F', (777, 930, 900, 1021), 48),
    ('m:trattoreLato', 'F', (968, 836, 1211, 1005), 80), ('m:trattoreDavanti', 'F', (1231, 840, 1345, 1001), 50),
    ('m:trattoreDietro', 'F', (1379, 841, 1504, 1001), 50),
    # ---- alberi e oggetti di scena (16 px a casella) ----
    ('o:quercia1', 'S', (45, 62, 186, 236), 38), ('o:quercia2', 'S', (200, 62, 341, 236), 38),
    ('o:quercia3', 'S', (355, 62, 487, 238), 36), ('o:quercia4', 'S', (503, 68, 632, 234), 36),
    ('o:pioppo1', 'S', (655, 64, 712, 231), 20), ('o:pioppo2', 'S', (741, 59, 795, 231), 20),
    ('o:cespuglio1', 'S', (830, 136, 906, 199), 22), ('o:cespuglio2', 'S', (934, 125, 1010, 199), 22),
    ('o:cespuglioFiori', 'S', (1032, 125, 1116, 199), 24),
    ('o:rotoballa', 'S', (1154, 61, 1219, 137), 22), ('o:ballaQuadra', 'S', (1148, 168, 1225, 226), 24),
    ('o:silo', 'S', (1254, 65, 1335, 239), 40),
    ('o:alberello', 'S', (60, 261, 122, 347), 18), ('o:cespuglio3', 'S', (156, 271, 245, 351), 26),
    ('o:cespuglioRose', 'S', (281, 268, 355, 348), 22), ('o:fieno', 'S', (387, 272, 488, 350), 28),
    ('o:cisterna', 'S', (521, 258, 575, 351), 18), ('o:cartello', 'S', (603, 262, 667, 352), 20),
    ('o:lampione', 'S', (708, 260, 731, 356), 9), ('o:staccionata', 'S', (758, 296, 909, 348), 44),
    ('o:pozzo', 'S', (930, 246, 1023, 354), 30), ('o:carriola', 'S', (1037, 292, 1140, 356), 30),
    ('o:cassettaPosta', 'S', (1173, 283, 1213, 353), 12), ('o:panchina', 'S', (1241, 296, 1338, 353), 30),
    # colture: 16 px di larghezza, come src/hd/oggetti.js
    ('c:mais1', 'S', (558, 652, 620, 712), 16), ('c:mais2', 'S', (627, 625, 689, 712), 16),
    ('c:mais3', 'S', (696, 570, 758, 712), 16), ('c:mais4', 'S', (764, 551, 827, 712), 16),
    ('c:pomodoro1', 'S', (844, 638, 907, 712), 16), ('c:pomodoro2', 'S', (914, 609, 976, 712), 16),
    ('c:pomodoro3', 'S', (982, 584, 1045, 712), 16),
    # ---- caselle del terreno ----
    ('t:erba1', 'S', (50, 414, 136, 500), 'casella'), ('t:erba2', 'S', (152, 414, 238, 500), 'casella'),
    ('t:erbaFiori', 'S', (257, 414, 341, 500), 'casella'),
    ('t:terra1', 'S', (384, 413, 471, 501), 'casella'), ('t:terra2', 'S', (488, 412, 574, 501), 'casella'),
    ('t:asfalto1', 'S', (615, 414, 693, 500), 'casella'), ('t:asfalto2', 'S', (709, 414, 788, 500), 'casella'),
    ('t:ciottolato', 'S', (928, 414, 1015, 500), 'casella'),
    ('t:campo', 'S', (1032, 414, 1120, 500), 'casella'), ('t:campo2', 'S', (1137, 413, 1225, 500), 'casella'),
    ('t:bagnato', 'S', (1239, 413, 1327, 501), 'casella'),
    ('t:acqua', 'S', (1062, 580, 1127, 690), 'casella'), ('t:acqua2', 'S', (1143, 580, 1225, 690), 'casella'),
    ('t:ponte', 'S', (1242, 584, 1327, 676), 'casella'),
    # ---- arredi degli interni (scala 0.45) ----
    *[(n, 'I', r, ('scala', 0.45)) for n, r in [
        ('i:letto', (19, 74, 128, 229)), ('i:comodino', (139, 103, 201, 184)), ('i:armadio', (212, 40, 323, 190)),
        ('i:mobiletv', (327, 68, 429, 189)), ('i:divano', (432, 96, 576, 186)), ('i:libreria', (580, 48, 672, 174)),
        ('i:stufa', (680, 49, 760, 175)), ('i:lavello', (769, 67, 845, 163)), ('i:frigo', (855, 49, 924, 162)),
        ('i:televisore', (945, 72, 999, 133)), ('i:scaffale', (1100, 55, 1186, 196)), ('i:botti', (1001, 100, 1100, 244)),
        ('i:salumi', (1191, 68, 1283, 200)), ('i:jukebox', (1284, 104, 1362, 235)), ('i:panca', (489, 200, 592, 255)),
        ('i:sedia', (604, 183, 647, 268)), ('i:tavolo', (648, 195, 764, 278)), ('i:sedia2', (775, 189, 820, 273)),
        ('i:scrivania', (831, 185, 931, 265)), ('i:cassaforte', (939, 173, 997, 246)),
        ('i:bancone', (9, 309, 243, 519)), ('i:banconeSolo', (9, 396, 243, 519)), ('i:mensoleBar', (24, 309, 227, 394)), ('i:mensole', (233, 310, 350, 395)), ('i:tavolino', (354, 320, 428, 403)),
        ('i:sgabello', (440, 328, 479, 402)), ('i:freezer', (492, 311, 612, 406)), ('i:biliardo', (626, 309, 806, 404)),
        ('i:stecche', (819, 307, 890, 390)), ('i:palco', (819, 406, 942, 520)), ('i:tavoloCarte', (905, 306, 1047, 402)),
        ('i:bacheca', (1059, 297, 1178, 376)), ('i:slotRossa', (1200, 282, 1271, 377)), ('i:slotBlu', (1286, 282, 1358, 378)),
        ('i:sediaBar', (333, 420, 381, 506)), ('i:tavolinoVerde', (382, 434, 478, 515)), ('i:biliardino', (492, 435, 585, 517)),
        ('i:bancomat', (594, 434, 648, 514)), ('i:divanoViola', (658, 431, 809, 514)), ('i:banconeNeon', (954, 431, 1092, 519)),
        ('i:discoBall', (1103, 426, 1166, 502)), ('i:jukeboxNeon', (1180, 410, 1248, 522)), ('i:tendaRossa', (1258, 405, 1366, 520)),
        ('i:ponte', (14, 582, 180, 761)), ('i:bancoLavoro', (186, 626, 297, 745)), ('i:carrello', (304, 628, 380, 746)),
        ('i:mola', (385, 660, 448, 746)), ('i:caffe', (455, 610, 527, 746)), ('i:fusti', (535, 607, 587, 747)),
        ('i:gomme', (595, 614, 685, 747)), ('i:calendario', (685, 606, 748, 695)), ('i:pancaPesi', (752, 643, 861, 756)),
        ('i:tapis', (866, 629, 937, 757)), ('i:sacco', (949, 605, 988, 720)), ('i:manubri', (999, 662, 1105, 748)),
        ('i:specchio', (1115, 609, 1173, 708)), ('i:armadietti', (1179, 609, 1286, 749)), ('i:doccia', (1292, 601, 1359, 750)),
    ]],
]

def ritaglia(a, m, r, tieni_grandi=True):
    x0, y0, x1, y1 = r
    rgb, al = a[y0:y1, x0:x1].astype(float), m[y0:y1, x0:x1].copy()
    if tieni_grandi:  # via i pezzetti di scritte e i bordi di altri disegni
        lab, n = ndi.label(ndi.binary_dilation(al, iterations=1))
        if n > 1:
            aree = ndi.sum(al, lab, range(1, n + 1))
            ok = [i + 1 for i, s in enumerate(aree) if s >= 0.12 * aree.max()]
            al &= np.isin(lab, ok)
    ys, xs = np.nonzero(al)
    rgb, al = rgb[ys.min():ys.max() + 1, xs.min():xs.max() + 1], al[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    return rgb, al.astype(float)

def rimpicciolisci(rgb, al, W, H):
    """media dei colori pesata con l'alfa, poi alfa netto (pixel art)"""
    pm = np.dstack([rgb * al[..., None], al * 255])
    im = Image.fromarray(np.clip(pm, 0, 255).astype(np.uint8), 'RGBA').resize((W, H), Image.BOX)
    o = np.array(im).astype(float)
    A = o[..., 3] / 255
    col = o[..., :3] / np.maximum(A, 1e-6)[..., None]
    out = np.zeros((H, W, 4), np.uint8)
    out[..., :3] = np.clip(col, 0, 255)
    out[..., 3] = (A >= 0.5) * 255
    return out

def bordi_puliti(img):
    """JPEG: i pixel del bordo ancora tinti di magenta diventano contorno scuro"""
    A = img[..., 3] > 0
    r, g, b = [img[..., i].astype(int) for i in range(3)]
    bordo = A & ~ndi.binary_erosion(A, iterations=2)
    rosa = (r > g + 45) & (b > g + 45) & (np.abs(r - b) < 70) & ((r + b) > 220)
    m = bordo & rosa
    img = img.copy(); img[m, 0], img[m, 1], img[m, 2] = 42, 26, 48
    return img

def casella(rgb, N=32):
    """32x32 ripetibile: il bordo prende il centro della casella spostata di mezzo giro"""
    im = Image.fromarray(rgb.astype(np.uint8)).resize((N, N), Image.BOX)
    A = np.array(im).astype(float)
    B = np.roll(A, (N // 2, N // 2), (0, 1))
    t = np.minimum(np.arange(N), N - 1 - np.arange(N)) / (N / 2)  # 0 al bordo, 1 al centro
    w = np.clip(np.minimum.outer(t, t) * 2.2, 0, 1)[..., None]
    C = A * w + B * (1 - w)
    out = np.zeros((N, N, 4), np.uint8); out[..., :3] = np.clip(C, 0, 255); out[..., 3] = 255
    return out

def gronda(al):
    """riga (dall'alto) dove finisce il tetto: l'ultima riga larga quanto la gronda"""
    H = al.shape[0]
    wid = np.array([(np.nonzero(r)[0][-1] - np.nonzero(r)[0][0] + 1) if r.any() else 0 for r in al])
    mx = wid[:int(H * 0.6)].max()
    return max(i for i in range(int(H * 0.6)) if wid[i] >= mx - 3)

def main():
    cache = {}
    pezzi = []
    for voce in VOCI:
        nome, f, r, dim = voce[:4]
        if f not in cache:
            file, soglia, ombre = FOGLI[f]
            a = np.array(Image.open(O + file).convert('RGB')).astype(int)
            cache[f] = (a, maschera(a, soglia, ombre, file.endswith('.jpg')))
        a, m = cache[f]
        meta = {}
        if dim == 'casella':
            x0, y0, x1, y1 = r
            img = casella(a[y0:y1, x0:x1])
        else:
            rgb, al = ritaglia(a, m, r)
            if isinstance(dim, tuple): W = max(2, round(al.shape[1] * dim[1]))
            else: W = dim
            H = max(2, round(al.shape[0] * W / al.shape[1]))
            img = rimpicciolisci(rgb, al, W, H)
            if FOGLI[f][0].endswith('.jpg'): img = bordi_puliti(img)
            if len(voce) > 4 and voce[4] == 'facciata':
                meta['gronda'] = round((gronda(al > 0) + 1) * H / al.shape[0])
        pezzi.append((nome, img, meta))
    # impacchetta a scaffali
    LARGO = 1024
    pezzi.sort(key=lambda p: -p[1].shape[0])
    x = y = riga = 0; pos = {}
    for nome, img, meta in pezzi:
        h, w = img.shape[:2]
        if x + w > LARGO: x, y, riga = 0, y + riga + 1, 0
        pos[nome] = (x, y, w, h, meta); x += w + 1; riga = max(riga, h)
    H = y + riga + 1
    atl = np.zeros((H, LARGO, 4), np.uint8)
    for nome, img, meta in pezzi:
        x, y, w, h, _ = pos[nome]; atl[y:y + h, x:x + w] = img
    Image.fromarray(atl, 'RGBA').save('assets/sprites/fogli.png', optimize=True)
    righe = []
    for nome, *_ in VOCI:
        x, y, w, h, meta = pos[nome]
        righe.append(f"  '{nome}': [{x}, {y}, {w}, {h}{', ' + str(meta['gronda']) if 'gronda' in meta else ''}],")
    js = ("// Generato da tools/fogli/taglia_fogli.py: non modificare a mano.\n"
          "// nome: [x, y, w, h, (facciate) riga della gronda]\n"
          "export const FOGLI_FILE = 'assets/sprites/fogli.png';\n"
          "export const FOGLI = {\n" + "\n".join(righe) + "\n};\n")
    open('src/data/sprite_fogli.js', 'w').write(js)
    print('atlante', LARGO, 'x', H, 'pezzi', len(pezzi))

main()
