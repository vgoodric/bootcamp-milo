import { html } from '../../../../deps/htm-preact.js';
import {
  ActionTypes,
  useFilterDispatch,
} from '../../wrappers/FilterProvider.js';
import { useDataState } from '../../wrappers/DataProvider.js';
import GridContainer from '../GridContainer.js';
import GridItem from '../GridItem.js';
import { colorMap } from '../utils.js';
import SmallLoader from '../SmallLoader.js';

export default function StatusCard({ status, date, cnt, percent, loading }) {
  const dataState = useDataState();
  const filterDispatch = useFilterDispatch();
  const { selectedRepo, selectedBranch } = dataState;

  const displayRepoBranch =
    selectedRepo && selectedBranch
      ? `${selectedRepo.toUpperCase()} ${selectedBranch.toUpperCase()}`
      : 'No Data';

  const color = colorMap[status];

  const statusSetter = () => {
    filterDispatch({
      type: ActionTypes.MERGE_STATE,
      payload: {
        status,
        showDetail: true,
      },
    });
  };

  const cntPercentRow = loading
    ? html`<${SmallLoader} />`
    : html`
      <${GridContainer} spaceAround>
        <${GridItem}>
          <div class="cnt-percent">
            <div class=${`clickable ${color}`} onClick=${statusSetter}>
              <span class=${'cnt'}>
                ${cnt}
              </span>
              <span class=${'percent'}>
                /${percent}%
              </span>
            </div>
          </div>
        </${GridItem}>
      </${GridContainer}>`;

  return html`<div class="summary-card text-centered">

  <${GridContainer} flexEnd>
    <${GridItem}>
      <div class="date">${date}</div>
    </${GridItem}>
  </${GridContainer}>

  <${GridContainer} spaceAround>
    <${GridItem}>
    <div class="branch">${displayRepoBranch}</div>
    </${GridItem}>
  </${GridContainer}>

  <${GridContainer} spaceAround>
    <${GridItem}>
      <div class="status">${status?.toUpperCase()}</div>
    </${GridItem}>
  </${GridContainer}>

  ${cntPercentRow}

  </div> `;
}
