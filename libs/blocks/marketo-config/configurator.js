import {
  createContext,
  html,
  render,
  useContext,
  useEffect,
  useReducer,
  useState,
} from '../../deps/htm-preact.js';

import { loadStyle, parseEncodedConfig, utf8ToB64, getConfig } from '../../utils/utils.js';
import Accordion from '../../ui/controls/Accordion.js';


const ConfiguratorContext = createContext('marketoForm');

export const Select = ({ label, options, prop, onChange, sort }) => {
  const context = useContext(ConfiguratorContext);
  const onSelectChange = (e) => {
    context.dispatch({
      type: 'SELECT_CHANGE',
      prop,
      value: e.target.value,
    });
    if (typeof onChange === 'function') {
      onChange();
    }
  };
  const optionsArray = sort ? sortObjects(options) : Object.entries(options);
  return html`
      <div class="field">
        <label for=${prop}>${label}</label>
        <select id=${prop} value=${context.state[prop]} onChange=${onSelectChange}>
          ${optionsArray.map(([v, l]) => html`<option value="${v}">${l} (${v})</option>`)}
        </select>
      </div>
    `;
};

export const Input = ({ label, type = 'text', prop, placeholder }) => {
  const context = useContext(ConfiguratorContext);
  const onInputChange = (e) => {
    context.dispatch({
      type: 'INPUT_CHANGE',
      prop,
      value: type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const value = { [type === 'checkbox' ? 'checked' : 'value']: (context.state[prop]) };
  return html` <div class="field">
      <label for=${prop}>${label}</label>
      <input type=${type} id=${prop} name=${prop} ...${value} placeholder=${placeholder} onChange=${onInputChange} />
    </div>`;
};
