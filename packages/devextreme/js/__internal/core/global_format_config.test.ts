import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import coreLocalization from '@js/common/core/localization/core';
import config from '@js/core/config';

import type { LocaleAwareFormatter } from './global_format_config';
import {
  applyDataTypePreset,
  getDateFormatLocale,
  getEffectiveFormatLocale,
  getFormatterOptions,
  getGlobalFormatByDataType,
  getRawGlobalFormatByDataType,
  isLocaleOnlyFormat,
  resolvePresetOverride,
  withFormatLocale,
} from './global_format_config';

const GLOBAL_FORMAT_KEYS = ['dateFormat', 'timeFormat', 'dateTimeFormat', 'numberFormat', 'dateTimeFormatPresets'] as const;
type GlobalFormatKey = typeof GLOBAL_FORMAT_KEYS[number];

describe('global_format_config', () => {
  let savedValues: Partial<Record<GlobalFormatKey, unknown>> = {};
  let savedLocale = '';

  beforeEach(() => {
    savedLocale = coreLocalization.locale();
    const currentConfig = config();

    savedValues = {};
    GLOBAL_FORMAT_KEYS.forEach((key) => {
      savedValues[key] = currentConfig[key];
    });
  });

  afterEach(() => {
    coreLocalization.locale(savedLocale);
    const currentConfig = config();

    GLOBAL_FORMAT_KEYS.forEach((key) => {
      if (savedValues[key] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete currentConfig[key];
      } else {
        currentConfig[key] = savedValues[key] as never;
      }
    });
  });

  describe('getGlobalFormatByDataType', () => {
    it('should return undefined when no global formats configured', () => {
      expect(getGlobalFormatByDataType('date')).toBeUndefined();
      expect(getGlobalFormatByDataType('time')).toBeUndefined();
      expect(getGlobalFormatByDataType('datetime')).toBeUndefined();
      expect(getGlobalFormatByDataType('number')).toBeUndefined();
    });

    it('should return undefined for unknown dataType', () => {
      expect(getGlobalFormatByDataType('boolean')).toBeUndefined();
      expect(getGlobalFormatByDataType('')).toBeUndefined();
    });

    it('should resolve string dateFormat', () => {
      config({ ...config(), dateFormat: 'dd/MM/yyyy' });

      expect(getGlobalFormatByDataType('date')).toBe('dd/MM/yyyy');
    });

    it('should resolve string timeFormat', () => {
      config({ ...config(), timeFormat: 'HH:mm:ss' });

      expect(getGlobalFormatByDataType('time')).toBe('HH:mm:ss');
    });

    it('should resolve string dateTimeFormat', () => {
      config({ ...config(), dateTimeFormat: 'dd/MM/yyyy HH:mm' });

      expect(getGlobalFormatByDataType('datetime')).toBe('dd/MM/yyyy HH:mm');
    });

    it('should resolve function dateFormat', () => {
      const formatter = (d: Date): string => d.toISOString();

      config({ ...config(), dateFormat: formatter });

      expect(getGlobalFormatByDataType('date')).toBe(formatter);
    });

    it('should resolve function numberFormat', () => {
      const formatter = (n: number): string => n.toFixed(2);

      config({ ...config(), numberFormat: formatter });

      expect(getGlobalFormatByDataType('number')).toBe(formatter);
    });

    it('should resolve locale map with default key', () => {
      config({
        ...config(),
        dateFormat: {
          default: 'yyyy-MM-dd',
          'de-DE': 'dd.MM.yyyy',
        },
      });

      // Default locale is 'en', not in map → uses 'default'
      expect(getGlobalFormatByDataType('date')).toBe('yyyy-MM-dd');
    });

    it('should coexist: dateFormat and numberFormat set together', () => {
      config({
        ...config(),
        dateFormat: 'dd/MM/yyyy',
        numberFormat: '#,##0.00',
      });

      expect(getGlobalFormatByDataType('date')).toBe('dd/MM/yyyy');
      expect(getGlobalFormatByDataType('number')).toBe('#,##0.00');
      expect(getGlobalFormatByDataType('time')).toBeUndefined();
    });
  });

  describe('resolvePresetOverride', () => {
    it('should return undefined when dateTimeFormatPresets is not configured', () => {
      expect(resolvePresetOverride('shortDate')).toBeUndefined();
    });

    it('should return undefined for unknown preset name', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: 'dd/MM/yyyy',
        },
      });

      expect(resolvePresetOverride('unknownPreset')).toBeUndefined();
    });

    it('should resolve string preset override', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: 'dd/MM/yyyy',
        },
      });

      expect(resolvePresetOverride('shortDate')).toBe('dd/MM/yyyy');
    });

    it('should resolve function preset override', () => {
      const fn = (d: Date): string => d.toISOString();

      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: fn,
        },
      });

      expect(resolvePresetOverride('shortDate')).toBe(fn);
    });

    it('should do case-insensitive lookup', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: 'dd/MM/yyyy',
        },
      });

      expect(resolvePresetOverride('SHORTDATE')).toBe('dd/MM/yyyy');
      expect(resolvePresetOverride('shortdate')).toBe('dd/MM/yyyy');
      expect(resolvePresetOverride('ShortDate')).toBe('dd/MM/yyyy');
    });

    it('should resolve locale map preset with default key', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: {
            default: 'dd/MM/yyyy',
            'de-DE': 'dd.MM.yyyy',
          },
        },
      });

      // Default locale is 'en', not in map → uses 'default'
      expect(resolvePresetOverride('shortDate')).toBe('dd/MM/yyyy');
    });

    it('should resolve locale map preset with function value', () => {
      const fn = (d: Date): string => `${d.getDate()}/${d.getMonth() + 1}`;

      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: {
            default: fn,
          },
        },
      });

      expect(resolvePresetOverride('shortDate')).toBe(fn);
    });

    it('should handle multiple preset overrides', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: 'dd/MM/yyyy',
          longDate: 'EEEE, dd MMMM yyyy',
          shortTime: 'HH:mm',
        },
      });

      expect(resolvePresetOverride('shortDate')).toBe('dd/MM/yyyy');
      expect(resolvePresetOverride('longDate')).toBe('EEEE, dd MMMM yyyy');
      expect(resolvePresetOverride('shortTime')).toBe('HH:mm');
    });
  });

  describe('getGlobalFormatByDataType with format locale', () => {
    it('should resolve locale map entry by message locale', () => {
      config({
        ...config(),
        numberFormat: {
          de: { locale: 'en-US', minimumFractionDigits: 2 },
          default: { locale: 'de-DE', minimumFractionDigits: 2 },
        },
      });
      coreLocalization.locale('de');

      expect(getGlobalFormatByDataType('number')).toEqual({
        locale: 'en-US',
        minimumFractionDigits: 2,
      });
    });

    it('should resolve preset override from locale map', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: {
            de: 'dd.MM.yyyy',
            default: 'dd/MM/yyyy',
          },
        },
      });
      coreLocalization.locale('de');

      expect(resolvePresetOverride('shortDate')).toBe('dd.MM.yyyy');
    });
  });

  describe('getEffectiveFormatLocale - global config dataType resolution', () => {
    it('should resolve locale via getGlobalFormatByDataType when global config type matches preset', () => {
      config({
        ...config(),
        timeFormat: {
          default: {
            locale: 'de-DE',
            type: 'shortTime',
          },
        },
      });
      coreLocalization.locale('en');

      expect(getEffectiveFormatLocale(undefined, undefined, 'shortTime')).toBe('de-DE');
    });

    it('should resolve locale via getGlobalFormatByDataType for implicit shortDate preset', () => {
      config({
        ...config(),
        dateFormat: {
          default: {
            locale: 'de-DE',
          },
        },
      });
      coreLocalization.locale('en');

      expect(getEffectiveFormatLocale(undefined, undefined, 'shortDate')).toBe('de-DE');
    });

    it('should infer dataType from Intl format object options', () => {
      config({
        ...config(),
        timeFormat: {
          default: {
            locale: 'de-DE',
          },
        },
      });
      coreLocalization.locale('en');

      expect(getEffectiveFormatLocale({
        hour: 'numeric',
        minute: 'numeric',
      })).toBe('de-DE');
    });

    it('should use explicit dataType with getGlobalFormatByDataType', () => {
      config({
        ...config(),
        dateFormat: {
          default: {
            locale: 'de-DE',
          },
        },
      });
      coreLocalization.locale('en');

      expect(getEffectiveFormatLocale(undefined, 'date')).toBe('de-DE');
    });
  });

  describe('getEffectiveFormatLocale', () => {
    it('should return string locale from format object', () => {
      expect(getEffectiveFormatLocale({ locale: 'en-US' })).toBe('en-US');
    });

    it('should evaluate function locale', () => {
      expect(getEffectiveFormatLocale({ locale: () => 'de-DE' })).toBe('de-DE');
    });

    it('should prefer own format locale over global format locale', () => {
      config({
        ...config(),
        numberFormat: {
          default: { locale: 'en-US' },
        },
      });

      expect(getEffectiveFormatLocale({ locale: 'ja' }, 'number')).toBe('ja');
    });

    it('should fall back to global numberFormat locale', () => {
      config({
        ...config(),
        numberFormat: {
          default: { locale: 'en-US', minimumFractionDigits: 2 },
        },
      });
      coreLocalization.locale('de');

      expect(getEffectiveFormatLocale({ type: 'fixedPoint', precision: 0 }, 'number')).toBe('en-US');
    });

    it('should fall back to message locale when no format locale is configured', () => {
      coreLocalization.locale('de');

      expect(getEffectiveFormatLocale({ type: 'fixedPoint', precision: 0 }, 'number')).toBe('de');
    });
  });

  describe('getDateFormatLocale', () => {
    beforeEach(() => {
      coreLocalization.locale('en');
      config({
        ...config(),
        dateFormat: { default: { type: 'shortDate', locale: 'de-DE' } },
      });
    });

    it('should resolve locale from source preset when it is aliased to another preset', () => {
      expect(getDateFormatLocale('shortDate', 'longDate')).toBe('de-DE');
    });

    it('should resolve locale from source preset when it is aliased to Intl options', () => {
      expect(getDateFormatLocale('shortDate', { weekday: 'long' })).toBe('de-DE');
    });

    it('should prefer source format own locale over aliased format locale', () => {
      expect(getDateFormatLocale(
        { type: 'shortDate', locale: 'ja' },
        { type: 'longDate', locale: 'fr' },
      )).toBe('ja');
    });

    it('should use aliased format own locale when source has none', () => {
      expect(getDateFormatLocale('shortDate', { type: 'longDate', locale: 'fr' })).toBe('fr');
    });

    it('should fall back to message locale for unmapped preset', () => {
      expect(getDateFormatLocale('longDate')).toBe('en');
    });

    it('should use the preset override locale when the resolved format is omitted', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          longDate: { default: { type: 'longDate', locale: 'de' } },
        },
      });

      expect(getDateFormatLocale('longDate')).toBe('de');
      expect(getDateFormatLocale({ type: 'longDate' })).toBe('de');
      expect(getDateFormatLocale({ type: 'longDate', locale: 'ja' })).toBe('ja');
    });

    it('should keep an explicit resolved format ahead of a preset override', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          longDate: { default: { type: 'longDate', locale: 'de' } },
        },
      });

      expect(getDateFormatLocale('longDate', { type: 'longDate', locale: 'fr' })).toBe('fr');
      expect(getDateFormatLocale('shortDate', 'longDate')).toBe('de-DE');
    });
  });

  describe('getRawGlobalFormatByDataType', () => {
    it('should return locale-only datetime format without preset', () => {
      config({ ...config(), dateTimeFormat: { default: { locale: 'de' } } });

      expect(getRawGlobalFormatByDataType('datetime')).toEqual({ locale: 'de' });
      expect(getGlobalFormatByDataType('datetime')).toEqual({ locale: 'de', type: 'shortDateShortTime' });
    });

    it('should return locale-only time format without preset', () => {
      config({ ...config(), timeFormat: { default: { locale: 'de' } } });

      expect(getRawGlobalFormatByDataType('time')).toEqual({ locale: 'de' });
      expect(getGlobalFormatByDataType('time')).toEqual({ locale: 'de', type: 'shortTime' });
    });
  });

  describe('isLocaleOnlyFormat', () => {
    it.each([
      { format: { locale: 'de' }, expected: true },
      { format: { locale: () => 'de' }, expected: true },
      { format: { locale: 'de', type: undefined }, expected: true },
      { format: { locale: 'de', type: undefined, precision: undefined }, expected: true },
      { format: { locale: 'de', type: 'shortDate' }, expected: false },
      { format: { locale: 'de', type: null }, expected: false },
      { format: { locale: undefined, type: undefined }, expected: false },
      { format: { locale: 'de', maximumFractionDigits: 1 }, expected: false },
      { format: { type: 'shortDate' }, expected: false },
      { format: 'shortDate', expected: false },
      { format: undefined, expected: false },
    ])('should return $expected for $format', ({ format, expected }) => {
      expect(isLocaleOnlyFormat(format as never)).toBe(expected);
    });
  });

  describe('withFormatLocale', () => {
    const createLocaleAwareFormatter = (locale?: unknown): LocaleAwareFormatter => {
      const formatter: LocaleAwareFormatter = () => `text:${String(locale)}`;
      formatter.withLocale = createLocaleAwareFormatter;
      return formatter;
    };

    it('should rebuild locale-aware function format with locale', () => {
      const format = withFormatLocale(createLocaleAwareFormatter(), 'de') as LocaleAwareFormatter;

      expect(format(new Date())).toBe('text:de');
    });

    it('should rebuild locale-aware formatter inside format object', () => {
      const format = withFormatLocale({ type: null, formatter: createLocaleAwareFormatter() } as never, 'de') as {
        formatter: LocaleAwareFormatter; locale: string;
      };

      expect(format.formatter(new Date())).toBe('text:de');
      expect(format.locale).toBe('de');
    });

    it('should keep formatter inside format object when it is not locale-aware', () => {
      const formatter = (): string => 'text';
      const format = withFormatLocale({ formatter } as never, 'de') as { formatter: unknown };

      expect(format.formatter).toBe(formatter);
    });

    it('should wrap string preset into format object with locale', () => {
      expect(withFormatLocale('month', 'de')).toEqual({ type: 'month', locale: 'de' });
    });

    it('should add locale to format object', () => {
      expect(withFormatLocale({ type: 'fixedPoint', precision: 2 }, 'de'))
        .toEqual({ type: 'fixedPoint', precision: 2, locale: 'de' });
    });

    it('should keep function locale as is', () => {
      const locale = (): string => 'de';

      expect(withFormatLocale('month', locale)).toEqual({ type: 'month', locale });
    });

    it('should return function format unchanged', () => {
      const formatter = (): string => 'text';

      expect(withFormatLocale(formatter, 'de')).toBe(formatter);
    });

    it('should return format unchanged without locale', () => {
      const format = { type: 'fixedPoint' };

      expect(withFormatLocale(format, undefined)).toBe(format);
      expect(withFormatLocale('month', undefined)).toBe('month');
    });

    it('should not mutate the original format object', () => {
      const format = { type: 'fixedPoint', precision: 2 };

      withFormatLocale(format, 'de');

      expect(format).toEqual({ type: 'fixedPoint', precision: 2 });
    });
  });

  describe('getFormatterOptions', () => {
    it('should remove locale metadata from format object', () => {
      expect(getFormatterOptions({
        locale: 'en-US',
        minimumFractionDigits: 2,
      })).toEqual({
        minimumFractionDigits: 2,
      });
    });

    it('should return non-object format as-is', () => {
      expect(getFormatterOptions('fixedPoint')).toBe('fixedPoint');
    });

    it('should not mutate the original format object', () => {
      const formatObject = { locale: 'en-US', precision: 2 };

      getFormatterOptions(formatObject);

      expect(formatObject).toEqual({ locale: 'en-US', precision: 2 });
    });
  });

  describe('applyDataTypePreset', () => {
    it('should add a datetime preset to a locale-only format', () => {
      expect(applyDataTypePreset({ locale: 'en-US' }, 'datetime')).toEqual({
        locale: 'en-US',
        type: 'shortDateShortTime',
      });
    });

    it('should add a time preset to a locale-only format', () => {
      expect(applyDataTypePreset({ locale: 'de-DE' }, 'time')).toEqual({
        locale: 'de-DE',
        type: 'shortTime',
      });
    });

    it('should add a datetime preset when optional members are undefined', () => {
      expect(applyDataTypePreset({ locale: 'de', type: undefined }, 'datetime')).toEqual({
        locale: 'de',
        type: 'shortDateShortTime',
      });
    });

    it('should leave a locale-only date format unchanged', () => {
      expect(applyDataTypePreset({ locale: 'de' }, 'date')).toEqual({ locale: 'de' });
    });

    it('should leave a format that already has a type unchanged', () => {
      const format = { locale: 'en-US', type: 'longDate' };

      expect(applyDataTypePreset(format, 'datetime')).toBe(format);
    });

    it('should resolve a locale-only dateTimeFormat with the datetime preset', () => {
      config({
        ...config(),
        dateTimeFormat: {
          default: { locale: 'en' },
        },
      });

      expect(getGlobalFormatByDataType('datetime')).toEqual({
        locale: 'en',
        type: 'shortDateShortTime',
      });
    });
  });
});
