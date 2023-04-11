import { html, render, useContext, useEffect } from '../../deps/htm-preact.js';
import { loadMarketoForm, initMczDataLayer } from '../marketo/marketo.js';
import { loadStyle } from '../../utils/utils.js';
import { Input, Select, CopyBtn } from './configurator-components.js'
import { ConfiguratorContext, ConfiguratorProvider, stateReform, saveStateToLocalStorage } from './configurator-context.js';
import Accordion from '../../ui/controls/Accordion.js';

const LS_KEY = 'marketoConfiguratorState';

const defaultState = {
  title: '',
  description: '',
  error_message: '',
  form_id: '1723',
  base_url: '//engage.adobe.com',
  munchkin_id: '360-KCI-804',
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
  <${Select} label="Title Size" prop="title_size" options="${{ h1: 'H1', h2: 'H2', h3: 'H3', h4: 'H4', h5: 'H5', h6: 'H6', p: 'P' }}" />
  <${Select} label="Title Alignment" prop="title_align" options="${{ left: 'Left', center: 'Center', right: 'Right' }}" />
  <${Select} label="Custom Theme" prop="style_customTheme" options="${{ none: 'None', mcz: 'MCZ' }}" />
`;

const Configurator = ({ rootEl }) => {
  const { state, dispatch } = useContext(ConfiguratorContext);
  const title = rootEl.querySelector('h1, h2, h3, h4, h5, h6, p')?.textContent || 'Configurator';

  useEffect(() => {
    loadMarketoForm(document.querySelector('.marketo'), stateReform(state));
    saveStateToLocalStorage(state, LS_KEY);
  }, [state]);

  const panels = [{
    title: 'Required',
    content: html`<${FieldsPanel}/>`,
  }, {
    title: 'Preferences',
    content: html`<${PrefPanel}/>`,
  },
  {
    title: 'Style',
    content: html`<${StylePanel} />`,
  }];

  return html`
      <div class="tool-header">
        <div class="tool-title">
          <h1>${title}</h1>
        </div>
        <${CopyBtn} />
      </div>
      <div class="tool-content">
        <div class="config-panel">
          <${Accordion} lskey=config items=${panels} alwaysOpen=${false} />
        </div>
        <div class="content-panel">
          <div class="section">
            <div class="block marketo"></div>
          </div>
        </div>
      </div>`;
};

export default async function init(el) {
  initMczDataLayer();
  loadStyle('/libs/ui/page/page.css');
  loadStyle('/libs/blocks/marketo/marketo.css');
  const app = html`
  <${ConfiguratorProvider} defaultState=${defaultState} lsKey=${LS_KEY}>
    <${Configurator} rootEl=${el} />
  </${ConfiguratorProvider}>`;
  render(app, el);
}
