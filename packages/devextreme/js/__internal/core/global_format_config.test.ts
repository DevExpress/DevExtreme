import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import coreLocalization from '@js/common/core/localization/core';
import config from '@js/core/config';

import {
  getEffectiveFormatLocale,
  getFormatterOptions,
  getGlobalFormatByDataType,
  resolvePresetOverride,
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
});
