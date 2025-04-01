chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "paste-anyway",
        title: "Paste Anyway",
        contexts: ["editable"]
    });
    console.log("Context menu created");
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log("Context menu clicked:", info.menuItemId);

    if (info.menuItemId === "paste-anyway") {
        // Check if we're on a restricted page
        if (tab.url.startsWith("chrome://") || tab.url.includes("chrome.google.com/webstore")) {
            // Show a notification or alert that this page is restricted
            chrome.action.setBadgeText({ text: "!" });
            chrome.action.setBadgeBackgroundColor({ color: "#F44336" });

            // Clear the badge after 3 seconds
            setTimeout(() => {
                chrome.action.setBadgeText({ text: "" });
            }, 3000);

            console.log("Cannot run on restricted page:", tab.url);
            return;
        }

        // Execute a content script that will both read the clipboard and simulate typing
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: pasteViaSimulation
        }).catch(error => {
            console.error("Error executing script:", error);
        });
    }
});

// This function is injected into the page and handles both clipboard reading and typing
function pasteViaSimulation() {
    // First read from clipboard in the page context
    navigator.clipboard.readText()
        .then(text => {
            if (text) {
                console.log("Got clipboard text, length:", text.length);
                // Simulate typing with the clipboard text
                simulateTyping(text);
            }
        })
        .catch(error => {
            console.error("Error reading clipboard:", error);
            alert("Unable to access clipboard. Make sure you've granted clipboard permission.");
        });

    // Simulate typing function embedded directly here
    function simulateTyping(text) {
        function typeCharacter(char) {
            const event = new KeyboardEvent('keydown', {
                key: char,
                code: 'Key' + char.toUpperCase(),
                charCode: char.charCodeAt(0),
                keyCode: char.charCodeAt(0),
                which: char.charCodeAt(0),
                bubbles: true
            });

            document.activeElement.dispatchEvent(event);

            // Also dispatch a keypress event for compatibility
            const pressEvent = new KeyboardEvent('keypress', {
                key: char,
                code: 'Key' + char.toUpperCase(),
                charCode: char.charCodeAt(0),
                keyCode: char.charCodeAt(0),
                which: char.charCodeAt(0),
                bubbles: true
            });
            document.activeElement.dispatchEvent(pressEvent);

            // Insert the character into the focused element if it's an input or textarea
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                const start = document.activeElement.selectionStart;
                const end = document.activeElement.selectionEnd;
                const value = document.activeElement.value;

                document.activeElement.value = value.substring(0, start) + char + value.substring(end);
                document.activeElement.selectionStart = document.activeElement.selectionEnd = start + 1;
            } else if (document.activeElement.isContentEditable) {
                // For contentEditable elements
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const textNode = document.createTextNode(char);
                range.deleteContents();
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                range.setEndAfter(textNode);
                selection.removeAllRanges();
                selection.addRange(range);
            }

            // Dispatch keyup event
            const upEvent = new KeyboardEvent('keyup', {
                key: char,
                code: 'Key' + char.toUpperCase(),
                charCode: char.charCodeAt(0),
                keyCode: char.charCodeAt(0),
                which: char.charCodeAt(0),
                bubbles: true
            });
            document.activeElement.dispatchEvent(upEvent);
        }

        // Add a small delay between characters to make it more realistic
        const delay = 10; // milliseconds between each character

        // Type each character with a delay
        for (let i = 0; i < text.length; i++) {
            setTimeout(() => {
                typeCharacter(text[i]);
            }, i * delay);
        }

        console.log(`Typed ${text.length} characters`);
    }
}

// This function must be identical to the one in popup.js
function simulateTyping(text) {
    function typeCharacter(char) {
        const event = new KeyboardEvent('keydown', {
            key: char,
            code: 'Key' + char.toUpperCase(),
            charCode: char.charCodeAt(0),
            keyCode: char.charCodeAt(0),
            which: char.charCodeAt(0),
            bubbles: true
        });

        document.activeElement.dispatchEvent(event);

        // Also dispatch a keypress event for compatibility
        const pressEvent = new KeyboardEvent('keypress', {
            key: char,
            code: 'Key' + char.toUpperCase(),
            charCode: char.charCodeAt(0),
            keyCode: char.charCodeAt(0),
            which: char.charCodeAt(0),
            bubbles: true
        });
        document.activeElement.dispatchEvent(pressEvent);

        // Insert the character into the focused element if it's an input or textarea
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            const start = document.activeElement.selectionStart;
            const end = document.activeElement.selectionEnd;
            const value = document.activeElement.value;

            document.activeElement.value = value.substring(0, start) + char + value.substring(end);
            document.activeElement.selectionStart = document.activeElement.selectionEnd = start + 1;
        } else if (document.activeElement.isContentEditable) {
            // For contentEditable elements
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const textNode = document.createTextNode(char);
            range.deleteContents();
            range.insertNode(textNode);
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        // Dispatch keyup event
        const upEvent = new KeyboardEvent('keyup', {
            key: char,
            code: 'Key' + char.toUpperCase(),
            charCode: char.charCodeAt(0),
            keyCode: char.charCodeAt(0),
            which: char.charCodeAt(0),
            bubbles: true
        });
        document.activeElement.dispatchEvent(upEvent);
    }

    // Add a small delay between characters to make it more realistic
    const delay = 10; // milliseconds between each character

    // Type each character with a delay
    for (let i = 0; i < text.length; i++) {
        setTimeout(() => {
            typeCharacter(text[i]);
        }, i * delay);
    }

    return `Typed ${text.length} characters`;
}