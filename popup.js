const enable = "enable";
const autopause = "autopause";
const overlay = "overlay";
    
//persistance
chrome.storage.local.get([enable], (result) => {
    document.getElementById('enable').checked = result.enable
});
chrome.storage.local.get([autopause], (result) => {
    document.getElementById('autopause').checked = result.autopause
});
chrome.storage.local.get([overlay], (result) => {
    document.getElementById('overlay').checked = result.overlay
});


//to mainscript
$("#enable").on('change', function() {
    if ($(this).is(':checked')) {
        $(this).attr('value', 'true');
        chrome.storage.local.set({[enable]: true});
    }
    else {
        $(this).attr('value', 'false');
        chrome.storage.local.set({[enable]: false});
    }
});
$("#autopause").on('change', function() {
    if ($(this).is(':checked')) {
        $(this).attr('value', 'true');
        chrome.storage.local.set({[autopause]: true});
    }
    else {
        $(this).attr('value', 'false');
        chrome.storage.local.set({[autopause]: false});
    }
});

$("#overlay").on('change', function() {
    if ($(this).is(':checked')) {
        $(this).attr('value', 'true');
        chrome.storage.local.set({[overlay]: true});
    }
    else {
        $(this).attr('value', 'false');
        chrome.storage.local.set({[overlay]: false});
    }
});

//info
function getCurrentTab(callback) {
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
      callback(tab);
    });
}

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    const video = tabs[0].url.split("?")[1];
    chrome.storage.local.get([video], (result) => {
        const para = document.createElement("p");
        let node = "";
        if(result[video] === undefined){
            node = 0;
        }
        else{
            node = document.createTextNode(result[video]);
        }
        para.appendChild(node);
        const element = document.getElementById("number");
        element.appendChild(para);
    });
});