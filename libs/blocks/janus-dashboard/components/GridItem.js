import { html } from '../../../deps/htm-preact.js';

function GridItem({ children, centered }) {
  return html`<li class=${`grid-item${centered ? ' text-centered' : ''}`}>
    ${children}
  </li>`;
}

export default GridItem;
