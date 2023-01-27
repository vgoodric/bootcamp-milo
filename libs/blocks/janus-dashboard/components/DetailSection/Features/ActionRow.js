import { html } from '../../../../../deps/htm-preact.js';
import { SortingConfigs } from './sortUtils.js';
import Dropdown from '../../Dropdown.js';
import GridContainer from '../../GridContainer.js';
import GridItem from '../../GridItem.js';

const FILTERS = ['status', 'env', 'branch', 'browser', 'tag'];

export default function ActionRow({
  feature,
  filterState,
  setFilter,
  sortingState,
  setSorting,
}) {
  const filterToID = FILTERS.reduce(
    (acc, filter) => ({
      ...acc,
      [filter]: `${feature}-filter-${filter}`,
    }),
    {},
  );
  const filterOnSubmit = (e) => {
    const newFilter = FILTERS.reduce((acc, filter) => {
      const value = e.target.elements[filterToID[filter]]?.value;
      if (!value) return acc;
      return { ...acc, [filter]: value };
    }, {});
    setFilter(newFilter);
    e.preventDefault();
  };
  const inputFields = FILTERS.map(
    (filter) => html`<span
      ><label for=${filterToID[filter]}>${filter}: </label>
      <input
        type="text"
        placeholder=""
        class="text-input-filter"
        id=${filterToID[filter]}
        name=${filterToID[filter]}
        value=${filterState[filter]}
    /></span>`,
  );

  const sortOptions = Object.keys(SortingConfigs).map((key) => ({
    value: key,
    text: SortingConfigs[key].name,
  }));
  // FIXME: add sort icon
  const sortDropdown = html`
    <div class="mr2">
      <${Dropdown}
        options=${sortOptions}
        onSelect=${(value) => setSorting(value)}
        value=${sortingState}
      />
    </div>
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
