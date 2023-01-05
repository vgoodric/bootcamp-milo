import { html, useReducer } from '../../../../../deps/htm-preact.js';
import DetailTable from './DetailTable.js';
import CountRow from './CountRow.js';
import ActionRow from './ActionRow.js';
import { SortingConfigs } from './sortUtils.js';

// manual enum
export const ActionTypes = {
  // SET_STATUS: 0,
  CLOSE_DETAIL: 1,
  SHOW_DETAIL: 2,
  SET_FILTER: 3,
  SET_SORTING: 4,
};

const initialState = {
  showDetail: false,
  filterState: {},
  sorting: `DEFAULT`,
};
const reducer = (state, action) => {
  switch (action.type) {
    // case ActionTypes.SET_STATUS:
    //   return { ...state, showDetail: true, status: action.payload };
    case ActionTypes.CLOSE_DETAIL:
      // TODO: maybe reset filterState here
      return { ...state, showDetail: false };
    case ActionTypes.SHOW_DETAIL:
      return { ...state, showDetail: true };
    case ActionTypes.SET_FILTER:
      return { ...state, filterState: action.payload };
    case ActionTypes.SET_SORTING:
      return { ...state, sorting: action.payload };
    default:
      return state;
  }
};

export default function Feature({ data, feature }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const getSetStatusCB = (status) => () => {
  //   dispatch({ type: ActionTypes.SET_STATUS, payload: status });
  // };
  const closeDetail = () => {
    dispatch({ type: ActionTypes.CLOSE_DETAIL });
  };
  const showDetail = () => {
    dispatch({ type: ActionTypes.SHOW_DETAIL });
  };
  const setFilter = (filter) => {
    dispatch({ type: ActionTypes.SET_FILTER, payload: filter });
  };
  const setSorting = (sorting) => {
    dispatch({ type: ActionTypes.SET_SORTING, payload: sorting });
  };

  const detailTable = state.showDetail
    ? html`<${DetailTable}
        data=${data}
        filterState=${state.filterState}
        sortingState=${state.sorting}
      />`
    : null;

  const actionRow = state.showDetail
    ? html`<div class='pt1 pb1'><${ActionRow}
        feature=${feature}
        setFilter=${setFilter}
        sortingState=${state.sorting}
        setSorting=${setSorting}
      /></div>`
    : null;

  return html` <div class="mb1">
    <${CountRow}
      data=${data}
      feature=${feature}
      closeDetail=${closeDetail}
      showDetail=${showDetail}
      showingDetail=${state.showDetail}
    />
    ${actionRow}
    <div class="selected-background text-centered">${detailTable}</div>
  </div>`;
}
