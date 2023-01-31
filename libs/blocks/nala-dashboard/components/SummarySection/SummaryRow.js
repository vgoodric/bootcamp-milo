import { html } from '../../../../deps/htm-preact.js';
import GridContainer from '../GridContainer.js';
import GridItem from '../GridItem.js';
import { useTestrunData } from '../../wrappers/DataProvider.js';
import StatusCard from './StatusCard.js';
import TotalCard from './TotalCard.js';
import { PASSED, FAILED, FLAKY } from '../../utils/constants.js';

const totalPercent = 100;

function SummaryRow() {
  const testrunData = useTestrunData();
  const { value, loading } = testrunData;
  const { results, timestamp } = value?.data || {
    results: [],
    timestamp: 0,
  };

  const totalCnt = results.length;
  const totalPassedCnt = results.filter((d) => d.status === PASSED).length;
  const totalFailedCnt = totalCnt - totalPassedCnt;

  const passedPercent = Math.ceil(1000 * (totalPassedCnt / totalCnt || 0)) / 10;
  const failedPercent = totalCnt === 0 ? 0 : totalPercent - passedPercent;

  const date = timestamp ? new Date(timestamp).toLocaleDateString() : 'N/A';

  return html`
    <${GridContainer} spaceBetween>
      <${GridItem}>
        <${TotalCard} 
          date=${date} 
          cnt=${totalCnt}
          loading=${loading} />
      </${GridItem}>
      <${GridItem}>
        <${StatusCard}
          status=${FAILED}
          date=${date}
          cnt=${totalFailedCnt} 
          percent=${failedPercent.toFixed(1)}
          loading=${loading} />
      </${GridItem}>
      <${GridItem}>
        <${StatusCard} 
          status=${PASSED}
          date=${date} 
          cnt=${totalPassedCnt} 
          percent=${passedPercent.toFixed(1)}
          loading=${loading} />
      </${GridItem}>
      <${GridItem}>
        <${StatusCard} 
          status=${FLAKY}
          date=${date} 
          cnt=${0} 
          percent=${'0.0'}
          loading=${loading} />
      </${GridItem}>
    </${GridContainer}>`;
}

export default SummaryRow;
