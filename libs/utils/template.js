import { getConfig, getMetadata, loadStyle } from './utils.js';

const MILO_TEMPLATES = ['404', 'featured-story'];

export default async function loadTemplate() {
  const template = getMetadata('template');
  if (!template) return;
  const name = template.toLowerCase().replace(/[^0-9a-z]/gi, '-');
  document.body.classList.add(name);
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs && MILO_TEMPLATES.includes(name) ? miloLibs : codeRoot;
  const styleLoaded = new Promise((resolve) => {
    loadStyle(`${base}/templates/${name}/${name}.css`, resolve);
  });
  const scriptLoaded = new Promise((resolve) => {
    (async () => {
      try {
        await import(`${base}/templates/${name}/${name}.js`);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`failed to load module for ${name}`, err);
      }
      resolve();
    })();
  });
  await Promise.all([styleLoaded, scriptLoaded]);
}
