import { html, useContext } from '../../../../../deps/htm-preact.js';
// import { FilterContext } from '../../../wrappers/FilterWrapper.js';
import GridContainer from '../../GridContainer.js';
import GridItem from '../../GridItem.js';
import Clickable from '../../Clickable.js';
import { PASSED } from '../../../utils/constants.js';

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
  return html`
    <div class=${showingDetail ? 'selected-table-row' : 'unselected-table-row'}>
      <${GridContainer}>
        <${GridItem} spacing=3>
          <span class="pl1 bold">${feature}</span>
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
          <${Clickable} >
            <div onClick=${showingDetail ? closeDetail : showDetail}>
              ${showingDetail ? 'Collapse' : 'Expand'}
            </div>
          </${Clickable}>
        </${GridItem}>
      </${GridContainer}>
    </div>`;
}
