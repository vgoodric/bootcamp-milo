/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/notification-aside/notification-aside.js');
describe('notification-aside', () => {
  const notifyAsides = document.querySelectorAll('.notification-aside');
  notifyAsides.forEach((media) => init(media));

  describe('default notification aside large', () => {
    it('has a heading-L', () => {
      const heading = notifyAsides[0].querySelector('.heading-L');
      expect(heading).to.exist;
    });
    it('has a body-M', () => {
      const body = notifyAsides[0].querySelector('.body-M');
      expect(body).to.exist;
    });
  });

  describe('default notification aside medium', () => {
    it('has a heading-S', () => {
      const heading = notifyAsides[1].querySelector('.heading-S');
      expect(heading).to.exist;
    });
    it('has a body-S', () => {
      const body = notifyAsides[1].querySelector('.body-S');
      expect(body).to.exist;
    });
  });

  describe('default notification aside small', () => {
    it('has a body-M', () => {
      const body = notifyAsides[2].querySelector('.body-M');
      expect(body).to.exist;
    });
  });

  describe('default notification aside x-small', () => {
    it('has a body-M', () => {
      const body = notifyAsides[3].querySelector('.body-M');
      expect(body).to.exist;
    });
  });
});
