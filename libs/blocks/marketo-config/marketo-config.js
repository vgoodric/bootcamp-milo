import {
  createContext,
  html,
  render,
  useContext,
  useEffect,
  useReducer,
  useState,
} from '../../deps/htm-preact.js';
import { loadMarketoForm } from '../marketo/marketo.js';
import { loadStyle, parseEncodedConfig, utf8ToB64, getConfig } from '../../utils/utils.js';
// import { Input, Select } from './configurator.js'
import Accordion from '../../ui/controls/Accordion.js';

const LS_KEY = 'marketoFormConfiguratorState';
const ConfiguratorContext = createContext('marketoForm');
// const { marketoBaseURL, marketoMunchkinID, marketoFormID } = getConfig();
const { marketoBaseURL, marketoMunchkinID, marketoFormID } = ['//engage.adobe.com','360-KCI-804','1723']
const defaultState = {
  title: '',
  description: '',
  error_message: '',
  form_id: marketoFormID,
  base_url: marketoBaseURL,
  munchkin_id: marketoMunchkinID,
  destination_url: '',
  hidden_fields: '',
  'form.subType': '',
  'program.poi': '',
  'program.coPartnerNames': '',
  'program.campaignIds.sfdc': '',
  'program.campaignIds.external': '',
  'program.campaignIds.retouch': '',
  'program.campaignIds.onsite': '',
  'field_visibility.phone': '',
  'field_visibility.comments': '',
  'field_visibility.functional_area': '',
  'field_visibility.job_title': '',
  'field_visibility.demo': '',
  'field_filters.products': '',
  'field_filters.job_role': '',
  'field_filters.industry': '',
  'field_filters.functional_area': '',
  style_backgroundTheme: '',
  style_layout: '',
  title_size: 'h3',
  title_align: 'center',
style_customTheme: '',
};

const getHashConfig = () => {
  const { hash } = window.location;
  if (!hash) return null;
  window.location.hash = '';

  const encodedConfig = hash.startsWith('#') ? hash.substring(1) : hash;
  return parseEncodedConfig(encodedConfig);
}

const renameKeys = (obj, newKeys) => {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
};

const stateReform = (state) => {
  const newKeys = {};
  Object.keys(state).forEach(((k) => { newKeys[k] = k.replace('_', ' '); }));
  return renameKeys(state, newKeys);
};

const stateReformUndo = (state) => {
  const newKeys = {};
  Object.keys(state).forEach(((k) => { newKeys[k] = k.replace(' ', '_'); }));
  return renameKeys(state, newKeys);
};

const getInitialState = () => {
  const hashConfig = getHashConfig();
  if (hashConfig) return hashConfig;

  const lsState = localStorage.getItem(LS_KEY);
  if (lsState) {
    try {
      return JSON.parse(lsState);
    } catch (e) {
      // ignore
    }
  }
  return null;
};

const saveStateToLocalStorage = (state) => {
  localStorage.setItem(LS_KEY, JSON.stringify(stateReformUndo(state)));
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_CHANGE':
    case 'INPUT_CHANGE':
    case 'MULTI_SELECT_CHANGE':
      return { ...state, [action.prop]: action.value };
    default:
      console.log('DEFAULT');
      return state;
  }
};

const CopyBtn = () => {
  const { state } = useContext(ConfiguratorContext);
  const [isError, setIsError] = useState();
  const [isSuccess, setIsSuccess] = useState();
  const [errorMessage, setErrorMessage] = useState('Failed to Copy.');
  const [showConfigUrl, setShowConfigUrl] = useState(false);

  // debug
  const [configUrl, setConfigUrl] = useState('');

  const setStatus = (setFn, status = true) => {
    setFn(status);
    setTimeout(() => {
      setFn(!status);
    }, 2000);
  };

  const configFormValidation = () => {
    let inputValuesFilled = true;
    const testInputs = document.querySelectorAll('#form_id, #base_url, #munchkin_id, #destination_url');
    const requiredPanelExpandButton = document.querySelector('#ai_Marketo_Form_Config_Fileds button[aria-label=Expand]');
    testInputs.forEach((input) => {
      if (!input.value) {
        inputValuesFilled = false;
        if (requiredPanelExpandButton) {
          requiredPanelExpandButton.click();
        }
        input.focus();
      }
    });
    return inputValuesFilled;
  };

  const getUrl = () => {
    const url = window.location.href.split('#')[0];
    return `${url}#${utf8ToB64(JSON.stringify(stateReform(state)))}`;
  };

  const copyConfig = () => {
    setConfigUrl(getUrl());
    if (!navigator?.clipboard) {
      setStatus(setIsError);
      setShowConfigUrl(false);
      return;
    }
    if (!configFormValidation()) {
      setErrorMessage('Required fields must be filled');
      setStatus(setIsError);
      setShowConfigUrl(false);
      return;
    }

    const linkTitle = document.getElementById('title').value;
    const formId = document.getElementById('form_id').value;
    const link = document.createElement('a');
    link.href = getUrl();
    link.textContent = `Marketo Form - ${linkTitle || formId}`;

    const blob = new Blob([link.outerHTML], { type: 'text/html' });
    // eslint-disable-next-line no-undef
    const data = [new ClipboardItem({ [blob.type]: blob })];
    navigator.clipboard.write(data)
      .then(() => {
        setStatus(setIsSuccess);
        setErrorMessage('Failed to copy.');
        setShowConfigUrl(true);
      }, () => {
        setStatus(setIsError);
        setShowConfigUrl(false);
      });
  };

  return html`
  <textarea class=${`config-url ${showConfigUrl ? '' : 'hide'}`}>${configUrl}</textarea>
  <button
    class="copy-config"
    onClick=${copyConfig}>Copy</button>
  <div class="copy-message ${isError === true ? 'is-error' : ''} ${isSuccess === true ? 'is-success' : ''}">
    <div class="success-message">Copied to clipboard!</div>
    <div class="error-message">${errorMessage}</div>
  </div>`;
};

