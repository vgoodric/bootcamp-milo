import { html } from '../../../deps/htm-preact.js';
import useUploadData from '../hooks/useUploadData.js';
import { useDataDispatch, useDataState } from './DataProvider.js';

function UploadDataWrapper({ children }) {
  const dataDispatch = useDataDispatch();
  const dataState = useDataState();
  const { uploadFileOnInput, uploadInvalidErrMsg } =
    useUploadData(dataDispatch);
  let wrappedContent;
  if (uploadInvalidErrMsg) {
    wrappedContent = uploadInvalidErrMsg;
  } else if (dataState.testrunData) {
    wrappedContent = children;
  } else {
    wrappedContent = 'Upload a generated JSON file to see visualization';
  }

  return html`
    <div>
      <div class="mb2">
        <input
          type="file"
          name="persistedResults"
          accept=".json"
          onInput=${uploadFileOnInput}
        />
      </div>
      ${wrappedContent}
    </div>
  `;
}

export default UploadDataWrapper;
