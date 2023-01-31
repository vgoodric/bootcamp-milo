import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import(
  '../../../libs/blocks/nala-dashboard/nala-dashboard.js'
);

describe('Nala Dashboard', () => {
  it('should exist', () => {
    const block = document.querySelector('.nala-dashboard');
    init(block);
    expect(block).to.exist;
  });
});
