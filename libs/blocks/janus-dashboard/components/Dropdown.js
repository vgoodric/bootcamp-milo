import { html } from '../../../deps/htm-preact.js';

export default function Dropdown({ options, onSelect, value, labelText }) {
  const optionSelections = options.map(
    (o) => html`<option
      key=${o}
      selected=${o.value === value}
      value=${o.value}
    >
      ${o.text}
    </option>`,
  );
  return html`<div class="dropdown">
    <label class="label">${labelText}</label>
    <select
      class="select"
      onChange=${(e) => {
        onSelect(e.target.value);
      }}
    >
      ${optionSelections}
    </select>
  </div>`;
}
