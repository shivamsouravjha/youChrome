console.log("Popup script loaded");

// Function to send player control message to the content script
function sendPlayerControlMessage(action) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: action }, function (response) {
            if (chrome.runtime.lastError) {
                console.error('Error sending message to content script:', chrome.runtime.lastError.message);
            } else {
                console.log('Message sent to content script:', response);
            }
        });
    });
}

// Function to update popup with video details
function updatePopup(title, channel) {
    document.getElementById('video-title').textContent = title;
    document.getElementById('video-channel').textContent = channel;
}

// Initialize toggle switch and add event listeners when popup is loaded
document.addEventListener('DOMContentLoaded', function () {

    // Listen for messages from content script to update popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.title && message.channel) {
            updatePopup(message.title, message.channel);
        }
    });

    // Request video details from the content script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "requestVideoDetails" });
    });

    var toggleSwitch = document.getElementById('toggle-extension');
    chrome.storage.sync.get('extensionEnabled', function (data) {
        toggleSwitch.checked = data.hasOwnProperty('extensionEnabled') ? data.extensionEnabled : true;
    });

    toggleSwitch.addEventListener('change', function () {
        chrome.runtime.sendMessage({ toggleExtension: toggleSwitch.checked ? 'enable' : 'disable' });
    });

    // Add event listeners to control buttons
    document.getElementById('next-video').addEventListener('click', function () {
        sendPlayerControlMessage('next');
    });

    document.getElementById('prev-video').addEventListener('click', function () {
        sendPlayerControlMessage('prev');
    });

    document.getElementById('play-pause').addEventListener('click', function () {
        sendPlayerControlMessage('playPause');
    });

    document.getElementById('rewind').addEventListener('click', function () {
        sendPlayerControlMessage('rewind');
    });

    document.getElementById('fast-forward').addEventListener('click', function () {
        sendPlayerControlMessage('fastForward');
    });

    document.getElementById('close-btn').addEventListener('click', function () {
        window.close();
    });
});
