export function decorateBlockAnalytics(blockEl) {
  const lh = [];
  const exclude = ['--', 'block'];
  blockEl.classList.forEach((c) => {
    if (!c.includes(exclude[0]) && c !== exclude[1]) lh.push(c);
  });
  blockEl.setAttribute('daa-im', 'true');
  blockEl.setAttribute('daa-lh', lh.join('|'));
}

export function decorateLinkAnalytics(textEl, headings) {
  const headingText = [...headings].map((heading) => heading.textContent);
  textEl.setAttribute('daa-lh', headingText.join('|'));
  const links = textEl.querySelectorAll('a, button');
  links.forEach((link, i) => {
    let linkType = 'link';
    const { classList } = link;
    if (classList.contains('con-button') && classList.contains('blue')) { linkType = 'filled'; }
    if (classList.contains('con-button') && classList.contains('outline')) { linkType = 'outline'; }
    const str = `${linkType}|${link.innerText} ${i + 1}`;
    link.setAttribute('daa-ll', str);
  });
}
