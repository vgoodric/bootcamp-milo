import { html } from '../../../deps/htm-preact.js';

function TableRow({ children }) {
  return html`<tr class="detail-rows-row">
    ${children}
  </tr>`;
}

export default TableRow;
