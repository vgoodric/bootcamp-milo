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
* Aside - v5.1
*/

import { decorateBlockBg, decorateButtons } from '../../utils/decorate.js';

const options = [
  { size: 'large', sizes: ['heading-L', 'body-M'] },
  { size: 'medium', sizes: ['heading-S', 'body-S'] },
  { size: 'small', sizes: ['heading-S', 'body-M'] },
  { size: 'xsmall', sizes: ['heading-S', 'body-M'] }
];

function decorateLayout(el) {
  const elems = el.querySelectorAll(':scope > div');
  const foreground = elems[elems.length - 1];
  foreground.classList.add('foreground', 'container');
  if (elems.length > 1) decorateBlockBg(el, elems[0]);
  return foreground;
}

function decorateContent(foreground, sizes) {
  if (!foreground) return;
  const header = foreground.querySelector('h1, h2, h3, h4, h5, h6');
  const text = header?.closest('div') ?? foreground.querySelector('p').closest('div');
  text?.classList.add('text');
  const image = text?.querySelector('img');
  if (image) image.closest('p')?.classList.add('image');
  const headings = text?.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings?.[headings.length - 1];
  if (heading) {
    heading.classList.add(sizes[0]);
    heading.nextElementSibling?.classList.add(sizes[1], 'body');
  } else foreground.querySelector('p:not([class])')?.classList.add(sizes[1], 'body', 'strong');
  foreground.querySelector('p:not([class]) > a:not([class])')?.classList.add('cta');
}

export default function init(el) {
  const foreground = decorateLayout(el);
  const size = options.find(size => [...el.classList].includes(size.size)) ?? sizes[0];
  decorateContent(foreground, size.sizes);
  decorateButtons(foreground);
}
