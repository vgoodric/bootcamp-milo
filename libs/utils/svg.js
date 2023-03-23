import { createTag } from './utils.js';

export default function makeSVG(a) {
  const { textContent, href } = a;
  if (!(textContent.includes('.svg') || href.includes('.svg'))) return a;
  try {
    // Mine for URL and alt text
    const splitText = textContent.split('|');
    const textUrl = new URL(splitText.shift().trim());
    const altText = splitText.join('|').trim();

    // Relative link checking
    const hrefUrl = a.href.startsWith('/')
      ? new URL(`${window.location.origin}${a.href}`)
      : new URL(a.href);

    const src = textUrl.hostname.includes('.hlx.') ? textUrl.pathname : textUrl;

    const img = createTag('img', { loading: 'lazy', src });
    if (altText) img.alt = altText;
    const pic = createTag('picture', null, img);

    if (textUrl.pathname === hrefUrl.pathname) {
      a.parentElement.replaceChild(pic, a);
      return pic;
    }
    a.textContent = '';
    a.append(pic);
    return a;
  } catch (e) {
    console.log('Failed to create SVG.', e.message);
    return a;
  }
}
