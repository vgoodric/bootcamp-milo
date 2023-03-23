const loadScript = (url, type) => new Promise((resolve, reject) => {
  let script = document.querySelector(`head > script[src="${url}"]`);
  if (!script) {
    const { head } = document;
    script = document.createElement('script');
    script.setAttribute('src', url);
    if (type) {
      script.setAttribute('type', type);
    }
    head.append(script);
  }

  if (script.dataset.loaded) {
    resolve(script);
    return;
  }

  const onScript = (event) => {
    script.removeEventListener('load', onScript);
    script.removeEventListener('error', onScript);

    if (event.type === 'error') {
      reject(new Error(`error loading script: ${script.src}`));
    } else if (event.type === 'load') {
      script.dataset.loaded = true;
      resolve(script);
    }
  };

  script.addEventListener('load', onScript);
  script.addEventListener('error', onScript);
});

export default loadScript;
