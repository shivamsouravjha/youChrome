let lastVideoID = null;

function getYouTubeVideoID(url) {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get("v");
}

function getVideoID(currentVideo) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(currentVideo, function (result) {
            if (chrome.runtime.lastError) {
                reject(new Error('Extension context invalidated.'));
            } else if (result[currentVideo]) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

function setVideoID(currentVideo) {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const expiry = Date.now() + oneDayInMilliseconds;
    chrome.storage.local.set({ [currentVideo]: "played", expiry: expiry }, function () {
        if (chrome.runtime.lastError) {
            console.error(new Error('Extension context invalidated.'));
        } else {
            console.log('Value is set to ' + currentVideo);
        }
    });
}
// function sendPlayerControlMessage(action) {
//     chrome.runtime.sendMessage({ action: action });
// }

function performActionForNewVideo(videoID) {
    // if (!currentVideo || adPlaying || currentVideo === lastVideoID) return;
    getVideoID(videoID).then(videoPlayed => {
        if (!videoPlayed) {
            setVideoID(videoID);
        } else {
            const nextButton = document.querySelector('.ytp-next-button');
            if (nextButton) {
                chrome.runtime.sendMessage({ action: 'next' });
                chrome.runtime.sendMessage({ action: 'next' });
            }
        }
    }).catch(error => {
        console.error(error);
    });
};

function checkForNewVideo() {
    const currentVideoID = getYouTubeVideoID(window.location.href);
    console.log(currentVideoID && currentVideoID !== lastVideoID)
    if (currentVideoID && currentVideoID !== lastVideoID) {
        lastVideoID = currentVideoID;
        performActionForNewVideo(currentVideoID);
    }
}

const contentObserver = new MutationObserver(checkForNewVideo);

contentObserver.observe(document, { subtree: true, childList: true });
checkForNewVideo()