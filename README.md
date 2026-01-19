# PasteAnyway

![Logo](images/logo.png)

This is a Chrome/Edge/Firefox extension that allows you to paste text into any input field, even if the authors of the website have disabled pasting for god knows what reason.

# Usage

There are two methods to use the extension:

1. You can paste into the extension's dropdown box and hit 'Send'. The extension will then 'type' the contents into input field.
2. There's a context menu option that appears when you right-click on any input field. You can select "Paste Anyway" from the context menu, and it will type the text contents of your clipboard directly into that input field.

Safari coming soon? It has a way different extension mechanism

## How It Works

The extension simulates keyboard input character-by-character, bypassing paste event listeners. It also dispatches `input` events for compatibility with modern frameworks like React, Vue, and Angular.

# Development

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
```

## Running Tests

```bash
npm test           # Run tests once
npm run test:watch # Run tests in watch mode
```

## Project Structure

```
PasteAnyway/
├── manifest.json          # Extension manifest (MV3)
├── background.js          # Service worker / background script
├── popup.html/js          # Extension popup UI
├── lib/
│   └── content-script.js  # Injected typing simulation
├── core/                  # Pure functions (tested)
│   ├── url-validation.js
│   ├── keyboard-events.js
│   ├── text-insertion.js
│   └── typing-scheduler.js
└── test-utils/            # Test utilities
```

# Installing a Browser Extension from Source Code

This guide walks you through the process of installing an unpacked/source code version of a browser extension across different browsers.

## Google Chrome

1. **Download and extract the extension source code**
   - Download the extension source code (ZIP file or repository)
   - Extract it to a folder on your computer
   - Make sure the folder contains the `manifest.json` file

2. **Open Chrome's extension page**
   - Type `chrome://extensions` in the address bar and press Enter
   - Or navigate through: Menu (⋮) > More Tools > Extensions

3. **Enable Developer Mode**
   - Toggle on "Developer mode" in the top-right corner

4. **Load the unpacked extension**
   - Click the "Load unpacked" button
   - Navigate to and select the folder containing the extension source code
   - Click "Select Folder"

5. **Verify installation**
   - The extension should now appear in your list of installed extensions
   - You should see the extension icon in your toolbar (or click the puzzle piece icon to access it)

## Mozilla Firefox

1. **Download and extract the extension source code**
   - Download the extension source code
   - Extract it to a folder on your computer
   - Ensure the folder contains the `manifest.json` file

2. **Access temporary extension installation**
   - Type `about:debugging` in the address bar and press Enter
   - Click on "This Firefox" in the left sidebar

3. **Load the temporary extension**
   - Click "Load Temporary Add-on..."
   - Navigate to the extension folder
   - Select the `manifest.json` file
   - Click "Open"

4. **Note about Firefox temporary extensions**
   - Extensions installed this way are temporary and will be removed when Firefox is closed
   - This is mainly for development and testing purposes

5. **For permanent installation (advanced)**
   - For permanent installation in Firefox, you need to sign the extension through Mozilla
   - Or use Firefox Developer Edition/Nightly and modify preferences to allow unsigned extensions

## Microsoft Edge

1. **Download and extract the extension source code**
   - Download the extension source code
   - Extract it to a folder on your computer
   - Make sure the folder has the `manifest.json` file

2. **Open Edge's extension page**
   - Type `edge://extensions` in the address bar and press Enter
   - Or navigate through: Menu (⋯) > Extensions

3. **Enable Developer Mode**
   - Toggle on "Developer mode" at the bottom-left of the page

4. **Load the unpacked extension**
   - Click "Load unpacked"
   - Navigate to and select the folder containing the extension source code
   - Click "Select Folder"

5. **Verify installation**
   - The extension should now appear in your list of installed extensions
   - Check the toolbar for the extension icon

## Troubleshooting

If you encounter issues during installation:

- Make sure the extension's `manifest.json` file is properly formatted
- Check for any console errors by right-clicking the extension icon > Inspect
- Verify that the browser version supports all the APIs used in the extension
- Some extensions may require specific permissions that need to be granted

## Keeping the Extension Updated

When using source code versions of extensions:

- Updates aren't automatic - you'll need to manually update the code
- To update, download the newest source code and repeat the installation process
- In Chrome and Edge, you can often press the "Update" button on the extensions page

## Security Considerations

When installing extensions from source:

- Only install extensions from trusted sources
- Review the code if possible to ensure it doesn't contain malicious elements
- Be cautious with extensions requesting extensive permissions
