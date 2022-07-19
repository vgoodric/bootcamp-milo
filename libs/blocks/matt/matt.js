export default function init(el) {
  const img = el.querySelector('img');
  const imgContainer = img.closest('div');
  imgContainer.classList.add('img-container');
  imgContainer.parentElement.classList.add('content-container');
}
