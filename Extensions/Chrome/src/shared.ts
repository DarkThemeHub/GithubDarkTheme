import { githubDarkThemeStorageV1Format } from "./popup/Popup";

export async function getLocalStorageValue(): Promise<githubDarkThemeStorageV1Format> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get("GithubDarkThemeStorageV1", function (value) {
                resolve(value.GithubDarkThemeStorageV1 as githubDarkThemeStorageV1Format);
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
}
