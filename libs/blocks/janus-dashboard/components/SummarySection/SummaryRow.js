import { html, useContext } from '../../../../deps/htm-preact.js';
import GridContainer from '../GridContainer.js';
import GridItem from '../GridItem.js';
import { FilterContext, ActionTypes } from '../../wrappers/FilterWrapper.js';
import { DataContext } from '../../wrappers/FetchDataWrapper.js';
import StatusCard from './StatusCard.js';
import TotalCard from './TotalCard.js';
import {
  extractTimeFromTestId,
  convertTimeToShortDate,
} from '../../utils/utils.js';
import { PASSED } from '../../utils/constants.js';
import Dropdown from '../Dropdown.js';

const totalPercent = 100;

function SummaryRow() {
  const { data: unfilteredData, envs } = useContext(DataContext);
  const {
    state: { branch, env },
    dispatch,
  } = useContext(FilterContext);
  const data = unfilteredData
    .filter((d) => !env || d.env === env)
    .filter((d) => !branch || d.branch === branch);

  const envOptions = [
    { value: null, text: 'All' },
    ...envs.map((c) => ({ value: c, text: c })),
  ];
  const setEnv = (value) => {
    dispatch({
      type: ActionTypes.SET_STATE,
      payload: { env: value, showDetail: true },
    });
  };

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

  return html`<div class="section-divider">
    <${GridContainer} spaceBetween>
      <${GridItem}>
        <${TotalCard} 
        date=${date} 
        cnt=${totalCnt} />
      </${GridItem}>
      <${GridItem}>
        <${StatusCard}
          status='failed'
          date=${date}
          cnt=${totalFailedCnt} 
          percent=${failedPercent.toFixed(1)} />
      </${GridItem}>
      <${GridItem}>
        <${StatusCard} 
        status='passed' 
        date=${date} 
        cnt=${totalPassedCnt} 
        percent=${passedPercent.toFixed(1)} />
      </${GridItem}>
      <${GridItem}>
        <${StatusCard} 
        status='flaky' 
        date=${date} 
        cnt=${0} 
        percent=${'0.0'} />
      </${GridItem}>
    </${GridContainer}>

    <${GridContainer}>
      <${GridItem}>
        <div class='mt2'></div>
        <${Dropdown} options=${envOptions} onSelect=${setEnv} value=${env} labelText="Env" />

      </${GridItem}>
    </${GridContainer}>
  </div>`;
}

export default SummaryRow;
