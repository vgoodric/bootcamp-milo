import { html, render } from '../../deps/htm-preact.js';

function CaasTagSelector() {
  return html`
    <h1 class="cts-heading">Caas Tag Selector</h1>
  `;
}

export default async function init(el) {
  render(html`<${CaasTagSelector} />`, el);
}
