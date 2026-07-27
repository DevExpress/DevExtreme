import {
  describe, expect, it,
} from '@jest/globals';

import type { GetResizableConfigOptions } from './get_resizable_config';
import { getResizableConfig } from './get_resizable_config';

const baseOptions: GetResizableConfigOptions = {
  direction: 'vertical',
  cellWidth: 100,
  cellHeight: 50,
  resizableStep: 75,
  reduced: undefined,
  isGroupedByDate: false,
  rtlEnabled: false,
};

describe('getResizableConfig', () => {
  it('should build a vertical rule with top/bottom handles and cell-height step', () => {
    const rule = getResizableConfig({ ...baseOptions, direction: 'vertical' });

    expect(rule.handles).toBe('top bottom');
    expect(rule.minWidth).toBe(0);
    expect(rule.minHeight).toBe(50);
    expect(rule.step).toBe('50');
    expect(rule.roundStepValue).toBe(true);
  });

  it('should build a horizontal rule with left/right handles and resizable step', () => {
    const rule = getResizableConfig({ ...baseOptions, direction: 'horizontal' });

    expect(rule.handles).toBe('left right');
    expect(rule.minWidth).toBe(100);
    expect(rule.minHeight).toBe(0);
    expect(rule.step).toBe('75');
    expect(rule.roundStepValue).toBe(false);
  });

  it('should use strict step precision when not grouped by date', () => {
    const notGrouped = getResizableConfig({ ...baseOptions, isGroupedByDate: false });
    const grouped = getResizableConfig({ ...baseOptions, isGroupedByDate: true });

    expect(notGrouped.stepPrecision).toBe('strict');
    expect(grouped.stepPrecision).toBeUndefined();
  });

  it.each([
    { reduced: 'head', rtlEnabled: false, expected: 'left' },
    { reduced: 'head', rtlEnabled: true, expected: 'right' },
    { reduced: 'tail', rtlEnabled: false, expected: 'right' },
    { reduced: 'tail', rtlEnabled: true, expected: 'left' },
    { reduced: 'body', rtlEnabled: false, expected: '' },
  ] as const)('should set handles for reduced=$reduced rtl=$rtlEnabled', ({
    reduced, rtlEnabled, expected,
  }) => {
    const rule = getResizableConfig({
      ...baseOptions, direction: 'horizontal', reduced, rtlEnabled,
    });

    expect(rule.handles).toBe(expected);
  });
});
