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

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    handlePlayerControl(request.action);
});
