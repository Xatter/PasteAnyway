#!/bin/bash
# Build script to create store-ready zip files for browser extension stores

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Extract version from manifest.json
VERSION=$(grep -o '"version": *"[^"]*"' manifest.json | grep -o '[0-9.]*')

if [ -z "$VERSION" ]; then
    echo "Error: Could not extract version from manifest.json"
    exit 1
fi

# Create store directory if it doesn't exist
mkdir -p store

# Define output filename
OUTPUT_FILE="store/paste-anyway-v${VERSION}.zip"

# Remove existing zip if it exists
rm -f "$OUTPUT_FILE"

# Create the zip file with only the necessary extension files
# Excludes: test files, node_modules, scripts, config files, etc.
zip -r "$OUTPUT_FILE" \
    manifest.json \
    background.js \
    popup.html \
    popup.js \
    lib/content-script.js \
    images/icon16.png \
    images/icon48.png \
    images/icon128.png \
    core/keyboard-events.js \
    core/text-insertion.js \
    core/typing-scheduler.js \
    core/url-validation.js

echo ""
echo "Created: $OUTPUT_FILE"
echo ""
echo "Contents:"
unzip -l "$OUTPUT_FILE"
