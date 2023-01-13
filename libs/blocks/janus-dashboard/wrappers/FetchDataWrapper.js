/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
import { html, createContext, useContext } from '../../../deps/htm-preact.js';
import useGetData from '../hooks/useGetData.js';
import { MetaDataContext } from './MetaDataWrapper.js';
import { RepoContext } from './RepoWrapper.js';
import { BranchContext } from './BranchWrapper.js';
import { UploadFileContext } from './UploadFileWrapper.js';
import Loader from '../components/Loader.js';

function extractInfo(data) {
  const branchSet = new Set();
  const envSet = new Set();
  data.forEach((d) => {
    branchSet.add(d.branch);
    envSet.add(d.env);
  });
  return { branchSet, envSet };
}

export const DataContext = createContext();

function throwForInvalidJSON(field) {
  throw new Error(`invalid or missing field: ${field}`);
}

function getUploadedData(uploadedData) {
  try {
    const { results, timestamp, branch, repo } = uploadedData;

    if (!timestamp) throwForInvalidJSON('timestamp');
    if (!branch) throwForInvalidJSON('branch');
    if (!repo) throwForInvalidJSON('repo');
    if (!results || !Array.isArray(results)) throwForInvalidJSON('results');

    const contextValue = {
      source: 'upload',
      uploadedData,
      branch,
      repo,
      timestamp,
      data: results,
    };
    return { contextValue };
  } catch (error) {
    return { error };
  }
}

function WithFetchAPIData({ children }) {
  const { dataLink } = useContext(MetaDataContext);

  const {
    state: { repo },
  } = useContext(RepoContext);
  const {
    state: { branch },
  } = useContext(BranchContext);
  const { isLoading, data, error } = useGetData(dataLink);
  if (error) {
    return `Error loading data from ${dataLink}: ${error}`;
  }
  if (isLoading) {
    return html`<${Loader} />`;
  }

  const { branchSet, envSet } = extractInfo(data);

  const dataValue = {
    source: 'api',
    dataLink,
    data,
    branches: Array.from(branchSet),
    envs: Array.from(envSet),
  };
  return html` <${DataContext.Provider}
    value=${{ ...dataValue, error, isLoading }}
  >
    ${children}
  <//>`;
}

function WithUploadedData({ children, uploadedData, uploadedFileName }) {
  const { error, contextValue } = getUploadedData(uploadedData);
  if (error) {
    return `Invalid JSON ${uploadedFileName}: ${error}`;
  }
  return html` <${DataContext.Provider} value=${{ ...contextValue }}>
    ${children}
  <//>`;
}

// FIXME: after data APIs done, switch to use them instead of franklin-form APIs
export default function FetchDataWrapper({ children }) {
  const { uploadedData, uploadedFileName } = useContext(UploadFileContext);
  if (uploadedData) {
    return html`<${WithUploadedData} uploadedData=${uploadedData} uploadedFileName=${uploadedFileName}>${children}</${WithUploadedData}>`;
  }
  return html`<${WithFetchAPIData}>${children}</${WithFetchAPIData}>`;
}
