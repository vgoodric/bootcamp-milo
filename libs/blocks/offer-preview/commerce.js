import { loadScript, createTag } from '../../utils/utils.js';
import { initTacocat, getTacocatEnv, loadTacocat } from '../merch/merch.js';

const decorateOfferDetails = (el, offer) => {
  // Create a new title element
  const title = document.createElement('h2');
  title.innerText = 'Offer details';

  // Create a new unordered list element
  const list = document.createElement('ul');

  // Add the offer details to the unordered list
  const offer = {
    'Type': offer.type,
    'Offer ID': offer.offerID,
    'Product Arrangement': offer.productArrangement,
    'Price Point': offer.pricePoint,
    'Customer Segment': offer.customerSegment,
    'Commitment': offer.commitment,
    'Term': offer.term,
    'Offer Type': offer.offerType,
    'OSI': offer.OSI
  };

  Object.entries(offer).forEach(([key, value]) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${key}:</strong> ${value}`;
    list.appendChild(li);
  });

  // Add the title and unordered list to the element
  el.appendChild(title);
  el.appendChild(list);
}

const handleSearch = (e, els) => {
  const search = e.target.value;
  loadTacocat();

  //mock offer object
  const offer = {
    type: 'Type 1',
    offerID: '123456',
    productArrangement: 'Product 1',
    pricePoint: 'Price 1',
    customerSegment: 'Segment 1',
    commitment: 'Commitment 1',
    term: 'Term 1',
    offerType: 'Type 2',
    OSI: 'OSI 1',
  };
  els.forEach((subject) => {
    if (subject.textContent.includes(search)) {
      subject.style.display = 'flex';
    } else {
      subject.style.display = 'none';
    }
  });
};

const decorateSearch = (el) => {
  const search = createTag('input', { class: 'locale-search', placeholder: 'Search offer' });
  const icon = createTag('div', { class: 'locale-search-icon' });
  const wrapper = createTag('div', { class: 'locale-search-wrapper' }, [search, icon]);
  const offerDetails = decorateOfferDetails();
  const list = createTag('ul', { class: 'locales' }, offerDetails);
  search.addEventListener('keyup', (e) => { handleSearch(e, offerDetails); });
  el.append(wrapper, list);
};

const decorateHeader = (el) => {
  const header = createTag('div', { class: 'sk-header' });
  const heading = createTag('span', null, 'Offer details');
  header.append(heading);
  el.append(header);
};

//To-Do: Add tacocat to the page and add the offer details to the page

function detectContext() {
  if (window.self === window.top) document.body.classList.add('in-page');
}

export default async function init(el) {
  detectContext();
  decorateHeader(el);
  decorateSearch(el);
}
