import { useEffect, useMemo } from '../../../deps/htm-preact.js';
import { useMetaData } from './MetaDataProvider.js';
import { postData, processData } from '../utils/utils.js';
import { useDataDispatch, useDataState, ActionTypes } from './DataProvider.js';
import useFetchAPI from '../hooks/useFetchAPI.js';

const actionGetReposBranches = 'getreposbranches';
const actionGetTestrunsByRepoBranch = 'gettestrunsbyrepobranch';
const actionGetTestrun = 'gettestrun';

function useFetchRepoBranchMap({ dataLink, dataDispatch }) {
  const memoizedFetchFunc = useMemo(
    () => async () => postData(`${dataLink}/${actionGetReposBranches}`, null),
    [dataLink],
  );
  useFetchAPI(
    false,
    dataDispatch,
    ActionTypes.SET_REPO_BRANCH_MAP,
    memoizedFetchFunc,
  );
}

function useFetchAvailableTestruns({
  dataLink,
  selectedBranch,
  selectedRepo,
  dataDispatch,
}) {
  const skipEffect = !selectedBranch || !selectedRepo;
  const memoizedFetchFunc = useMemo(
    () => async () =>
      postData(
        `${dataLink}/${actionGetTestrunsByRepoBranch}`,
        JSON.stringify({ repo: selectedRepo, branch: selectedBranch }),
      ),
    [selectedBranch, selectedRepo, dataLink],
  );
  useFetchAPI(
    skipEffect,
    dataDispatch,
    ActionTypes.SET_AVAILABLE_TESTRUNS,
    memoizedFetchFunc,
  );
}

function useFetchTestrunData({ dataLink, selectedTestrunName, dataDispatch }) {
  const skipEffect = !selectedTestrunName;
  const memoizedFetchFunc = useMemo(
    () => async () => {
      const res = await postData(
        `${dataLink}/${actionGetTestrun}`,
        JSON.stringify({ name: selectedTestrunName }),
      );
      const { data, error } = processData(res.data);
      if (error) throw error;
      return { data };
    },
    [selectedTestrunName, dataLink],
  );
  useFetchAPI(
    skipEffect,
    dataDispatch,
    ActionTypes.SET_TESTRUN_DATA,
    memoizedFetchFunc,
  );
}

function useSelectDefaultRepoBranch({
  defaultBranch,
  defaultRepo,
  dataDispatch,
  repoBranchMapAvailable,
}) {
  useEffect(() => {
    if (!defaultRepo || !repoBranchMapAvailable) return;
    dataDispatch({
      type: ActionTypes.SET_SELECTED_REPO,
      payload: defaultRepo,
    });
    if (defaultBranch) {
      dataDispatch({
        type: ActionTypes.SET_SELECTED_BRANCH,
        payload: defaultBranch,
      });
    }
  }, [defaultBranch, dataDispatch, defaultRepo, repoBranchMapAvailable]);
}

function useSelectFirstTestrun({ dataDispatch, firstTestrun, noReady }) {
  useEffect(() => {
    if (noReady || !firstTestrun) return;
    dataDispatch({
      type: ActionTypes.SET_SELECTED_TESTRUN_NAME,
      payload: firstTestrun,
    });
  }, [dataDispatch, noReady, firstTestrun]);
}

export default function APIDataWrapper({ children }) {
  const { dataLink, defaultBranch, defaultRepo } = useMetaData();
  const dataState = useDataState();
  const dataDispatch = useDataDispatch();
  const {
    selectedBranch,
    selectedRepo,
    selectedTestrunName,
    repoBranchMap: { value: repoBranchMapValue },
    availableTestruns: { value: availableTestrunsValue },
  } = dataState;
  useFetchRepoBranchMap({ dataDispatch, dataLink });
  useFetchAvailableTestruns({
    selectedBranch,
    selectedRepo,
    dataDispatch,
    dataLink,
  });
  useFetchTestrunData({ selectedTestrunName, dataDispatch, dataLink });

  // if repoBranchMap loaded and default repo/branch configured in the authored block:
  //    auto select repo/branch
  useSelectDefaultRepoBranch({
    dataDispatch,
    defaultBranch,
    defaultRepo,
    repoBranchMapAvailable: !!repoBranchMapValue,
  });

  // if availableTestruns loaded and default repo&branch configured in the authored block:
  //    auto select the first testruns
  useSelectFirstTestrun({
    dataDispatch,
    defaultBranch,
    defaultRepo,
    firstTestrun: availableTestrunsValue?.names?.[0],
    noReady: !(
      defaultRepo === selectedRepo && defaultBranch === selectedBranch
    ),
  });
  return children;
}
