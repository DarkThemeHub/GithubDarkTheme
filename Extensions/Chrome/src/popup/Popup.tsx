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
