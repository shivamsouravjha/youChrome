// This function is called when the content script receives a message from popup.js
function handlePlayerControl(action) {
    isExtensionEnabled((extensionEnabled) => {
        if (!extensionEnabled) return; // Do nothing if the extension is disabled

        const videoPlayer = document.querySelector('video');
        if (!videoPlayer) return;

        switch (action) {
            case 'next':
                document.querySelector('.ytp-next-button')?.click();
                lastVideoID = null
                break;
            case 'prev':
                // YouTube does not have a previous button, you may need to implement a custom solution
                break;
            case 'playPause':
                if (videoPlayer.paused) {
                    videoPlayer.play();
                } else {
                    videoPlayer.pause();
                }
                break;
            case 'rewind':
                videoPlayer.currentTime -= 10; // Rewinds the video by 10 seconds
                break;
            case 'fastForward':
                videoPlayer.currentTime += 10; // Fast-forwards the video by 10 seconds
                break;
            default:
                console.error('Unknown action:', action);
        }
    });
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "requestVideoDetails") {

    } else {
        handlePlayerControl(request.action);
    }
});

function fetchAndSendVideoDetails() {
    const title = document.querySelector('h1.ytd-watch-metadata')?.textContent.trim();
    const channel = document.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string')?.textContent.trim();
    chrome.runtime.sendMessage({ title: title, channel: channel });
}

// Example function to check if the extension is enabled
function isExtensionEnabled(callback) {
    chrome.runtime.sendMessage({ type: 'checkStatus' }, (response) => {
        if (chrome.runtime.lastError) {
            console.error(`Error in fetching extension status: ${chrome.runtime.lastError.message}`);
            callback(false);
        } else {
            callback(response.extensionEnabled);
        }
    });
}

const observer = new MutationObserver(fetchAndSendVideoDetails);
observer.observe(document.body, { childList: true, subtree: true });

fetchAndSendVideoDetails();

