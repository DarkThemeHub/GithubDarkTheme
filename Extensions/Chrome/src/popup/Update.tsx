import * as React from 'react';
import './Update.scss'
import compareVersions from 'compare-versions';

const API_ADDRESS = 'https://api.github.com/';



interface storageFormat {
    version: string,
    theme: string
}
export const Update: React.FunctionComponent<{}> = ({ }) => {
    React.useEffect(() => {
        console.log('render!');
        if (latestVersion === undefined) {
            getLatestReleaseDetails()
        }
    })

    const [lastUpdated, setLastUpdated] = React.useState<number>(undefined);
    const [lastVersionCheck, setLastVersionCheck] = React.useState<number>(undefined);
    const [latestVersion, setLatestVersion] = React.useState<string>(undefined);
    const [updateAvailable, setUpdateAvailable] = React.useState<boolean>(undefined);
    const [installedVersion, setInstalledVersion] = React.useState<string>();


    chrome.storage.local.get('storageFile', (result) => {
        const storageFile = result.storageFile as storageFormat;
        console.log(storageFile);
        setInstalledVersion(storageFile.version);
    });

    function getLatestReleaseDetails() {
        return fetch(API_ADDRESS + `repos/acoop133/githubdarktheme/releases/latest`)
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                setLatestVersion(data.tag_name);
                determineNeedsUpdate(data.tag_name, installedVersion);
            })
            .catch(function (error) {
                // handle error
                console.error(error);
            }).then(() => {
                setLastVersionCheck(Date.now);
            });

    }

    function determineNeedsUpdate(latestVersion: string, installedVersion: string) {
        console.log('latest:' + latestVersion);
        console.log('installed:' + installedVersion);
        if (installedVersion === undefined) {
            setUpdateAvailable(true);
        }
        else if (latestVersion === undefined) {
            console.error("latest version is undefined but should have value")
        } else {
            console.log("start compare")
            setUpdateAvailable(compareVersions.compare(latestVersion, installedVersion, '>'));
            console.log("complete compare")
        }
    }

    function InstallLatestTheme() {
        fetch(API_ADDRESS + `repos/acoop133/githubdarktheme/contents/Theme.css?ref=${latestVersion}`)
            .then(response => response.json())
            .then(data => {
                const toStorage: storageFormat = {
                    version: latestVersion,
                    theme: data.content
                }
                chrome.storage.local.set({ "storageFile": toStorage });
                setInstalledVersion(latestVersion);
                setUpdateAvailable(false);
            })
            .catch(function (error) {
                // handle error
                console.error(error);
            });
    }

    function UpdateToLatestTheme() {
        getLatestReleaseDetails();
        InstallLatestTheme();
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
            <button onClick={() => { }}>Release Notes</button>
            {
                updateAvailable &&
                <button onClick={() => UpdateToLatestTheme()}>Update Theme</button>
            }
        </div>
    </div >

}
