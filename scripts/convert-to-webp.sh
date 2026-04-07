#!/usr/bin/env bash
# convert-to-webp.sh
# Converts all extracted organ PNGs and existing bpart_images/ and bodyimage/ PNGs to WebP.
# Quality: -q 90 preserves medical illustration fidelity.
#
# Usage: bash scripts/convert-to-webp.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Check for cwebp
if ! command -v cwebp &> /dev/null; then
  echo "cwebp not found. Installing via brew..."
  brew install webp
fi

echo "Using cwebp: $(which cwebp)"
echo ""

# Convert extracted organ PNGs to WebP (from scripts/extract-base64.mjs output)
ORGANS_DIR="$ROOT_DIR/public/assets/organs"
organ_webp_count=0
if [ -d "$ORGANS_DIR" ]; then
  for png in "$ORGANS_DIR"/*.png; do
    [ -f "$png" ] || continue
    base="${png%.png}"
    cwebp -q 90 "$png" -o "${base}.webp" -quiet
    rm "$png"
    organ_webp_count=$((organ_webp_count + 1))
  done
fi
echo "Organs: $organ_webp_count extracted organ PNGs converted to WebP in public/assets/organs/"

# Convert bpart_images/ PNGs to WebP
BPART_DIR="$ROOT_DIR/bpart_images"
BPART_OUT="$ROOT_DIR/public/assets/body-parts"
mkdir -p "$BPART_OUT"
bpart_webp_count=0
if [ -d "$BPART_DIR" ]; then
  for png in "$BPART_DIR"/*.png; do
    [ -f "$png" ] || continue
    filename="$(basename "$png" .png)"
    cwebp -q 90 "$png" -o "$BPART_OUT/${filename}.webp" -quiet
    bpart_webp_count=$((bpart_webp_count + 1))
  done
fi
echo "Body-parts: $bpart_webp_count WebP files created in public/assets/body-parts/"

# Convert bodyimage/ PNGs to WebP (body system overview images)
BODYIMAGE_DIR="$ROOT_DIR/bodyimage"
SYSTEMS_OUT="$ROOT_DIR/public/assets/systems"
mkdir -p "$SYSTEMS_OUT"
systems_webp_count=0
if [ -d "$BODYIMAGE_DIR" ]; then
  for png in "$BODYIMAGE_DIR"/*.png; do
    [ -f "$png" ] || continue
    filename="$(basename "$png" .png)"
    cwebp -q 90 "$png" -o "$SYSTEMS_OUT/${filename}.webp" -quiet
    systems_webp_count=$((systems_webp_count + 1))
  done
fi
# Also convert any extracted system PNGs (from extract-base64.mjs BODY_SYSTEMS thumbnails)
for png in "$SYSTEMS_OUT"/*.png; do
  [ -f "$png" ] || continue
  base="${png%.png}"
  cwebp -q 90 "$png" -o "${base}.webp" -quiet
  rm "$png"
  systems_webp_count=$((systems_webp_count + 1))
done
echo "Systems: $systems_webp_count WebP files created in public/assets/systems/"

echo ""
echo "Total:"
echo "  public/assets/organs/: $(ls "$ORGANS_DIR"/*.webp 2>/dev/null | wc -l | tr -d ' ') WebP files"
echo "  public/assets/body-parts/: $(ls "$BPART_OUT"/*.webp 2>/dev/null | wc -l | tr -d ' ') WebP files"
echo "  public/assets/systems/: $(ls "$SYSTEMS_OUT"/*.webp 2>/dev/null | wc -l | tr -d ' ') WebP files"
