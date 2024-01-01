// This function is called when the content script receives a message from popup.js
function handlePlayerControl(action) {
    const videoPlayer = document.querySelector('video');
    if (!videoPlayer) return;

    switch (action) {
        case 'next':
            document.querySelector('.ytp-next-button')?.click();
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
    console.log(title,"adssadsa")
    chrome.runtime.sendMessage({ title: title, channel: channel });

    // chrome.runtime.sendMessage({ title: title, channel: channel });.

}
const observer = new MutationObserver(fetchAndSendVideoDetails);
observer.observe(document.body, { childList: true, subtree: true });

// Also send details when the script is first loaded
fetchAndSendVideoDetails();

