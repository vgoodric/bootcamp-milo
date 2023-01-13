import { html } from '../../../../../deps/htm-preact.js';
import { SortingConfigs } from './sortUtils.js';
import Dropdown from '../../Dropdown.js';
import GridContainer from '../../GridContainer.js';
import GridItem from '../../GridItem.js';

const filterFields = ['status', 'env', 'branch', 'browser', 'tag'];

export default function ActionRow({
  feature,
  setFilter,
  sortingState,
  setSorting,
}) {
  const fieldIDMap = filterFields.reduce(
    (acc, field) => ({
      ...acc,
      [field]: `${feature}-filter-${field}`,
    }),
    {}
  );
  const filterOnSubmit = (e) => {
    const newFilter = filterFields.reduce((acc, field) => {
      const fieldValue = e?.target?.elements?.[fieldIDMap?.[field]]?.value;
      if (!fieldValue) return acc;
      return { ...acc, [field]: fieldValue };
    }, {});
    setFilter(newFilter);
    e.preventDefault();
  };
  const inputFields = Object.keys(fieldIDMap).map(
    (field) => html`<span><label for=${fieldIDMap[field]}>${field}: </label>
      <input
        type="text"
        placeholder=""
        class="text-input-filter"
        id=${fieldIDMap[field]}
        name=${fieldIDMap[field]}
      /></span>`
  );

  const sortOptions = Object.keys(SortingConfigs).map((key) => {
    return {
      value: key,
      text: SortingConfigs[key].name,
    };
  });
  // FIXME: add sort icon
  const sortDropdown = html`
  <div class='mr2'>
    <${Dropdown}
      options=${sortOptions}
      onSelect=${(value) => setSorting(value)}
      value=${sortingState}
    /></div>
  `;
  const filterRow = html`<form onsubmit=${filterOnSubmit}>
    ${inputFields}
    <input type="submit" value="SetFilter" />
  </form>`;
  return html`
  <${GridContainer} spaceBetween>
    <${GridItem} spacing=${10}>${filterRow}</${GridItem}>
    <${GridItem}>${sortDropdown}</${GridItem}>
  </${GridContainer}>`;
}
