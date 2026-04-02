import { describe, expect, it } from '@jest/globals';

import { shouldCancelDragging } from './utils';

describe('shouldCancelDragging', () => {
  it('should return false when field is undefined', () => {
    expect(shouldCancelDragging(undefined, 'column')).toBe(false);
    expect(shouldCancelDragging(undefined, 'row')).toBe(false);
    expect(shouldCancelDragging(undefined, 'filter')).toBe(false);
    expect(shouldCancelDragging(undefined, 'data')).toBe(false);
  });

  it('should return true when isMeasure is true and target is column', () => {
    expect(shouldCancelDragging({ isMeasure: true }, 'column')).toBe(true);
  });

  it('should return true when isMeasure is true and target is row', () => {
    expect(shouldCancelDragging({ isMeasure: true }, 'row')).toBe(true);
  });

  it('should return true when isMeasure is true and target is filter', () => {
    expect(shouldCancelDragging({ isMeasure: true }, 'filter')).toBe(true);
  });

  it('should return false when isMeasure is true and target is data', () => {
    expect(shouldCancelDragging({ isMeasure: true }, 'data')).toBe(false);
  });

  it('should return true when isMeasure is false and target is data', () => {
    expect(shouldCancelDragging({ isMeasure: false }, 'data')).toBe(true);
  });

  it('should return false when isMeasure is false and target is column', () => {
    expect(shouldCancelDragging({ isMeasure: false }, 'column')).toBe(false);
  });

  it('should return false when isMeasure is undefined', () => {
    expect(shouldCancelDragging({}, 'data')).toBe(false);
    expect(shouldCancelDragging({}, 'column')).toBe(false);
  });
});
