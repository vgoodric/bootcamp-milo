import {
  createTag,
  getConfig,
  getMetadata,
} from '../../utils/utils.js';

function decorateHeading(section, heading) {
  const p = createTag('p', { class: 'footer-nav-heading' }, heading.textContent);
  section.replaceChild(p, heading);
}

function decorateNav(nav, children) {
  [...children].forEach((section) => {
    const headings = section.querySelectorAll(':scope > h2');
    if (headings.length > 0) {
      headings.forEach((heading) => { decorateHeading(section, heading); });
      nav.append(section);
    }
  });
}
function decorateFooter(dom, el) {
  const { children } = dom.body;
  const nav = createTag('nav');
  decorateNav(nav, children);
  return el.append(nav);
}

export default async function init(el) {
  const { locale } = getConfig();

  const url = getMetadata('footer-source') || `${locale.prefix}/footer`;
  if (url) {
    const resp = await fetch(`${url}.plain.html`);
    if (!resp.ok) return null;
    const html = await resp.text();
    if (html) {
      try {
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, 'text/html');
        return decorateFooter(dom, el);
      } catch {
        console.log('Could not create footer.');
      }
    }
  }
  return el;
}
