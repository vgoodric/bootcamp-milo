document.addEventListener('seo-qa-tool', async (e) => {
  const { default: seaQaTool } = await import('./seo-qa-tool.js');
  const {url} = e.detail;
  seaQaTool({url});
});
