"""Maschera dello sfondo magenta (chroma key) dei fogli disegnati."""
import numpy as np
from scipy import ndimage as ndi

def maschera(a, minimo=200, ombre=False, jpeg=False):
    """a: array HxWx3 int. Restituisce True dove c'è il disegno."""
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mn = np.minimum(r, b)
    bg = (g < 0.45 * mn) & (np.abs(r - b) < 25) & (mn > minimo)
    if ombre:  # ombre viola dipinte sotto alberi e oggetti
        bg |= (g < 0.5 * mn) & (np.abs(r - b) < 30) & (mn > 75)
    # bordi sporchi del JPEG: pixel rosati attaccati allo sfondo
    for _ in range(3 if jpeg else 2):
        vicino = ndi.binary_dilation(bg)
        if jpeg: rosa = (r > g + 35) & (b > g + 35) & (np.abs(r - b) < 60) & (g < 0.8 * mn)
        else: rosa = (r > g + 60) & (b > g + 60) & (np.abs(r - b) < 45) & (g < 0.6 * mn)
        bg |= vicino & rosa
    return ~bg
