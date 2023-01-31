import { html } from '../../deps/htm-preact.js';
import ErrorBoundary from './wrappers/ErrorBoundary.js';
import FilterProvider from './wrappers/FilterProvider.js';
import LayoutWrapper from './wrappers/LayoutWrapper.js';
import SummarySection from './components/SummarySection/index.js';
import DetailSection from './components/DetailSection/index.js';
import MetaDataProvider from './wrappers/MetaDataProvider.js';
import DataProvider from './wrappers/DataProvider.js';
import ToggleAPIFileWrapper from './wrappers/ToggleAPIFileWrapper.js';

function DashboardApp({ el }) {
  const displayData = html`
  <${FilterProvider}>
    <${SummarySection} />
    <${DetailSection} />
  </${FilterProvider}>`;

  return html`
    <${ErrorBoundary}>
      <${LayoutWrapper}>
        <${MetaDataProvider} el=${el}>
          <${DataProvider}>
            <${ToggleAPIFileWrapper}>
              ${displayData}
            </${ToggleAPIFileWrapper}>
          </${DataProvider}>
        </${MetaDataProvider}>
      </${LayoutWrapper}>
    </${ErrorBoundary}>
  `;
}

export default DashboardApp;
