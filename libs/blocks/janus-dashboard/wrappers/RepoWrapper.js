import {
  html,
  useReducer,
  createContext,
  useContext,
} from '../../../deps/htm-preact.js';
import { MetaDataContext } from './MetaDataWrapper.js';
// manual enum
export const ActionTypes = {
  SET_REPO: 0,
  SET_REPOS: 1,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_REPO:
      return { ...state, repo: action.payload };
    case ActionTypes.SET_REPOs:
      return { ...state, repos: action.payload };
    default:
      return state;
  }
};

export const RepoContext = createContext();

function RepoWrapper({ children }) {
  const { defaultRepo, dataLink } = useContext(MetaDataContext);
  const initialState = { repo: defaultRepo, repos: [defaultRepo] };
  // TODO: fetch available repos and append to the states
  const [state, dispatch] = useReducer(reducer, initialState);
  return html`
    <${RepoContext.Provider} value=${{ state, dispatch }}> ${children} </${
    RepoContext.Provider
  }>
  `;
}

export default RepoWrapper;
