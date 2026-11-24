"""Ritaglia i due fogli di personaggi e animali e crea l'atlante usato dal gioco.

Uso: python3 tools/taglia_personaggi.py   (serve numpy, pillow e scipy)
Legge  assets/sprites/originali/personaggi_1.png e personaggi_2.png
Scrive assets/sprites/personaggi.png (tutti gli sprite usati, in fila)
       src/data/sprite_personaggi.js (dove sta ogni sprite nell'atlante)

Ogni figura dei fogli si indica con foglio, riga e posizione nella riga (contando da 0).
Si ritagliano solo le figure che esistono nel gioco: per aggiungerne una basta una riga in USATI.
"""
import json
import numpy as np
import scipy.ndimage as nd
from PIL import Image

FOGLI = {1: 'assets/sprites/originali/personaggi_1.png', 2: 'assets/sprites/originali/personaggi_2.png'}
ALTEZZA_UMANO = 46       # un personaggio di altezza media diventa alto 46 pixel (come Garonio)

# nome: (foglio, riga, posizione)
USATI = {
    # foglio 1
    'contadino_forcone': (1, 0, 0),   # il Gigante
    'contadina_cesto':   (1, 0, 1),   # la Mamma
    'cameriera_vassoio': (1, 0, 6),   # Lola, barista del Night
    'punk_chitarra':     (1, 0, 8),   # banda della sagra
    'veterinario':       (1, 1, 6),   # il Dottor Sbrana
    'bodyguard':         (1, 1, 9),   # Sandokan, il buttafuori
    'operaio_casco':     (1, 2, 0),   # operai del cantiere
    'geometra':          (1, 2, 1),   # il Geometra Ballarin
    'chitarrista':       (1, 2, 8),   # banda della sagra
    'felpa_cappellino':  (1, 2, 9),   # il cugino Ermes
    'anziano_bastone':   (1, 3, 4),   # il Walter pensionato
    'sciura':            (1, 3, 5),   # la Sciura Ines
    'barista':           (1, 4, 0),   # Loredana
    'donna_grembiule':   (1, 4, 1),   # l'Ornella
    'uomo_gilet':        (1, 4, 2),   # il Gino del tabacchi
    'uomo_zaino':        (1, 4, 3),   # il Postino
    'ubriaco_birra':     (1, 4, 4),   # Tarcisio
    'hippie':            (1, 4, 5),   # il Bubetto
    'cuoco':             (1, 0, 3),   # Ottavio delle uova (mercato)
    'pizzaiolo':         (1, 0, 4),   # Gilberto «Salamella» (mercato)
    'grembiule_verde':   (1, 0, 5),   # la Rina della verdura (mercato)
    'maiale':            (1, 5, 2),
    'gallina':           (1, 5, 3),
    'gatto':             (1, 5, 6),
    'cane':              (1, 5, 7),
    # foglio 2
    'contadino_salopette': (2, 0, 0), # il Sor Bortolo (mercato)
    'contadino_patate':  (2, 0, 1),   # il Patata
    'meccanico':         (2, 0, 2),   # Zeno
    'operaio_gilet':     (2, 0, 3),   # operai del cantiere
    'canottiera':        (2, 0, 4),   # Bruno «il Toro»
    'vigilessa':         (2, 1, 2),   # la Vigilessa
    'bullo':             (2, 1, 7),   # il bullo del paese
    'boss_sigaro':       (2, 1, 8),   # Mister Mountain
    'escursionista':     (2, 2, 7),   # il turista tedesco
    'cowboy_fucile':     (2, 2, 8),   # Mister Frank
    'venditore':         (2, 1, 3),   # Nando delle pentole (mercato)
    'completo_cravatta': (2, 3, 4),   # il Consulente
    'anziano_coppola':   (2, 3, 6),   # il Bepi
    'nonna':             (2, 3, 7),   # la Pina
    'ragazzo_zaino':     (2, 3, 8),   # Kevin, garzone di Frank
    'bionda_rosa':       (2, 4, 0),   # la Giusy parrucchiera
    'mora_rosso':        (2, 4, 1),   # Federica
    'mora_occhiali':     (2, 4, 2),   # Ilenia
    'sportiva':          (2, 4, 3),   # Debora
    'tuta_felpa':        (2, 4, 4),   # il Moreno in tuta
    'cappellino_rosso':  (2, 4, 5),   # Ugo, nipote del Patata
    'cresta':            (2, 4, 6),   # l'amico di Bruno
    'bionda_bianco':     (2, 4, 8),   # Sabrina
    'ciccione':          (2, 5, 0),   # il cliente ubriaco
    'barbuto':           (2, 5, 2),   # Rocco il camionista
    'hippie_barba':      (2, 5, 3),   # banda della sagra
    'commendatore':      (2, 5, 8),   # il Commendatore
    # edifici del paese (chiesa, castello, farmacia, dottore, palestra, pizzeria, kebab, meccanico)
    'prete':             (2, 5, 5),   # Don Peppino, il parroco
    'suora':             (2, 5, 7),   # Suor Carmela
    'conte':             (1, 1, 8),   # il Conte della Bassa
    'professore':        (2, 3, 5),   # Ambrogio, il maggiordomo del castello
    'farmacista':        (1, 1, 4),   # il Dottor Pastiglia, farmacista
    'dottore':           (2, 0, 7),   # il Dottor Mutua, medico condotto
    'infermiera':        (2, 0, 8),   # l'infermiera Assunta
    'sergente':          (2, 2, 5),   # il Sergente, istruttore della palestra
    'cuoco2':            (2, 0, 5),   # Gennaro, il pizzaiolo
    'cameriera2':        (1, 3, 9),   # la Concetta, cameriera della pizzeria
    'cameriere':         (2, 0, 6),   # Kemal del kebab
    'garzone_cuffie':    (2, 3, 1),   # Ivan, il garzone di Zeno
}
ANIMALI = {'maiale', 'gallina', 'gatto', 'cane'}


