import { html, useState } from '../../../deps/htm-preact.js';
import { useDataDispatch, ActionTypes } from './DataProvider.js';
import UploadDataWrapper from './UploadDataWrapper.js';
import APIDataWrapper from './APIDataWrapper.js';

export default function ToggleAPIFileWrapper({ children }) {
  const [usingFile, setUsingFile] = useState(false);
  const dataDispatch = useDataDispatch();

  const wrapper = usingFile ? UploadDataWrapper : APIDataWrapper;

  const toggleOnClickHandler = () => {
    setUsingFile((curr) => !curr);
    dataDispatch({ type: ActionTypes.RESET_STATE });
  };

  const toggleSwitch = html`<div class="toggle-button mt2 mb1">
    <button class=${usingFile ? 'on' : 'off'} onClick=${toggleOnClickHandler}>
      ${usingFile ? 'Use API' : 'Upload Data'}
    </button>
  </div> `;

  return html`
  <div>
    ${toggleSwitch}
    <${wrapper}>
      ${children}
    </${wrapper}>
  </div>`;
}
