const MILO_BLOCKS = [
  'accordion',
  'adobetv',
  'article-feed',
  'article-header',
  'aside',
  'author-header',
  'caas',
  'caas-config',
  'card',
  'card-horizontal',
  'card-metadata',
  'carousel',
  'chart',
  'columns',
  'faas',
  'faq',
  'featured-article',
  'figure',
  'fragment',
  'featured-article',
  'footer',
  'gnav',
  'how-to',
  'icon-block',
  'iframe',
  'instagram',
  'marketo',
  'marquee',
  'media',
  'merch',
  'modal',
  'modal-metadata',
  'pdf-viewer',
  'quote',
  'read-more',
  'recommended-articles',
  'region-nav',
  'review',
  'section-metadata',
  'slideshare',
  'preflight',
  'promo',
  'tabs',
  'table-of-contents',
  'text',
  'walls-io',
  'tags',
  'tiktok',
  'twitter',
  'video',
  'vimeo',
  'youtube',
  'z-pattern',
  'share',
  'reading-time',
];
const AUTO_BLOCKS = [
  { adobetv: 'https://video.tv.adobe.com' },
  { gist: 'https://gist.github.com' },
  { caas: '/tools/caas' },
  { faas: '/tools/faas' },
  { fragment: '/fragments/' },
  { instagram: 'https://www.instagram.com' },
  { slideshare: 'https://www.slideshare.net' },
  { tiktok: 'https://www.tiktok.com' },
  { twitter: 'https://twitter.com' },
  { vimeo: 'https://vimeo.com' },
  { vimeo: 'https://player.vimeo.com' },
  { youtube: 'https://www.youtube.com' },
  { youtube: 'https://youtu.be' },
  { 'pdf-viewer': '.pdf' },
  { video: '.mp4' },
];
const ENVS = {
  local: {
    name: 'local',
    edgeConfigId: '8d2805dd-85bf-4748-82eb-f99fdad117a6',
    pdfViewerClientId: '600a4521c23d4c7eb9c7b039bee534a0',
  },
  stage: {
    name: 'stage',
    ims: 'stg1',
    adobeIO: 'cc-collab-stage.adobe.io',
    adminconsole: 'stage.adminconsole.adobe.com',
    account: 'stage.account.adobe.com',
    edgeConfigId: '8d2805dd-85bf-4748-82eb-f99fdad117a6',
    pdfViewerClientId: '600a4521c23d4c7eb9c7b039bee534a0',
  },
  prod: {
    name: 'prod',
    ims: 'prod',
    adobeIO: 'cc-collab.adobe.io',
    adminconsole: 'adminconsole.adobe.com',
    account: 'account.adobe.com',
    edgeConfigId: '2cba807b-7430-41ae-9aac-db2b0da742d5',
    pdfViewerClientId: '3c0a5ddf2cc04d3198d9e48efc390fa9',
  },
};
const LANGSTORE = 'langstore';

function getEnv(conf) {
  const { host, href } = window.location;
  const location = new URL(href);
  const query = location.searchParams.get('env');

  if (query) return { ...ENVS[query], consumer: conf[query] };
  if (host.includes('localhost:')) return { ...ENVS.local, consumer: conf.local };
  /* c8 ignore start */
  const stage = host.includes('.hlx.') || host.includes('.stage.') || host.includes('.corp.');
  if (stage) return { ...ENVS.stage, consumer: conf.stage };
  return { ...ENVS.prod, consumer: conf.prod };
  /* c8 ignore stop */
}

export function getLocale(locales, pathname = window.location.pathname) {
  if (!locales) return { ietf: 'en-US', tk: 'hah7vzn.css', prefix: '' };
  const split = pathname.split('/');
  const localeString = split[1];
  const locale = locales[localeString] || locales[''];
  if (localeString === LANGSTORE) {
    locale.prefix = `/${localeString}/${split[2]}`;
    return locale;
  }
  locale.prefix = locale.ietf === 'en-US' ? '' : `/${localeString}`;
  return locale;
}

