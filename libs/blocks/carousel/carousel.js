/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/*
 * Carousel - v1.0.0
 */
import { createTag, getConfig } from '../../utils/utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

const ARROW_NEXT_IMG = `<img class="next-icon" alt="Next icon" src="${base}/blocks/carousel/arrow.svg" height="10" width="16">`;
const ARROW_PREVIOUS_IMG = `<img class="previous-icon" alt="Previous icon" src="${base}/blocks/carousel/arrow.svg" height="10" width="16">`;
const LIGHTBOX_ICON = `<img class="expand-icon" alt="Expand carousel to full screen" src="${base}/blocks/carousel/expand.svg" height="14" width="20">`;
const CLOSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <g transform="translate(-10500 3403)">
    <circle cx="10" cy="10" r="10" transform="translate(10500 -3403)" fill="#707070"/>
    <line y1="8" x2="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
    <line x1="8" y1="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
  </g>
</svg>`;
// const SWIPE_PROPS = { event: '', direction: '' };
const KEY_CODES = {
  SPACE: 'Space',
  END: 'End',
  HOME: 'Home',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
};

function decorateNextPreviousBtns() {
  const btnsArray = [];
  const previousBtn = createTag(
    'button',
    {
      class: 'carousel-button carousel-previous',
      'aria-label': 'Previous',
      'data-toggle': 'previous',
    },
    ARROW_PREVIOUS_IMG,
  );

  const nextBtn = createTag(
    'button',
    {
      class: 'carousel-button carousel-next',
      'aria-label': 'Next',
      'data-toggle': 'next',
    },
    ARROW_NEXT_IMG,
  );

  btnsArray.push(previousBtn, nextBtn);
  return btnsArray;
}

function decorateLightboxButtons() {
  const btnsArray = [];
  const expandBtn = createTag(
    'button',
    {
      class: 'lightbox-button carousel-expand',
      'aria-label': 'Open in full screen',
    },
    LIGHTBOX_ICON,
  );
  const closeBtn = createTag(
    'button',
    {
      class: 'lightbox-button carousel-close',
      'aria-label': 'Close full screen carousel',
    },
    CLOSE_ICON,
  );
  btnsArray.push(expandBtn, closeBtn);
  return btnsArray;
}

function decorateSlideIndicators(slides) {
  const indicatorDots = [];

  for (let i = 0; i < slides.length; i += 1) {
    const li = createTag('li', {
      class: 'carousel-indicator',
      role: 'tab',
      tabindex: -1,
      'data-index': i,
      'aria-selected': false,
      'aria-labelledby': `Viewing Slide ${i + 1}`,
    });

    // Set inital active state
    if (i === 0) {
      li.classList.add('active');
      li.setAttribute('tabindex', 0);
    }
    indicatorDots.push(li);
  }
  return indicatorDots;
}

function handleNext(nextElement, elements) {
  if (nextElement.nextElementSibling) {
    return nextElement.nextElementSibling;
  }
  return elements[0];
}

function handlePrevious(previousElment, elements) {
  if (previousElment.previousElementSibling) {
    return previousElment.previousElementSibling;
  }
  return elements[elements.length - 1];
}

function handleLightboxButtons(lightboxBtns, el, slideWrapper) {
  const curtain = createTag('div', { class: 'carousel-curtain' });

  [...lightboxBtns].forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (button.classList.contains('carousel-expand')) {
        el.classList.add('lightbox-active');
        slideWrapper.append(curtain);
      }

      if (button.classList.contains('carousel-close')) {
        el.classList.remove('lightbox-active');
        curtain.remove();
      }
    }, true);
  });

  // Handle click outside of Carousel
  curtain.addEventListener('click', (event) => {
    event.preventDefault();
    el.classList.remove('lightbox-active');
    curtain.remove();
  }, true);
}

function jumpToDirection(activeSlideIndex, jumpToIndex, slideContainer) {
  if (activeSlideIndex < jumpToIndex) {
    slideContainer.classList.remove('is-reversing');
  } else {
    slideContainer.classList.add('is-reversing');
  }
}

function moveSlides(event, carouselElements, jumpToIndex) {
  const {
    slideContainer,
    slides,
    nextPreviousBtns,
    slideIndicators,
    controlsContainer,
    direction,
  } = carouselElements;

  let referenceSlide = slideContainer.querySelector('.reference-slide');
  let activeSlide = slideContainer.querySelector('.active');
  let activeSlideIndicator = controlsContainer.querySelector('.active');
  const activeSlideIndex = activeSlideIndicator.dataset.index;

  if (!referenceSlide) {
    slides[slides.length - 1].classList.add('reference-slide');
    slides[slides.length - 1].style.order = '1';
    // track reference slide - last slide initially
    referenceSlide = slides[slides.length - 1];
  }

  // Remove class/attributes after being tracked
  referenceSlide.classList.remove('reference-slide');
  referenceSlide.style.order = null;
  activeSlide.classList.remove('active');
  activeSlideIndicator.classList.remove('active');
  activeSlideIndicator.setAttribute('tabindex', -1);

  /*
   * If jumpto buttons are clicked
   * update reference slide, indicator dot, and active slide
  */
  if (jumpToIndex >= 0) {
    if (jumpToIndex === 0) {
      slides[slides.length - 1].classList.add('reference-slide');
      slides[slides.length - 1].style.order = '1';
      referenceSlide = slides[slides.length - 1];
      activeSlideIndicator = slideIndicators[jumpToIndex];
      activeSlide = slides[jumpToIndex];
      jumpToDirection(activeSlideIndex, jumpToIndex, slideContainer);
    } else if (jumpToIndex === slides.length - 1) {
      slides[slides.length - 2].classList.add('reference-slide');
      slides[slides.length - 2].style.order = '1';
      referenceSlide = slides[slides.length - 2];
      activeSlideIndicator = slideIndicators[jumpToIndex];
      activeSlide = slides[jumpToIndex];
      jumpToDirection(activeSlideIndex, jumpToIndex, slideContainer);
    } else {
      slides[jumpToIndex - 1].classList.add('reference-slide');
      slides[jumpToIndex - 1].style.order = '1';
      referenceSlide = slides[jumpToIndex - 1];
      activeSlideIndicator = slideIndicators[jumpToIndex];
      activeSlide = slides[jumpToIndex];
      jumpToDirection(activeSlideIndex, jumpToIndex, slideContainer);
    }
  }

  // Next arrow button, swipe, keyboard navigation
  if ((event.currentTarget).dataset.toggle === 'next'
    || event.key === KEY_CODES.ARROW_RIGHT
    || (direction === 'left' && event.type === 'touchend')) {
    nextPreviousBtns[1].focus();
    referenceSlide = handleNext(referenceSlide, slides);
    activeSlideIndicator = handleNext(activeSlideIndicator, slideIndicators);
    activeSlide = handleNext(activeSlide, slides);
    slideContainer?.classList.remove('is-reversing');
  }

  // Previous arrow button, swipe, keyboard navigation
  if ((event.currentTarget).dataset.toggle === 'previous'
    || event.key === KEY_CODES.ARROW_LEFT
    || (direction === 'right' && event.type === 'touchend')) {
    nextPreviousBtns[0].focus();
    referenceSlide = handlePrevious(referenceSlide, slides);
    activeSlideIndicator = handlePrevious(activeSlideIndicator, slideIndicators);
    activeSlide = handlePrevious(activeSlide, slides);
    slideContainer.classList.add('is-reversing');
  }

  // Update reference slide attributes
  referenceSlide.classList.add('reference-slide');
  referenceSlide.style.order = '1';

  // Update active slide and indicator dot attributes
  activeSlide.classList.add('active');
  activeSlideIndicator.classList.add('active');
  activeSlideIndicator.setAttribute('tabindex', 0);

  // Loop over all slide siblings to update their order
  for (let i = 2; i <= slides.length; i += 1) {
    referenceSlide = handleNext(referenceSlide, slides);
    referenceSlide.style.order = i;
  }

  /*
   * Activates slide animation.
   * Delay time matches animation time
  */
  slideContainer.classList.remove('is-ready');
  return setTimeout(() => slideContainer.classList.add('is-ready'), 60);
}

const getSwipeDistance = (start, end) => {
  if (end === 0) {
    const updateStart = 0;
    return Math.abs(updateStart - end);
  }
  return Math.abs(start - end);
};

const getSwipeDirection = (swipe, swipeDistance) => {
  const { xDistance } = swipeDistance;

  if (xDistance !== swipe.xStart && xDistance > swipe.xMin) {
    return (swipe.xEnd > swipe.xStart) ? 'right' : 'left';
  }
  return undefined;
};

/**
  * Mobile swipe/touch direction detection
  */
function mobileSwipeDetect(carouselElements) {
  const { el } = carouselElements;
  const swipe = { xMin: 50 };

  el.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    swipe.xStart = touch.screenX;
  });

  el.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    swipe.xEnd = touch.screenX;
  });

  el.addEventListener('touchend', (event) => {
    const swipeDistance = {};
    swipeDistance.xDistance = getSwipeDistance(swipe.xStart, swipe.xEnd);
    carouselElements.direction = getSwipeDirection(swipe, swipeDistance);

    // reset end swipe values
    swipe.xStart = 0;
    swipe.xEnd = 0;

    if (swipeDistance.xDistance > swipe.xMin) {
      moveSlides(event, carouselElements);
    }
  });
}

function handleChangingSlides(carouselElements) {
  const { el, nextPreviousBtns, slideIndicators } = carouselElements;

  // Handle Next/Previous Buttons
  [...nextPreviousBtns].forEach((btn) => {
    btn.addEventListener('click', (event) => {
      moveSlides(event, carouselElements);
    });
  });

  // Handle keyboard navigation
  el.addEventListener('keydown', (event) => {
    if (event.key === KEY_CODES.ARROW_RIGHT
      || event.key === KEY_CODES.ARROW_LEFT) { moveSlides(event, carouselElements); }
  });

  // Handle slide indictors
  [...slideIndicators].forEach((li) => {
    li.addEventListener('click', (event) => {
      const jumpToIndex = Number(li.dataset.index);
      moveSlides(event, carouselElements, jumpToIndex);
    });
  });

  // Swipe Events
  mobileSwipeDetect(carouselElements);
}

export default function init(el) {
  const carouselSection = el.closest('.section');
  if (!carouselSection) return;

  const keyDivs = el.querySelectorAll(':scope > div > div:first-child');
  const carouselName = keyDivs[0].textContent;
  const parentArea = el.closest('.fragment') || document;
  const candidateKeys = parentArea.querySelectorAll('div.section-metadata > div > div:first-child');
  const slides = [...candidateKeys].reduce((rdx, key) => {
    if (key.textContent === 'carousel' && key.nextElementSibling.textContent === carouselName) {
      const slide = key.closest('.section');
      slide.classList.add('carousel-slide');
      rdx.push(slide);
      slide.setAttribute('data-index', rdx.indexOf(slide));
    }
    return rdx;
  }, []);

  const fragment = new DocumentFragment();
  const nextPreviousBtns = decorateNextPreviousBtns();
  const slideIndicators = decorateSlideIndicators(slides);
  const controlsContainer = createTag('div', { class: 'carousel-controls' });

  fragment.append(...slides);
  const slideWrapper = createTag('div', { class: 'carousel-wrapper' });
  const slideContainer = createTag('div', { class: 'carousel-slides' }, fragment);
  const carouselElements = {
    el,
    nextPreviousBtns,
    slideContainer,
    slides,
    slideIndicators,
    controlsContainer,
    direction: undefined,
  };

  if (el.classList.contains('lightbox')) {
    const lightboxBtns = decorateLightboxButtons();
    slideWrapper.append(slideContainer, ...lightboxBtns);
    handleLightboxButtons(lightboxBtns, el, slideWrapper);
  } else {
    slideWrapper.append(slideContainer);
  }

  el.textContent = '';
  el.append(slideWrapper);

  const dotsUl = createTag('ul', {
    class: 'carousel-indicators',
    role: 'tablist',
    tabindex: 0,
  });
  dotsUl.append(...slideIndicators);
  controlsContainer.append(dotsUl);

  el.append(...nextPreviousBtns, controlsContainer);

  parentArea.addEventListener('milo:deferred', () => {
    const images = el.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.removeAttribute('loading');
    });
  });

  slides[0].classList.add('active');
  handleChangingSlides(carouselElements);
}
