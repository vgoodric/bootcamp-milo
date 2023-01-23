import { html } from '../../../../../deps/htm-preact.js';
import { useDataState } from '../../../wrappers/DataProvider.js';
import GridContainer from '../../GridContainer.js';
import GridItem from '../../GridItem.js';

export default function TitleRow() {
  const dataState = useDataState();
  const { selectedRepo, selectedBranch } = dataState;
  return html`
  <div class='mb2 detail-section-title-row'>
    <${GridContainer}>
      <${GridItem} spacing=3>
        <span class='pl1'>${selectedRepo.toUpperCase()} ${selectedBranch.toUpperCase()} TESTS</span>
      <//>
      <${GridItem} centered>Total<//>
      <${GridItem} centered>Passed<//>
      <${GridItem} centered>Failed<//>
      <${GridItem}>
        <input type="text" placeholder="Search" class='search-bar' />
      <//>
    </${GridContainer}>
  </div>`;
}
