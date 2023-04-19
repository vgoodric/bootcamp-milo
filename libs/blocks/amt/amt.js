import { getConfig, loadScript } from '../../utils/utils.js';

async function getMd(path) {
  const resp = await fetch(path);
  if (!resp.ok) return null;
  return resp.text();
}

export default async function init(el) {
  const config = getConfig();
  const base = config.miloLibs || config.codeRoot;

  await loadScript(`${base}/deps/amt/vs/loader.js`);

  require.config({ paths: { vs: `${base}/deps/amt/vs` } });

  window.require(['vs/editor/editor.main'], async () => {
    const diffEditor = window.monaco.editor.createDiffEditor(el);

    const originalMd = getMd('/libs/blocks/amt/original.md');
    const modifiedMd = getMd('/libs/blocks/amt/modified.md');

    Promise.all([originalMd, modifiedMd]).then((result) => {
      const original = window.monaco.editor.createModel(result[0], 'markdown');
      const modified = window.monaco.editor.createModel(result[1], 'markdown');
      diffEditor.setModel({ original, modified });
    });
  });
}
