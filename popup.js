console.log("Popup script loaded");
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "requestVideoDetails" });
    });

    function updatePopup(title, channel) {
        console.log(title,channel,"tits")
        document.getElementById('video-title').textContent = title;
        document.getElementById('video-channel').textContent = channel;
    }
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("tits")
        if (message.title && message.channel) {
            updatePopup(message.title, message.channel);
        }
    });
    document.addEventListener('DOMContentLoaded', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { fromPopup: true });
        });
    });

    function sendPlayerControlMessage(action) {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: action }, function (response) {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message to content script:');
                } else {
                    console.log('Message sent to content script:', response);
                }
            });
        });
    }

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
