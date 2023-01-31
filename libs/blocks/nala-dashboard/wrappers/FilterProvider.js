import {
  html,
  useReducer,
  createContext,
  useContext,
} from '../../../deps/htm-preact.js';

// manual enum
export const ActionTypes = {
  SET_SHOW_DETAIL: 0,
  MERGE_STATE: 1,
  TOGGLE_SHOW_DETAIL: 2,
};

const initialState = {
  showDetail: false,
  status: null,
  searchStr: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_SHOW_DETAIL:
      return { ...state, showDetail: action.payload };
    case ActionTypes.TOGGLE_SHOW_DETAIL:
      return { ...state, showDetail: !state.showDetail };
    case ActionTypes.MERGE_STATE:
      return Object.keys(action.payload).reduce(
        (acc, currKey) => ({ ...acc, [currKey]: action.payload[currKey] }),
        { ...state },
      );
    default:
      return state;
  }
};

const FilterContext = createContext();

function FilterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return html`
    <${FilterContext.Provider} value=${{ state, dispatch }}> ${children} <//>
  `;
}

export function useFilterState() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilterState must be used within FilterProvider');
  }
  return context.state;
}

export function useFilterDispatch() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilterDispatch must be used within FilterProvider');
  }
  return context.dispatch;
}

export default FilterProvider;
