import { html, useContext, useState } from '../../../deps/htm-preact.js';

export default function DropdownBig({ options = [], onSelect, value = '' }) {
  const optionSelections = options.map(
    (o, i) => html`<option
      key=${o}
      selected=${o.value === value}
      value=${o.value}
    >
      ${o.text.toUpperCase()}
    </option>`
  );

  return html`<div class=${`dropdown-big`}>
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
