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
  SET_REPO: 0,
  SET_REPOS: 1,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_REPO:
      return { ...state, repo: action.payload };
    case ActionTypes.SET_REPOS:
      return { ...state, repos: action.payload };
    default:
      return state;
  }
};

export const RepoContext = createContext();

function RepoWrapper({ children }) {
  const { defaultRepo, dataLink } = useContext(MetaDataContext);
  const { uploadedData } = useContext(UploadFileContext);
  const initialState = { repo: defaultRepo, repos: [defaultRepo] };

  // TODO: fetch available repos and append to state.repos
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!uploadedData?.repo) return;
    dispatch({ type: ActionTypes.SET_REPO, payload: uploadedData.repo });
    dispatch({ type: ActionTypes.SET_REPOS, payload: [uploadedData.repo] });
  }, [uploadedData?.repo]);

  return html`
    <${RepoContext.Provider} value=${{ state, dispatch }}>
      ${children}
    </${RepoContext.Provider}>
  `;
}

export default RepoWrapper;
