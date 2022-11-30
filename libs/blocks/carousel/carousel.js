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
const KEY_CODES = {
  SPACE: 'Space',
  END: 'End',
  HOME: 'Home',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_UP: 'ArrowUp',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_DOWN: 'ArrowDown',
};

// function getCarouselProps(props) {
//   // Create an object of carousel properties to pass on
//   return props;
// }

function decorateNextPreviousBtns() {
  const btnsArray = [];
  const previousBtn = createTag(
    'button', 
    { 
      class: 'carousel-button carousel-previous',
      'aria-label': 'Previous',
      'data-toggle': 'previous',
    },
    ARROW_PREVIOUS_IMG
  );

  const nextBtn = createTag(
    'button', 
    { 
      class: 'carousel-button carousel-next',
      'aria-label': 'Next',
      'data-toggle': 'next',
    },
    ARROW_NEXT_IMG
  );

  btnsArray.push(previousBtn, nextBtn);
  return btnsArray;
}

function decorateSlideIndicators(slides) {
  const indicatorDots = [];

  slides.forEach((li, idx) => {
    li = createTag('li', {
      class: 'carousel-indicator',
      role: 'tab',
      tabindex: -1,
      'data-index': idx,
      'aria-selected': false,
      'aria-labelledby': `Viewing Slide ${idx + 1}`,
    });

    // Inital active state
    if (idx === 0) {
      li.classList.add('active');
      li.setAttribute('tabindex', 0);
    }
    indicatorDots.push(li)
  });
  return indicatorDots;
}

function handleNext(nextElement, elements) {
  if (nextElement.nextElementSibling) {
    return nextElement.nextElementSibling;
  } else {
    // The last nextElementSibiling returns false
    nextElement = elements[0];
    return nextElement;
  }
};

function handlePrevious(previousElment, elements) {
  if (previousElment.previousElementSibling) {
    return previousElment.previousElementSibling;
  } else {
    previousElment = elements[elements.length - 1];
    return previousElment;
  }
};

function moveSlides(event, slideContainer, slides, nextPreviousBtns, slideIndicators, controlsContainer) {
  // console.log('currentTarget, eventCode', event.currentTarget, event.code);
  let referenceSlide = slideContainer.querySelector('.reference-slide');
  let slideIndex = controlsContainer.querySelector('.active');
  
  // Check if reference slide has been set
  if (!referenceSlide) {
    slides[slides.length - 1].classList.add('reference-slide');
    slides[slides.length - 1].style.order = '-1';
    // track reference slide
    referenceSlide = slides[slides.length - 1];
  }
  
  // Remove class after being tracked
  referenceSlide.classList.remove('reference-slide');
  referenceSlide.style.order = null;
  slideIndex.classList.remove('active');
  slideIndex.setAttribute('tabindex', -1);

  // Update reference slide
  if ((event.currentTarget).dataset.toggle === 'next' 
    || event.key === KEY_CODES.ARROW_RIGHT
    || event.key === KEY_CODES.ARROW_DOWN) {
      nextPreviousBtns[1].focus();
      referenceSlide = handleNext(referenceSlide, slides);
      slideIndex = handleNext(slideIndex, slideIndicators);
      slideContainer?.classList.remove('is-reversing');
  } 
  if ((event.currentTarget).dataset.toggle === 'previous' 
    || event.key === KEY_CODES.ARROW_LEFT
    || event.key === KEY_CODES.ARROW_UP) {
      nextPreviousBtns[0].focus();
      referenceSlide = handlePrevious(referenceSlide, slides);
      slideIndex = handlePrevious(slideIndex, slideIndicators);
      slideContainer.classList.add('is-reversing');
  }
  referenceSlide.classList.add('reference-slide');
  referenceSlide.style.order = '-1';

  // Hanlde slide indicator
  slideIndex.classList.add('active');
  slideIndex.setAttribute('tabindex', 0);

  // Loop over all siblings and update their order
  let i, j, ref;
  for(
      i = j = 2, ref = slides.length;
      2 <= ref ? j <= ref : j >= ref;
      i = 2 <= ref ? ++j : --j
  ) {
      referenceSlide = handleNext(referenceSlide, slides);
      referenceSlide.style.order = i;
  }

  /*
   * Activates slide animation.
   * Delay time matches animation time
  */
  slideContainer.classList.remove('is-ready');
  return setTimeout(function () {
    return slideContainer.classList.add('is-ready');
  }, 60);
}

function handleNextPreviousEvents(element, nextPreviousBtns, slideContainer, slides, slideIndicators, controlsContainer) {
  // Handle Next/Previous Buttons
  Array.from(nextPreviousBtns).forEach(function(btn) {
    btn.addEventListener('click',  function (event) {
      moveSlides(event, slideContainer, slides, nextPreviousBtns,slideIndicators, controlsContainer);
    });
  });

  // Handle keyboard navigation
  element.addEventListener('keydown', (event) => {
    // onKeyDown(event, slideContainer, slides);
    // console.log(event.key);
    if(event.key === KEY_CODES.ARROW_RIGHT
      || event.key === KEY_CODES.ARROW_LEFT
      || event.key === KEY_CODES.ARROW_UP
      || event.key === KEY_CODES.ARROW_DOWN)
    moveSlides(event, slideContainer, slides, nextPreviousBtns, slideIndicators, controlsContainer);
  });

  // Handle slide indictors
  Array.from(slideIndicators).forEach(function(li) {
    li.addEventListener('click',  function (event) {
      console.log('slide indicator', li)
      // moveSlides(event, slideContainer, slides, nextPreviousBtns, slideIndicators);
    });
  });
}

export default function init(el) {
  const carouselSection = el.closest('.section');
  if (!carouselSection) return;

  const keyDivs = el.querySelectorAll(':scope > div > div:first-child');
  const carouselName = keyDivs[0].textContent;
  // const timer = getCarouselProps(keyDivs);
  // console.log('timer', timer);

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
  const slideContainer = createTag('div', { class: 'carousel-slides' }, fragment);

  el.replaceChildren(slideContainer);

  const dotsUl = createTag('ul',{ 
    class: 'carousel-indicators',
    role: 'tablist',
    tabindex: 0,
  });
  dotsUl.append(...slideIndicators);
  controlsContainer.append(dotsUl);

  el.append(...nextPreviousBtns, controlsContainer);

  parentArea.addEventListener('milo:deferred', (e) => {
    const images = el.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.removeAttribute('loading');
    });
  });

  handleNextPreviousEvents(el, nextPreviousBtns, slideContainer, slides, slideIndicators, controlsContainer);
}
