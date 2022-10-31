import { html } from '../../../../../deps/htm-preact.js';
import GridContainer from '../../GridContainer.js';
import GridItem from '../../GridItem.js';

export default function TitleRow({ env }) {
  return html`
  <div class='mb2 detail-section-title-row'>
    <${GridContainer}>
      <${GridItem}><span class='pl1'>${env?.toUpperCase() || 'ALL'} MAIN</span><//>
      <${GridItem} centered>Total<//>
      <${GridItem} centered>Passed<//>
      <${GridItem} centered>Failed<//>
      <${GridItem} centered>
        <input type="text" placeholder="Search..." />
      <//>
    </${GridContainer}>
  </div>`;
}
