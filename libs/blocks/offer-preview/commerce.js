import { createTag, getConfig, getLocale } from '../../utils/utils.js';

const { locales } = getConfig();

const params = new URLSearchParams(window.location.search);
const referrer = params.get('referrer');
const owner = params.get('owner');
const repo = params.get('repo');

const formatJson = (json) => {
  const { pathname } = new URL(json.preview.url);
  const locale = getLocale(locales, pathname);
  const editHref = json.edit.url ? json.edit.url : '#';
  return {
    locale,
    pathname,
    edit: createTag('a', { class: `edit action status-${json.edit.status}`, href: editHref, target: '_blank', title: 'Edit' }, 'Edit'),
    preview: createTag('a', { class: `preview action status-${json.preview.status}`, href: json.preview.url, target: '_blank', title: 'Preview' }, 'Preview'),
    live: createTag('a', { class: `live action status-${json.live.status}`, href: json.live.url, target: '_blank', title: 'Live' }, 'Live'),
  };
};

const getDetails = async (path) => {
  const url = path
    ? `https://admin.hlx.page/status/${owner}/${repo}/main${path}?editUrl=auto`
    : `https://admin.hlx.page/status/${owner}/${repo}/main?editUrl=${referrer}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    return formatJson(json);
  } catch (e) {
    return false;
  }
};

const getStatus = async (li, localePath) => {
  const page = await getDetails(localePath);
  const actions = createTag('div', { class: 'actions' }, [page.edit, page.preview, page.live]);
  li.append(actions);
};

const decorateOfferDetails = (current) => {
  const currLocale = current.locale.prefix.replace('/', '');
  delete locales[currLocale];
  return Object.keys(locales).map((key) => {
    const prefix = key === '' ? key : `/${key}`;
    const localePath = currLocale === ''
      ? `/${key}${current.pathname}`
      : current.pathname.replace(current.locale.prefix, prefix);
    const li = createTag('li', { class: 'detail' }, `<span>${key || 'us'}</span>`);
    getStatus(li, localePath);
    return li;
  });
};

const handleSearch = (e, els) => {
  const search = e.target.value;
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

function detectContext() {
  if (window.self === window.top) document.body.classList.add('in-page');
}

export default async function init(el) {
  detectContext();
  decorateHeader(el);
  decorateSearch(el);
}
