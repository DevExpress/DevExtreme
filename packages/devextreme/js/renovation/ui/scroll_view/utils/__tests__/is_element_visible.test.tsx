import each from 'jest-each';
import { isElementVisible } from '../is_element_visible';

describe('isElementVisible(element)', () => {
  it('element is null', () => {
    const element = null;

    expect(isElementVisible(element)).toEqual(false);
  });

  it('element is undefined', () => {
    const element = undefined;

    expect(isElementVisible(element)).toEqual(false);
  });

  each([undefined, 0]).describe('offsetWidth: %o', (offsetWidth) => {
    each([undefined, 0]).describe('offsetWidth: %o', (offsetHeight) => {
      it('element is defined, offsetWidth: undefined, offsetHeight: undefined, element.getClientRects is not a function', () => {
        const element = {
          offsetWidth,
          offsetHeight,
          getClientRects: undefined,
        } as any;

        expect(isElementVisible(element)).toEqual(false);
      });
    });
  });

  it('element is defined, offsetWidth: 1, offsetHeight: undefined, element.getClientRects is not a function', () => {
    const element = {
      offsetWidth: 1,
      offsetHeight: 0,
      getClientRects: undefined,
    } as any;

    expect(isElementVisible(element)).toEqual(true);
  });

  it('element is defined, offsetWidth: undefined, offsetHeight: 1, element.getClientRects is not a function', () => {
    const element = {
      offsetWidth: undefined,
      offsetHeight: 1,
      getClientRects: undefined,
    } as any;

    expect(isElementVisible(element)).toEqual(true);
  });

  it('element is defined, offsetWidth: undefined, offsetHeight: undefined, element.getClientRects().length: 1', () => {
    const element = {
      offsetWidth: undefined,
      offsetHeight: undefined,
      getClientRects: () => ({ length: 1 }),
    } as any;

    expect(isElementVisible(element)).toEqual(true);
  });

  it('element is defined, offsetWidth: undefined, offsetHeight: undefined, element.getClientRects().length: 0', () => {
    const element = {
      offsetWidth: undefined,
      offsetHeight: undefined,
      getClientRects: () => ({ length: 0 }),
    } as any;

    expect(isElementVisible(element)).toEqual(false);
  });
});
