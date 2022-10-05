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
 * Marketo Form
 */

import { loadScript, createTag, getConfig } from '../../utils/utils.js';

const cleanStyleSheets = (form) => {
  const { styleSheets = [] } = document;

  [...styleSheets].forEach((sheet) => {
    const { href = '' } = sheet;
    const fromMarketo = /marketo.com/.test(href);
    const sheetScope = sheet.ownerNode || sheet.owningElement;
    const formIsParent = sheetScope === form.getFormElem()[0];

    if (fromMarketo || formIsParent) {
      console.log(sheet);
      sheet.disabled = true;
    }
  });
};

const loadForm = (form) => {
  console.log('loadForm');
  const $form = form.getFormElem();
  const formElements = [...$form.find('input:not([type=hidden])'), ...$form.find('select')];
  console.log(formElements);
  if ($form) {
    cleanStyleSheets(form);
    console.log($form);
    // MarketoLoader.cleanStyleSheets(form);
    // MarketoLoader.postProcessing(MktoForms2, this.element, this.config);
    // prefill(MktoForms2, this.element, this.config);
  }
};

const readyForm = (form) => {
  console.log('readyForm');
  const $form = form.getFormElem();
  const redirectUrl = '';

  form.onSuccess(() => {
    const mktoSubmit = new Event('mktoSubmit');

    // Dispatch event for listeners
    window.dispatchEvent(mktoSubmit);
    window.mktoSubmitted = true;

    // Check for form in modal, and set close button
    if (redirectUrl) {
      window.location.href = redirectUrl;
      return false;
    }

    return true;
  });
};

const init = (el) => {
  const { marketoBaseURL, marketoMunchkinID, marketoFormID } = getConfig();
  // TODO: Default base URL, ID, and munchkinId
  const children = Array.from(el?.querySelectorAll(':scope > div'));
  const config = {};
  children.forEach((element) => {
    const key = element?.children[0]?.textContent;
    const value = element?.children[1]?.textContent;
    if (key && value) { config[key] = value; }
  });
  console.log(config);
  const formID = config['Form ID'] ?? marketoFormID;
  const marketoURL = config['Base URL'] ?? marketoBaseURL;
  const munchkinID = config['Munchkin ID'] ?? marketoMunchkinID;

  // console.log(formText, formData, redirectUrl, hiddenFields);
  // TODO: load Marketo api with promise
  if (!marketoURL) {
    el.style.display = 'none';
    return;
  }
  loadScript(`https://${marketoURL}/js/forms2/js/forms2.min.js`)
    .then(() => {
      console.log('loadScript');
      // TODO: Set ID
      const form = createTag('form', { ID: `mktoForm_${formID}` });
      // el.append(form);
      el.replaceChildren(form);
      // Append text-container
      window.MktoForms2?.loadForm(marketoURL, munchkinID, formID, loadForm);
      window.MktoForms2?.whenReady(readyForm);
    }).catch(() => {
      el.style.display = 'none';
      return;
    });

  // TODO: prefill?
  // TODO: remove styles whenReady
  // TODO: validate onSubmit / allFieldsFilled / showErrorMessage
  // TODO: form onSuccess
};

const prefill = (MktoForms2, formElement, config) => {
  const performPrefillOperations = (status) => {
    if (status === false) {
      return;
    }
    // Get the unique form id if there is one
    const uniqueFormId = formElement.getAttribute('data-marketo-unique-form-id');

    // Generate a new form element for querying
    const queryString = `div.form_display form.marketo-form[data-marketo-unique-form-id="${uniqueFormId}"]`;
    const parentFormElement = document.querySelector(queryString);
    // Get the Marketo form object
    const formObject = MktoForms2.getForm(config.formId);

    // Be notified when the form changes to do prefill
    MktoForms2.onFormRender((formObj) => {
      if (formObj) {
        // We need to save the current form values before doing prefill
        saveFormCurrentValuesToLocalStorage(parentFormElement);
        prefillProcessor(formObject, parentFormElement);
      }
    });

    // Check to see if we need to refresh the items in local storage
    refreshPrefillItemsInLocalStorage();

    // Setup a listener on the form for saving form values to localstorage
    setupFormInputListener(parentFormElement);

    // Prefill Processor
    prefillProcessor(formObject, parentFormElement);
  };
  // Make sure we have consent to do prefill
  checkConsent(performPrefillOperations);

  return null;
};

export default init;
