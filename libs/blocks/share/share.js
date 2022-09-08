import { createTag, getConfig } from '../../utils/utils.js';

export default async function decorate(el) {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;

  const resp = await fetch(`${base}/blocks/share/share.svg`);
  if (!resp.ok) return;
  const text = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'image/svg+xml');
  console.log(doc.querySelector('#facebook'));


  // $block.innerHTML = /* HTML */ `
  //   <div>
  //     <p>Share this page:</p>
  //     <p class="icon-container">
  //       <svg class="icon icon-facebook" fill="currentColor"><use href="${base}/blocks/share/share.svg#facebook"></use></svg>
  //       <svg class="icon icon-twitter" fill="currentColor"><use href="${base}/blocks/share/share.svg#twitter"></use></svg>
  //       <svg class="icon icon-linkedin" fill="currentColor"><use href="${base}/blocks/share/share.svg#linkedin"></use></svg>
  //       <svg class="icon icon-pinterest" fill="currentColor"><use href="${base}/blocks/share/share.svg#pinterest"></use></svg>
  //     </p>
  //   </div>
  // `;
  // const $inlineSVGicons = Array.from($block.querySelectorAll('svg.icon'));
  // $inlineSVGicons.forEach(($icon) => {
  //   const url = encodeURIComponent(window.location.href);
  //   let link = null;
  //   if ($icon.classList.contains('icon-facebook')) {
  //     link = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  //   } else if ($icon.classList.contains('icon-linkedin')) {
  //     link = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  //   } else if ($icon.classList.contains('icon-twitter')) {
  //     link = `https://twitter.com/share?&url=${url}`;
  //   } else if ($icon.classList.contains('icon-pinterest')) {
  //     link = `https://pinterest.com/pin/create/button/?url=${url}`;
  //   } else {
  //     $icon.remove();
  //   }
  //   if (link) {
  //     const $link = createTag('a', { target: '_blank', href: link });
  //     $link.addEventListener('click', () => {
  //       window.open($link.href, 'newwindow', 'width=600, height=400');
  //     });
  //     $icon.parentNode.replaceChild($link, $icon);
  //     $link.append($icon);
  //   }
  // });
}
