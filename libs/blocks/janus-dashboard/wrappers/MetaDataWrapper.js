import { html, createContext } from '../../../deps/htm-preact.js';
import { getMetadata } from '../../../utils/utils.js';

export const MetaDataContext = createContext();

function MetaDataWrapper({ children }) {
  const dataapi = getMetadata('dataapi');
  return html`
    <${MetaDataContext.Provider} value=${{ dataapi }}> ${children} <//>
  `;
}

export default MetaDataWrapper;
