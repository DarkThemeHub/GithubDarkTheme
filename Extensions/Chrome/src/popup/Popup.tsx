import * as React from 'react';
import './Popup.scss';
import { Update } from './Update';

interface AppProps { }

interface AppState { }


export default class Popup extends React.Component<AppProps, AppState> {
  constructor(props: AppProps, state: AppState) {
    super(props, state);
  }

  componentDidMount() {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true });


    /* var extensionName = '<the_extension_name>';
 
     chrome.management.getAll(function (extensions) {
       var isInstalled = extensions.some(function (extensionInfo) {
         return extensionInfo.name === extensionName;
       });
       if (isInstalled) {
         alert("Stylus or Stylish extension was detected, make sure you are not using any github themes that may conflict with this.")
       }
     }); */
  }

  render() {
    return (
      <div className="popupContainer">
        <h2>Github Darktheme</h2>

        <Update />
      </div>
    );
  }
}
