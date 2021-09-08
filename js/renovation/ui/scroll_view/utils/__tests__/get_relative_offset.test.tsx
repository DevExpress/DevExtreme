import { getRelativeOffset } from '../get_relative_offset';

describe('getRelativeOffset(targetElement, sourceElement)', () => {
  it('should return correct relative offset', () => {
    const targetElement = {
      getBoundingClientRect: () => ({
        left: -70,
        top: 20,
      }),
    } as any;

    const sourceEl = {
      getBoundingClientRect: () => ({
        left: 35,
        top: 125,
      }),
      offsetParent: targetElement,
    } as any;

    expect(getRelativeOffset(targetElement, sourceEl)).toEqual({ left: 105, top: 105 });
  });

  // T162489
  it('should return correct relative offset with intermediate element', () => {
    const targetElement = {
      getBoundingClientRect: () => ({
        left: 8,
        top: 326,
      }),
    } as any;

    const intermediateElement = {
      getBoundingClientRect: () => ({
        left: 8,
        top: 376,
      }),
      offsetParent: targetElement,
    } as any;

    const sourceEl = {
      getBoundingClientRect: () => ({
        left: 8,
        top: 376,
      }),
      offsetParent: intermediateElement,
    } as any;

    expect(getRelativeOffset(targetElement, sourceEl)).toEqual({ left: 0, top: 50 });
  });
});
