# -*- coding: utf-8 -*-
"""Re-encode the catalog preview videos at CRF 26 and drop their (never-heard,
autoplay-muted) audio tracks. Writes beside the original as `.new.mp4` so the
result can be inspected before anything is replaced."""
import os, subprocess, sys

ROOT = "public/projects/catalog"
APPLY = "--apply" in sys.argv


def probe(path, entries):
    return subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", entries, "-of", "csv=p=0", path],
        capture_output=True, text=True).stdout.strip()


videos = []
for dirpath, _, files in os.walk(ROOT):
    for f in files:
        if f.lower().endswith(".mp4") and not f.endswith(".new.mp4"):
            videos.append(os.path.join(dirpath, f))

before = after = 0
mismatched = []
rows = []
for src in sorted(videos):
    out = src[:-len(".mp4")] + ".new.mp4"
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", src,
         "-c:v", "libx264", "-crf", "26", "-preset", "slow",
         "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", out],
        check=True)

    dim_old = probe(src, "stream=width,height,sample_aspect_ratio")
    dim_new = probe(out, "stream=width,height,sample_aspect_ratio")
    if dim_old != dim_new:
        mismatched.append("%s : %s -> %s" % (src, dim_old, dim_new))

    b, a = os.path.getsize(src), os.path.getsize(out)
    before += b
    after += a
    rel = os.path.relpath(src, ROOT)
    rows.append("%-56s %7.0f -> %7.0f KB  (%3.0f%%)" % (rel, b / 1024, a / 1024, 100.0 * a / b))

print("\n".join(rows))
print("-" * 40)
print("total: %.2f MB -> %.2f MB   saved %.2f MB (%.0f%%)" % (
    before / 1048576, after / 1048576, (before - after) / 1048576,
    100 - 100.0 * after / before))
print("dimension/SAR changes:", mismatched or "none - all identical")

if APPLY and not mismatched:
    for src in sorted(videos):
        out = src[:-len(".mp4")] + ".new.mp4"
        os.replace(out, src)
    print("applied: originals replaced")
elif APPLY:
    print("NOT applied - dimensions changed, inspect first")
