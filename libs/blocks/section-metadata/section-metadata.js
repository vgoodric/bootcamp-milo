import createTag from '../../utils/utils.js';

function handleBackground(div, section) {
  const pic = div.querySelector('picture');
  if (pic) {
    section.classList.add('has-background');
    pic.classList.add('section-background');
    section.insertAdjacentElement('afterbegin', pic);
  } else {
    const color = div.textContent;
    if (color) {
      section.style.backgroundColor = color;
    }
  }
}

function handleStyle(div, section) {
  const value = div.textContent.toLowerCase();
  const styles = value.split(', ').map((style) => style.replaceAll(' ', '-'));
  if (section) {
    section.classList.add(...styles);
  }
}

function handleWrapper(div, section) {
  const sectionSibling = section.previousElementSibling;
  if (!sectionSibling) return;
  sectionSibling.classList.add('section-one');
  section.classList.add('section-two');
  const textClass = div.textContent.trim().replaceAll( ' ', '-');
  const content = createTag('div', {class: `content`});
  const sectionWrapper = createTag('div', {class: `section-wrapper ${textClass}`}, content);
  section.insertAdjacentElement( 'afterend', sectionWrapper );
  content.insertAdjacentElement('afterbegin', sectionSibling );
  content.insertAdjacentElement('beforeend', section );
}

export default function init(el) {
  const section = el.closest('main > div');
  if (!section) return;
  section.className = 'section';
  const keyDivs = el.querySelectorAll(':scope > div > div:first-child');
  keyDivs.forEach((div) => {
    const valueDiv = div.nextElementSibling;
    if (div.textContent === 'style') {
      handleStyle(valueDiv, section);
    }
    if (div.textContent === 'background') {
      handleBackground(valueDiv, section);
    }
    if (div.textContent === 'wrapper') {
      handleWrapper(valueDiv, section);
    }
  });
}
