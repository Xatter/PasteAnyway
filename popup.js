// popup.js - Extension logic
document.addEventListener('DOMContentLoaded', function() {
  const pasteText = document.getElementById('pasteText');
  const sendButton = document.getElementById('sendButton');
  const status = document.getElementById('status');

  // Auto-focus the textarea when popup opens
  pasteText.focus();

  sendButton.addEventListener('click', function() {
    const text = pasteText.value;
    
    if (!text) {
      status.textContent = 'Please enter some text first.';
      return;
    }

    status.textContent = 'Sending text...';
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: simulateTyping,
        args: [text]
      }).then(() => {
        status.textContent = 'Text sent successfully!';
      }).catch((error) => {
        status.textContent = 'Error: ' + error.message;
      });
    });
  });
});

// Function that will be injected into the page to simulate typing
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