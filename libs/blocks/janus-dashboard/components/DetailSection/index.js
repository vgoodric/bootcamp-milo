import { html } from '../../../../deps/htm-preact.js';
import { useFilterState } from '../../wrappers/FilterProvider.js';
import Features from './Features/index.js';
import TitleRow from './TitleRow/index.js';
import { useTestrunData } from '../../wrappers/DataProvider.js';

function groupByFeatureNames(data) {
  const map = new Map();
  data.forEach((d) => {
    if (!map.has(d.name)) {
      map.set(d.name, []);
    }
    map.get(d.name).push(d);
  });
  return map;
}

export default function DetailSection() {
  const filterState = useFilterState();
  const testrunData = useTestrunData();

  if (!testrunData.value?.data) return null;

  const { results } = testrunData.value.data;
  const { status, searchStr } = filterState;
  const regex = new RegExp(searchStr);
  const filteredData = (
    searchStr ? results.filter((d) => regex.test(d.title)) : results
  ).filter((d) => !status || d.status === status);
  const featureMap = groupByFeatureNames(filteredData);

  const featureRows = Array.from(featureMap.keys()).map(
    (feature) =>
      html`<${Features}
        data=${featureMap.get(feature)}
        feature=${feature}
        key=${feature}
      />`,
  );

  return html`<div><${TitleRow} />${featureRows}</div>`;
}
