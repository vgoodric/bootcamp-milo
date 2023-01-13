import { html, useContext } from '../../../../deps/htm-preact.js';
import GridContainer from '../GridContainer.js';
import GridItem from '../GridItem.js';
import { FilterContext } from '../../wrappers/FilterWrapper.js';
import { DataContext } from '../../wrappers/FetchDataWrapper.js';
import StatusCard from './StatusCard.js';
import TotalCard from './TotalCard.js';
import {
  extractTimeFromTestId,
  convertTimeToShortDate,
} from '../../utils/utils.js';
import { PASSED, FAILED, FLAKY } from '../../utils/constants.js';

const totalPercent = 100;

function SummaryRow() {
  const { data: unfilteredData } = useContext(DataContext);
  const { state: { branch, env } } = useContext(FilterContext);
  const data = unfilteredData
    .filter((d) => !env || d.env === env)
    .filter((d) => !branch || d.branch === branch);

  const totalCnt = data.length;
  const totalPassedCnt = data.filter((d) => d.status === PASSED).length;
  const totalFailedCnt = totalCnt - totalPassedCnt;

  const passedPercent = Math.ceil(1000 * (totalPassedCnt / totalCnt || 0)) / 10;
  const failedPercent = totalPercent - passedPercent;

  // FIXME: assuming that all testIds in the data array are the same
  const testId = data?.[0]?.testId || null;
  const date = testId
    ? convertTimeToShortDate(extractTimeFromTestId(testId))
    : 'invalid result format';

  return html`
    <${GridContainer} spaceBetween>
      <${GridItem}>
        <${TotalCard} 
          date=${date} 
          cnt=${totalCnt} />
      </${GridItem}>
      <${GridItem}>
        <${StatusCard}
          status=${FAILED}
          date=${date}
          cnt=${totalFailedCnt} 
          percent=${failedPercent.toFixed(1)} />
      </${GridItem}>
      <${GridItem}>
        <${StatusCard} 
          status=${PASSED}
          date=${date} 
          cnt=${totalPassedCnt} 
          percent=${passedPercent.toFixed(1)} />
      </${GridItem}>
      <${GridItem}>
        <${StatusCard} 
          status=${FLAKY}
          date=${date} 
          cnt=${0} 
          percent=${'0.0'} />
      </${GridItem}>
    </${GridContainer}>`;
}

export default SummaryRow;
