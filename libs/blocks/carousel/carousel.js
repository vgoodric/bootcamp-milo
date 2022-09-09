import { html, render, useEffect, useState } from '../../deps/htm-preact.js';

const Carousel = ({ rootEl }) => {
  const variant = rootEl.classList[1];
  const [slides, setSlides] = useState([]);
  const items = [...rootEl.querySelectorAll(':scope > div')];
  const buttonDiv = items.pop();

  const firstSlides = items.map((item, idx) => html`<div data-idx=${idx} class="carousel-item" dangerouslySetInnerHTML=${{ __html: item.outerHTML }} />`);

  useEffect(async () => {
    setSlides(firstSlides);
  }, []);

  const onClick = (e) => {
    if (e.target.textContent === 'next') {
      const slide = slides.pop();
      const newOrder = [slide, ...slides];
      setSlides(newOrder);
    } else {
      const slide = slides.shift();
      const newOrder = [...slides, slide];
      setSlides(newOrder);
    }
  };

  const anchors = [...buttonDiv.querySelectorAll('a')];
  const buttons = anchors.map((anchor) => html`<button onClick=${onClick}>${anchor.textContent}</button>`);

  // Destroy inner contents
  // rootEl.innerHTML = '';

  if (slides.length === 0) return null;

  if (variant === 'increment') {
    return html`
    <div class="carousel-items">${slides}</div>
    <div class="carousel-buttons" >${buttons}</div>`;
  }
  if (variant === 'slides-2') {
    return html`
      <div class="carousel-items">${slides}</div>
      <div class="carousel-buttons" >${buttons}</div>`;
  }

  return null;
};

export default async function init(el) {
  const app = html`<${Carousel} rootEl=${el} /> `;
  render(app, el);
}
