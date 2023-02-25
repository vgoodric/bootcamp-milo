import {
  createTag,
  decorateLinks,
  getConfig,
  getMetadata,
} from '../../utils/utils.js';

function decorateFeatures(children) {
  const features = createTag('div', { class: 'footer-features' });

  const blocks = [...children].reduce((acc, child) => {
    const childBlocks = [...child.querySelectorAll(':scope > [class]')];
    if (childBlocks.length > 0) {
      acc.push(...childBlocks);
      child.remove();
    }
    return acc;
  }, []);

  features.append(...blocks, ...children);
  return features;
}

function decorateHeading(section, heading) {
  const p = createTag('p', { class: 'footer-nav-heading' }, heading.textContent);
  section.replaceChild(p, heading);
}

function decorateNav(children) {
  const nav = createTag('nav', { class: 'footer-nav' });
  [...children].forEach((section) => {
    const headings = section.querySelectorAll(':scope > h2');
    if (headings.length > 0) {
      headings.forEach((heading) => { decorateHeading(section, heading); });
      section.classList.add('footer-nav-section');
      nav.append(section);
    }
  });
  return nav;
}

function decorateFooter(dom, footer) {
  const { children } = dom.body;
  const nav = decorateNav(children);
  const features = decorateFeatures(children);
  return footer.append(nav, features);
}

export default async function init(el) {
  const { locale } = getConfig();
  const url = getMetadata('footer-source') || `${locale.prefix}/footer`;
  try {
    const resp = await fetch(`${url}.plain.html`);
    if (!resp.ok) return null;
    const html = await resp.text();
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');
    decorateLinks(dom);
    return decorateFooter(dom, el);
  } catch {
    console.log('Could not create footer.');
  }
  return el;
}
