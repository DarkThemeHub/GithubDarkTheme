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

export function getDateTimeInSeconds(): number {
    return Date.now() / 1000;
}

export interface githubDarkThemeStorageV1Format {
    installedVersion: string;
    LastUpdateCheckedTime: number;
    theme: string;
    disabled: boolean;
    urlMatchRegex: string[];
}