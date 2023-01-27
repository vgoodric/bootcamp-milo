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

  return html`<div>
    <button onClick=${toggleOnClick}
    >
      ${!usingFile ? 'Use Local Files' : 'Fetch from APIs'}
    </button>
    <${wrapper}>
      ${children}
    </${wrapper}>
  </div>`;
}
