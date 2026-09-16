# -*- coding: utf-8 -*-
"""Generate 640w / 1280w variants for every catalog webp and record the
intrinsic width of each original so the srcset descriptors are honest."""
import io, os, subprocess, json, sys

ROOT = "public/projects/catalog"
WIDTHS = (640, 1280)

def probe_width(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height", "-of", "csv=p=0", path],
        capture_output=True, text=True).stdout.strip()
    w, h = out.split(",")[:2]
    return int(w), int(h)

originals = []
for dirpath, _, files in os.walk(ROOT):
    for f in files:
        if not f.lower().endswith(".webp"):
            continue
        if any(f.endswith("-%dw.webp" % w) for w in WIDTHS):
            continue
        originals.append(os.path.join(dirpath, f))

sizes = {}
made = skipped = 0
before = after = 0
for path in sorted(originals):
    w, h = probe_width(path)
    url = "/" + os.path.relpath(path, "public").replace(os.sep, "/")
    sizes[url] = [w, h]
    before += os.path.getsize(path)
    stem = path[:-len(".webp")]
    for target in WIDTHS:
        out = "%s-%dw.webp" % (stem, target)
        if target >= w:                       # never upscale
            skipped += 1
            continue
        if os.path.exists(out):
            after += os.path.getsize(out)
            continue
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-i", path,
             "-vf", "scale=%d:-2:flags=lanczos" % target,
             "-c:v", "libwebp", "-quality", "80", "-compression_level", "6", out],
            check=True)
        after += os.path.getsize(out)
        made += 1

io.open("app/mediaSizes.ts", "w", encoding="utf-8").write(
    "// Generated - intrinsic pixel size of every catalog image, so the srcset\n"
    "// width descriptors match reality. Regenerate with scripts/gen-variants.\n"
    "export const mediaSizes: Record<string, [number, number]> = "
    + json.dumps(sizes, indent=2, ensure_ascii=False).replace('"', '"')
    + ";\n")

print("originals: %d, variants made: %d, skipped(upscale): %d" % (len(originals), made, skipped))
print("originals total: %.1f MB, variants total: %.1f MB" % (before/1048576, after/1048576))
