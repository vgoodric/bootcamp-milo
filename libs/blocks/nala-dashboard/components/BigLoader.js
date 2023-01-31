import { html } from '../../../deps/htm-preact.js';
import GridItem from './GridItem.js';

export default function BigLoader() {
  // FIXME: use icon
  return html`<div class="loader-big-container">
    <${GridItem}>
      <div class="loader-big-text">BigLoader...</div>
    <//>
  <//>`;
}
