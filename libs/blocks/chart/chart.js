import { loadScript, makeRelative } from '../../utils/utils.js';

const options = {
  tooltip: {},
  legend: { data: ['Revenue'] },
  yAxis: {},
};

export default async function init(el) {
  await loadScript('/libs/deps/echarts.min.js');
  const fqdnPath = el.querySelector(':scope > div > div').textContent;
  const path = makeRelative(fqdnPath);
  const resp = await fetch(path);
  if (resp.ok) {
    const json = await resp.json();
    const entries = json.data.map((entry) => {
      // Excel date
      const excelDate = +entry.Day > 99999
      ? new Date(+entry.Day * 1000)
      : new Date(Math.round((+entry.Day - (1 + 25567 + 1)) * 86400 * 1000));

      const month = excelDate.toLocaleString('default', { month: 'short' });
      const day = excelDate.toLocaleString('default', { day: 'numeric' });
      return { key: `${day}-${month}`, value: entry.Revenue };
    });

    const xAxis = { data: entries.map((entry) => { return entry.key }) };
    const series = [ { name: 'Revenue', type: 'bar', data: entries.map((entry) => { return entry.value }) } ];

    options.xAxis = xAxis;
    options.series = series;

    const chart = echarts.init(el);
    chart.setOption(options);
  }
}
