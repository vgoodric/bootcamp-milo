import { useState } from '../../../deps/htm-preact.js';
import { ActionTypes, prefetchValue } from '../wrappers/DataProvider.js';
import { processData } from '../utils/utils.js';

export default function useUploadData(dataDispatch) {
  const [uploadInvalidErrMsg, setUploadInvalidErrMsg] = useState(null);
  const uploadFileOnInput = async (e) => {
    const fileInput = e.target.files?.[0];
    if (!fileInput) {
      dataDispatch({ type: ActionTypes.RESET_STATE });
    } else {
      const fileName = fileInput.name;
      const content = await fileInput.text();
      const parsed = JSON.parse(content);
      const { data, error } = processData(parsed, fileName);
      if (error) {
        setUploadInvalidErrMsg(`Invalid JSON ${fileName}: ${error}`);
      } else {
        const { repo, branch } = data;
        dataDispatch({
          type: ActionTypes.SET_STATE,
          payload: {
            repoBranchMap: {
              ...prefetchValue,
              value: { [repo]: [branch] },
            },
            selectedTestrunName: fileName,
            selectedRepo: repo,
            selectedBranch: branch,
            availableTestruns: {
              ...prefetchValue,
              value: { names: [fileName] },
            },
            testrunData: { ...prefetchValue, value: { data } },
          },
        });
      }
    }
  };
  return { uploadFileOnInput, uploadInvalidErrMsg };
}
