export default function loadFavicon(createTag, config, getMetadata) {
  const { codeRoot } = config;
  const name = getMetadata('favicon') || 'favicon';
  const favBase = `${codeRoot}/img/favicons/${name}`;
  document.head.querySelector('link[rel="icon"]').href = `${favBase}.svg`;
  const tags = [];
  tags.push(createTag('link', { rel: 'apple-touch-icon', sizes: '180x180', href: `${favBase}-180.png` }));
  tags.push(createTag('link', { rel: 'icon', href: `${favBase}.svg`, type: 'image/svg+xml' }));
  tags.push(createTag('link', { rel: 'manifest', href: `${favBase}.webmanifest` }));
  document.head.append(...tags);
}