def figure(path):
    """Trova le figure del foglio: [(riga, [box...])], box = (x0, y0, x1, y1, etichette)."""
    a = np.array(Image.open(path).convert('RGB'))
    ai = a.astype(int)
    bg = np.median(ai[0:8].reshape(-1, 3), axis=0)
    diff = np.abs(ai - bg).sum(2)
    lab, n = nd.label(diff > 40)
    objs = nd.find_objects(lab)
    aree = nd.sum(diff > 40, lab, range(1, n + 1))
    grandi, piccoli = [], []
    for i, s in enumerate(objs):
        b = [s[1].start, s[0].start, s[1].stop, s[0].stop]
        if aree[i] > 2500: grandi.append(b)
        elif aree[i] > 20: piccoli.append(b)
    for b in piccoli:   # pezzetti staccati (rebbi del forcone, lenza...) alla figura più vicina
        cx, cy = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
        dist = lambda c: max(0, c[0] - cx, cx - c[2]) + max(0, c[1] - cy, cy - c[3])
        m = min(grandi, key=dist)
        if dist(m) < 25: m[:] = [min(m[0], b[0]), min(m[1], b[1]), max(m[2], b[2]), max(m[3], b[3])]
    righe = {}
    for b in grandi: righe.setdefault((b[1] + b[3]) // 2 // 170, []).append(b)
    righe = [sorted(bs, key=lambda b: b[0]) for _, bs in sorted(righe.items())]
    return a, diff, righe


def ritaglia(a, diff, b):
    x0, y0, x1, y1 = b[0] - 2, b[1] - 2, b[2] + 2, b[3] + 2
    sub = diff[y0:y1, x0:x1]
    isbg = sub <= 40
    lab, n = nd.label(isbg)
    bordo = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    dim = nd.sum(isbg, lab, range(1, n + 1))
    trasp = np.zeros_like(isbg)
    for i in range(1, n + 1):
        m = lab == i
        # sfondo attorno alla figura, o buchi grandi dello stesso colore (tra braccio e fianco)
        if i in bordo or (dim[i - 1] > 30 and sub[m].mean() < 14): trasp |= m
    # ombra a terra sotto i piedi: stesso colore dello sfondo ma più scuro, attaccata allo sfondo
    px = a[y0:y1, x0:x1].astype(float)
    bs = np.maximum(px[..., 2], 1)
    rb, gb = np.median(px[trasp][:, 0] / np.maximum(px[trasp][:, 2], 1)), np.median(px[trasp][:, 1] / np.maximum(px[trasp][:, 2], 1))
    ombra = (np.abs(px[..., 0] / bs - rb) < 0.1) & (np.abs(px[..., 1] / bs - gb) < 0.1) & (px[..., 2] > 40)
    ombra[: int(ombra.shape[0] * 0.85)] = False
    lab2, _ = nd.label(ombra | trasp)
    toccano = set(np.unique(lab2[trasp])) - {0}
    trasp |= np.isin(lab2, list(toccano)) & ombra
    alpha = np.where(trasp, 0, 255).astype(np.uint8)
    return np.dstack([a[y0:y1, x0:x1], alpha])


def riduci(rgba, k):
    """Riduce di k volte: colore medio dei pixel pieni, alfa a soglia."""
    h, w = rgba.shape[:2]
    W, H = max(1, round(w / k)), max(1, round(h / k))
    im = Image.fromarray(rgba, 'RGBA')
    al = np.array(im.getchannel('A').resize((W, H), Image.BOX)).astype(float) / 255
    pre = rgba[..., :3].astype(float) * (rgba[..., 3:] / 255)
    col = np.array(Image.fromarray(pre.clip(0, 255).astype(np.uint8)).resize((W, H), Image.BOX)).astype(float)
    col = (col / np.maximum(al[..., None], 1e-3)).clip(0, 255)
    out = np.dstack([col, np.where(al >= 0.5, 255, 0)]).astype(np.uint8)
    # toglie righe e colonne vuote ai bordi
    ys, xs = np.nonzero(out[..., 3])
    return out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


fogli = {k: figure(p) for k, p in FOGLI.items()}
# scala per foglio: l'altezza tipica di un umano del foglio diventa ALTEZZA_UMANO
scala, rif = {}, {}
for k, (_, _, righe) in fogli.items():
    alt = [b[3] - b[1] for r in righe for b in r]
    rif[k] = float(np.median(alt))
    scala[k] = rif[k] / ALTEZZA_UMANO

pezzi = {}
for nome, (f, r, c) in USATI.items():
    a, diff, righe = fogli[f]
    b = righe[r][c]
    pezzi[nome] = (riduci(ritaglia(a, diff, b), scala[f]), (b[3] - b[1]) / rif[f])

# atlante: tutto in fila su righe larghe 512
X = Y = rh = 0
pos = {}
for nome, (img, k) in pezzi.items():
    h, w = img.shape[:2]
    if X + w > 512: X, Y, rh = 0, Y + rh + 1, 0
    pos[nome] = (X, Y, w, h, round(k, 3))
    X += w + 1; rh = max(rh, h)
atl = np.zeros((Y + rh, 512, 4), np.uint8)
for nome, (x, y, w, h, _) in pos.items(): atl[y:y + h, x:x + w] = pezzi[nome][0]
Image.fromarray(atl, 'RGBA').save('assets/sprites/personaggi.png', optimize=True)

with open('src/data/sprite_personaggi.js', 'w') as fh:
    fh.write('// Generato da tools/taglia_personaggi.py: non modificare a mano.\n')
    fh.write('// nome: [x, y, larghezza, altezza, altezza relativa (1 = umano medio)]\n')
    fh.write("export const ATLANTE_FILE = 'assets/sprites/personaggi.png';\n")
    fh.write('export const ATLANTE = {\n')
    for nome, p in pos.items(): fh.write(f'  {nome}: {json.dumps(list(p))},\n')
    fh.write('};\n')
print(len(pos), 'sprite,', atl.shape[1], 'x', atl.shape[0], 'scale', {k: round(v, 2) for k, v in scala.items()})
