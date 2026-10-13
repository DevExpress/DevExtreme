import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import coreLocalization from '@js/common/core/localization/core';

import formatHelper from './format_helper';
import type { LocaleAwareFormatter } from './global_format_config';
import { withFormatLocale } from './global_format_config';

describe('formatHelper composite date format', () => {
  let savedLocale = '';

  beforeEach(() => {
    savedLocale = coreLocalization.locale();
    coreLocalization.locale('en');
  });

  afterEach(() => {
    coreLocalization.locale(savedLocale);
  });

  const ticks = [new Date(2024, 5, 15, 13, 0), new Date(2024, 5, 16, 14, 30)];

  it('should build composite format from several parts', () => {
    const format = formatHelper.getDateFormatByTicks(ticks) as LocaleAwareFormatter;

    expect(typeof format).toBe('function');
    expect(format(ticks[1])).toBe('Sunday, 16 2:30 PM');
  });

  it('should apply locale to each part of composite format', () => {
    const format = formatHelper.getDateFormatByTicks(ticks);
    const localizedFormat = withFormatLocale(format, 'de') as LocaleAwareFormatter;

    expect(localizedFormat(ticks[1])).toBe('Sonntag, 16 14:30');
  });

  it('should apply locale to month name part', () => {
    const format = formatHelper.getDateFormatByDifferences({ month: true, day: true, hour: true }, 'hour');
    const localizedFormat = withFormatLocale(format, 'de') as LocaleAwareFormatter;

    expect(localizedFormat(new Date(2024, 2, 16, 14, 30))).toBe('Mär 16 14:30');
  });

  it('should not change original composite format', () => {
    const format = formatHelper.getDateFormatByTicks(ticks) as LocaleAwareFormatter;

    withFormatLocale(format, 'de');

    expect(format(ticks[1])).toBe('Sunday, 16 2:30 PM');
  });
});
