import { html, createContext } from '../../../deps/htm-preact.js';

export const MetaDataContext = createContext();

// FIXME: make these default options authorable
const defaultRepo = 'milo';
const defaultBranch = 'main';

function getDataLink(el) {
  const content = el?.querySelectorAll(':scope > div');
  const wrapper = content[0]?.querySelector(':scope > div');
  const dataAnchor = wrapper?.querySelector('a');
  const dataLink = dataAnchor.innerText;
  return dataLink;
}

function getDefaultRepo(el) {
  return defaultRepo;
}

function getDefaultBranch(el) {
  return defaultBranch;
}

function MetaDataWrapper({ el, children }) {
  const dataLink = getDataLink(el);
  const defaultRepo = getDefaultRepo(el);
  const defaultBranch = getDefaultBranch(el);
  return html`
    <${MetaDataContext.Provider}
      value=${{ dataLink, defaultRepo, defaultBranch }}
    >
      ${children}
    </${MetaDataContext.Provider}>
  `;
}

export default MetaDataWrapper;
