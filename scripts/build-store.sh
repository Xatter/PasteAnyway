#!/bin/bash
# Build script to create store-ready zip files for browser extension stores

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Extract version from store/chrome/manifest.json (authoritative source)
VERSION=$(grep -o '"version": *"[^"]*"' store/chrome/manifest.json | grep -o '[0-9.]*')

if [ -z "$VERSION" ]; then
    echo "Error: Could not extract version from store/chrome/manifest.json"
    exit 1
fi

# Parse arguments
BUILD_CHROME=false
BUILD_FIREFOX=false

if [ $# -eq 0 ]; then
    # No arguments = build both
    BUILD_CHROME=true
    BUILD_FIREFOX=true
else
    for arg in "$@"; do
        case $arg in
            chrome)
                BUILD_CHROME=true
                ;;
            firefox)
                BUILD_FIREFOX=true
                ;;
            *)
                echo "Usage: $0 [chrome] [firefox]"
                echo "  No arguments: build both"
                echo "  chrome: build Chrome extension only"
                echo "  firefox: build Firefox extension only"
                exit 1
                ;;
        esac
    done
fi

# Common files to include in both builds
COMMON_FILES=(
    background.js
    popup.html
    popup.js
    lib/content-script.js
    images/icon16.png
    images/icon48.png
    images/icon128.png
    core/keyboard-events.js
    core/text-insertion.js
    core/typing-scheduler.js
    core/url-validation.js
)

build_extension() {
    local browser=$1
    local manifest_path="store/${browser}/manifest.json"
    local output_file="store/${browser}/paste-anyway-v${VERSION}.zip"

    echo "Building ${browser} extension..."

    # Remove existing zip if it exists
    rm -f "$output_file"

    # Create a temporary directory for the build
    local tmp_dir=$(mktemp -d)
    trap "rm -rf $tmp_dir" EXIT

    # Copy manifest
    cp "$manifest_path" "$tmp_dir/manifest.json"

    # Copy common files
    for file in "${COMMON_FILES[@]}"; do
        local dir=$(dirname "$file")
        mkdir -p "$tmp_dir/$dir"
        cp "$file" "$tmp_dir/$file"
    done

    # Create zip from the temporary directory
    (cd "$tmp_dir" && zip -r "$PROJECT_ROOT/$output_file" .)

    # Clean up trap for this iteration
    rm -rf "$tmp_dir"
    trap - EXIT

    echo ""
    echo "Created: $output_file"
    echo ""
    echo "Contents:"
    unzip -l "$output_file"
    echo ""
}

if [ "$BUILD_CHROME" = true ]; then
    build_extension "chrome"
fi

if [ "$BUILD_FIREFOX" = true ]; then
    build_extension "firefox"
fi

echo "Done!"
