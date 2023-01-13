import { buildRow } from '../../TableRow.js';
import { html } from '../../../../../deps/htm-preact.js';
import TableHeaderCell from '../../TableHeaderCell.js';
import TableDataCell from '../../TableDataCell.js';
import { SortingConfigs } from './sortUtils.js';

export default function DetailTable({ data, filterState, sortingState }) {
  const dataRows = data
    .filter((datum) =>
      Object.keys(filterState).every(
        (currField) =>
          filterState[currField] === null ||
          filterState[currField] === '' ||
          filterState[currField] === datum[currField]
      )
    )
    .sort(SortingConfigs[sortingState].sortingFunc)
    .map((d, index) =>
      buildRow(
        [
          { content: index + 1 },
          { content: d.branch },
          {
            content: html`<span class="bold"
              >${d.status && d.status.toUpperCase()}</span
            >`,
          },
          { content: d.browser },
          { content: d.env },
          { content: d.tag },
          {
            content: html`<div class="long-text-block">${d.errorMessage}</div>`,
            config: { textLeft: true },
          },
        ],
        TableDataCell
      )
    );
  const headerRow = buildRow(
    [
      { content: '#' },
      { content: 'Branch' },
      { content: 'Status' },
      { content: 'Browser' },
      { content: 'Env' },
      { content: 'Tag' },
      { content: 'Error Msg', config: { textLeft: true } },
    ],
    TableHeaderCell
  );
  return html`<div class="table-wrapper">
    <table class="detail-table">
      ${headerRow} ${dataRows}
    </table>
  </div>`;
}
