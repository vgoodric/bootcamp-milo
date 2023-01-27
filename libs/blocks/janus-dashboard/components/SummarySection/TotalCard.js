import { html } from '../../../../deps/htm-preact.js';
import {
  useFilterDispatch,
  ActionTypes as FilterActionTypes,
} from '../../wrappers/FilterProvider.js';
import {
  useDataState,
  useDataDispatch,
  ActionTypes as DataActionTypes,
  initialState,
} from '../../wrappers/DataProvider.js';
import GridContainer from '../GridContainer.js';
import GridItem from '../GridItem.js';
import { colorMap } from '../utils.js';
import Dropdown from '../Dropdown.js';
import SmallLoader from '../SmallLoader.js';

const status = 'total';

export default function TotalCard({ date, cnt, loading }) {
  const dataDispatch = useDataDispatch();
  const dataState = useDataState();
  const filterDispatch = useFilterDispatch();
  const {
    selectedRepo,
    repoBranchMap,
    availableTestruns,
    selectedBranch,
    selectedTestrunName,
  } = dataState;

  const repoOptions = repoBranchMap.value
    ? Object.keys(repoBranchMap.value).map((r) => ({
        value: r,
        text: r,
      }))
    : [];
  const branchOptions =
    repoBranchMap.value && selectedRepo
      ? repoBranchMap.value[selectedRepo].map((b) => ({
          value: b,
          text: b,
        }))
      : [];
  const testrunOptions = availableTestruns.value?.names
    ? availableTestruns.value.names.map((t) => ({ value: t, text: t }))
    : [];

  const repoOnSelect = (repo) =>
    dataDispatch({ type: DataActionTypes.SET_SELECTED_REPO, payload: repo });
  const branchOnSelect = (branch) =>
    dataDispatch({
      type: DataActionTypes.SET_SELECTED_BRANCH,
      payload: branch,
    });
  const testrunOnSelect = (testrunName) =>
    dataDispatch({
      type: DataActionTypes.SET_SELECTED_TESTRUN_NAME,
      payload: testrunName,
    });

  const color = colorMap[status];

  const setFilterStatusTotal = () => {
    filterDispatch({
      type: FilterActionTypes.MERGE_STATE,
      payload: {
        status: null,
        showDetail: true,
      },
    });
  };

  const cntRow = loading
    ? html`<${SmallLoader} color="blue" />`
    : html`
      <${GridContainer} spaceAround>
        <${GridItem}>
            <div class=${`clickable ${color} cnt-total mt03`} onClick=${setFilterStatusTotal}>
              ${cnt}
          </div>
        </${GridItem}>
      </${GridContainer}>`;

  const title = !loading && 'TOTAL TESTS';

  return html`<div class="summary-card text-centered">
  <${GridContainer} spaceBetween>
    <${GridItem}>
      <${Dropdown}
        options=${repoOptions}
        onSelect=${repoOnSelect}
        value=${selectedRepo}
        defaultValue=${initialState.selectedRepo}
        defaultText=${'select repo'}
        isLoading=${repoBranchMap.loading}
        isError=${repoBranchMap.error}
        bigDropdown
      />
    </${GridItem}>
    <${GridItem}>
      <div class="date">${date}</div>
    </${GridItem}>
  </${GridContainer}>

  <${GridContainer} >
    <${GridItem}>
      <${Dropdown}
        options=${branchOptions}
        labelText='BRANCH'
        onSelect=${branchOnSelect}
        value=${selectedBranch}
        defaultValue=${initialState.selectedBranch}
        defaultText=${'select branch'}
        isError=${repoBranchMap.error}
      />
    </${GridItem}>
    <${GridItem}>
      <${Dropdown}
        options=${testrunOptions}
        labelText='TESTRUN'
        onSelect=${testrunOnSelect}
        value=${selectedTestrunName}
        defaultValue=${initialState.selectedTestrunName}
        defaultText=${'select testrun'}
        isLoading=${availableTestruns.loading}
        isError=${repoBranchMap.error || availableTestruns.error}
      />
    </${GridItem}>
  </${GridContainer}>

  <hr />

  ${title}
  
  ${cntRow}
  
  </div> `;
}
