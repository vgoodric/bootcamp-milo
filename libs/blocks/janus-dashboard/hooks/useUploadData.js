import { useState } from '../../../deps/htm-preact.js';
import { ActionTypes, prefetchValue } from '../wrappers/DataProvider.js';

function throwForInvalidJSON(field) {
  throw new Error(`invalid or missing field: ${field}`);
}

function processData(data) {
  try {
    const { results, timestamp, branch, repo } = data;
    if (!timestamp) throwForInvalidJSON('timestamp');
    if (!branch) throwForInvalidJSON('branch');
    if (!repo) throwForInvalidJSON('repo');
    if (!results || !Array.isArray(results)) throwForInvalidJSON('results');
    return { data };
  } catch (error) {
    return { error };
  }
}
export default function useUploadData(dataDispatch) {
  const [uploadInvalidErrMsg, setUploadInvalidErrMsg] = useState(null);
  const uploadFileOnChange = async (e) => {
    const fileInput = e.target.files?.[0];
    if (fileInput) {
      const fileName = fileInput.name;
      const content = await fileInput.text();
      const parsed = JSON.parse(content);
      const { data, error } = processData(parsed, fileName);
      if (error) {
        setUploadInvalidErrMsg(`Invalid JSON ${fileName}: ${error}`);
      } else {
        dataDispatch({
          type: ActionTypes.SET_UPLOAD_DATA_STATES,
          payload: { data, fileName },
        });
        // const { repo, branch } = data;
        // dataDispatch({
        //   type: ActionTypes.SET_REPO_BRANCH_MAP,
        //   payload: { ...prefetchValue, value: { [repo]: [branch] } },
        // });
        // dataDispatch({ type: ActionTypes.SET_SELECTED_TESTRUN_NAME, payload: '' });
      }
    } else {
      dataDispatch({ type: ActionTypes.RESET_STATE });
    }
  };
  return { uploadFileOnChange, uploadInvalidErrMsg };
}
