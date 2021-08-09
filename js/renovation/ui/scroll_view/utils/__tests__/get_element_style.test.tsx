import {
  getElementOverflowX, getElementPaddingBottom, getElementTransform, getElementOverflowY,
} from '../get_element_style';
import { setWindow } from '../../../../../core/utils/window';

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
