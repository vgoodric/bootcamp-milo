import { html } from '../../../../../deps/htm-preact.js';
import GridContainer from '../../GridContainer.js';
import GridItem from '../../GridItem.js';
import Clickable from '../../Clickable.js';
import { PASSED } from '../../../utils/constants.js';
import ChevronDown from '../../../img/ChevronDown.js';
import ChevronUp from '../../../img/ChevronUp.js';
import { capitalize } from '../../utils.js';

export default function CountRow({
  feature,
  data,
  closeDetail,
  showDetail,
  showingDetail,
}) {
  const total = data.length;
  const passed = data.filter((d) => d.status === PASSED).length;
  const failed = total - passed;

  const onClickHandler = showingDetail ? closeDetail : showDetail;
  const chevron = showingDetail
    ? html`<${ChevronUp} />`
    : html`<${ChevronDown} />`;

  return html`
    <div class=${showingDetail ? 'selected-table-row' : 'unselected-table-row'}>
      <${Clickable} >
        <div onClick=${onClickHandler}>
          <${GridContainer}>
            <${GridItem} spacing=3>
              <span class="pl1 bold">${feature && capitalize(feature)}</span>
            </${GridItem}>
            <${GridItem} centered>
              <span class='bold'>${total}</span>
            </${GridItem}>
            <${GridItem} centered>
            <span class='bold'>${passed}</span>
            </${GridItem}>
            <${GridItem} centered>
            <span class='bold'>${failed}</span>
            </${GridItem}>
            <${GridItem} centered>
              ${chevron}
            </${GridItem}>
          </${GridContainer}>
        </div>
      </${Clickable}>
    </div>`;
}
