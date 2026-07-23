import { describe, expect, it } from '@jest/globals';

import { getMaxHorizontalScrollOffset } from '../utils';

const createContainerMock = (
  scrollWidth: number,
  clientWidth: number,
): HTMLElement => ({ scrollWidth, clientWidth } as HTMLElement);

describe('getMaxHorizontalScrollOffset', () => {
  it('returns 0 when the container is not defined', () => {
    expect(getMaxHorizontalScrollOffset(undefined)).toBe(0);
  });

  it('returns the difference between the scroll width and the client width', () => {
    const container = createContainerMock(2000, 995);

    expect(getMaxHorizontalScrollOffset(container)).toBe(1005);
  });

  it('returns 0 when the content does not overflow the container', () => {
    const container = createContainerMock(1000, 1000);

    expect(getMaxHorizontalScrollOffset(container)).toBe(0);
  });

  it('rounds the result', () => {
    const container = createContainerMock(2000.4, 995);

    expect(getMaxHorizontalScrollOffset(container)).toBe(1005);
  });
});
