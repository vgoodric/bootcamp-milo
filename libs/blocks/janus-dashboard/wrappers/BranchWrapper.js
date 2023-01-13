import {
  html,
  useReducer,
  createContext,
  useContext,
  useEffect,
} from '../../../deps/htm-preact.js';
import { MetaDataContext } from './MetaDataWrapper.js';
import { UploadFileContext } from './UploadFileWrapper.js';
// manual enum
export const ActionTypes = {
  SET_BRANCH: 0,
  SET_BRANCHES: 1,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_BRANCH:
      return { ...state, branch: action.payload };
    case ActionTypes.SET_BRANCHES:
      return { ...state, branches: action.payload };
    default:
      return state;
  }
};

export const BranchContext = createContext();

function BranchWrapper({ children }) {
  const { defaultBranch, dataLink } = useContext(MetaDataContext);
  const { uploadedData } = useContext(UploadFileContext);
  const initialState = { branch: defaultBranch, branches: [defaultBranch] };
  // TODO: fetch available branches and append to the states
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!uploadedData?.branch) return;
    dispatch({ type: ActionTypes.SET_BRANCH, payload: uploadedData.branch });
    dispatch({
      type: ActionTypes.SET_BRANCHES,
      payload: [uploadedData.branch],
    });
  }, [uploadedData?.branch]);

  return html`
    <${BranchContext.Provider} value=${{ state, dispatch }}> ${children} <//>
  `;
}

export default BranchWrapper;
