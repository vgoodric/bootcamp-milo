export default function loadFavicon(createTag, config, getMetadata) {
  const { codeRoot } = config;
  const name = getMetadata('favicon') || 'favicon';
  const favBase = `${codeRoot}/img/favicons/${name}`;

  const favicon = document.head.querySelector('link[rel="icon"]');
  favicon.setAttribute('type', 'image/svg+xml');
  favicon.href = `${favBase}.svg`;

  const tags = [
    createTag('link', { rel: 'apple-touch-icon', sizes: '180x180', href: `${favBase}-180.png` }),
    createTag('link', { rel: 'mask-icon', sizes: '180x180', href: `${favBase}-mask.svg`, color: '#ff1693' }),
    createTag('link', { rel: 'manifest', href: `${favBase}.webmanifest` }),
  ];
  document.head.append(...tags);
}


// <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff1693">
