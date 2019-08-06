import * as React from 'react';
import './Update.scss'

const API_ADDRESS = 'https://api.github.com/';



interface storageFormat {
    version: string,
    theme: string
}
export const Update: React.FunctionComponent<{}> = ({ }) => {


    const [lastUpdated, setLastUpdated] = React.useState<number>(undefined);
    const [lastVersionCheck, setLastVersionCheck] = React.useState<number>(undefined);
    const [latestVersion, setLatestVersion] = React.useState<string>(undefined);
    let fromStorage: storageFormat;

    let initialInstalledVersion: string;
    chrome.storage.local.get('storageFile', (result) => {
        const storageFile = result.storageFile as storageFormat;
        console.log(storageFile);
        console.log("retrieve storage attempted")
        setInstalledVersion(storageFile.version);
    });

    const [installedVersion, setInstalledVersion] = React.useState<string>();


    function GetLatestReleaseDetails() {
        return fetch(API_ADDRESS + `repos/acoop133/githubdarktheme/releases/latest`)
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                setLatestVersion(data.tag_name);
            })
            .catch(function (error) {
                // handle error
                console.error(error);
            }).then(() => {
                setLastVersionCheck(Date.now);
            });

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

            })
            .catch(function (error) {
                // handle error
                console.error(error);
            });
    }

    function UpdateToLatestTheme() {
        GetLatestReleaseDetails();
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

    const Update = () => {
        alert("Update triggered");

        updateAvailableNotification();

        GetLatestReleaseDetails();
    }

    return <div>
        <div>Latest version: {latestVersion}</div>
        <div>Installed version: {installedVersion}</div>
        <div className="button-row">
            <button onClick={() => { }}>Release Notes</button>
            {
                installedVersion !== latestVersion &&
                <button onClick={() => UpdateToLatestTheme()}>Update Theme</button>
            }
        </div>
    </div >

}
