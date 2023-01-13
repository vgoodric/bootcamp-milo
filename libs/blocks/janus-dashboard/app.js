import { html } from '../../deps/htm-preact.js';
import ErrorBoundary from './wrappers/ErrorBoundary.js';
import MetaDataWrapper from './wrappers/MetaDataWrapper.js';
import RepoWrapper from './wrappers/RepoWrapper.js';
import BranchWrapper from './wrappers/BranchWrapper.js';
import UploadFileWrapper from './wrappers/UploadFileWrapper.js';
import FetchDataWrapper from './wrappers/FetchDataWrapper.js';
// import { PreprocessWrapper } from './wrappers/PreprocessWrapper.js';
import FilterWrapper from './wrappers/FilterWrapper.js';
import LayoutWrapper from './wrappers/LayoutWrapper.js';
import SummarySection from './components/SummarySection/index.js';
import DetailSection from './components/DetailSection/index.js';

function DashboardApp({ el }) {
  return html`
    <${ErrorBoundary}>
      <${LayoutWrapper}>
        <${MetaDataWrapper} el=${el}>
              <${UploadFileWrapper}>
              <${RepoWrapper}>
            <${BranchWrapper}>
                <${FetchDataWrapper}>
                  <${FilterWrapper}>
                    <${SummarySection} />
                    <${DetailSection} />
                  </${FilterWrapper}>
                </${FetchDataWrapper}>
                </${BranchWrapper}>
          </${RepoWrapper}>
              </${UploadFileWrapper}>
            
        </${MetaDataWrapper}>
        </${LayoutWrapper}>
    </${ErrorBoundary}>
  `;
}

export default DashboardApp;