const Select = ({ label, options, prop, onChange, sort }) => {
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

const Input = ({ label, type = 'text', prop, placeholder }) => {
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

const FieldsPanel = () => html`
  <${Input} label="Title (Optional)" prop="title" />
  <${Input} label="Description (Optional)" prop="description" />
  <${Input} label="Error Message (Optional)" prop="error_message" />
  <${Input} label="Form ID*" prop="form_id" />
  <${Input} label="Base URL*" prop="base_url" />
  <${Input} label="Munchkin ID*" prop="munchkin_id" />
  <${Input} label="Destination URL*" prop="destination_url" />
  <${Input} label="Hidden Fields (Optional)" prop="hidden_fields" />
`;

const PrefPanel = () => html`
  <${Input} label='form channel' prop='form.subType' />
  <${Input} label='hardcoded poi' prop='program.poi' />
  <${Input} label='co-partner names' prop='program.coPartnerNames' />
  <${Input} label='campaign id - sfdc' prop='program.campaignIds.sfdc' />
  <${Input} label='campaign id - external' prop='program.campaignIds.external' />
  <${Input} label='campaign id - retouch' prop='program.campaignIds.retouch' />
  <${Input} label='campaign id - onsite' prop='program.campaignIds.onsite' />
  <${Input} label='field - phone' prop='field_visibility.phone' />
  <${Input} label='field - comments' prop='field_visibility.comments' />
  <${Input} label='field - functional area' prop='field_visibility.functional_area' />
  <${Input} label='field - job title' prop='field_visibility.job_title' />
  <${Input} label='field - demo ': 'field_visibility.demo' />
  <${Input} label='filter - products' prop='field_filters.products' />
  <${Input} label='filter - job role' prop='field_filters.job_role' />
  <${Input} label='filter - industry' prop='field_filters.industry' />
  <${Input} label='filter - functional area' prop='field_filters.functional_area' />
`;

const StylePanel = () => html`
  <${Select} label="Background Theme" prop="style_backgroundTheme" options="${{ white: 'White', dark: 'Dark' }}" />
  <${Select} label="Layout" prop="style_layout" options="${{ column1: '1 Column', column2: '2 Columns' }}" />
  <${Select}
    label="Title Size"
    prop="title_size"
    options="${{ h1: 'H1', h2: 'H2', h3: 'H3', h4: 'H4', h5: 'H5', h6: 'H6', p: 'P' }}" />
  <${Select} label="Title Alignment" prop="title_align" options="${{ left: 'Left', center: 'Center', right: 'Right' }}" />
  <${Select} label="Custom Theme" prop="style_customTheme" options="${{ none: 'None' }}" />
`;

const Configurator = ({ rootEl }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState() || defaultState);
  const title = rootEl.querySelector('h1, h2, h3, h4, h5, h6, p').textContent || 'Configurator';

  useEffect(() => {
    loadMarketoForm(document.querySelector('.marketo'), stateReform(state));
    saveStateToLocalStorage(state);
  }, [state]);

  const panels = [{
    title: 'Required',
    content: html`<${FieldsPanel}/>`,
  }, {
    title: 'Pref',
    content: html`<${PrefPanel}/>`,
  },
  {
    title: 'Style',
    content: html`<${StylePanel} />`,
  }];


  return html`
    <${ConfiguratorContext.Provider} value=${{ state, dispatch }}>
      <div class="tool-header">
        <div class="tool-title">
          <h1>${title}</h1>
        </div>
        <${CopyBtn} />
      </div>
      <div class="tool-content">
        <div class="config-panel">
          <${Accordion} lskey=faasconfig items=${panels} alwaysOpen=${false} />
        </div>
        <div class="content-panel">
          <div class="section">
            <div class="block marketo"></div>
          </div>
        </div>
      </div>
    </ConfiguratorContext.Provider>`;
};

export default async function init(el) {
  // const [state, dispatch] = useReducer(reducer, getInitialState() || defaultState);
  // const title = rootEl.querySelector('h1, h2, h3, h4, h5, h6, p').textContent || 'Configurator';

  loadStyle('/libs/ui/page/page.css');
  loadStyle('/libs/blocks/marketo/marketo.css');
  const app = html`<${Configurator} rootEl=${el} />`;
  render(app, el);
}
