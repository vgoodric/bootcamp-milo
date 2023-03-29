/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/*
 * Marketo Form Data Layer enhancements for MCZ
 */

const initMczDataLayer = () => {
  window.mcz_marketoForm_pref = window.mcz_marketoForm_pref || [];
  window.mcz_marketoForm_pref = {
    profile: {
      prefLanguage: '',
      segLangCode: '',
    },
    form: {
      type: 'marketo_form',
      subType: 'formSubType', //seminar, whitepaper_form, nurture, webinar, strategy_webinar, demo, etc
    },
    program: {
      prefLanguagePresent: true,
      poi: '',
      coPartnerNames: '', //Partner1, Partner2
      submitButton: '', //Submit
      campaignIds: {
        sfdc: '',
        external: '',
        retouch: '',
        onsite: '',
      },
    },
    field_visibility: {
      phone: 'required',
      comments: 'visible',
      functional_area: 'visible',
      job_title: 'visible',
      demo: 'visible',
    },
    field_filters: {
      products: '', //POI-Dxonly
      job_role: '', //Job Role-HiLevel
      industry: '', //Industry-Manufacturing
      functional_area: '', //Functional Area-DX
    },
  };
}

const mcz_marketoForm_pref_keys = {
  'form channel': 'form.subType',
  'hardcoded poi': 'program.poi',
  'co-partner names': 'program.coPartnerNames',
  'campaign id - sfdc': 'program.campaignIds.sfdc',
  'campaign id - external': 'program.campaignIds.external',
  'campaign id - retouch': 'program.campaignIds.retouch',
  'campaign id - onsite': 'program.campaignIds.onsite',
  'field - phone': 'field_visibility.phone',
  'field - comments': 'field_visibility.comments',
  'field - functional area': 'field_visibility.functional_area',
  'field - job title': 'field_visibility.job_title',
  'field - demo ': 'field_visibility.demo',
  'filter - products': 'field_filters.products',
  'filter - job role': 'field_filters.job_role',
  'filter - industry': 'field_filters.industry',
  'filter - functional area': 'field_filters.functional_area',
};

const init = (el) => {
  el.style.display = 'none';

  const children = Array.from(el.querySelectorAll(':scope > div'));

  initMczDataLayer();

  function get_fromDL(path) {
    return path.split('.').reduce(function (prev, curr) {
      return prev ? prev[curr] : undefined;
    }, window.mcz_marketoForm_pref || self.mcz_marketoForm_pref);
  }

  function set_inDL(key, value) {
    const dataLayerLocation = mcz_marketoForm_pref_keys[key];
    if (dataLayerLocation) {
      const path = dataLayerLocation.split('.');
      path.reduce(function (prev, curr, index, array) {
        if (index === array.length - 1) {
          prev[curr] = value;
        }
        return prev ? prev[curr] : undefined;
      }, window.mcz_marketoForm_pref || self.mcz_marketoForm_pref);
    } else {
      console.log('key not found: ', key, mcz_marketoForm_pref_keys[key]);
    }
  }

  children.forEach((element) => {
    const key = element.children[0]?.textContent.toLowerCase();
    const value = element.children[1]?.textContent;
    if (key && value) {
      set_inDL(key, value);
    }
  });

  console.log('mcz_marketoForm_pref', window.mcz_marketoForm_pref);
};

export default init;
