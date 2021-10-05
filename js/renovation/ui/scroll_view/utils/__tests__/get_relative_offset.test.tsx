import { getRelativeOffset } from '../get_relative_offset';

describe('getRelativeOffset(targetElementClass, sourceElement)', () => {
  it('should return correct relative offset', () => {
    const targetElementClass = 'dx-scrollable-content';
    const targetElement = {
      offsetLeft: -70,
      offsetTop: 20,
      classList: { contains: (elementClass) => targetElementClass === elementClass },
    } as any;

    const sourceEl = {
      offsetLeft: 35,
      offsetTop: 125,
      offsetParent: targetElement,
      classList: { contains: () => false },
    } as any;

    expect(getRelativeOffset(targetElementClass, sourceEl)).toEqual({ left: 35, top: 125 });
  });

  it('should not cause any errors if element not have offsetParent', () => {
    const sourceEl = {
      offsetLeft: 35,
      offsetTop: 125,
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
    const targetElementClass = 'dx-scrollable-content';
    const targetElement = {
      offsetLeft: 25,
      offsetTop: 50,
      classList: { contains: () => true },
    } as any;

    const intermediateElement = {
      offsetLeft: 30,
      offsetTop: 36,
      offsetParent: targetElement,
      classList: { contains: () => false },
    } as any;

    const sourceEl = {
      offsetLeft: 0,
      offsetTop: 0,
      offsetParent: intermediateElement,
      classList: { contains: () => false },
    } as any;

    expect(getRelativeOffset(targetElementClass, sourceEl)).toEqual({ left: 30, top: 36 });
  });
});
