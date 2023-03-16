import { createTag } from '../../utils/utils.js';

export default async function init(el) {
  const params = new URL(document.location).searchParams;
  const results = params.get('results');
  if (!results) return;
  const experiences = JSON.parse(results);
  // eslint-disable-next-line no-restricted-syntax
  for (const href of experiences) {
    const a = createTag('a', { href });
    el.append(a);
    const { default: createFragment } = await import('../fragment/fragment.js');
    // eslint-disable-next-line no-await-in-loop
    await createFragment(a);
  }
  el.classList.add('show');
}
