import { githubDarkThemeStorageV1Format, REPO_OWNER, REPO_NAME, API_ADDRESS } from "./popup/Popup";
import { injectTheme, removeInjectedTheme } from "./popup/injectorFunctions";
import { compare } from "compare-versions";
import { getLocalStorageValue } from "./shared";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // onMessage must return "true" if response is async.
    let isResponseAsync = false;

    if (request.popupMounted) {
        console.log("eventPage notified that Popup.tsx has mounted.");
    }

    return isResponseAsync;
});

chrome.runtime.onInstalled.addListener(function () {
    console.log("Setting up first install");
    tryInstallOrUpdate();

    alert("Extension Installed");
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // onMessage must return "true" if response is async.
    let isResponseAsync = false;

    if (request.disable) {
        disableTheme();
    }
    else if (request.enable) {
        enableTheme();
    }

    return isResponseAsync;
});
async function disableTheme() {
    const storageObject = (await getLocalStorageValue("GithubDarkThemeStorageV1")) as githubDarkThemeStorageV1Format;
    var copy = { ...storageObject };
    copy.disabled = true;
    chrome.storage.local.set({ "GithubDarkThemeStorageV1": copy }, () => {
        removeInjectedTheme();
    });
};


async function enableTheme() {
    const storageObject = (await getLocalStorageValue("GithubDarkThemeStorageV1")) as githubDarkThemeStorageV1Format;
    var copy = { ...storageObject };
    copy.disabled = false;
    chrome.storage.local.set({ "GithubDarkThemeStorageV1": copy }, () => {
        injectTheme();
    });
};

async function tryInstallOrUpdate() {
    console.log("getLatestRelease!");
    const storageObject = (await getLocalStorageValue("GithubDarkThemeStorageV1")) as githubDarkThemeStorageV1Format;

    getLatestReleaseVersion().then(latestReleaseVersion => {
        if (needsInstallOrUpdate(storageObject, latestReleaseVersion)) {
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

    chrome.storage.local.set({ GithubDarkThemeStorageV1: storageObject }, () => {
        injectTheme();
    });
}

async function getThemeCss(tagVersion: string): Promise<string> {
    const response = await fetch(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${tagVersion}/Theme.css`);
    const themeData = await response.text();
    return themeData;
}

function needsInstallOrUpdate(storageObject: githubDarkThemeStorageV1Format, latestReleaseVersion: string): boolean {
    console.log('determineNeedsUpdate!');
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