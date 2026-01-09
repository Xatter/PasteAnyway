# Paste Anyway - Known Restrictions

This document lists known restrictions and limitations of the Paste Anyway extension.

## Pages Where Extension Cannot Work

Due to browser security policies, Paste Anyway cannot operate on certain pages:

### Browser Internal Pages
- `chrome://` pages (Chrome settings, extensions, etc.)
- `chrome-extension://` pages (other extension pages)
- `about:` pages (Firefox internal pages)
- `moz-extension://` pages (Firefox extension pages)
- `edge://` pages (Microsoft Edge internal pages)

### Browser Extension Stores
- Chrome Web Store (`chromewebstore.google.com`)
- Firefox Add-ons (`addons.mozilla.org`)
- Microsoft Edge Add-ons (`microsoftedge.microsoft.com/addons`)

### File URLs
- `file://` URLs may have limited functionality depending on browser settings
- Some browsers restrict extension access to local files by default
- To enable on file URLs: Go to `chrome://extensions`, find Paste Anyway, click "Details", and enable "Allow access to file URLs"

## Technical Limitations

### Character Typing Speed
- Text is typed character-by-character with a 10ms delay between characters
- Very long text (1000+ characters) may take several seconds to complete
- This is intentional to ensure compatibility with form validation and frameworks

### Framework Compatibility
- Works with React, Vue, Angular, and most modern frameworks
- Dispatches proper `input`, `keydown`, `keypress`, and `keyup` events
- Some highly customized input components may not respond correctly

### Clipboard Access
- Requires clipboard permission to use the context menu "Paste Anyway" option
- If clipboard access is denied, use the popup method instead (paste directly into popup)

## Troubleshooting

### Extension Icon Not Appearing
- Ensure the extension is enabled in `chrome://extensions`
- Try pinning the extension to your toolbar

### "Paste Anyway" Context Menu Not Showing
- Right-click must be on an editable element (input, textarea, or contentEditable)
- Won't appear on non-editable page elements

### Text Not Being Typed
- Check if the page is in the restricted list above
- Ensure the input field is focused
- Some fields with heavy JavaScript validation may interfere

### Error Badge on Extension Icon
- A red badge indicates the current page is restricted
- This is expected behavior on browser internal pages and extension stores
