// popup.js
console.log("Popup script loaded");
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    // This function is defined within the DOMContentLoaded callback
    // to ensure it has access to the updated scope after DOM is ready.
    function sendPlayerControlMessage(action) {
        console.log("Button clicked:", action);

        // Uncomment the messaging functionality to actually send the message
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: action }, function(response) {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message to content script:');
                } else {
                    console.log('Message sent to content script:', response);
                }
            });
        });
    }

    // Register event listeners for each button
    document.getElementById('next-video').addEventListener('click', function() {
        sendPlayerControlMessage('next');
    });

    document.getElementById('prev-video').addEventListener('click', function() {
        sendPlayerControlMessage('prev');
    });

    document.getElementById('play-pause').addEventListener('click', function() {
        sendPlayerControlMessage('playPause');
    });

    document.getElementById('rewind').addEventListener('click', function() {
        sendPlayerControlMessage('rewind');
    });

    document.getElementById('fast-forward').addEventListener('click', function() {
        sendPlayerControlMessage('fastForward');
    });

    document.getElementById('close-btn').addEventListener('click', function() {
        window.close();
    });
});
