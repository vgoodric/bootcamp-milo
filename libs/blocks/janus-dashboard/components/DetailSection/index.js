import { html, useContext } from '../../../../deps/htm-preact.js';
// import { PreprocessContext } from '../../wrappers/PreprocessWrapper.js';
import { FilterContext } from '../../wrappers/FilterWrapper.js';
import Feature from './Feature/index.js';
import TitleRow from './TitleRow/index.js';
import { DataContext } from '../../wrappers/FetchDataWrapper.js';

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
  const { state: filterState } = useContext(FilterContext);
  const { data } = useContext(DataContext);
  const { env, branch, status } = filterState;
  const filteredData = data
    .filter((d) => !env || d.env === env)
    .filter((d) => !branch || d.branch === branch)
    .filter((d) => !status || d.status === status);

  const featureMap = groupByFeatureNames(filteredData);

  const featureRows = Array.from(featureMap.keys()).map(
    (feature) =>
      html`<${Feature}
        data=${featureMap.get(feature)}
        feature=${feature}
        key=${feature}
      />`
  );

  return html`<div><${TitleRow} env=${env}></${TitleRow}>${featureRows}</div>`;
}
