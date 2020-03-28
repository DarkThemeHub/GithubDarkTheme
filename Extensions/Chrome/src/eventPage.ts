import { REPO_OWNER, REPO_NAME, API_ADDRESS } from "./popup/Popup";
import { compare } from "compare-versions";
import { getLocalStorageValue, getDateTimeInSeconds, githubDarkThemeStorageV1Format } from "./shared";

setAlarms();
setExtensionUiCallbackListeners();
chrome.runtime.onInstalled.addListener(function () {
    console.log("Setting up first install");

    tryInstallOrUpdate();

    //alert("Extension Installed");
});

chrome.runtime.onUpdateAvailable.addListener(function callback(details) {
    chrome.runtime.reload();
});

chrome.runtime.onConnect.addListener(function () {
    enableTheme();
    injectTheme();
});

function setExtensionUiCallbackListeners() {
    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        // onMessage must return "true" if response is async.
        let isResponseAsync = false;
        if (request.popupMounted) {
            console.log("eventPage notified that Popup.tsx has mounted.");
        }
        if (request.disableTheme) {
            await disableTheme();
        }

        if (request.enableTheme) {
            await enableTheme();
        }

        if (request.forceCheckUpdate) {
            await tryInstallOrUpdate();
        }

        return isResponseAsync;
    });
}

function setAlarms() {
    const ALARM_NAME = "GithubDarkThemeCheckForUpdate";
    const ALARM_DELAY_IN_MINUTES = 60 * 4; // 6 times a day
    chrome.alarms.create(ALARM_NAME, { when: Date.now(), periodInMinutes: ALARM_DELAY_IN_MINUTES });
    chrome.alarms.onAlarm.addListener(function callback(alarm) {
        if (alarm.name === ALARM_NAME) {
            tryInstallOrUpdate();
        }
    });
}

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
            installVersionOfTheme(latestReleaseVersion);
        }
    });
}

const semVersionRegex = new RegExp(/^([0-9]*\.[0-9]*\..*)/)

async function getLatestReleaseVersion(): Promise<string> {
    const response = await fetch(API_ADDRESS + `repos/${REPO_OWNER}/${REPO_NAME}/releases`);
    const releaseData = await response.json() as any[];

    for (let index = 0; index < releaseData.length; index++) {
        const element = (releaseData[index].tag_name as string).match(semVersionRegex);
        if (element !== null) {
            return releaseData[index].tag_name;
        }
    }
    return undefined;
};

async function installVersionOfTheme(version: string) {
    console.log(`repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`);

    const themeData = await getThemeCss(version);
    const urlRegex = (await getUrlRegex(version)).split(`\n`);
    const storageObject = {
        installedVersion: version,
        LastUpdateCheckedTime: getDateTimeInSeconds(),
        theme: themeData,
        disabled: false,
        urlMatchRegex: urlRegex
    } as githubDarkThemeStorageV1Format;

    chrome.storage.local.set({ "GithubDarkThemeStorageV1": storageObject }, () => {
        injectTheme();
    });
}

async function getThemeCss(tagVersion: string): Promise<string> {
    const response = await fetch(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${tagVersion}/Theme.css`);
    const themeData = await response.text();
    return themeData;
}
async function getUrlRegex(tagVersion: string): Promise<string> {
    const response = await fetch(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${tagVersion}/UrlRegex.txt`);
    const regexData = await response.text();
    return regexData;
}

async function needsInstallOrUpdate(latestReleaseVersion: string): Promise<boolean> {
    console.log('determineNeedsUpdate!');
    const storageObject = (await getLocalStorageValue()) as githubDarkThemeStorageV1Format;
    if (storageObject === undefined) {
        return true
    }
    if (storageObject.disabled === true) {
        return false;
    }
    if (storageObject.installedVersion === '' || storageObject.disabled === undefined) {
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

async function injectTheme() {
    const urlRegex = (await getLocalStorageValue()).urlMatchRegex;
    chrome.tabs.query({ url: [] }, tabs => {
        const tabsFiltered = tabs.filter(tab => isUrlRegexMatch(urlRegex, tab.url));
        tabsFiltered.forEach(tab => {

            chrome.tabs.executeScript(tab.id, {
                code: `
                        var evt = document.createEvent('Event');
                        evt.initEvent('injectTheme', true, false);

                        // fire the event
                        document.dispatchEvent(evt);
                        `
            })
        });
    })
    console.log("Theme inject event sent");
};

async function removeInjectedTheme() {
    const urlRegex = (await getLocalStorageValue()).urlMatchRegex;
    chrome.tabs.query({ url: [] }, tabs => {
        const tabsFiltered = tabs.filter(tab => isUrlRegexMatch(urlRegex, tab.url));
        tabsFiltered.forEach(tab => {
            chrome.tabs.executeScript(tab.id, {
                code: `
                        var evt = document.createEvent('Event');
                        evt.initEvent('removeTheme', true, false);

                        // fire the event
                        document.dispatchEvent(evt);
                        `
            })
        });
    })
    console.log("remove injected theme event sent");
};

function isUrlRegexMatch(urlRegex: string[], urlToCheck: string) {

    var urlMatched = false;
    for (let index = 0; index < urlRegex.length; index++) {
        const match = urlToCheck.match(urlRegex[index]);
        if (match !== null) {
            urlMatched = true;
        }
    }
    return urlMatched;
}
