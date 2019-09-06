import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { compare } from 'compare-versions';
import * as React from 'react';
import './Update.scss'
const API_ADDRESS = 'https://api.github.com/';

interface storageFormat {
    version: string;
    lastGetLatestVersionCheckTime: number | undefined;
    theme: string | undefined;
}

export const Update: React.FunctionComponent<{}> = ({ }) => {

    const [lastUpdated, setLastUpdated] = React.useState<number>(undefined);
    const [lastVersionCheck, setLastVersionCheck] = React.useState<number>(undefined);
    const [latestVersion, setLatestVersion] = React.useState<string>(undefined);
    const [newInstallAvailable, setNewInstallAvailable] = React.useState<boolean>(undefined);
    const [installedVersion, setInstalledVersion] = React.useState<string>('');
    const [versions, setVersions] = React.useState<string[]>(undefined);
    const [theme, setTheme] = React.useState<string>('');

    const query: chrome.tabs.QueryInfo = {
        url: ["*://*.github.com/*",
            "*://*.github.com/",
            "*://github.com/",
            "*://github.com/*"]
    };

    function injectTheme() {
        chrome.tabs.query(query, tabs => {
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

    function removeInjectedTheme() {
        chrome.tabs.query(query, tabs => {
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

    React.useEffect(() => {
        console.log('render!');

        chrome.storage.local.get('storageFile', (result) => {
            const storageFile = result.storageFile as storageFormat;
            console.log(storageFile);
            setInstalledVersion(storageFile.version);
            setTheme(storageFile.theme);
        });
        const nextCheckOffset = new Date();
        nextCheckOffset.setMinutes(20);
        nextCheckOffset.getTime;

        if (latestVersion === undefined || versions === undefined || Date.now() > (lastVersionCheck + nextCheckOffset.getTime())) {
            getLatestReleaseDetails();
            getAllReleaseTags();
        }
        determineNeedsUpdate();

    });

    function getAllReleaseTags() {
        console.log('getAllReleaseTags!');
        return fetch(API_ADDRESS + 'repos/acoop133/githubdarktheme/tags')
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

    function getLatestReleaseDetails() {
        console.log('getLatestReleaseDetails!');
        return fetch(API_ADDRESS + 'repos/acoop133/githubdarktheme/releases/latest')
            .then(response => response.json())
            .then(data => {
                setLatestVersion(data.tag_name);
                determineNeedsUpdate();
            })
            .catch(function (error) {
                // handle error
                console.error(error);
            }).then(() => {
                setLastVersionCheck(Date.now());
            });

    }

    function determineNeedsUpdate() {
        console.log('determineNeedsUpdate!');
        if (installedVersion === '') {
            setNewInstallAvailable(true);
        }
        else if (latestVersion === undefined) {
            console.error('latest version is undefined but should have value');
        } else {
            console.log('start compare');
            setNewInstallAvailable(compare(latestVersion, installedVersion, '>'));
            console.log('complete compare');
        }
    }

    async function InstallThemeVersion(version: string) {
        console.log(`InstallThemeVersion! ${version}`);
        await getLatestReleaseDetails();
        fetch(`https://raw.githubusercontent.com/acoop133/GithubDarkTheme/${version}/Theme.css`)
            .then(response => response.text())
            .then(data => {
                const toStorage: storageFormat = {
                    version,
                    lastGetLatestVersionCheckTime: lastVersionCheck,
                    theme: data,
                };
                chrome.storage.local.set({ 'storageFile': toStorage });
                setTheme(data);
                injectTheme();
                setInstalledVersion(version);
                setNewInstallAvailable(false);
            })
            .catch(function (error) {
                // handle error
                console.error(error);
            });
    }

    const uninstallTheme = () => {
        console.log('uninstallTheme!');
        chrome.storage.local.clear(() => {
            setInstalledVersion('');
            setTheme('');
            removeInjectedTheme();
        });
    };

    const updateAvailableNotification = () => {
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
    };

    function onChange(event) {
        const versionSelected = event.target.value as string;
        InstallThemeVersion(versionSelected);
    }

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
                <Select
                    value={installedVersion}
                    onChange={(e) => onChange(e)}
                    displayEmpty={true}
                >
                    <MenuItem value="" disabled={true}>Select a version to install</MenuItem>
                    {versions && versions.map(v => {
                        return <MenuItem value={v}>{v}</MenuItem>;
                    })}
                </Select>
                {installedVersion !== '' && <button onClick={() => uninstallTheme()}>Uninstall Theme</button>}
            </div>
        </div>
        <div className="button-row">
            <button onClick={() => { chrome.tabs.create({ url: 'https://github.com/acoop133/GithubDarkTheme/releases' }); }}>Release Notes</button>
            <button onClick={() => { chrome.tabs.create({ url: 'https://github.com/acoop133/GithubDarkTheme/issues' }); }}>Report Issues</button>
        </div>
    </div >;
};
