import { html } from '../../../../deps/htm-preact.js';
import { useDataState } from '../../wrappers/DataProvider.js';
import {
  useFilterDispatch,
  useFilterState,
  ActionTypes,
} from '../../wrappers/FilterProvider.js';
import GridContainer from '../GridContainer.js';
import GridItem from '../GridItem.js';

export default function TitleRow() {
  const dataState = useDataState();
  const { searchStr } = useFilterState();
  const filterDispatch = useFilterDispatch();

  const { selectedRepo, selectedBranch } = dataState;

  const searchOnInput = (e) => {
    e.preventDefault();
    filterDispatch({
      type: ActionTypes.MERGE_STATE,
      payload: { searchStr: e.target.value },
    });
  };

  return html`
  <div class='mb2 detail-section-title-row'>
    <${GridContainer}>
      <${GridItem} spacing=3>
        <span class='pl1'>${selectedRepo.toUpperCase()} ${selectedBranch.toUpperCase()} TESTS</span>
      </${GridItem}>
      <${GridItem} centered>Total</${GridItem}>
      <${GridItem} centered>Passed</${GridItem}>
      <${GridItem} centered>Failed</${GridItem}>
      <${GridItem}>
        <input
          type="search"
          placeholder="Search"
          class='search-bar'
          value=${searchStr}
          onInput=${searchOnInput} />
      </${GridItem}>
    </${GridContainer}>
  </div>`;
}
