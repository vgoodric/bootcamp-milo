import { html, useContext } from '../../../../deps/htm-preact.js';
import { FilterContext, ActionTypes } from '../../wrappers/FilterWrapper.js';
import GridContainer from '../GridContainer.js';
import GridItem from '../GridItem.js';
import { colorMap } from '../utils.js';

export default function StatusCard({ status, date, cnt, percent }) {
  const { dispatch, state: filterState } = useContext(FilterContext);
  const { branch, env } = filterState;

  const displayEnv = env?.toUpperCase() || 'All Envs';
  const displayBranch = branch?.toUpperCase() || 'MAIN';

  const color = colorMap[status];

  const getStatusSetter = (newStatus) => () => {
    dispatch({
      type: ActionTypes.SET_STATE,
      payload: {
        status: newStatus === 'total' ? null : newStatus,
        showDetail: true,
      },
    });
  };

  return html`<div class="summary-card text-centered">

  <${GridContainer} flexEnd>
    <${GridItem}>
      <div class="date">${date}</div>
    </${GridItem}>
  </${GridContainer}>

  <${GridContainer} spaceAround>
    <${GridItem}>
    <div class="branch">${displayEnv} ${displayBranch}</div>
    </${GridItem}>
  </${GridContainer}>

  <${GridContainer} spaceAround>
    <${GridItem}>
      <div class="status">${status?.toUpperCase()}</div>
    </${GridItem}>
  </${GridContainer}>

  <${GridContainer} spaceAround>
    <${GridItem}>
      <div class="cnt-percent">
        <div class=${`clickable ${color}`} onClick=${getStatusSetter(status)}>
          <span class=${'cnt'}>
            ${cnt}
          </span>
          <span class=${'percent'}>
            /${percent}%
          </span>
        </div>
      </div>
    </${GridItem}>
  </${GridContainer}>
  </div> `;
}
