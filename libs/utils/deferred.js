import { createTag, getMetadata, loadBlock, loadScript, loadStyle } from './utils.js';

async function loadFooter() {
  const footerMeta = getMetadata('footer');
  const footer = document.querySelector('footer');
  if (footerMeta === 'off') {
    footer.remove();
    return;
  }
  footer.className = footerMeta || 'footer';
  await loadBlock(footer);
}

function initSidekick() {
  const initPlugins = async () => {
    const { default: init } = await import('./sidekick.js');
    init({ createTag, loadBlock, loadScript, loadStyle });
  };

  if (document.querySelector('helix-sidekick')) {
    initPlugins();
  } else {
    document.addEventListener('sidekick-ready', () => {
      initPlugins();
    });
  }
}

export default async function loadDeferred(area, blocks, config, isDoc) {
  if (isDoc) {
    await loadFooter();
    const georouting = getMetadata('georouting') || config.geoRouting;
    if (georouting === 'on') {
      const { default: loadGeoRouting } = await import('../features/georouting/georouting.js');
      loadGeoRouting(config, createTag, getMetadata);
    }
    const richResults = getMetadata('richresults');
    if (richResults) {
      const { default: addRichResults } = await import('../features/richresults.js');
      addRichResults(richResults, { createTag, getMetadata });
    }
    const { default: loadFavIcon } = await import('./favicon.js');
    loadFavIcon(createTag, config, getMetadata);
    initSidekick();
  }

  const event = new Event('milo:deferred');
  area.dispatchEvent(event);
  if (config.links === 'on') {
    const path = `${config.contentRoot || ''}${getMetadata('links-path') || '/seo/links.json'}`;
    import('../features/links.js').then((mod) => mod.default(path, area));
  }

  if (config.locale?.ietf === 'ja-JP') {
    // Japanese word-wrap
    import('../features/japanese-word-wrap.js').then(({ controlLineBreaksJapanese }) => {
      controlLineBreaksJapanese(config, area);
    });
  }

  import('./samplerum.js').then(({ sampleRUM }) => {
    sampleRUM('lazy');
    sampleRUM.observe(blocks);
    sampleRUM.observe(area.querySelectorAll('picture > img'));
  });
}
