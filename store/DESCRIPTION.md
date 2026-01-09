# Chrome Web Store Description

## Short Description (132 characters max)
Bypass paste restrictions on websites. Type your clipboard content character-by-character when sites block normal pasting.

## Full Description

**Paste Anyway** lets you paste text on websites that have disabled the paste function.

### The Problem
Many websites disable pasting in form fields for "security" reasons - password confirmations, email verifications, or payment forms. This forces you to manually retype information, which is time-consuming and error-prone.

### The Solution
Paste Anyway bypasses these restrictions by simulating keyboard input. Instead of using the browser's paste function (which sites can block), it types your text character-by-character, just as if you were typing it yourself.

### How to Use

**Method 1: Extension Popup**
1. Click the Paste Anyway icon in your toolbar
2. Paste or type your text in the popup
3. Click in the target input field on the webpage
4. Click "Send" in the popup

**Method 2: Context Menu (Recommended)**
1. Copy text to your clipboard
2. Right-click on any input field
3. Select "Paste Anyway"
4. Your text is typed automatically

### Features
- Works on most websites that block pasting
- Compatible with React, Vue, Angular, and other modern frameworks
- Uses realistic keyboard event simulation
- No data collection or external connections
- Lightweight and fast

### Privacy
- All processing happens locally in your browser
- No data is sent to external servers
- Clipboard is only accessed when you explicitly use the extension
- No tracking, analytics, or advertising

### Limitations
- Cannot work on browser internal pages (chrome://, about:, etc.)
- Cannot work on browser extension stores (for security)
- Very long text may take a moment to "type"
