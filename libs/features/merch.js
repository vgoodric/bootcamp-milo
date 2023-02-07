import { loadScript, getConfig, createTag } from '../utils/utils.js';

const { miloLibs, codeRoot, env } = getConfig();
const base = miloLibs || codeRoot;

function buildButton(osi) {
  const a = createTag('a');
  a.href = '#';
  a.className = 'con-button blue button-M';
  a.dataset.checkoutClientid = 'mini_plans';
  a.dataset.checkoutWorkflow = 'UCv3';
  a.dataset.checkoutWorkflowStep = 'email';
  a.dataset.wcsOsi = osi;
  a.dataset.template = 'checkoutUrl';
  return a;
}

function buildPrice(osi, type) {
  return createTag('span', { 'data-wcs-osi': osi, 'data-template': type });
}

function getPriceType(name) {
  switch (name) {
    case 'price': { return 'price'; }
    case 'optical': { return 'priceOptical'; }
    case 'strikethrough': { return 'priceStrikethrough'; }
    case 'with-tax': { return 'priceWithTax'; }
    case 'with-strikethrough-tax': { return 'priceWithTaxStrikethrough'; }
    default: return null;
  }
}

export function runTacocat() {
  if (!window.tacocat) {
    await loadScript(`${base}/deps/tacocat-index.js`);
  }

  const wcs = { apiKey: 'wcms-commerce-ims-ro-user-cc' };
  window.tacocat({ environment: env.name, wcs });
}

export async function getPrice(osi, priceType) {
  if (!osi) return;
  const mappedPriceType = getPriceType(priceType) ?? 'price';
  const price = buildPrice(osi, mappedPriceType);
  return price;
}


export async function getButton(osi, div) {
  if (!osi) return;
  return buildButton(div.querySelector('a'), osi);
}
