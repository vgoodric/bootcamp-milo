/* eslint-disable comma-dangle */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable indent */
/* eslint-disable object-curly-newline */
import {
  html,
  createContext,
  useReducer,
  useContext,
} from '../../../deps/htm-preact.js';

const DataContext = createContext();

// manual enum
export const ActionTypes = {
  SET_SELECTED_REPO: 0,
  SET_SELECTED_BRANCH: 1,
  SET_SELECTED_TESTRUN_NAME: 2,
  SET_REPO_BRANCH_MAP: 3,
  SET_AVAILABLE_TESTRUNS: 4,
  SET_TESTRUN_DATA: 5,
  SET_UPLOAD_DATA_STATES: 6,
  RESET_STATE: 8,
};
export const prefetchValue = { value: null, loading: false, error: null };
export const initialState = {
  selectedRepo: null,
  selectedBranch: null,
  selectedTestrunName: null,
  testrunData: prefetchValue,
  repoBranchMap: prefetchValue,
  availableTestruns: prefetchValue,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_SELECTED_REPO:
      return {
        ...state,
        selectedRepo: payload,
        selectedBranch: null,
        selectedTestrunName: null,
        availableTestruns: prefetchValue,
        testrunData: prefetchValue,
      };
    case ActionTypes.SET_SELECTED_BRANCH:
      return {
        ...state,
        selectedBranch: payload,
        selectedTestrunName: null,
        availableTestruns: prefetchValue,
        testrunData: prefetchValue,
      };
    case ActionTypes.SET_SELECTED_TESTRUN_NAME:
      return {
        ...state,
        selectedTestrunName: payload,
        testrunData: prefetchValue,
      };
    case ActionTypes.SET_REPO_BRANCH_MAP:
      return {
        ...state,
        repoBranchMap: payload,
        selectedRepo: null,
        selectedBranch: null,
        selectedTestrunName: null,
        testrunData: prefetchValue,
        availableTestruns: prefetchValue,
      };
    case ActionTypes.SET_AVAILABLE_TESTRUNS:
      return {
        ...state,
        selectedTestrunName: null,
        testrunData: prefetchValue,
        availableTestruns: payload,
      };
    case ActionTypes.SET_TESTRUN_DATA:
      return {
        ...state,
        testrunData: payload,
      };
    case ActionTypes.SET_UPLOAD_DATA_STATES: {
      const { data, fileName } = payload;
      const { repo, branch } = data;
      return {
        ...state,
        repoBranchMap: {
          ...prefetchValue,
          value: { [repo]: [branch] },
        },
        selectedTestrunName: payload.fileName,
        selectedRepo: repo,
        selectedBranch: branch,
        availableTestruns: { ...prefetchValue, value: { names: [fileName] } },
        testrunData: { ...prefetchValue, value: { data } },
      };
    }
    case ActionTypes.RESET_STATE:
      return initialState;
    default:
      throw new Error(`Illegal Action Type: ${type}`);
  }
};

export default function DataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log({ state });
  return html` <${DataContext.Provider} value=${{ state, dispatch }}>
    ${children}
  <//>`;
}

/**
 *
 * @returns {object} DataContext state
 */
export function useDataState() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataState must be used within DataProvider');
  }
  return context.state;
}

/**
 *
 * @returns {object} TestrunData {data, contentLength, creationTime, url, lastModified, ...rest}
 */
export function useTestrunData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataState must be used within DataProvider');
  }
  return context.state.testrunData;
}

/**
 *
 * @returns {Function} DataContext dispatch function
 */
export function useDataDispatch() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataDispatch must be used within DataProvider');
  }
  return context.dispatch;
}
