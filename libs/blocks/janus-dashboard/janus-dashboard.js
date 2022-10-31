import { html, render } from '../../deps/htm-preact.js';
import DashboardApp from './app.js';

export default function init(el) {
  const children = el?.querySelectorAll(':scope > div');
  const wrapper = children[0]?.querySelector(':scope > div');
  const dataAnchor = wrapper?.querySelector('a');

  // const dataLink = dataAnchor.href;
  const dataLink = dataAnchor.innerText;

  const app = html`<${DashboardApp} dataLink=${dataLink} /`;
  render(app, el);
}
