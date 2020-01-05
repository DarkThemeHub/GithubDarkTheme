import { compare } from 'compare-versions';
import * as React from 'react';
import './Page.scss';
import { injectTheme, removeInjectedTheme } from './injectorFunctions';
const API_ADDRESS: string = 'https://api.github.com/';
const STORAGE_ID: string = 'GithubDarkThemeStorageV1';
const REPO_OWNER: string = 'DarkThemeHub';
const REPO_NAME: string = 'GithubDarkTheme';
interface githubDarkThemeStorageV1Format {
    version: string;
    lastGetLatestVersionCheckTime: number | undefined;
    theme: string | undefined;
    disabled: boolean;
}

export const Update: React.FunctionComponent<{}> = () => {

    const [lastUpdated, setLastUpdated] = React.useState<number>(undefined);
    const [lastVersionCheck, setLastVersionCheck] = React.useState<number>(undefined);
    const [latestVersion, setLatestVersion] = React.useState<string>(undefined);
    const [installedVersion, setInstalledVersion] = React.useState<string>(undefined);
    const [versions, setVersions] = React.useState<string[]>();
    const [themeDisabled, setThemeDisabled] = React.useState<boolean>(undefined);
    const [storageCache, setStorageCache] = React.useState<githubDarkThemeStorageV1Format>(undefined);
    const [runOnceRan, setRunOnceRan] = React.useState<boolean>(false)
    
    if(!runOnceRan) { 
        RunOnce()
    }

    React.useEffect(() => {
        console.log('render!');

    });

    function RunOnce(){
        Promise.resolve(getStorageFile())
        .then(() => {
            if (storageCache) {
                setInstalledVersion(storageCache.version);
                setThemeDisabled(storageCache.disabled ? false : true);
            }
        }).then(() => {
            if (themeDisabled != true) {
                const nextCheckOffset = new Date();
                nextCheckOffset.setMinutes(20);

                if (Date.now() > (lastVersionCheck + nextCheckOffset.getTime())) {
                    if (needsInstallOrUpdate()) {

                        installLatestThemeVersion();
                    }
                    //getAllReleaseTags();
                }
            }
        });
        setRunOnceRan(true);
    }

    //// fix this
    function getStorageFile() {
        chrome.storage.local.get("GithubDarkThemeStorageV1", (result) => {
            setStorageCache(result.GithubDarkThemeStorageV1 as githubDarkThemeStorageV1Format);
        });
    };

    /*     function getAllReleaseTags() {
            console.log('getAllReleaseTags!');
            return fetch(API_ADDRESS + `repos/${REPO_OWNER}/${REPO_NAME}/tags`)
                .then(response => response.json())
                .then((data) => {
                    const dataTyped = data as any[];
                    const options = dataTyped.map(d => d.name);
     
                    setVersions(options);
                })
                .catch(function (error) {
                    // handle error
                    console.error(error);
                });
        }
     */
    async function getLatestReleaseDetails() {
        console.log('getLatestReleaseDetails!');
        console.log(`repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`)
        fetch(API_ADDRESS + `repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`)
            .then(response => response.json())
            .then(data => {
                setLatestVersion(data.tag_name);
            })
            .catch(function (error) {
                // handle error
                console.error(error);
            }).then(() => {
                setLastVersionCheck(Date.now());
            });

    }

    function needsInstallOrUpdate(): boolean {
        console.log('determineNeedsUpdate!');
        if (themeDisabled === true) {
            return false;
        }
        if (installedVersion === '' || installedVersion === undefined) {
            return true;
        }
        else if (latestVersion === undefined) {
            console.error('latest version is undefined but should have value');
        } else {
            console.log('start compare');
            console.log(latestVersion + installedVersion);
            return compare(latestVersion, installedVersion, '>');
        }
    }

    async function installLatestThemeVersion() {
        console.log(`InstallThemeVersion! ${latestVersion}`);
        await getLatestReleaseDetails();
        fetch(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${latestVersion}/Theme.css`)
            .then(response => response.text())
            .then(data => {
                const toStorage: githubDarkThemeStorageV1Format = {
                    version: latestVersion,
                    lastGetLatestVersionCheckTime: lastVersionCheck,
                    theme: data,
                    disabled: false
                };

                chrome.storage.local.set({ "GithubDarkThemeStorageV1": toStorage }, () => {
                    injectTheme();
                    setInstalledVersion(latestVersion);
                    setThemeDisabled(false);
                });

            })
            .catch(function (error) {
                // handle error
                console.error(error);
            });
    }
    const enableTheme = () => {
        console.log('enableTheme!');
        Promise.resolve(getStorageFile()).then(() => {
            var copy = { ...storageCache };
            copy.disabled = false;
            installLatestThemeVersion();            
        })
    }

    const disableTheme = () => {
        console.log('disableTheme!');

        Promise.resolve(getStorageFile()).then(() => {
            var copy = { ...storageCache };
            copy.disabled = true;
            chrome.storage.local.set({ "GithubDarkThemeStorageV1": copy }, () => {
                removeInjectedTheme();
                setThemeDisabled(true);
            });
            
        })
    };

    /*     const updateAvailableNotification = () => {
            chrome.notifications.create({
                title: 'New Update Available',
                buttons: [
                    { title: 'Release Notes' },
                    { title: 'Update now' },
                    { title: 'Enable Auto Update' }],
                message: 'A new update for Github Darktheme is available',
                type: 'basic',
                iconUrl: undefined,
            });
        }; */

    /*     function onChange(event) {
            const versionSelected = event.target.value as string;
            InstallThemeVersion(versionSelected);
        } */

    return <div>
        <div className="update-grid">
            <div className="grid-item" style={{ paddingRight: 20 }}>
                <span style={{ float: 'right' }}>Latest version:</span>
            </div>
            <div className="grid-item">
                {latestVersion} <span className="small-text">checked {(Date.now() - lastVersionCheck)} ago</span>
            </div>
            <div className="grid-item" style={{ paddingRight: 20 }}>
                <div style={{ alignItems: 'baseline', float: 'right' }}>Installed version:</div>
            </div>
            <div className="grid-item">
                {/* <Select
                    value={installedVersion}
                    onChange={(e) => onChange(e)}
                    displayEmpty={true}
                >
                    <MenuItem value="" disabled={true}>Select a version to install</MenuItem>
                    {versions && versions.map(v => {
                        return <MenuItem value={v}>{v}</MenuItem>;
                    })}
                </Select> */
                    //turn above into theme flavors instead of versions
                }
                <div>{installedVersion}</div>
                {
                    themeDisabled ?
                        <button onClick={() => enableTheme()}>Enable Theme</button>
                        :
                        <button onClick={() => disableTheme()}>Disable Theme</button>
                }

            </div>
        </div>
        <div className="button-row">
            <button onClick={() => { chrome.tabs.create({ url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases` }); }}>Release Notes</button>
            <button onClick={() => { chrome.tabs.create({ url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues` }); }}>Report Issues</button>
        </div>
    </div >;
};
