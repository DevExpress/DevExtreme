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
} from './m_global_format_config';

const GLOBAL_FORMAT_KEYS = ['dateFormat', 'timeFormat', 'dateTimeFormat', 'numberFormat', 'dateTimeFormatPresets'] as const;
type GlobalFormatKey = typeof GLOBAL_FORMAT_KEYS[number];

const saveAndRestore = (): { save: () => void; restore: () => void } => {
  let savedValues: Partial<Record<GlobalFormatKey, unknown>> = {};
  let savedLocale = '';

  return {
    save() {
      savedLocale = coreLocalization.locale();
      const currentConfig = config();

      savedValues = {};
      GLOBAL_FORMAT_KEYS.forEach((key) => {
        savedValues[key] = currentConfig[key];
      });
    },
    restore() {
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
    },
  };
};

describe('m_global_format_config', () => {
  const { save, restore } = saveAndRestore();

  beforeEach(() => { save(); });
  afterEach(() => { restore(); });

  describe('getGlobalFormatByDataType', () => {
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
  });

  describe('resolvePresetOverride', () => {
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
