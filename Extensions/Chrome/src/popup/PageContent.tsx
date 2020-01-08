import * as React from 'react';
import './PageContent.scss';
import { REPO_OWNER, REPO_NAME } from './Popup';
import { getDateTimeInSeconds, githubDarkThemeStorageV1Format } from '../shared';

export interface PageProps {
    storage: githubDarkThemeStorageV1Format;
    enableThemeCallback: () => void;
    disableThemeCallback: () => void;
}

export const PageContent: React.FunctionComponent<PageProps> = ({ storage, enableThemeCallback, disableThemeCallback }) => {

    const lastCheckedTimeString = secondsToFormattedString(getDateTimeInSeconds() - storage.LastUpdateCheckedTime);

    function secondsToFormattedString(secondsInput: number) {
        const days = Math.floor(secondsInput / 86400);
        const hours = Math.floor((secondsInput % 86400) / 3600);
        const minutes = Math.floor(((secondsInput % 86400) % 3600) / 60);
        const seconds = Math.floor(((secondsInput % 86400) % 3600) % 60);
        var outputString = "";
        if (days > 0) {
            outputString += (days + " days ")
        }
        if (hours > 0) {
            outputString += (hours + " hours ")
        }
        if (minutes > 0) {
            outputString += (minutes + " minutes ")
        }
        outputString += (seconds + " seconds")

        return outputString;
    }

    return <div>
        <div className="grid">
            <div className="grid-item" style={{ paddingRight: 20 }}>
                <div >Installed version:</div>
            </div>
            <div className="grid-item">{storage.installedVersion}</div>
        </div>
        <span className="small-text">{`Checked for update ${lastCheckedTimeString} ago`}</span>
        <div className="button-row">
            <span style={{ float: "left" }}>
                {storage.disabled ?
                    <button onClick={() => enableThemeCallback()}>Enable Theme</button> :
                    <button onClick={() => disableThemeCallback()}>Disable Theme</button>
                }
            </span>
            <span style={{ float: "right" }}>
                <button onClick={() => { chrome.tabs.create({ url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases` }); }}>Release Notes</button>
                <button onClick={() => { chrome.tabs.create({ url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues` }); }}>Report Issues</button>
            </span>
        </div>
    </div >
};

