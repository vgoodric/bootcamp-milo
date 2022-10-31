import { html } from '../../../../../deps/htm-preact.js';
import TableRow from '../../TableRow.js';
import TableHeaderCell from '../../TableHeaderCell.js';
import TableDataCell from '../../TableDataCell.js';
import { colorMap } from '../../utils.js';

function DataRow({ data, rowNum }) {
  const { branch, status, browser, name, tag, errorMessage } = data;
  return html`<${TableRow}>
    <${TableDataCell}>${rowNum}</${TableDataCell}>
    <${TableDataCell}>${branch}</${TableDataCell}>
    <${TableDataCell}><span class=${colorMap[status]}>${status}</span></${TableDataCell}>
    <${TableDataCell}>${browser}</${TableDataCell}>
    <${TableDataCell}>${name}</${TableDataCell}>
    <${TableDataCell}>${tag}</${TableDataCell}>
    <${TableDataCell} textLeft>
      <pre class='long-text-block'>${errorMessage}</pre>
    </${TableDataCell}>
  </${TableRow}>`;
}

function HeaderRow() {
  return html`
    <${TableRow}>
      <${TableHeaderCell}>#<//>
      <${TableHeaderCell}>Branch<//>
      <${TableHeaderCell}>Status<//>
      <${TableHeaderCell}>Browser<//>
      <${TableHeaderCell}>Env<//>
      <${TableHeaderCell}>Tag<//>
      <${TableHeaderCell} textLeft>Error Msg<//>
    </${TableRow}>`;
}

export default function DetailRows({ data }) {
  if (data.length === 0) {
    return 'No data for this status';
  }
  const dataRows = data.map(
    (d, index) => html`<${DataRow} data=${d} rowNum=${index + 1} />`
  );
  return html`<table class="detail-rows-table">
    <${HeaderRow} />
    ${dataRows}
  </table>`;
}
