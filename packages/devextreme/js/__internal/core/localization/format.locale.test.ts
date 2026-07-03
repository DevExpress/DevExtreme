import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import coreLocalization from '@js/common/core/localization/core';
import dateLocalization from '@js/common/core/localization/date';
import numberLocalization from '@js/common/core/localization/number';
import config from '@js/core/config';

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

describe('format locale integration', () => {
  const { save, restore } = saveAndRestore();

  beforeEach(() => { save(); });
  afterEach(() => { restore(); });

  describe('numbers', () => {
    it('should format using global numberFormat locale instead of message locale', () => {
      coreLocalization.locale('de');
      config({
        ...config(),
        numberFormat: {
          default: {
            locale: 'en-US',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        },
      });

      expect(numberLocalization.format(1234.56)).toBe('1,234.56');
    });

    it('should apply global numberFormat locale to explicit format type', () => {
      coreLocalization.locale('de');
      config({
        ...config(),
        numberFormat: {
          default: {
            locale: 'en-US',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        },
      });

      expect(numberLocalization.format(1234.56, { type: 'fixedPoint', precision: 0 })).toBe('1,235');
    });

    it('should prefer explicit format locale over global numberFormat locale', () => {
      coreLocalization.locale('de');
      config({
        ...config(),
        numberFormat: {
          default: {
            locale: 'en-US',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        },
      });

      expect(numberLocalization.format(1234.56, {
        type: 'fixedPoint',
        precision: 0,
        locale: 'de-DE',
      })).toBe('1.235');
    });

    it('should parse using effective number format locale separators', () => {
      coreLocalization.locale('de');
      config({
        ...config(),
        numberFormat: {
          default: {
            locale: 'en-US',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        },
      });

      expect(numberLocalization.parse('1234.56')).toBe(1234.56);
    });

    it('should apply message locale separators to LDML global numberFormat', () => {
      coreLocalization.locale('de');
      config({
        ...config(),
        numberFormat: '#,##0.00',
      });

      expect(numberLocalization.format(1234.5)).toBe('1.234,50');
    });

    it('should apply dynamic global numberFormat locale at format time', () => {
      let dynamicLocale = 'en-US';

      coreLocalization.locale('de');
      config({
        ...config(),
        numberFormat: {
          default: {
            locale: () => dynamicLocale,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        },
      });

      expect(numberLocalization.format(1234.56)).toBe('1,234.56');

      dynamicLocale = 'de-DE';
      expect(numberLocalization.format(1234.56)).toBe('1.234,56');
    });

    it('should use global numberFormat locale for decimal and thousands separators', () => {
      coreLocalization.locale('de');
      config({
        ...config(),
        numberFormat: {
          default: {
            locale: 'en-US',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        },
      });

      expect(numberLocalization.getDecimalSeparator()).toBe('.');
      expect(numberLocalization.getThousandsSeparator()).toBe(',');
    });

    it('should not pass locale metadata to Intl.NumberFormat options', () => {
      coreLocalization.locale('de');
      config({
        ...config(),
        numberFormat: {
          default: {
            locale: 'en-US',
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          },
        },
      });

      const numberFormatSpy = jest.spyOn(Intl, 'NumberFormat');
      numberLocalization.format(1.234);

      numberFormatSpy.mock.calls.forEach(([, options]) => {
        expect(options?.locale).toBeUndefined();
      });

      numberFormatSpy.mockRestore();
    });
  });

  describe('dates', () => {
    it('should format implicit shortDate using global dateFormat locale', () => {
      coreLocalization.locale('en');
      config({
        ...config(),
        dateFormat: {
          default: {
            locale: 'de-DE',
            type: 'shortDate',
          },
        },
      });

      expect(dateLocalization.format(new Date(2020, 0, 2), {
        locale: 'de-DE',
        type: 'shortDate',
      })).toBe('2.1.2020');
    });

    it('should format implicit shortDate preset using global dateFormat locale', () => {
      coreLocalization.locale('en');
      config({
        ...config(),
        dateFormat: {
          default: {
            locale: 'de-DE',
            type: 'shortDate',
          },
        },
      });

      expect(dateLocalization.format(new Date(2020, 0, 2), 'shortDate')).toBe('2.1.2020');
    });

    it('should format using explicit date format locale', () => {
      coreLocalization.locale('en');

      expect(dateLocalization.format(new Date(2020, 0, 2), {
        locale: 'de-DE',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })).toBe('02.01.2020');
    });

    it('should not pass locale metadata to Intl.DateTimeFormat options', () => {
      const dateTimeFormatSpy = jest.spyOn(Intl, 'DateTimeFormat');

      coreLocalization.locale('en');

      dateLocalization.format(new Date(2021, 5, 15), {
        locale: 'de-DE',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      dateTimeFormatSpy.mock.calls.forEach(([, options]) => {
        expect(options?.locale).toBeUndefined();
      });

      dateTimeFormatSpy.mockRestore();
    });
  });
});
