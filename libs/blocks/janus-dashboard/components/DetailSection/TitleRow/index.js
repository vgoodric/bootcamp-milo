import { html, useContext } from '../../../../../deps/htm-preact.js';
import { RepoContext } from '../../../wrappers/RepoWrapper.js';
import { BranchContext } from '../../../wrappers/BranchWrapper.js';
import GridContainer from '../../GridContainer.js';
import GridItem from '../../GridItem.js';

export default function TitleRow() {
  const { state: { repo } } = useContext(RepoContext);
  const { state: { branch } } = useContext(BranchContext);
  return html`
  <div class='mb2 detail-section-title-row'>
    <${GridContainer}>
      <${GridItem} spacing=3>
        <span class='pl1'>${repo.toUpperCase()} ${branch.toUpperCase()} TESTS</span>
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
