export default function init(el) {
  const image = el.querySelector('img');
  const imgArea = image.closest('div');
  imgArea.classList.add('image-area');
  imgArea.parentElement.classList.add('foreground-container');
}
