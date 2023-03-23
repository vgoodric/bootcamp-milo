import { getConfig, getMetadata, loadScript } from './utils.js';

function loadPrivacy() {
  const domains = {
    'adobe.com': '7a5eb705-95ed-4cc4-a11d-0cc5760e93db',
    'hlx.live': '926b16ce-cc88-4c6a-af45-21749f3167f3',
    'hlx.page': '3a6a37fe-9e07-4aa9-8640-8f358a623271',
  };
  const currentDomain = Object.keys(domains)
    .find((domain) => window.location.host.includes(domain)) || domains[0];
  let domainId = domains[currentDomain];
  // Load Privacy in test mode to allow setting cookies on hlx.live and hlx.page
  if (getConfig().env.name === 'stage') {
    domainId += '-test';
  }
  window.fedsConfig = {
    privacy: {
      otDomainId: domainId,
      documentLanguage: true,
    },
  };
  loadScript('https://www.adobe.com/etc.clientlibs/globalnav/clientlibs/base/privacy-standalone.js');

  const privacyTrigger = document.querySelector('footer a[href*="#openPrivacy"]');
  privacyTrigger?.addEventListener('click', (event) => {
    event.preventDefault();
    window.adobePrivacy?.showPreferenceCenter();
  });
}

// Load everything that impacts performance later.
export default function loadDelayed(delay = 3000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      loadPrivacy();
      if (getMetadata('interlinks') === 'on') {
        const path = `${getConfig().locale.contentRoot}/keywords.json`;
        import('../features/interlinks.js').then((mod) => { mod.default(path); resolve(mod); });
      } else {
        resolve(null);
      }
      import('./samplerum.js').then(({ sampleRUM }) => sampleRUM('cwv'));
    }, delay);
  });
}
