window.milo = window.milo || {};
const blocks = [
  'caas',
  'faq',
  'fragment',
  'how-to',
  'modal',
  'marquee',
];

window.milo.load = async (blockName) => {
  if (blocks.indexOf(blockName)) {
    return import(`https://central--milo--adobecom.hlx.page/libs/blocks/${blockName}/${blockName}.js`);
  }
  return null;
};
