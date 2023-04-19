import { getConfig, loadScript } from '../../utils/utils.js';

export default async function init(el) {
  const config = getConfig();
  const base = config.miloLibs || config.codeRoot;

  await loadScript(`${base}/deps/amt/vs/loader.js`);

  require.config({ paths: { vs: `${base}/deps/amt/vs` } });

  require([`vs/editor/editor.main`], async function () {

    var diffEditor = monaco.editor.createDiffEditor(el);

    Promise.all([xhr('/libs/blocks/amt/original.md'), xhr('/libs/blocks/amt/modified.md')]).then(function (r) {
      var originalTxt = r[0].responseText;
      var modifiedTxt = r[1].responseText;

      diffEditor.setModel({
        original: monaco.editor.createModel(originalTxt, 'javascript'),
        modified: monaco.editor.createModel(modifiedTxt, 'javascript')
      });
    });
  });

  function xhr(url) {
    var req = null;
    return new Promise(
      function (c, e) {
        req = new XMLHttpRequest();
        req.onreadystatechange = function () {
          if (req._canceled) {
            return;
          }

          if (req.readyState === 4) {
            if ((req.status >= 200 && req.status < 300) || req.status === 1223) {
              c(req);
            } else {
              e(req);
            }
            req.onreadystatechange = function () {};
          }
        };

        req.open('GET', url, true);
        req.responseType = '';

        req.send(null);
      },
      function () {
        req._canceled = true;
        req.abort();
      }
    );
  }

}