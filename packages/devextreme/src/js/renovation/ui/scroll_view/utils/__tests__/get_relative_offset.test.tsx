import { getRelativeOffset } from '../get_relative_offset';

describe('getRelativeOffset(targetElementClass, sourceElement)', () => {
  it('should return correct relative offset', () => {
    const targetElementClass = 'dx-scrollable-content';
    const targetElement = {
      getBoundingClientRect: () => ({
        left: -70,
        top: 20,
      }),
      classList: { contains: (elementClass) => elementClass === targetElementClass },
    } as any;

    const sourceEl = {
      getBoundingClientRect: () => ({
        left: 35,
        top: 125,
      }),
      offsetParent: targetElement,
      classList: { contains: () => false },
    } as any;

    expect(getRelativeOffset(targetElement, sourceEl)).toEqual({ left: 105, top: 105 });
  });

  it('should not cause any errors if element not have offsetParent', () => {
    const sourceEl = {
      getBoundingClientRect: () => ({
        left: 35,
        top: 125,
      }),
      classList: { contains: () => false },
    } as any;

    expect(getRelativeOffset.bind([({} as HTMLElement, sourceEl)])).not.toThrow();
    expect(getRelativeOffset('', sourceEl)).toEqual({
      top: 0,
      left: 0,
    });
  });

  // T162489
  it('should return correct relative offset with intermediate element', () => {
    const targetElement = {
      getBoundingClientRect: () => ({
        left: 8,
        top: 326,
      }),
      classList: { contains: () => true },
    } as any;

    const intermediateElement = {
      getBoundingClientRect: () => ({
        left: 8,
        top: 376,
      }),
      offsetParent: targetElement,
      classList: { contains: () => false },
    } as any;

    const sourceEl = {
      getBoundingClientRect: () => ({
        left: 8,
        top: 376,
      }),
      offsetParent: intermediateElement,
      classList: { contains: () => false },
    } as any;

    expect(getRelativeOffset(targetElement, sourceEl)).toEqual({ left: 0, top: 50 });
  });
});
