document.addEventListener('seo-qa-tool', async (e) => {
  const { default: sendToCaaS } = await import('./seo-qa-tool.js');
  const {url} = e.detail;
  sendToCaaS({url});
});
