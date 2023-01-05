import { html, useContext } from '../../../../deps/htm-preact.js';
import {
  RepoContext,
  ActionTypes as RepoActionTypes,
} from '../../wrappers/RepoWrapper.js';
import {
  BranchContext,
  ActionTypes as BranchActionTypes,
} from '../../wrappers/BranchWrapper.js';
import GridContainer from '../GridContainer.js';
import GridItem from '../GridItem.js';
import { colorMap } from '../utils.js';
import DropdownBig from '../DropdownBig.js';
import Dropdown from '../Dropdown.js';

const status = 'total';

export default function TotalCard({ date, cnt }) {
  const { dispatch: repoDispatch, state: repoState } = useContext(RepoContext);
  const { dispatch: branchDispatch, state: branchState } =
    useContext(BranchContext);
  const { repo, repos } = repoState;
  const { branch, branches } = branchState;

  const repoOptions = [...repos.map((c) => ({ value: c, text: c }))];
  const branchOptions = [...branches.map((c) => ({ value: c, text: c }))];

  const color = colorMap[status];

  return html`<div class="summary-card text-centered">
  <${GridContainer} spaceBetween>
    <${GridItem}>
      <${DropdownBig} options=${repoOptions} />
    </${GridItem}>
    <${GridItem}>
      <div class="date">${date}</div>
    </${GridItem}>
  </${GridContainer}>

  <${GridContainer} >
    <${GridItem}>
    <div class='mt1'>
      <${Dropdown} options=${branchOptions} labelText='BRANCH' />
    </div>
    </${GridItem}>
  </${GridContainer}>

  <hr />

  <div>TOTAL TESTS</div>
  
  <${GridContainer} spaceAround>
    <${GridItem}>
        <div class=${`clickable ${color} cnt-total`} onClick=${() => {}}>
          <span class=${'cnt-total'}>
            ${cnt}
          </span>
      </div>
    </${GridItem}>
  </${GridContainer}>
  </div> `;
}
