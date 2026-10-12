import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import coreLocalization from '@js/common/core/localization/core';
import config from '@js/core/config';

import { smartFormatter } from './smart_formatter';

const GLOBAL_FORMAT_KEYS = ['numberFormat', 'dateTimeFormat'] as const;

const datetimeTick = new Date(2024, 5, 15, 14, 30);
const monthTick = new Date(2024, 5, 1);

const formatDatetime = (
  tick: Date,
  tickInterval: string,
  format?: unknown,
): string => smartFormatter(tick, {
  labelOptions: { format },
  ticks: [],
  tickInterval,
  dataType: 'datetime',
  type: 'continuous',
});

const formatNumeric = (
  tick: number,
  ticks: number[],
  tickInterval: number,
  format?: unknown,
): string => smartFormatter(tick, {
  labelOptions: { format },
  ticks,
  tickInterval,
  dataType: 'numeric',
  type: 'continuous',
});

describe('smartFormatter with locale-only format', () => {
  let savedLocale = '';
  let savedFormats: Record<string, unknown> = {};

  beforeEach(() => {
    savedLocale = coreLocalization.locale();
    coreLocalization.locale('en');

    const currentConfig = config() as Record<string, unknown>;
    savedFormats = {};
    GLOBAL_FORMAT_KEYS.forEach((key) => {
      savedFormats[key] = currentConfig[key];
    });
  });

  afterEach(() => {
    coreLocalization.locale(savedLocale);

    const currentConfig = config() as Record<string, unknown>;
    GLOBAL_FORMAT_KEYS.forEach((key) => {
      currentConfig[key] = savedFormats[key];
    });
  });

  describe('datetime axis', () => {
    it.each([
      { tickInterval: 'hour', tick: datetimeTick, expected: '2:30 PM' },
      { tickInterval: 'month', tick: monthTick, expected: 'June' },
    ])('should auto-format by $tickInterval interval without locale', ({ tickInterval, tick, expected }) => {
      expect(formatDatetime(tick, tickInterval)).toBe(expected);
    });

    it.each([
      { tickInterval: 'hour', tick: datetimeTick, expected: '14:30' },
      { tickInterval: 'month', tick: monthTick, expected: 'Juni' },
    ])('should keep auto-format by $tickInterval interval for own locale-only format', ({ tickInterval, tick, expected }) => {
      expect(formatDatetime(tick, tickInterval, { locale: 'de' })).toBe(expected);
    });

    it.each([
      { tickInterval: 'hour', tick: datetimeTick, expected: '14:30' },
      { tickInterval: 'month', tick: monthTick, expected: 'Juni' },
    ])('should keep auto-format by $tickInterval interval for global locale-only dateTimeFormat', ({ tickInterval, tick, expected }) => {
      config({ ...config(), dateTimeFormat: { default: { locale: 'de' } } });

      expect(formatDatetime(tick, tickInterval)).toBe(expected);
    });

    it('should support function locale', () => {
      expect(formatDatetime(monthTick, 'month', { locale: () => 'de' })).toBe('Juni');
    });

    it('should keep explicit format with locale as is', () => {
      expect(formatDatetime(datetimeTick, 'hour', { type: 'shortDate', locale: 'de' })).toBe('15.6.2024');
    });
  });

  describe('numeric axis', () => {
    it.each([
      {
        name: 'fraction precision', tick: 1.5, ticks: [1, 1.25, 1.5], tickInterval: 0.25, en: '1.50', de: '1,50',
      },
      {
        name: 'thousands grouping', tick: 20000, ticks: [10000, 20000], tickInterval: 10000, en: '20K', de: '20K',
      },
      {
        name: 'millions modifier', tick: 1500000, ticks: [1000000, 1500000], tickInterval: 500000, en: '1.5M', de: '1,5M',
      },
    ])('should keep auto $name', ({
      tick, ticks, tickInterval, en, de,
    }) => {
      expect(formatNumeric(tick, ticks, tickInterval)).toBe(en);
      expect(formatNumeric(tick, ticks, tickInterval, { locale: 'de' })).toBe(de);
    });

    it('should keep auto precision for global locale-only numberFormat', () => {
      config({ ...config(), numberFormat: { default: { locale: 'de' } } });

      expect(formatNumeric(1.5, [1, 1.25, 1.5], 0.25)).toBe('1,50');
    });

    it('should keep explicit format with locale as is', () => {
      expect(formatNumeric(1.5, [1, 1.25, 1.5], 0.25, { type: 'fixedPoint', precision: 3, locale: 'de' })).toBe('1,500');
    });
  });
});
