async function showModal(details) {
  const { getModal } = await import('../blocks/modal/modal.js');
  return getModal(null, { class: 'marquee', id: 'offer-modal', content: details, closeEvent: 'closeModal' });
}

export default async function loadOfferPoc(config, getMetadata, loadBlock) {
  const navPath = 'https://main--milo--adobecom.hlx.page/fragments/vhargrave/black-friday-modal';
  const resp = await fetch(`${navPath}`);
  if (!resp.ok) return;
  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const launchStartDate = getMetadata('launchstartdate', doc);
  const enddate = getMetadata('enddate', doc);
  const start = new Date(launchStartDate);
  const end = new Date(enddate);
  const currentDate = new Date();
  if (currentDate > start && currentDate < end) {
    const marquee = doc.body.querySelector('.marquee');
    loadBlock(marquee);
    showModal(marquee);
  }
}
