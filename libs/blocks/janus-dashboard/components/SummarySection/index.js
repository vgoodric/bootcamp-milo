import { html, useContext } from '../../../../deps/htm-preact.js';
import SummaryRow from './SummaryRow.js';

export default function SummarySection() {
  return html`
    <div class="mb5">
        <${SummaryRow} />
    </div>
  `;
}
