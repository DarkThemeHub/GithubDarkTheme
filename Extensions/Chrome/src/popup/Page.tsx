import { compare } from 'compare-versions';
import * as React from 'react';
import './Page.scss';
import { githubDarkThemeStorageV1Format, REPO_OWNER, REPO_NAME } from './Popup';

export interface PageProps {
    storage: githubDarkThemeStorageV1Format;
    enableThemeCallback: () => void;
    disableThemeCallback: () => void;
}
export const Page: React.FunctionComponent<PageProps> = ({ storage, enableThemeCallback, disableThemeCallback }) => {

    return <div>
        <div className="update-grid">
            <div className="grid-item" style={{ paddingRight: 20 }}>
                <span style={{ float: 'right' }}>Last update checked:</span>
            </div>
            <div className="grid-item">
                <span className="small-text">{storage && (Date.now() - storage.LastUpdateCheckedTime)} ago</span>
            </div>
            <div className="grid-item" style={{ paddingRight: 20 }}>
                <div style={{ alignItems: 'baseline', float: 'right' }}>Installed version:</div>
            </div>
            <div className="grid-item">
                <div>{storage && storage.installedVersion}</div>
                {
                    storage && storage.disabled ?
                        <button onClick={() => enableThemeCallback()}>Enable Theme</button>
                        :
                        <button onClick={() => disableThemeCallback()}>Disable Theme</button>
                }
            </div>
        </div>
        <div className="button-row">
            <button onClick={() => { chrome.tabs.create({ url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases` }); }}>Release Notes</button>
            <button onClick={() => { chrome.tabs.create({ url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues` }); }}>Report Issues</button>
        </div>
    </div >
};
