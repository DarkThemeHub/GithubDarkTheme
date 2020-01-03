const urlRegexMatch: chrome.tabs.QueryInfo = {
    url: ["*://*.github.com/*",
        "*://*.github.com/",
        "*://github.com/",
        "*://github.com/*"]
};

export function injectTheme() {
    chrome.tabs.query(urlRegexMatch, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.executeScript(tab.id, {
                code: `
            var evt = document.createEvent('Event');
            evt.initEvent('injectTheme', true, false);

            // fire the event
            document.dispatchEvent(evt);
            ` })
        });
    })
};

export function removeInjectedTheme() {
    chrome.tabs.query(urlRegexMatch, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.executeScript(tab.id, {
                code: `
            var evt = document.createEvent('Event');
            evt.initEvent('removeTheme', true, false);

            // fire the event
            document.dispatchEvent(evt);
            ` })
        });
    })
};