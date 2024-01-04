let extensionEnabled = true; // Default state of the extension

// Function to initialize or fetch the state
function initializeState() {
    console.log("Initializing state...");
    chrome.storage.sync.get('extensionEnabled', function(data) {
        if (data.hasOwnProperty('extensionEnabled')) {
            extensionEnabled = data.extensionEnabled;
        } else {
            chrome.storage.sync.set({extensionEnabled: true});
        }
        console.log(`Extension initialized with state: ${extensionEnabled}`);
    });
}

// Initialize state when the extension is installed or the browser starts
chrome.runtime.onInstalled.addListener(initializeState);
chrome.runtime.onStartup.addListener(initializeState);

// This runs when the user clicks the extension icon.
chrome.action.onClicked.addListener((tab) => {
    if (tab.url && tab.url.includes('youtube.com/watch')) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        }, (injectionResults) => {
            if (chrome.runtime.lastError) {
                console.error('Script injection failed: ', chrome.runtime.lastError.message);
            } else {
                console.log('Content script injected successfully.');
            }
        });
    } else {
        console.log('The extension icon was clicked, but the tab is not a YouTube watch page.');
    }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'checkStatus') {
        sendResponse({extensionEnabled: extensionEnabled});
    } else if (message.toggleExtension) {
        extensionEnabled = message.toggleExtension === 'enable';
        chrome.storage.sync.set({extensionEnabled: extensionEnabled}, () => {
            if (chrome.runtime.lastError) {
                console.error(`Error setting state: ${chrome.runtime.lastError}`);
                sendResponse({ status: 'error', message: chrome.runtime.lastError.message });
            } else {
                console.log(`Extension state updated: ${extensionEnabled}`);
                sendResponse({ status: 'success', message: 'Extension state toggled.' });
            }
        });
        return true; 
    }else if (message && message.type === 'command') {
        console.log('Received command:', message.command);
        if (message.command === 'nextVideo') {
        }
        sendResponse({ status: 'success', message: 'Command executed' });
    } else if (message.from === 'content') {
        chrome.runtime.sendMessage(message);
    }else if (message && message.action === 'next') {
        if (sender.tab && sender.tab.id) {
            chrome.tabs.sendMessage(sender.tab.id, { action: 'next' });
        }
        sendResponse({ status: 'success', message: 'Next video action processed.' });
    }
});

function toggleExtensionState() {
    extensionEnabled = !extensionEnabled;
    console.log(`Extension state toggled to: ${extensionEnabled}`);
    chrome.storage.sync.set({extensionEnabled: extensionEnabled});
}
