import { html, useState } from '../../../deps/htm-preact.js';
import { useDataDispatch, ActionTypes } from './DataProvider.js';
import UploadDataWrapper from './UploadDataWrapper.js';
import APIDataWrapper from './APIDataWrapper.js';

export default function ToggleAPIFileWrapper({ children }) {
  const [usingFile, setUsingFile] = useState(false);
  const dataDispatch = useDataDispatch();

  const wrapper = usingFile ? UploadDataWrapper : APIDataWrapper;

  const toggleOnClick = () => {
    setUsingFile((curr) => !curr);
    dataDispatch({ type: ActionTypes.RESET_STATE });
  };

  const toggleSwitch = html`<label class="switch">
    <input
      class="switch-input"
      type="checkbox"
      checked=${usingFile}
      onClick=${toggleOnClick}
    />
    <span class="switch-label" data-on="API" data-off="Upload"></span>
    <span class="switch-handle"></span>
  </label>`;

  return html`<div>
    ${toggleSwitch}
    <${wrapper}>
      ${children}
    </${wrapper}>
  </div>`;
}
