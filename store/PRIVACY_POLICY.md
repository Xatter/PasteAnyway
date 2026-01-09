# Privacy Policy for Paste Anyway

**Last Updated:** January 2025

## Overview

Paste Anyway is a browser extension that helps users paste text on websites that have disabled the paste function. This privacy policy explains what data the extension accesses and how it is used.

## Data Collection

**Paste Anyway does not collect, store, or transmit any personal data.**

The extension operates entirely within your browser and does not communicate with any external servers.

## Permissions Explained

The extension requires the following browser permissions:

### clipboardRead
- **Purpose:** To read text from your clipboard when you use the "Paste Anyway" context menu option
- **When accessed:** Only when you explicitly right-click and select "Paste Anyway"
- **Data handling:** Clipboard content is read temporarily, used to simulate typing, and is never stored or transmitted

### activeTab
- **Purpose:** To identify the current tab where you want to paste text
- **When accessed:** Only when you interact with the extension
- **Data handling:** Tab information is used only to inject the typing script; no browsing data is stored or transmitted

### scripting
- **Purpose:** To inject the script that simulates keyboard input on the target webpage
- **When accessed:** Only when you use the extension to paste text
- **Data handling:** The script runs locally and does not collect any page content

### contextMenus
- **Purpose:** To add the "Paste Anyway" option to your right-click menu
- **Data handling:** No data is collected through this feature

### storage
- **Purpose:** Reserved for potential future settings/preferences
- **Current usage:** Not actively used for data storage
- **Data handling:** Any future stored data would remain local to your browser

### host_permissions (<all_urls>)
- **Purpose:** To allow the extension to work on any website where paste is blocked
- **Data handling:** The extension does not read or collect any website content; it only simulates keyboard input in form fields

## Data Storage

Paste Anyway does not store:
- Clipboard history
- Browsing history
- Form data
- Personal information
- Usage analytics

## Third-Party Services

Paste Anyway does not use any third-party services, analytics, or advertising.

## Data Transmission

Paste Anyway does not transmit any data. All functionality operates locally within your browser.

## Security

- The extension uses Manifest V3, Chrome's latest security standard
- No external network connections are made
- The extension cannot access browser internal pages or extension stores

## Changes to This Policy

Any changes to this privacy policy will be reflected in the extension update notes and this document.

## Contact

If you have questions about this privacy policy, please open an issue on the project's GitHub repository.

## Summary

- No data collection
- No external connections
- No tracking or analytics
- All processing is local to your browser
- Clipboard access only when you explicitly use the extension
