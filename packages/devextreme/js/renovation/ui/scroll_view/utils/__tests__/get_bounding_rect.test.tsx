import { getBoundingRect } from '../get_bounding_rect';

describe('getBoundingRect(element)', () => {
  const defaultBoundingRectValue = {
    width: 0,
    height: 0,
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  };

  it('element is null', () => {
    const element = null;

    expect(getBoundingRect(element)).toEqual(defaultBoundingRectValue);
  });

  it('element is undefined', () => {
    const element = undefined;

    expect(getBoundingRect(element)).toEqual(defaultBoundingRectValue);
  });

  it('element is defined', () => {
    const clientRectValue = {
      width: 10,
      height: 10,
      bottom: 45,
      top: 35,
      left: 26,
      right: 16,
    };

    const element = {
      getBoundingClientRect: () => clientRectValue,
    } as any;

    expect(getBoundingRect(element)).toEqual(clientRectValue);
  });

  it('element is object, getBoundingClientRect is not a function', () => {
    const element = { } as any;

    expect(getBoundingRect(element)).toEqual(defaultBoundingRectValue);
  });
});
