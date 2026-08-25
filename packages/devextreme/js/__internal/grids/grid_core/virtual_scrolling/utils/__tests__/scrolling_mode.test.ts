import {
  describe, expect, it,
} from '@jest/globals';

import {
  isAppendMode, isVirtualMode, isVirtualPaging,
} from '../scrolling_mode';

const createController = (mode: string): { option: (name: string) => unknown } => ({
  option: (name: string): unknown => (name === 'scrolling.mode' ? mode : undefined),
});

describe('isVirtualMode', () => {
  it('should be true for the virtual scrolling mode', () => {
    expect(isVirtualMode(createController('virtual'))).toBe(true);
  });

  it('should be false for the infinite scrolling mode', () => {
    expect(isVirtualMode(createController('infinite'))).toBe(false);
  });

  it('should be false for the standard scrolling mode', () => {
    expect(isVirtualMode(createController('standard'))).toBe(false);
  });
});

describe('isAppendMode', () => {
  it('should be true for the infinite scrolling mode', () => {
    expect(isAppendMode(createController('infinite'))).toBe(true);
  });

  it('should be false for the virtual scrolling mode', () => {
    expect(isAppendMode(createController('virtual'))).toBe(false);
  });

  it('should be false for the standard scrolling mode', () => {
    expect(isAppendMode(createController('standard'))).toBe(false);
  });
});

describe('isVirtualPaging', () => {
  it('should be true for the virtual scrolling mode', () => {
    expect(isVirtualPaging(createController('virtual'))).toBe(true);
  });

  it('should be true for the infinite scrolling mode', () => {
    expect(isVirtualPaging(createController('infinite'))).toBe(true);
  });

  it('should be false for the standard scrolling mode', () => {
    expect(isVirtualPaging(createController('standard'))).toBe(false);
  });
});
