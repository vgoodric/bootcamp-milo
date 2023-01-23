import { html, useState } from '../../../deps/htm-preact.js';
import { useDataDispatch } from './DataProvider.js';
import UploadDataWrapper from './UploadDataWrapper.js';
import APIDataWrapper from './APIDataWrapper.js';

export default function ToggleAPIFileWrapper({ children }) {
  const [usingFile, setUsingFile] = useState(false);

  const wrapper = usingFile ? UploadDataWrapper : APIDataWrapper;

  return html`<div>
    <button onClick=${() => {
      setUsingFile((curr) => !curr);
    }}
    >
      ${!usingFile ? 'Use Local Files' : 'Fetch from APIs'}
    </button>
    <${wrapper}>
      ${children}
    </${wrapper}>
  </div>`;
}
