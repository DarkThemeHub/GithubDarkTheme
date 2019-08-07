import * as React from 'react';
import './Update.scss'
import { compare } from 'compare-versions';

const API_ADDRESS = 'https://api.github.com/';



interface storageFormat {
    version: string,
    lastGetLatestVersionCheckTime: number,
    theme: string
}
export const Update: React.FunctionComponent<{}> = ({ }) => {

    const [lastUpdated, setLastUpdated] = React.useState<number>(undefined);
    const [lastVersionCheck, setLastVersionCheck] = React.useState<number>(undefined);
    const [latestVersion, setLatestVersion] = React.useState<string>(undefined);
    const [newInstallAvailable, setNewInstallAvailable] = React.useState<boolean>(undefined);
    const [installedVersion, setInstalledVersion] = React.useState<string>();

    React.useEffect(() => {
        console.log('render!');

        chrome.storage.local.get('storageFile', (result) => {
            const storageFile = result.storageFile as storageFormat;
            console.log(storageFile);
            setInstalledVersion(storageFile.version);
        });
        const nextCheckOffset = new Date();
        nextCheckOffset.setMinutes(20);
        nextCheckOffset.getTime;

        if (latestVersion === undefined || Date.now() > (lastVersionCheck + nextCheckOffset.getTime())) {
            getLatestReleaseDetails();
        }
        determineNeedsUpdate();
    })




    function getLatestReleaseDetails() {
        return fetch(API_ADDRESS + `repos/acoop133/githubdarktheme/releases/latest`)
            .then(response => response.json())
            .then(data => {
                //console.log(data);
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
        console.log('latest:' + latestVersion);
        console.log('installed:' + installedVersion);
        if (installedVersion === undefined) {
            setNewInstallAvailable(true);
        }
        else if (latestVersion === undefined) {
            console.error("latest version is undefined but should have value")
        } else {
            console.log("start compare")
            setNewInstallAvailable(compare(latestVersion, installedVersion, '>'));
            console.log("complete compare")
        }
    }

    function InstallLatestTheme() {
        getLatestReleaseDetails();
        fetch(API_ADDRESS + `repos/acoop133/githubdarktheme/contents/Theme.css?ref=${latestVersion}`)
            .then(response => response.json())
            .then(data => {
                const toStorage: storageFormat = {
                    version: latestVersion,
                    lastGetLatestVersionCheckTime: lastVersionCheck,
                    theme: data.content
                }
                chrome.storage.local.set({ "storageFile": toStorage });
                setInstalledVersion(latestVersion);
                setNewInstallAvailable(false);
            })
            .catch(function (error) {
                // handle error
                console.error(error);
            });
    }

    const uninstallTheme = () => {
        chrome.storage.local.clear(() => {
            setInstalledVersion(undefined);
            getLatestReleaseDetails();
        });
    }
    const updateAvailableNotification = () => {
        chrome.notifications.create({
            title: "New Update Available",
            buttons: [
                { title: "Release Notes" },
                { title: "Update now" },
                { title: "Enable Auto Update" }],
            message: "A new update for Github Darktheme is available",
            type: 'basic',
            iconUrl: undefined
        });
    }

    return <div>
        <div>Latest version: {latestVersion}</div>
        <div>Installed version: {installedVersion}</div>
        <div className="button-row">
            <button onClick={() => { chrome.tabs.create({ url: 'https://github.com/acoop133/GithubDarkTheme/releases' }) }}>Release Notes</button>
            {
                newInstallAvailable &&
                <button onClick={() => InstallLatestTheme()}>{installedVersion === undefined ? 'Install Theme' : 'Update Theme'}</button>
            }

            {installedVersion !== undefined && <button onClick={() => uninstallTheme()}>Uninstall Theme</button>}
        </div>
    </div >

}
