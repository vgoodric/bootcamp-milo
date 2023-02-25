import { loadScript, getMetadata, getConfig } from './utils.js';

function loadPrivacy() {
  window.fedsConfig = { privacy: { otDomainId: '7a5eb705-95ed-4cc4-a11d-0cc5760e93db' } };
  loadScript('https://www.adobe.com/etc.clientlibs/globalnav/clientlibs/base/privacy-standalone.js');

  const privacyTrigger = document.querySelector('footer a[href*="#openPrivacy"]');
  privacyTrigger?.addEventListener('click', (event) => {
    event.preventDefault();
    window.adobePrivacy?.showPreferenceCenter();
  });
}

export default function loadDelayed(delay = 3000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      loadPrivacy();
      if (getMetadata('interlinks') === 'on') {
        const { locale } = getConfig();
        const path = `${locale.contentRoot}/keywords.json`;
        import('../features/interlinks.js').then((mod) => { mod.default(path); resolve(mod); });
      } else {
        resolve(null);
      }
      import('./samplerum.js').then(({ sampleRUM }) => sampleRUM('cwv'));
    }, delay);
  });
}
