import * as React from 'react';
import './Popup.scss';
import { PageContent } from './PageContent';
import { getLocalStorageValue, githubDarkThemeStorageV1Format } from '../shared';

export const API_ADDRESS: string = 'https://api.github.com/';
const STORAGE_ID: string = 'GithubDarkThemeStorageV1';
export const REPO_OWNER: string = 'DarkThemeHub';
export const REPO_NAME: string = 'GithubDarkTheme';

const Popup: React.FunctionComponent<{}> = () => {
  var [storageObject, setStorageObject] = React.useState<githubDarkThemeStorageV1Format>(undefined);
  React.useEffect(() => {
    getLocalStorageValue().then(result => {
      setStorageObject(result as githubDarkThemeStorageV1Format);
      console.log("set storage cache");
    })
  }, [])

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

  const enableTheme = () => {
    console.log('enableTheme!');
    chrome.runtime.sendMessage({ enableTheme: true });
  }

  const disableTheme = () => {
    console.log('disableTheme!');
    chrome.runtime.sendMessage({ disableTheme: true });
  };

  const forceCheckUpdate = () => {
    chrome.runtime.sendMessage({ forceCheckUpdate: true });
  };

  return (
    <div className="popupContainer">
      <div >
        <h2 className="title" style={{ float: "left" }}>Github DarkTheme</h2>
        <div className="titleVersion">v{chrome.runtime.getManifest().version}</div>
        <br />
        <a className="authorLink" onClick={() => chrome.tabs.create({ url: `https://github.com/DarkThemeHub/` })}>by DarkThemeHub</a>
      </div>
      {storageObject &&
        <PageContent
          storage={storageObject}
          disableThemeCallback={disableTheme}
          enableThemeCallback={enableTheme}
          forceCheckUpdateCallback={forceCheckUpdate} />
      }
    </div >
  );
}

export default (Popup)