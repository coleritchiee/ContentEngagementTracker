import webgazer from './webgazer.js'

export function main(){
window.saveDataAcrossSessions = true;

const youtubePlayer = document.getElementsByClassName('video-stream')[0];
let state = "none";
const threshold = 1000;
const currentVideo = document.URL.split("?")[1];
const currentVideoTimes = document.URL.split("?")[1] + "times";
let startTime = Number.POSITIVE_INFINITY;
let enable = false;
let autopause = false;

chrome.storage.local.get(["enable"], (result) => {
    enable = result.enable;
    chrome.storage.local.set({"enable":[enable]});
});
chrome.storage.local.get(["autopause"], (result) => {
    autopause = result.autopause;
});
chrome.storage.local.get(["overlay"], (result) => {
    webgazer.showVideoPreview(result.overlay);
    webgazer.showPredictionPoints(result.overlay);
});
chrome.storage.local.get([currentVideo], (result) => {
    if(result[currentVideo] === undefined){
        chrome.storage.local.set({[currentVideo]:0});
    }
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if ("enable" in changes) {
        console.log("Old value: " + changes.enable.oldValue);
        console.log("New value: " + changes.enable.newValue);
        enable = changes.enable.newValue;
        if(enable){
            webgazer
            .setGazeListener((data,timestamp) => {
                if ((data.x < youtubePlayer.getBoundingClientRect().left ||
                    data.x > youtubePlayer.getBoundingClientRect().right||
                    data.y < youtubePlayer.getBoundingClientRect().top||
                    data.y > youtubePlayer.getBoundingClientRect().bottom)
                    && state != "paused"){
                    startTime = timestamp;
                    state = "paused";
                }
                else if ((data.x > youtubePlayer.getBoundingClientRect().left &&
                    data.x < youtubePlayer.getBoundingClientRect().right)&&
                    (data.y > youtubePlayer.getBoundingClientRect().top&&
                    data.y < youtubePlayer.getBoundingClientRect().bottom)
                    && state!="playing"){
                    startTime = timestamp;
                    state = "playing";
                }

                if(startTime + threshold < timestamp){
                    if(state === "paused"){
                        if(autopause){
                        youtubePlayer.pause();
                        }
                        state = "paused";

                        chrome.storage.local.get([currentVideo], (result) => {
                            chrome.storage.local.set({[currentVideo]:(result[currentVideo] + 1)});
                    });
                    startTime = Number.POSITIVE_INFINITY;
                    }
                    if (state === "playing"){
                        if(autopause){
                        youtubePlayer.play();
                        }
                    state = "playing";
                    startTime = Number.POSITIVE_INFINITY;
                    }
                }
            })
            .begin();
        }
        else{
            webgazer.end();
        }
    }
    if ("autopause" in changes) {
        console.log("Old value: " + changes.autopause.oldValue);
        console.log("New value: " + changes.autopause.newValue);
        autopause = changes.autopause.newValue;
    }
    if("overlay" in changes){
        console.log("Old value: " + changes.overlay.oldValue);
        console.log("New value: " + changes.overlay.newValue);
        webgazer.showPredictionPoints(changes.overlay.newValue);
        webgazer.showVideoPreview(changes.overlay.newValue);
    }
});

}