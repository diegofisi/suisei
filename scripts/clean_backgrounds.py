#!/usr/bin/env python3
"""
clean_backgrounds.py -- remove baked-in backgrounds from the Suisei outfit renders.

For every JPEG listed in TARGETS (in public/img/) this writes a sibling
public/img/<stem>.png with an alpha channel where the background used to be.

Why a flood fill and not a colour key: the character is drawn with dark
outlines, and she wears both pure-white (skirt, gloves, boots) and pure-black
(socks, gloves, ribbons) pieces.  A global colour key would punch holes in
those.  Instead we build a permissive "background-like" mask and then keep only
the part of it that is 4-connected to the image border.

Run with no arguments:
    python scripts/clean_backgrounds.py
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter



ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "public" / "img"

TARGETS = [
    "2018-03_indie-original.jpg",
    "2019-12_hololive-default.jpg",
    "2020-11_hololive-2nd-amakara.jpg",
    "2021-10_stellar-into-the-galaxy.jpg",
    "2023-01_shout-in-crisis.jpg",
    "2024-03_oriental-suit.jpg",
    "2025-02_budokan-comet.jpg",
]

PAD = 12          # padding kept around the content bounding box
FEATHER = 0.8     # gaussian radius used to soften the alpha edge

# Per-file threshold overrides, keyed by file stem.  Anything not listed here
# uses the defaults in DEFAULTS below.  Keys:
#   kind      : "black" | "white" | "checker"  (forces the detected type)
#   lum_max   : black  -- background is darker than this
#   lum_min   : white/checker -- background is brighter than this
#   sat_max   : white/checker -- background is less saturated than this
#   defringe  : black -- width in px of the dark-halo band to fade out
OVERRIDES = {}

DEFAULTS = {
    "black": {"lum_max": 14, "defringe": 2},
    "white": {"lum_min": 228, "sat_max": 16},
    "checker": {
        "lum_min": 170,
        "sat_max": 22,
        # enclosed-pocket detection (see checker_pockets)
        "pocket_min_area": 120,
        "pocket_score": 0.15,
        "pocket_grey": 0.04,
        "pocket_reach": 30,
    },
}


# --------------------------------------------------------------------------- #
# background classification
# --------------------------------------------------------------------------- #
def border_pixels(rgb, width=3):
    return np.concatenate(
        [
            rgb[:width].reshape(-1, 3),
            rgb[-width:].reshape(-1, 3),
            rgb[:, :width].reshape(-1, 3),
            rgb[:, -width:].reshape(-1, 3),
        ]
    )


def detect_kind(rgb):
    b = border_pixels(rgb).astype(np.float32)
    lum = b.mean(axis=1)
    dark = float((lum < 24).mean())
    bright = float((lum > 244).mean())
    if dark > 0.70:
        return "black"
    if bright > 0.85:
        return "white"
    return "checker"


# --------------------------------------------------------------------------- #
# background-like mask
# --------------------------------------------------------------------------- #
def background_mask(rgb, kind, cfg):
    f = rgb.astype(np.int16)
    lum = f.mean(axis=2)
    sat = f.max(axis=2) - f.min(axis=2)
    if kind == "black":
        return lum < cfg["lum_max"]
    # white and checkerboard are both "bright and grey"
    return (sat < cfg["sat_max"]) & (lum > cfg["lum_min"])


# --------------------------------------------------------------------------- #
# scanline flood fill from the image border (4-connected)
# --------------------------------------------------------------------------- #
def flood_from_border(mask):
    h, w = mask.shape
    out = np.zeros((h, w), dtype=bool)
    stack = []

    for x in np.flatnonzero(mask[0]):
        stack.append((int(x), 0))
    for x in np.flatnonzero(mask[h - 1]):
        stack.append((int(x), h - 1))
    for y in np.flatnonzero(mask[:, 0]):
        stack.append((0, int(y)))
    for y in np.flatnonzero(mask[:, w - 1]):
        stack.append((w - 1, int(y)))

    while stack:
        x, y = stack.pop()
        if out[y, x] or not mask[y, x]:
            continue
        row_m, row_o = mask[y], out[y]
        x1 = x
        while x1 > 0 and row_m[x1 - 1] and not row_o[x1 - 1]:
            x1 -= 1
        x2 = x
        while x2 < w - 1 and row_m[x2 + 1] and not row_o[x2 + 1]:
            x2 += 1
        out[y, x1 : x2 + 1] = True
        for ny in (y - 1, y + 1):
            if 0 <= ny < h:
                seg = mask[ny, x1 : x2 + 1] & ~out[ny, x1 : x2 + 1]
                idx = np.flatnonzero(seg)
                if idx.size:
                    starts = idx[np.r_[True, np.diff(idx) > 1]]
                    for s in starts:
                        stack.append((x1 + int(s), ny))
    return out


# --------------------------------------------------------------------------- #
# small binary morphology helpers (3x3, no scipy available)
# --------------------------------------------------------------------------- #
def _shifted_or(m):
    o = m.copy()
    o[1:, :] |= m[:-1, :]
    o[:-1, :] |= m[1:, :]
    o[:, 1:] |= m[:, :-1]
    o[:, :-1] |= m[:, 1:]
    return o


def dilate(m, n=1):
    for _ in range(n):
        m = _shifted_or(m)
    return m


def erode(m, n=1):
    return ~dilate(~m, n)


def label_components(mask):
    """4-connected scanline labelling with union-find (no scipy here either)."""
    h, w = mask.shape
    lab = np.zeros((h, w), dtype=np.int32)
    parent = [0]
    nxt = 1

    def find(a):
        while parent[a] != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[max(ra, rb)] = min(ra, rb)

    for y in range(h):
        idx = np.flatnonzero(mask[y])
        if idx.size == 0:
            continue
        breaks = np.r_[0, np.flatnonzero(np.diff(idx) > 1) + 1, idx.size]
        for i in range(len(breaks) - 1):
            x1 = int(idx[breaks[i]])
            x2 = int(idx[breaks[i + 1] - 1])
            ex = np.unique(lab[y - 1, x1 : x2 + 1]) if y > 0 else np.zeros(0, np.int32)
            ex = ex[ex > 0]
            if ex.size == 0:
                l = nxt
                parent.append(nxt)
                nxt += 1
            else:
                l = int(ex.min())
                for e in ex:
                    union(l, int(e))
            lab[y, x1 : x2 + 1] = l

    remap = np.array([find(i) for i in range(nxt)], dtype=np.int32)
    return remap[lab]


# --------------------------------------------------------------------------- #
# enclosed checkerboard pockets
# --------------------------------------------------------------------------- #
def checker_pockets(rgb, bg_like, bg, cfg):
    """Find checkerboard that the border flood could not reach.

    Some of these renders have holes in the silhouette -- inside a ponytail
    loop, between an arm and the torso -- where the fake-transparency
    checkerboard shows through but is not 4-connected to the image border.

    A global lattice model does not work (the cell pitch drifts across these
    images), so instead each unreachable component is scored on the local
    signature of the pattern: large FLAT patches of exactly the background grey
    and exactly the background white.  Drawn clothing, even white clothing, is
    shaded and almost never scores.
    """
    lum = rgb.astype(np.float32).mean(axis=2)
    sat = rgb.astype(np.float32).max(axis=2) - rgb.astype(np.float32).min(axis=2)

    b = lum[bg]
    if b.size == 0:
        return np.zeros_like(bg)
    mid = b[(b > 150) & (b < 235)]
    gref = float(np.median(mid)) if mid.size > 50 else 204.0
    hi = b[b >= 242]
    wref = float(np.median(hi)) if hi.size > 50 else 255.0

    li = Image.fromarray(np.clip(lum, 0, 255).astype(np.uint8), "L")
    hi_f = np.asarray(li.filter(ImageFilter.MaxFilter(3))).astype(np.float32)
    lo_f = np.asarray(li.filter(ImageFilter.MinFilter(3))).astype(np.float32)
    flat = (hi_f - lo_f) <= 8

    grey_flat = flat & (np.abs(lum - gref) <= 7) & (sat <= 10)
    white_flat = flat & (lum >= wref - 7) & (sat <= 10)
    chk = grey_flat | white_flat

    lab = label_components(bg_like & ~bg)
    ids, counts = np.unique(lab[lab > 0], return_counts=True)

    out = np.zeros_like(bg)
    strong_boxes = []
    weak = []
    for i, c in zip(ids, counts):
        if c < cfg["pocket_min_area"]:
            continue
        sel = lab == i
        score = float(chk[sel].mean())
        if score < cfg["pocket_score"]:
            continue
        ys, xs = np.nonzero(sel)
        box = (xs.min(), ys.min(), xs.max(), ys.max())
        if float(grey_flat[sel].mean()) >= cfg["pocket_grey"]:
            out |= sel
            strong_boxes.append(box)
        else:
            weak.append((sel, box))

    # A pocket split by a hair strand leaves an all-white half that has no grey
    # squares of its own; adopt it when it sits inside a confirmed pocket.
    r = cfg["pocket_reach"]
    for sel, (x0, y0, x1, y1) in weak:
        for bx0, by0, bx1, by1 in strong_boxes:
            if x0 >= bx0 - r and y0 >= by0 - r and x1 <= bx1 + r and y1 <= by1 + r:
                out |= sel
                break
    return out


# --------------------------------------------------------------------------- #
# main per-file pipeline
# --------------------------------------------------------------------------- #
def process(path):
    stem = path.stem
    src = Image.open(path).convert("RGB")
    rgb = np.asarray(src)
    h, w, _ = rgb.shape

    ov = OVERRIDES.get(stem, {})
    kind = ov.get("kind") or detect_kind(rgb)
    cfg = dict(DEFAULTS[kind])
    cfg.update({k: v for k, v in ov.items() if k != "kind"})

    bg_like = background_mask(rgb, kind, cfg)
    bg = flood_from_border(bg_like)
    if kind == "checker":
        bg = bg | checker_pockets(rgb, bg_like, bg, cfg)
    keep = ~bg

    # 1px erosion pulls the alpha edge just inside the outline so that the
    # JPEG ringing halo is dropped, then a light blur feathers it back out.
    alpha = (erode(keep, 1).astype(np.float32)) * 255.0
    alpha = np.asarray(
        Image.fromarray(alpha.astype(np.uint8), "L").filter(
            ImageFilter.GaussianBlur(FEATHER)
        )
    ).astype(np.float32)
    alpha[bg] = 0.0  # never let the blur bleed opacity back into the background

    # De-fringe: on black backgrounds the JPEG leaves a dark-grey halo hugging
    # the outline.  Fade those very dark pixels near the cut instead of leaving
    # a hard black rim.
    if kind == "black":
        band = dilate(bg, int(cfg.get("defringe", 2))) & keep
        lum = rgb.astype(np.float32).mean(axis=2)
        fade = np.clip(lum / 30.0, 0.55, 1.0)
        alpha = np.where(band, alpha * fade, alpha)

    out = np.dstack([rgb, np.clip(alpha, 0, 255).astype(np.uint8)])
    im = Image.fromarray(out, "RGBA")

    # crop to content + padding
    bbox = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if bbox:
        x0, y0, x1, y1 = bbox
        im = im.crop(
            (max(0, x0 - PAD), max(0, y0 - PAD), min(w, x1 + PAD), min(h, y1 + PAD))
        )

    dst = path.with_suffix(".png")
    im.save(dst)
    removed = 100.0 * float(bg.mean())
    return stem, (w, h), im.size, removed, kind


def main():
    print("%-38s%-10s%-14s%-14s%s" % ("file", "kind", "source", "output", "removed"))
    print("-" * 88)
    for name in TARGETS:
        p = IMG_DIR / name
        if not p.exists():
            print("%-38sMISSING" % name)
            continue
        stem, ssize, osize, removed, kind = process(p)
        print(
            "%-38s%-10s%-14s%-14s%5.1f%%"
            % (
                stem + ".png",
                kind,
                "%dx%d" % ssize,
                "%dx%d" % osize,
                removed,
            )
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
