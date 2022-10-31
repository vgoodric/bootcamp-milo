import { html, useReducer } from '../../../../../deps/htm-preact.js';
import DetailRows from './DetailRows.js';
import CountRow from './CountRow.js';
import GridContainer from '../../GridContainer.js';
import GridItem from '../../GridItem.js';

// manual enum
export const ActionTypes = {
  // SET_STATUS: 0,
  CLOSE_DETAIL: 1,
  SHOW_DETAIL: 2,
};
const initialState = { showDetail: false, status: null };
const reducer = (state, action) => {
  switch (action.type) {
    // case ActionTypes.SET_STATUS:
    //   return { ...state, showDetail: true, status: action.payload };
    case ActionTypes.CLOSE_DETAIL:
      return { ...state, showDetail: false, status: null };
    case ActionTypes.SHOW_DETAIL:
      return { ...state, showDetail: true };
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
  const detailRows = state.showDetail
    ? html`<${DetailRows} data=${data} />`
    : null;

  return html` <div class='mb1'>
    <${CountRow}
      data=${data}
      feature=${feature}
      closeDetail=${closeDetail}
      showDetail=${showDetail}
      showingDetail=${state.showDetail}
    />
    <div class="selected-background text-centered">${detailRows}</div>
  </div>`;
}
