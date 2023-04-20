import { getConfig, loadScript, createTag } from '../../utils/utils.js';

const ORIG_PATH = '/drafts/cmillar/adobe-digital-experiences-case-study-de';
const MOD_PATH = '/drafts/cmillar/adobe-digital-experiences-case-study';

async function getMd(path) {
  const resp = await fetch(path);
  if (!resp.ok) return null;
  return resp.text();
}

async function handlePreview() {
  const opts = { method: 'POST' };
  const resp = await fetch(`https://admin.hlx.page/preview/adobecom/milo/main${ORIG_PATH}`, opts);
  if (!resp.ok) console.log('something went wrong');
  window.open(ORIG_PATH, '_blank');
}

function makeButton(area) {
  const button = createTag('button', { class: 'con-button blue' }, 'Preview');
  button.addEventListener('click', handlePreview);
  area.append(button);
}

export default async function init(el) {
  const titleArea = el.querySelector(':scope > div:first-of-type');
  const div = el.querySelector(':scope > div:last-of-type');
  div.classList.add('amt-monaco-wrapper');
  titleArea.classList.add('amt-title');
  makeButton(titleArea);

  const config = getConfig();
  const base = config.miloLibs || config.codeRoot;

  await loadScript(`${base}/deps/amt/vs/loader.js`);

  require.config({ paths: { vs: `${base}/deps/amt/vs` } });

  window.require(['vs/editor/editor.main'], async () => {
    const diffEditor = window.monaco.editor.createDiffEditor(div, { renderSideBySide: false });

    const originalMd = getMd(`${ORIG_PATH}.md`);
    const modifiedMd = getMd(`${MOD_PATH}.md`);

    Promise.all([originalMd, modifiedMd]).then((result) => {
      const original = window.monaco.editor.createModel(result[0], 'markdown');
      const modified = window.monaco.editor.createModel(result[1], 'markdown');
      diffEditor.setModel({ original, modified });
    });
  });
}