export const [setConfig, getConfig] = (() => {
  let config = {};
  return [
    (conf) => {
      const origin = conf.origin || window.location.origin;
      const pathname = conf.pathname || window.location.pathname;
      config = { env: getEnv(conf), ...conf };
      config.codeRoot = conf.codeRoot ? `${origin}${conf.codeRoot}` : origin;
      config.locale = pathname ? getLocale(conf.locales, pathname) : getLocale(conf.locales);
      config.autoBlocks = conf.autoBlocks ? [...AUTO_BLOCKS, ...conf.autoBlocks] : AUTO_BLOCKS;
      document.documentElement.setAttribute('lang', config.locale.ietf);
      try {
        document.documentElement.setAttribute('dir', (new Intl.Locale(config.locale.ietf)).textInfo.direction);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Invalid or missing locale:', e);
      }
      config.locale.contentRoot = `${origin}${config.locale.prefix}${config.contentRoot ?? ''}`;
      return config;
    },
    () => config,
  ];
})();

export function getMetadata(name, doc = document) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = doc.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
}

export function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement
      || html instanceof SVGElement
      || html instanceof DocumentFragment) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  return el;
}

function getExtension(path) {
  const pageName = path.split('/').pop();
  return pageName.includes('.') ? pageName.split('.').pop() : '';
}

export function localizeLink(href, originHostName = window.location.hostname) {
  try {
    const { hostname, origin, hash, search, pathname } = new URL(href);
    const relative = hostname === originHostName;
    const processedHref = relative ? href.replace(origin, '') : href;
    if (hash === '#_dnt') return processedHref.split('#')[0];
    const path = pathname;
    const extension = getExtension(path);
    if (!['', 'html', 'json'].includes(extension)) return processedHref;
    const { locale, locales, prodDomains } = getConfig();
    if (!locale || !locales) return processedHref;
    const isLocalizable = relative || (prodDomains && prodDomains.includes(hostname));
    if (!isLocalizable) return processedHref;
    const isLocalizedLink = path.startsWith(`/${LANGSTORE}`) || Object.keys(locales)
      .some((loc) => loc !== '' && (path.startsWith(`/${loc}/`) || path.endsWith(`/${loc}`)));
    if (isLocalizedLink) return processedHref;
    const urlPath = `${locale.prefix}${path}${search}${hash}`;
    return relative ? urlPath : `${origin}${urlPath}`;
  } catch (error) {
    return href;
  }
}

