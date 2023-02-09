import { createTag } from '../../utils/utils.js';

const DEFAULT_TYPE = 'select';

function readOptions(el) {
  const list = el.getElementsByTagName('li');
  
  let options = [];
  for (const option of list) {
    options.push(option.textContent);
  }

  return options;
}

function renderOptions(el, options, name, type) {
  const wrapper = createTag('div', { class: `options ${name}` });

  switch (type) {
    case 'radio':
    case 'checkbox':
      options.forEach(option => {
        const id = option.toLowerCase();
        const radioOrCheck = createTag('input', { type, id, name, value: option });
        const label = createTag('label', { for: id }, radioOrCheck)

        label.append(option);
        wrapper.appendChild(label);
      });
      break;

    case 'select':
      const select = createTag('select', { name, id: name });
      options.forEach(option => {
        const o = createTag('option', { value: option }, option);
        select.appendChild(o);
      });

      wrapper.appendChild(select);
      break;
  }

  el.insertAdjacentElement('afterend', wrapper);
  el.parentNode.removeChild(el);
}

export default function init(el) {
  const name = el.classList[1];
  const type = el.classList[2] || DEFAULT_TYPE;

  const options = readOptions(el);
  renderOptions(el, options, name, type);
}
