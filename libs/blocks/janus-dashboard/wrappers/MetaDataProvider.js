import { html, createContext, useContext } from '../../../deps/htm-preact.js';

const MetaDataContext = createContext();

const backupDefaultDataLink =
  'https://14257-testrunsmanagement-stage.adobeio-static.net/api/v1/web/nala-api-testruns';

function getDataLink(el) {
  const children = el.querySelectorAll(':scope > div');
  const node = children[0].querySelector(':scope > div').querySelector('a');
  const dataLink = node.innerText || backupDefaultDataLink;
  node.remove();
  return dataLink;
}

function getDefaultRepo(el) {
  const children = el.querySelectorAll(':scope > div');
  const node = children?.[1]?.querySelector(':scope > div');
  const defaultRepo = node?.innerText || null;
  if (node) node.remove();
  return defaultRepo;
}

function getDefaultBranch(el) {
  const children = el.querySelectorAll(':scope > div');
  const node = children?.[2].querySelector(':scope > div');
  const defaultBranch = node?.innerText || null;
  if (node) node.remove();
  return defaultBranch;
}

function MetaDataProvider({ el, children }) {
  const dataLink = getDataLink(el);
  const defaultRepo = getDefaultRepo(el);
  const defaultBranch = getDefaultBranch(el);
  if (!defaultRepo && defaultBranch) {
    throw new Error(
      'Block usage error: defaultRepo is needed to have defaultBranch',
    );
  }
  return html`
    <${MetaDataContext.Provider}
      value=${{ dataLink, defaultRepo, defaultBranch }}
    >
      ${children}
    </${MetaDataContext.Provider}>
  `;
}

/**
 *
 * @returns {object} DataContext state
 */
export function useMetaData() {
  const context = useContext(MetaDataContext);
  if (context === undefined) {
    throw new Error('useMetaData must be used within MetaDataProvider');
  }
  const { dataLink, defaultRepo, defaultBranch } = context;

  return { dataLink, defaultRepo, defaultBranch };
}

export default MetaDataProvider;
