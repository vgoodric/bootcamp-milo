import {
  html,
  useReducer,
  createContext,
  useContext,
} from '../../../deps/htm-preact.js';
import { MetaDataContext } from './MetaDataWrapper.js';
// manual enum
export const ActionTypes = {
  SET_BRANCH: 0,
  SET_BRANCHES: 1,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_REPO:
      return { ...state, branch: action.payload };
    case ActionTypes.SET_REPOs:
      return { ...state, branches: action.payload };
    default:
      return state;
  }
};

export const BranchContext = createContext();

function BranchWrapper({ children }) {
  const { defaultBranch, dataLink } = useContext(MetaDataContext);
  const initialState = { branch: defaultBranch, branches: [defaultBranch] };
  // TODO: fetch available branches and append to the states
  const [state, dispatch] = useReducer(reducer, initialState);
  return html`
    <${BranchContext.Provider} value=${{ state, dispatch }}> ${children} <//>
  `;
}

export default BranchWrapper;
