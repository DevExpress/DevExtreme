import {
  describe, expect, it,
} from '@jest/globals';

import {
  isInfiniteMode, isStandardMode, isVirtualMode, isVirtualPaging, isVirtualRowRendering,
} from '../scrolling_mode';

describe('isStandardMode', () => {
  it('should be true for the standard scrolling mode', () => {
    expect(isStandardMode({ mode: 'standard' })).toBe(true);
  });

  it('should be false for the virtual scrolling mode', () => {
    expect(isStandardMode({ mode: 'virtual' })).toBe(false);
  });

  it('should be false for the infinite scrolling mode', () => {
    expect(isStandardMode({ mode: 'infinite' })).toBe(false);
  });

  it('should be false when the scrolling mode is not set', () => {
    expect(isStandardMode({})).toBe(false);
  });

  it('should be false when there are no scrolling options', () => {
    expect(isStandardMode(undefined)).toBe(false);
  });
});

describe('isVirtualMode', () => {
  it('should be true for the virtual scrolling mode', () => {
    expect(isVirtualMode({ mode: 'virtual' })).toBe(true);
  });

  it('should be false for the infinite scrolling mode', () => {
    expect(isVirtualMode({ mode: 'infinite' })).toBe(false);
  });

  it('should be false for the standard scrolling mode', () => {
    expect(isVirtualMode({ mode: 'standard' })).toBe(false);
  });

  it('should be false when there are no scrolling options', () => {
    expect(isVirtualMode(undefined)).toBe(false);
  });
});

describe('isInfiniteMode', () => {
  it('should be true for the infinite scrolling mode', () => {
    expect(isInfiniteMode({ mode: 'infinite' })).toBe(true);
  });

  it('should be false for the virtual scrolling mode', () => {
    expect(isInfiniteMode({ mode: 'virtual' })).toBe(false);
  });

  it('should be false for the standard scrolling mode', () => {
    expect(isInfiniteMode({ mode: 'standard' })).toBe(false);
  });

  it('should be false when there are no scrolling options', () => {
    expect(isInfiniteMode(undefined)).toBe(false);
  });
});

describe('isVirtualPaging', () => {
  it('should be true for the virtual scrolling mode', () => {
    expect(isVirtualPaging({ mode: 'virtual' })).toBe(true);
  });

  it('should be true for the infinite scrolling mode', () => {
    expect(isVirtualPaging({ mode: 'infinite' })).toBe(true);
  });

  it('should be false for the standard scrolling mode', () => {
    expect(isVirtualPaging({ mode: 'standard' })).toBe(false);
  });

  it('should be false when there are no scrolling options', () => {
    expect(isVirtualPaging(undefined)).toBe(false);
  });
});

describe('isVirtualRowRendering', () => {
  it('should be true for the virtual row rendering mode', () => {
    expect(isVirtualRowRendering({ mode: 'standard', rowRenderingMode: 'virtual' })).toBe(true);
  });

  it('should be true for the virtual row rendering mode in the legacy scrolling mode', () => {
    expect(isVirtualRowRendering({ mode: 'virtual', rowRenderingMode: 'virtual', legacyMode: true })).toBe(true);
  });

  it.each(['virtual', 'infinite'] as const)('should be true for the %s scrolling mode when the legacy mode is off', (mode) => {
    expect(isVirtualRowRendering({ mode, rowRenderingMode: 'standard', legacyMode: false })).toBe(true);
  });

  it.each(['virtual', 'infinite'] as const)('should be false for the %s scrolling mode in the legacy scrolling mode', (mode) => {
    expect(isVirtualRowRendering({ mode, rowRenderingMode: 'standard', legacyMode: true })).toBe(false);
  });

  it.each(['virtual', 'infinite'] as const)('should be false for the %s scrolling mode when the legacy mode is not set', (mode) => {
    expect(isVirtualRowRendering({ mode, rowRenderingMode: 'standard' })).toBe(false);
  });

  it('should be false for the standard scrolling mode when the legacy mode is off', () => {
    expect(isVirtualRowRendering({ mode: 'standard', rowRenderingMode: 'standard', legacyMode: false })).toBe(false);
  });

  it('should be false when there are no scrolling options', () => {
    expect(isVirtualRowRendering(undefined)).toBe(false);
  });
});
