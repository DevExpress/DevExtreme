import {
  getElementStyle,
  getElementOverflowX,
  getElementPaddingBottom,
  getElementTransform,
  getElementOverflowY,
} from '../get_element_style';
import { setWindow } from '../../../../../core/utils/window';

describe('getElementStyle', () => {
  it('element is not defined', () => {
    expect(getElementStyle(null)).toEqual(null);
  });

  it('hasWindow: false', () => {
    const el = {} as HTMLElement;
    setWindow({ }, false);
    expect(getElementStyle(el)).toEqual(null);
  });

  it('hasWindow: true, window.getComputedStyle: undefined', () => {
    const el = {} as HTMLElement;
    setWindow({ }, true);
    expect(getElementStyle(el)).toEqual(undefined);
  });

  it('hasWindow: true, window.getComputedStyle: { width: 120px }', () => {
    const el = {} as HTMLElement;
    setWindow({ getComputedStyle: () => ({ paddingBottom: '120px' }) }, true);
    expect(getElementStyle(el)).toEqual({ paddingBottom: '120px' });
  });
});

describe('getElementTransform', () => {
  it('element is not defined', () => {
    expect(getElementTransform(null)).toEqual('');
  });

  it('matrix(1, 0, 0, 1, 10, 20)', () => {
    const el = {} as HTMLElement;
    setWindow({ getComputedStyle: () => ({ transform: 'matrix(1, 0, 0, 1, 10, 20)' }) }, true);

    expect(getElementTransform(el)).toEqual('matrix(1, 0, 0, 1, 10, 20)');
  });
});

describe('getElementPaddingBottom', () => {
  it('element is not defined', () => {
    expect(getElementPaddingBottom(null)).toEqual(0);
  });

  it('paddingBottom: 5px', () => {
    const el = {} as HTMLElement;
    setWindow({ getComputedStyle: () => ({ paddingBottom: '5px' }) }, true);

    expect(getElementPaddingBottom(el)).toEqual(5);
  });
});

describe('getElementOverflowX', () => {
  it('element is not defined', () => {
    expect(getElementOverflowX(null)).toEqual('visible');
  });

  it('overflowX: hidden', () => {
    const el = {} as HTMLElement;
    setWindow({ getComputedStyle: () => ({ overflowX: 'hidden' }) }, true);

    expect(getElementOverflowX(el)).toEqual('hidden');
  });
});

describe('getElementOverflowY', () => {
  it('element is not defined', () => {
    expect(getElementOverflowX(null)).toEqual('visible');
  });

  it('overflowY: hidden', () => {
    const el = {} as HTMLElement;
    setWindow({ getComputedStyle: () => ({ overflowY: 'hidden' }) }, true);

    expect(getElementOverflowY(el)).toEqual('hidden');
  });
});
