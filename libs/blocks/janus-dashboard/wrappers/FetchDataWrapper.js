import { html, createContext, useContext } from '../../../deps/htm-preact.js';
import { MetaDataContext } from './MetaDataWrapper.js';
import { RepoContext } from './RepoWrapper.js';
import { BranchContext } from './BranchWrapper.js';
import Loader from '../components/Loader.js';
import useGetData from '../hooks/useGetData.js';

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

// FIXME: after data APIs done, switch to use them from franklin-form APIs
export default function FetchDataWrapper({ children }) {
  const { dataLink } = useContext(MetaDataContext);
  const {
    state: { repo },
  } = useContext(RepoContext);
  const {
    state: { branch },
  } = useContext(BranchContext);

  const { isLoading, data, isError } = useGetData(dataLink);

  if (isError) {
    return 'Error loading data!';
  }
  if (isLoading) {
    return html`<${Loader} />`;
  }

  const { branchSet, envSet } = extractInfo(data);

  const dataValue = {
    data,
    branches: Array.from(branchSet),
    envs: Array.from(envSet),
  };

  return html` <${DataContext.Provider} value=${dataValue}> ${children} <//>`;
}
