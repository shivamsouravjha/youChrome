// This runs when the extension is installed or updated.
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed or updated');
    // Initialization code goes here (e.g., setting up initial storage values).
});

// This runs when the user clicks the extension icon.
chrome.action.onClicked.addListener((tab) => {
    // Check if the current tab is a YouTube video page.
    if (tab.url && tab.url.includes('youtube.com/watch')) {
        // Inject the content script into the current page.
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        }, (injectionResults) => {
            // This callback is called after the script has been injected.
            // You can handle any post-injection logic here if necessary.
            if (chrome.runtime.lastError) {
                console.error('Script injection failed: ', chrome.runtime.lastError.message);
            }
        });
    } else {
        console.log('The extension icon was clicked, but the tab is not a YouTube watch page.');
    }
});

// Listen for messages from content scripts or popup.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Process the message.
    if (message && message.type === 'command') {
        console.log('Received command:', message.command);

        // Add your command handling logic here.
        // For example, if you're expecting to receive a "nextVideo" command:
        if (message.command === 'nextVideo') {
            // Code to trigger going to the next video.
            // You might need to send a message to content.js to perform a click on the next button.
        }

        // Send a response back to the sender if necessary.
        sendResponse({ status: 'success', message: 'Command executed' });
    } else if (message.from === 'content') {
        chrome.runtime.sendMessage(message);

    }

    // Return true to indicate that you will send a response asynchronously.
    // This is necessary if the response will not be sent immediately.
    return true;
});
