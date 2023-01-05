import { html } from '../../deps/htm-preact.js';
import ErrorBoundary from './wrappers/ErrorBoundary.js';
import MetaDataWrapper from './wrappers/MetaDataWrapper.js';
import RepoWrapper from './wrappers/RepoWrapper.js';
import BranchWrapper from './wrappers/BranchWrapper.js';
import FetchDataWrapper from './wrappers/FetchDataWrapper.js';
// import { PreprocessWrapper } from './wrappers/PreprocessWrapper.js';
import FilterWrapper from './wrappers/FilterWrapper.js';
import Layout from './components/Layout.js';

function DashboardApp({ el }) {
  return html`
    <${ErrorBoundary}>
      <${MetaDataWrapper} el=${el}>
        <${RepoWrapper}>
          <${BranchWrapper}>
            <${FetchDataWrapper}>
              <${FilterWrapper}>
                <${Layout} />
              </${FilterWrapper}>
            </${FetchDataWrapper}>
          </${BranchWrapper}>
        </${RepoWrapper}>
      </${MetaDataWrapper}>
    </${ErrorBoundary}>
  `;
}

export default DashboardApp;
