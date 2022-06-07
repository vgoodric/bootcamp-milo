import { loadScript, makeRelative } from '../../utils/utils.js';

const options = { tooltip: {}, yAxis: {} };

function formatExcelDate(string) {
  return +string > 99999
    ? new Date(+string * 1000)
    : new Date(Math.round((+string - (1 + 25567 + 1)) * 86400 * 1000));
}

export default async function init(el) {
  await loadScript('/libs/deps/echarts.min.js');
  const fqdnPath = el.querySelector(':scope > div > div').textContent;
  const path = makeRelative(fqdnPath);
  const resp = await fetch(path);
  if (!resp.ok) return;
  const json = await resp.json();
  const xAxisData = json.data.map((entry) => {
    const excelDate = formatExcelDate(entry.Day);
    const month = excelDate.toLocaleString('default', { month: 'short' });
    const day = excelDate.toLocaleString('default', { day: 'numeric' });
    return `${day}-${month}`;
  });
  const seriesData = json.data.map((entry) => { return entry.Revenue });

  // 'Revenue'
  const metric = Object.keys(json.data[0])[1];
  // 'Billion'
  const unit = json.data[0].Unit;

  options.legend = { data: [metric] };
  options.xAxis = { data: xAxisData };
  options.series = [{
    name: metric,
    type: 'bar',
    data: seriesData,
    tooltip: { valueFormatter: value => `${value} ${unit}` },
  }];

  const chart = echarts.init(el);
  chart.setOption(options);
}
