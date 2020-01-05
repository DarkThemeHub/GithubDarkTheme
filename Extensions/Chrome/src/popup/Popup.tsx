import * as React from 'react';
import './Popup.scss';
import { Page } from './Page';
import { compare } from 'compare-versions';
import { injectTheme, removeInjectedTheme } from './injectorFunctions';
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
  if (storageObject === undefined) {
    getLocalStorageValue("githubDarkThemeStorageV1Format").then(result => {
      setStorageObject(result as githubDarkThemeStorageV1Format);
      console.log("set storage cache");
    })
  }
  React.useEffect(() => {
    console.log("render!")
  })

  const enableTheme = () => {
    console.log('enableTheme!');
  }

  const disableTheme = () => {
    console.log('disableTheme!');

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