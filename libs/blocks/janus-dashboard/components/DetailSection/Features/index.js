import { html, useReducer } from '../../../../../deps/htm-preact.js';
import DetailTable from './DetailTable.js';
import CountRow from './CountRow.js';
import ActionRow from './ActionRow.js';

// manual enum again
export const ActionTypes = {
  CLOSE_DETAIL: 1,
  SHOW_DETAIL: 2,
  SET_FILTER: 3,
  SET_SORTING: 4,
};

const initialState = {
  showDetail: false,
  filterState: {},
  sorting: 'DEFAULT',
};
const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.CLOSE_DETAIL:
      return { ...state, showDetail: false };
    case ActionTypes.OPEN_DETAIL:
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
  const [{ showDetail, filterState, sorting }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  const closeDetail = () => {
    dispatch({ type: ActionTypes.CLOSE_DETAIL });
  };
  const openDetail = () => {
    dispatch({ type: ActionTypes.OPEN_DETAIL });
  };
  const setFilter = (filter) => {
    dispatch({ type: ActionTypes.SET_FILTER, payload: filter });
  };
  const setSorting = (order) => {
    dispatch({ type: ActionTypes.SET_SORTING, payload: order });
  };

  const detailTable = showDetail
    ? html`<${DetailTable}
        data=${data}
        filterState=${filterState}
        sortingState=${sorting}
      />`
    : null;

  const actionRow = showDetail
    ? html`<div class="pt1 pb1 ml1">
        <${ActionRow}
          feature=${feature}
          setFilter=${setFilter}
          filterState=${filterState}
          sortingState=${sorting}
          setSorting=${setSorting}
        />
      </div>`
    : null;

  return html` <div class="mb1">
    <${CountRow}
      data=${data}
      feature=${feature}
      closeDetail=${closeDetail}
      openDetail=${openDetail}
      showingDetail=${showDetail}
    />
    <div class="selected-background">
      ${actionRow}
      <div class="text-centered">${detailTable}</div>
    </div>
  </div>`;
}
