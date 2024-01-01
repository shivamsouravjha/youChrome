let prevVideoID;
let videoId;
let params;
let refrestParams = () => {
    let userSearchParams = new URLSearchParams(window.location.search);
    params = Object.fromEntries(userSearchParams.entries())
    videoId = window.location.pathname == "/watch" ? params.v : undefined;

}
let lsat = location.href;

let performCheck = () => {
    console.log(`shivam ${videoId}`)
}
new MutationObserver(() => {
    let url = location.href;
    // console.log(`what is here ${url}`)
    if (url != lsat) {
        lsat = url;
        refrestParams();
        if (videoId !== prevVideoID) {
            prevVideoID = videoId;
            performCheck();
        }
    }
}).observe(document,{subtree:true,childList:true})

refrestParams();
performCheck();