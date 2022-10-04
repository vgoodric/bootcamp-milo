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
* Icon Block - v5.1
*/

import { decorateButtons } from '../../utils/decorate.js';

function decorateLayout(el) {
  const foreground = document.createElement('div');
  foreground.classList.add('foreground', 'container', 'grid');
  el.appendChild(foreground);
  return foreground;
}

function decorateContent(row, isVerticle, isCentered) {
  if (!row) return;
  const text = row.querySelector('h1, h2, h3, h4, h5, h6, p')?.closest('div');
  if (text) {
    text?.classList.add('text');
    const headings = text?.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const heading = headings?.[headings.length - 1];
    let headingSize = 'heading-XL';
    if (isVerticle) headingSize = 'heading-S';
    else if (isCentered) headingSize = 'heading-M';
    heading?.classList.add(headingSize);
    heading?.nextElementSibling?.classList.add('body-M');
    heading?.previousElementSibling?.classList.add('icon-area');
    const image = row.querySelector(':scope img');
    image?.parentElement?.parentElement?.classList?.add('icon-area');
    decorateButtons(row);
    extendButtonsClass(text)
  }
}

function extendButtonsClass(text) {
  const buttons = text.querySelectorAll('.con-button');
  if (buttons.length === 0) return;
  buttons.forEach((button) => { button.classList.add('white') });
}

export default function init(el) {
  const foreground = decorateLayout(el);
  const rows = el.querySelectorAll(':scope > div:not([class])');
  const isVerticle = el.classList.contains('vertical');
  const isCentered = el.classList.contains('centered');
  [...rows].forEach(row => {
    decorateContent(row, isVerticle, isCentered);
    foreground.insertAdjacentElement('beforeEnd', row.children[0]);
    row.remove();
  });
}