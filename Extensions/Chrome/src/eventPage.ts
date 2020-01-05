import { githubDarkThemeStorageV1Format, REPO_OWNER, REPO_NAME, API_ADDRESS } from "./popup/Popup";
import { compare } from "compare-versions";
import { getLocalStorageValue } from "./shared";

chrome.runtime.onInstalled.addListener(function () {
    console.log("Setting up first install");
    tryInstallOrUpdate();

    alert("Extension Installed");
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // onMessage must return "true" if response is async.
    let isResponseAsync = false;

    if (request.popupMounted) {
        console.log("eventPage notified that Popup.tsx has mounted.");
    }
    else if (!request.themeEnabled) {
        disableTheme();
    }
    else if (request.themeEnabled) {
        enableTheme();
    }

    return isResponseAsync;
});

async function disableTheme() {
    const storageObject = await getLocalStorageValue();
    storageObject.disabled = true;
    chrome.storage.local.set({ "GithubDarkThemeStorageV1": storageObject }, () => {
        removeInjectedTheme();
    });
    console.log("background: disableTheme completed!")
};


async function enableTheme() {
    const storageObject = await getLocalStorageValue();
    storageObject.disabled = false;
    chrome.storage.local.set({ "GithubDarkThemeStorageV1": storageObject }, () => {
        injectTheme();
    });
    console.log("background: enableTheme completed!")
};

async function tryInstallOrUpdate() {
    console.log("getLatestRelease!");

    getLatestReleaseVersion().then(latestReleaseVersion => {
        if (needsInstallOrUpdate(latestReleaseVersion)) {
            installTheme();
        }
    });

}

async function getLatestReleaseVersion(): Promise<string> {
    const response = await fetch(API_ADDRESS + `repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`);
    const releaseData = await response.json();
    return releaseData.tag_name;
};

async function installTheme() {
    console.log(`repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`);
    const releaseData = await getLatestReleaseVersion();
    const themeData = await getThemeCss(releaseData);
    const storageObject = {
        installedVersion: releaseData,
        LastUpdateCheckedTime: Date.now(),
        theme: themeData,
        disabled: false
    };

    chrome.storage.local.set({ "GithubDarkThemeStorageV1": storageObject }, () => {
        injectTheme();
    });
}

async function getThemeCss(tagVersion: string): Promise<string> {
    const response = await fetch(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${tagVersion}/Theme.css`);
    const themeData = await response.text();
    return themeData;
}

async function needsInstallOrUpdate(latestReleaseVersion: string): Promise<boolean> {
    console.log('determineNeedsUpdate!');
    const storageObject = (await getLocalStorageValue()) as githubDarkThemeStorageV1Format;
    if (storageObject.disabled === true) {
        return false;
    }
    if (storageObject.installedVersion === '' || storageObject.installedVersion === undefined) {
        return true;
    }
    else if (latestReleaseVersion === undefined) {
        console.error('latest version is undefined but should have value');
    }
    else {
        console.log('start compare');
        console.log(latestReleaseVersion + storageObject.installedVersion);
        return compare(latestReleaseVersion, storageObject.installedVersion, '>');
    }
}

function injectTheme() {
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
    console.log("Theme inject event sent");
};

function removeInjectedTheme() {
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
    console.log("remove injected theme event sent");
};

const urlRegexMatch: chrome.tabs.QueryInfo = {
    url: ["*://*.github.com/*",
        "*://*.github.com/",
        "*://github.com/",
        "*://github.com/*"]
};

