import { readFile, sendKeys } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

function getMiddleOfElement(element) {
  const { x, y, width, height } = element.getBoundingClientRect();
  return {
    x: Math.floor(x + window.pageXOffset + width / 2),
    y: Math.floor(y + window.pageYOffset + height / 2),
  };
}

const { default: init } = await import('../../../libs/blocks/carousel/carousel.js');
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Carousel', () => {
  it('Carousel exsists', () => {
    const el = document.body.querySelector('.carousel');
    init(el);
    expect(el).to.exist;
  });

  it('Carousel has slides', () => {
    const slides = document.body.querySelectorAll('.carousel-slide');
    const activeSlide = slides[0].classList.contains('active');
    const slideIndicators = document.body.querySelectorAll('.carousel-indicator');
    const activeIndicator =  slideIndicators[0].classList.contains('active');

    expect(slides).to.exist;
    expect(activeSlide).to.be.true;
    expect(slideIndicators).to.exist;
    expect(activeIndicator).to.be.true;
  });

  it('Carousel has navigation buttons', () => {
    const nextButton = document.body.querySelector('.carousel-next');
    const previousButton = document.body.querySelector('.carousel-previous');
    const slideIndicators = document.body.querySelectorAll('.carousel-indicator');

    expect(nextButton).to.exist;
    expect(previousButton).to.exist;
    expect(slideIndicators).to.exist;
  });

  it('Clicks on next carousel button', () => {
    const nextButton = document.body.querySelector('.carousel-next');
    const slides = document.body.querySelectorAll('.carousel-slide');
    const slideIndicators = document.body.querySelectorAll('.carousel-indicator');
    
    nextButton.click();
    const activeSlide = slides[1].classList.contains('active');
    const activeIndicator =  slideIndicators[1].classList.contains('active');
    expect(activeSlide).to.be.true;
    expect(activeIndicator).to.be.true;
  });

  it('Keyboard navigation to go to next slide', async () => {
    const nextButton = document.body.querySelector('.carousel-next');
    const slides = document.body.querySelectorAll('.carousel-slide');
    const slideIndicators = document.body.querySelectorAll('.carousel-indicator');
    nextButton.focus();
    
    await sendKeys({ press: 'ArrowRight' });
    const activeSlide = slides[2].classList.contains('active');
    const activeIndicator =  slideIndicators[2].classList.contains('active');
    expect(activeSlide).to.be.true;
    expect(activeIndicator).to.be.true;
  });

  it('Carousel lightbox feature enabled', async () => {
    const el = document.body.querySelector('.carousel');
    const lightboxEnabled =  el.classList.contains('lightbox');
    const lightboxButton =  el.querySelector('.carousel-expand');
    console.log(lightboxButton);

    expect(lightboxEnabled).to.be.true;
    expect(lightboxButton).to.exist;
  });
});
