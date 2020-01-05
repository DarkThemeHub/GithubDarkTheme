import * as React from 'react';
import './Popup.scss';
import { Page } from './Page';
import { getLocalStorageValue } from '../shared';

export const API_ADDRESS: string = 'https://api.github.com/';
const STORAGE_ID: string = 'GithubDarkThemeStorageV1';
export const REPO_OWNER: string = 'DarkThemeHub';
export const REPO_NAME: string = 'GithubDarkTheme';

export interface githubDarkThemeStorageV1Format {
  installedVersion: string;
  LastUpdateCheckedTime: number;
  theme: string;
  disabled: boolean;
}

const Popup: React.FunctionComponent<{}> = () => {
  var [storageObject, setStorageObject] = React.useState<githubDarkThemeStorageV1Format>(undefined);

  chrome.runtime.sendMessage({ popupMounted: true });
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
      var storageChange = changes[key];
      if (key === STORAGE_ID) {
        //storageChange.oldValue as githubDarkThemeStorageV1Format,
        setStorageObject(storageChange.newValue as githubDarkThemeStorageV1Format);
      }
    }
  })

  if (storageObject === undefined) {
    getLocalStorageValue().then(result => {
      setStorageObject(result as githubDarkThemeStorageV1Format);
      console.log("set storage cache");
    })
  }

  React.useEffect(() => {
    console.log("render!")

  })

  const enableTheme = () => {
    console.log('enableTheme!');
    chrome.runtime.sendMessage({ themeEnabled: true });
  }

  const disableTheme = () => {
    console.log('disableTheme!');
    chrome.runtime.sendMessage({ themeEnabled: false });
  };

  return (
    <div className="popupContainer">
      <h2>Github Darktheme</h2>

      <Page
        storage={storageObject}
        disableThemeCallback={disableTheme}
        enableThemeCallback={enableTheme} />
    </div>
  );

}

export default (Popup)