export function loadStyle(href, callback) {
  let link = document.head.querySelector(`link[href="${href}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    if (callback) {
      link.onload = (e) => callback(e.type);
      link.onerror = (e) => callback(e.type);
    }
    document.head.appendChild(link);
  } else if (callback) {
    callback('noop');
  }
  return link;
}

export function appendHtmlPostfix(area = document) {
  const pageUrl = new URL(window.location.href);
  if (!pageUrl.pathname.endsWith('.html')) return;

  const { autoBlocks = [], htmlExclude = [] } = getConfig();

  const relativeAutoBlocks = autoBlocks
    .map((b) => Object.values(b)[0])
    .filter((b) => b.startsWith('/'));

  const HAS_EXTENSION = /\..*$/;
  const shouldNotConvert = (href) => {
    let url = { pathname: href };

    try { url = new URL(href, pageUrl); } catch {}

    if (!(href.startsWith('/') || href.startsWith(pageUrl.origin))
      || url.pathname?.endsWith('/')
      || href === pageUrl.origin
      || HAS_EXTENSION.test(href.split('/').pop())
      || htmlExclude?.some((excludeRe) => excludeRe.test(href))) {
      return true;
    }
    const isAutoblockLink = relativeAutoBlocks.some((block) => href.includes(block));
    if (isAutoblockLink) return true;
    return false;
  };

  if (area === document) {
    const canonEl = document.head.querySelector('link[rel="canonical"]');
    if (!canonEl) return;
    const { href } = canonEl;
    const canonUrl = new URL(href);
    if (canonUrl.pathname.endsWith('/') || canonUrl.pathname.endsWith('.html')) return;
    const pagePath = pageUrl.pathname.replace('.html', '');
    if (pagePath !== canonUrl.pathname) return;
    canonEl.setAttribute('href', `${href}.html`);
  }

  const links = area.querySelectorAll('a');
  links.forEach((el) => {
    const href = el.getAttribute('href');
    if (!href || shouldNotConvert(href)) return;

    try {
      const linkUrl = new URL(href.startsWith('http') ? href : `${pageUrl.origin}${href}`);
      if (linkUrl.pathname && !linkUrl.pathname.endsWith('.html')) {
        linkUrl.pathname = `${linkUrl.pathname}.html`;
        el.setAttribute('href', href.startsWith('/')
          ? `${linkUrl.pathname}${linkUrl.search}${linkUrl.hash}`
          : linkUrl.href);
      }
    } catch (err) {
      /* c8 ignore next 3 */
      // eslint-disable-next-line no-console
      console.log(err);
    }
  });
}

export async function loadBlock(block) {
  const name = block.classList[0];
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs && MILO_BLOCKS.includes(name) ? miloLibs : codeRoot;
  const styleLoaded = new Promise((resolve) => {
    loadStyle(`${base}/blocks/${name}/${name}.css`, resolve);
  });
  const scriptLoaded = new Promise((resolve) => {
    (async () => {
      try {
        const { default: init } = await import(`${base}/blocks/${name}/${name}.js`);
        await init(block);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`Failed loading ${name}`, err);
        const config = getConfig();
        if (config.env.name !== 'prod') {
          const { showError } = await import('../blocks/fallback/fallback.js');
          showError(block, name);
        }
      }
      resolve();
    })();
  });
  await Promise.all([styleLoaded, scriptLoaded]);
  return block;
}

export async function decorateSVG(a) {
  if (!(a.textContent.includes('.svg') || a.href.includes('.svg'))) return a;
  const { default: createSVG } = await import('./svg.js');
  return createSVG(a);
}

export function decorateAutoBlock(a) {
  const config = getConfig();
  const { hostname } = window.location;
  const url = new URL(a.href);
  const href = hostname === url.hostname ? `${url.pathname}${url.search}${url.hash}` : a.href;
  return config.autoBlocks.find((candidate) => {
    const key = Object.keys(candidate)[0];
    const match = href.includes(candidate[key]);
    if (match) {
      if (key === 'pdf-viewer' && !a.textContent.includes('.pdf')) {
        a.target = '_blank';
        return false;
      }
      if (key === 'fragment' && url.hash === '') {
        const { parentElement } = a;
        const { nodeName, innerHTML } = parentElement;
        const noText = innerHTML === a.outerHTML;
        if (noText && nodeName === 'P') {
          const div = createTag('div', null, a);
          parentElement.parentElement.replaceChild(div, parentElement);
        }
      }
      // Modals
      if (key === 'fragment' && url.hash !== '') {
        a.dataset.modalPath = url.pathname;
        a.dataset.modalHash = url.hash;
        a.href = url.hash;
        a.className = 'modal link-block';
        return true;
      }
      // slack uploaded mp4s
      if (key === 'video' && !a.textContent.match('media_.*.mp4')) return false;

      a.className = `${key} link-block`;
      return true;
    }
    return false;
  });
}

export function decorateLinks(el) {
  const anchors = el.getElementsByTagName('a');
  return [...anchors].reduce((rdx, a) => {
    a.href = localizeLink(a.href);
    decorateSVG(a);
    if (a.href.includes('#_blank')) {
      a.setAttribute('target', '_blank');
      a.href = a.href.replace('#_blank', '');
    }
    if (a.href.includes('#_dnb')) {
      a.href = a.href.replace('#_dnb', '');
    } else {
      const autoBlock = decorateAutoBlock(a);
      if (autoBlock) rdx.push(a);
    }
    return rdx;
  }, []);
}

function decorateContent(el) {
  const children = [el];
  let child = el;
  while (child) {
    child = child.nextElementSibling;
    if (child && child.nodeName !== 'DIV') {
      children.push(child);
    } else {
      break;
    }
  }
  return createTag('div', { class: 'content' }, children);
}

function decorateDefaults(el) {
  const firstChild = ':scope > *:not(div):first-child';
  const afterBlock = ':scope > div + *:not(div)';
  const children = el.querySelectorAll(`${firstChild}, ${afterBlock}`);
  children.forEach((child) => {
    const prev = child.previousElementSibling;
    const content = decorateContent(child);
    if (prev) {
      prev.insertAdjacentElement('afterend', content);
    } else {
      el.insertAdjacentElement('afterbegin', content);
    }
  });
}

function decorateHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  const headerMeta = getMetadata('header');
  if (headerMeta === 'off') {
    document.body.classList.add('nav-off');
    header.remove();
    return;
  }
  header.className = headerMeta || 'gnav';
  const breadcrumbs = document.querySelector('.breadcrumbs');
  if (breadcrumbs) {
    header.classList.add('has-breadcrumbs');
    header.append(breadcrumbs);
  }
}

async function decorateIcons(area, config) {
  const domIcons = area.querySelectorAll('span.icon');
  if (domIcons.length === 0) return;
  const { default: loadIcons } = await import('../features/icons.js');
  loadIcons(domIcons, config);
}

async function decoratePlaceholders(area, config) {
  const el = area.documentElement ? area.body : area;
  const regex = /{{(.*?)}}/g;
  const found = regex.test(el.innerHTML);
  if (!found) return;
  const { replaceText } = await import('../features/placeholders.js');
  el.innerHTML = await replaceText(el.innerHTML, config, regex);
}

function decorateSections(el, isDoc) {
  const selector = isDoc ? 'body > main > div' : ':scope > div';
  return [...el.querySelectorAll(selector)].map((section, idx) => {
    const links = decorateLinks(section);
    decorateDefaults(section);
    const blocks = section.querySelectorAll(':scope > div[class]:not(.content)');
    section.className = 'section';
    section.dataset.status = 'decorated';
    section.dataset.idx = idx;
    return { el: section, blocks: [...links, ...blocks] };
  });
}

async function loadMartech() {
  const query = new URL(window.location.href).searchParams.get('martech');
  if (query !== 'off' && getMetadata('martech') !== 'off') {
    const { default: martech } = await import('../martech/martech.js');
    martech();
  }
}

async function loadPostLCP(config) {
  loadMartech();
  const header = document.querySelector('header');
  if (header) { loadBlock(header); }
  const template = getMetadata('template');
  if (template) {
    const { default: loadTemplate } = await import('./template.js');
    loadTemplate(template);
  }
  const { default: loadFonts } = await import('./fonts.js');
  loadFonts(config.locale, loadStyle);
}

function decorateMeta() {
  const { origin } = window.location;
  const contents = document.head.querySelectorAll('[content*=".hlx."]');
  contents.forEach((meta) => {
    if (meta.getAttribute('property') === 'hlx:proxyUrl') return;
    try {
      const url = new URL(meta.content);
      meta.setAttribute('content', `${origin}${url.pathname}${url.search}${url.hash}`);
    } catch (e) {
      window.lana?.log(`Cannot make URL from metadata - ${meta.content}: ${e.toString()}`);
    }
  });
}

function decorateModal() {
  window.addEventListener('modal:open', async (e) => {
    const { miloLibs } = getConfig();
    const { findDetails, getModal } = await import('../blocks/modal/modal.js');
    loadStyle(`${miloLibs}/blocks/modal/modal.css`);
    const details = findDetails(e.detail.hash);
    if (details) getModal(details);
  });
}

export async function loadArea(area = document) {
  const config = getConfig();
  const isDoc = area === document;

  appendHtmlPostfix(area);
  await decoratePlaceholders(area, config);

  if (isDoc) {
    decorateMeta();
    decorateModal();
    decorateHeader();
    import('./samplerum.js').then(({ addRumListeners }) => { addRumListeners(); });
  }

  const sections = decorateSections(area, isDoc);

  const areaBlocks = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const section of sections) {
    const loaded = section.blocks.map((block) => loadBlock(block));
    areaBlocks.push(...section.blocks);

    // Only move on to the next section when all blocks are loaded.
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(loaded);

    // eslint-disable-next-line no-await-in-loop
    await decorateIcons(section.el, config);

    // Post LCP operations.
    if (isDoc && section.el.dataset.idx === '0') { loadPostLCP(config); }

    // Show the section when all blocks inside are done.
    delete section.el.dataset.status;
    delete section.el.dataset.idx;
  }

  // Load everything that can be deferred until after all blocks load.
  const { default: loadDeferred } = await import('./deferred.js');
  await loadDeferred(isDoc, area, areaBlocks, config);
}

export function loadLana(options = {}) {
  if (window.lana) return;

  const lanaError = (e) => {
    window.lana?.log(e.reason || e.error || e.message, { errorType: 'i' });
  };

  window.lana = {
    log: async (...args) => {
      window.removeEventListener('error', lanaError);
      window.removeEventListener('unhandledrejection', lanaError);
      await import('./lana.js');
      return window.lana.log(...args);
    },
    debug: false,
    options,
  };

  window.addEventListener('error', lanaError);
  window.addEventListener('unhandledrejection', lanaError);
}
