/* eslint-disable no-await-in-loop */
import { createTag } from '../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';

const MOCK = '["https://main--milo--adobecom.hlx.page/fragments/cmillar/uar-features", "https://main--milo--adobecom.hlx.page/fragments/cmillar/uar-marquee", "https://main--milo--adobecom.hlx.page/fragments/cmillar/uar-learn"]';

function saveLocalMock(storeName) {
  localStorage.setItem(storeName, MOCK);
}

function buildMock(storeName) {
  const mock = new DocumentFragment();
  const errMsg = `There are no experiences listed in local storage for ${storeName}. Do you want to mock them?`;
  const p = createTag('p', null, errMsg);
  const button = createTag('button', null, 'Mock them');
  button.addEventListener('click', () => {
    saveLocalMock(storeName);
    window.location.reload();
  });
  mock.append(p, button);
  return mock;
}

function destroyMock(storeName) {
  localStorage.removeItem(storeName);
  window.location.reload();
}

export default async function init(el) {
  const data = getMetadata(el);
  el.querySelector('div').remove();
  const expStr = localStorage.getItem(data.store.text);
  if (!expStr) {
    const mock = buildMock(data.store.text);
    el.append(mock);
    el.classList.add('show');
    return;
  }
  const experiences = JSON.parse(expStr);
  // eslint-disable-next-line no-restricted-syntax
  for (const href of experiences) {
    const a = createTag('a', { href });
    el.append(a);
    const { default: createFragment } = await import('../fragment/fragment.js');
    await createFragment(a);
  }

  const button = createTag('button', null, 'Destroy mock');
  button.addEventListener('click', () => {
    destroyMock(data.store.text);
    window.location.reload();
  });
  el.append(button);
  el.classList.add('show');
}
