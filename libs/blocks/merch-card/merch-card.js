import { loadStyle, getConfig, createTag } from '../../utils/utils.js';
import { getSectionMetadata } from '../section-metadata/section-metadata.js';

const HALF = 'OneHalfCard';
const HALF_HEIGHT = 'HalfHeightCard';
const PRODUCT = 'ProductCard';
const DOUBLE_WIDE = 'DoubleWideCard';

const getCardType = (styles) => {
  const cardTypes = {
    'half-card': HALF,
    'half-height-card': HALF_HEIGHT,
    'product-card': PRODUCT,
    'double-width-card': DOUBLE_WIDE,
  };
  const authoredType = styles?.find((style) => style in cardTypes);
  return cardTypes[authoredType] || HALF;
};

const getUpFromSectionMetadata = (section) => {
  const sectionMetadata = getSectionMetadata(section.querySelector('.section-metadata'));
  const styles = sectionMetadata.style?.split(', ').map((style) => style.replaceAll(' ', '-'));
  return styles?.find((style) => style.includes('-up'));
};

const addWrapper = (el, section, cardType) => {
  const gridCl = 'consonant-CardsGrid';
  const prevGrid = section.querySelector(`.consonant-Wrapper .${gridCl}`);

  if (prevGrid) return;

  const upClass = getUpFromSectionMetadata(section);
  const up = upClass?.replace('-', '') || '3up';
  const gridClass = `${gridCl} ${gridCl}--${up} ${gridCl}--with4xGutter${cardType === DOUBLE_WIDE ? ` ${gridCl}--doubleWideCards` : ''}`;
  const grid = createTag('div', { class: gridClass });
  const collection = createTag('div', { class: 'consonant-Wrapper-collection' }, grid);
  const inner = createTag('div', { class: 'consonant-Wrapper-inner' }, collection);
  const wrapper = createTag('div', { class: 'milo-card-wrapper consonant-Wrapper consonant-Wrapper--1200MaxWidth' }, inner);
  const cards = section.querySelectorAll('.merch-card');
  const prevSib = cards[0].previousElementSibling;

  grid.append(...cards);

  if (prevSib) {
    prevSib.after(wrapper);
  } else {
    section.prepend(wrapper);
  }
};

const addBackgroundImg = (picture, cardType, card) => {
  const url = picture.querySelector('img').src;
  const imageDiv = document.createElement('div');

  imageDiv.style.backgroundImage = `url(${url})`;
  imageDiv.classList.add(`consonant-${cardType}-img`);
  card.append(imageDiv);
};

const addInner = (el, cardType, card) => {
  const title = el.querySelector('h1, h2, h3, h4, h5, h6');
  const text = Array.from(el.querySelectorAll('p'))?.find((p) => !p.querySelector('picture, a'));
  let inner = el.querySelector(':scope > div:not([class])');

  if (cardType === DOUBLE_WIDE) {
    inner = document.createElement('a');
    inner.href = el.querySelector('a')?.href || '';
    inner.rel = 'noopener noreferrer';
    inner.tabIndex = 0;
    if (title) inner.append(title);
    if (text) inner.append(text);
    el.querySelector(':scope > div:not([class])')?.remove();
  }

  inner.classList.add(`consonant-${cardType}-inner`);
  card.append(inner);

  if (cardType === PRODUCT) {
    inner.querySelector(':scope > div')?.classList.add('consonant-ProductCard-row');
    if (text) inner.append(text);
  }

  if (cardType === HALF_HEIGHT) {
    text?.remove();
  }

  title?.classList.add(`consonant-${cardType}-title`);
};

const addFooter = (buttons, container) => {
  const linksArr = Array.from(buttons);
  const linksLeng = linksArr.length;
  let footer = `<div class="consonant-CardFooter"><hr><div class="consonant-CardFooter-row" data-cells="${linksLeng}">`;
  footer = linksArr.reduce(
    (combined, link, index) => (
      `${combined}<div class="consonant-CardFooter-cell consonant-CardFooter-cell--${(linksLeng === 2 && index === 0) ? 'left' : 'right'}">${link.outerHTML}</div>`),
    footer,
  );
  footer += '</div></div>';

  container.insertAdjacentHTML('beforeend', footer);
  buttons[0]?.parentElement?.remove();
};

const init = (el) => {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  loadStyle(`${base}/deps/caas.css`);

  const section = el.closest('.section');
  section.classList.add('milo-card-section');
  const row = el.querySelector(':scope > div');
  const picture = el.querySelector('picture');
  const links = el.querySelectorAll('a.con-button');
  const styles = Array.from(el.classList);
  const cardType = getCardType(styles);
  const card = el;

  addWrapper(el, section, cardType);

  card.classList.add('consonant-Card', `consonant-${cardType}`);
  if (!styles.includes('border')) card.classList.add('consonant-u-noBorders');

  if (picture && cardType !== PRODUCT) {
    addBackgroundImg(picture, cardType, card);
  }

  picture?.parentElement.remove();
  addInner(el, cardType, card);

  if (cardType === HALF || cardType === PRODUCT) {
    addFooter(links, row);
  }
};

export default init;
