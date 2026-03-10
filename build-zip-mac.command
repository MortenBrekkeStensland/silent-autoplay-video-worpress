#!/bin/bash
# Double-click this file on Mac to create a WordPress-ready plugin zip.

cd "$(dirname "$0")"

ZIP_NAME="silent-autoplay-video.zip"

rm -f "$ZIP_NAME"

zip -r "$ZIP_NAME" . \
  -x ".git/*" \
  -x ".gitignore" \
  -x ".DS_Store" \
  -x "build-zip-mac.command" \
  -x "build-zip-pc.bat" \
  -x "README.md" \
  -x "CLAUDE.md" \
  -x "*.zip"

echo ""
echo "Created: $ZIP_NAME"
echo ""
read -n 1 -s -r -p "Press any key to close..."
