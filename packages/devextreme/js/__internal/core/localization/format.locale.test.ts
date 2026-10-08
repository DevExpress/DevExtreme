import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import coreLocalization from '@js/common/core/localization/core';
import dateLocalization from '@js/common/core/localization/date';
import numberLocalization from '@js/common/core/localization/number';
import config from '@js/core/config';
import { getGlobalFormatByDataType } from '@ts/core/global_format_config';

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

    it('should apply explicit locale separators to an LDML format object', () => {
      coreLocalization.locale('en');
      config({
        ...config(),
        numberFormat: {
          default: {
            locale: 'fr',
          },
        },
      });

      expect(numberLocalization.format(1234.5, {
        type: '#,##0.00',
        locale: 'de-DE',
      })).toBe('1.234,50');
      expect(numberLocalization.parse('1.234,50', {
        type: '#,##0.00',
        locale: 'de-DE',
      })).toBe(1234.5);
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
        expect(options).not.toHaveProperty('locale');
      });

      numberFormatSpy.mockRestore();
    });
  });

  describe('dates', () => {
    it.each([
      { alias: 'longDate', expected: 'Donnerstag, 2. Januar 2020' },
      { alias: { default: { type: 'longDate' } }, expected: 'Donnerstag, 2. Januar 2020' },
      { alias: { default: { year: 'numeric', month: 'long', day: 'numeric' } }, expected: '2. Januar 2020' },
    ])('should keep source preset locale when dateTimeFormatPresets aliases it to $alias', ({ alias, expected }) => {
      coreLocalization.locale('en');
      config({
        ...config(),
        dateFormat: { default: { type: 'shortDate', locale: 'de-DE' } },
        dateTimeFormatPresets: { shortDate: alias },
      } as never);

      expect(dateLocalization.format(new Date(2020, 0, 2), 'shortDate')).toBe(expected);
    });

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

    it('should keep time when a locale-only dateTimeFormat is applied', () => {
      coreLocalization.locale('en');
      config({
        ...config(),
        dateTimeFormat: {
          default: { locale: 'de-DE' },
        },
      });

      expect(dateLocalization.format(
        new Date(2024, 5, 15, 14, 30),
        getGlobalFormatByDataType('datetime'),
      )).toBe('15.6.2024, 14:30');
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
        expect(options).not.toHaveProperty('locale');
      });

      dateTimeFormatSpy.mockRestore();
    });
  });

  describe('date parsing', () => {
    const date = new Date(2020, 0, 2);

    it.each([
      { type: 'shortDate', locale: 'en-US' },
      { type: 'longDate', locale: 'en-US' },
      { type: 'monthAndYear', locale: 'en-US' },
      {
        year: 'numeric', month: 'long', day: 'numeric', locale: 'en-US',
      },
    ])('should parse text formatted with explicit format locale %j', (format) => {
      coreLocalization.locale('de');

      const text = dateLocalization.format(date, format as never) as string;
      const parsed = dateLocalization.parse(text, format as never) as Date;

      expect(parsed.getFullYear()).toBe(2020);
      expect(parsed.getMonth()).toBe(0);
    });

    it('should parse month names using global dateFormat locale', () => {
      coreLocalization.locale('de');
      config({
        ...config(),
        dateFormat: { default: { type: 'longDate', locale: 'en-US' } },
      });

      const parsed = dateLocalization.parse('Thursday, January 2, 2020', 'longDate') as Date;

      expect(parsed).toEqual(date);
    });

    it('should keep parsing month names in message locale without format locale', () => {
      coreLocalization.locale('de');

      const text = dateLocalization.format(date, 'longDate') as string;

      expect(dateLocalization.parse(text, 'longDate')).toEqual(date);
    });
  });

  describe('currency', () => {
    it('should parse currency using explicit format locale separators', () => {
      coreLocalization.locale('de');

      expect(numberLocalization.parse('€1,234.50', {
        type: 'currency', currency: 'EUR', locale: 'en-US',
      } as never)).toBe(1234.5);
    });

    it('should use global numberFormat locale for OpenXML currency format', () => {
      coreLocalization.locale('de');
      const messageLocaleFormat = numberLocalization.getOpenXmlCurrencyFormat('EUR');

      config({
        ...config(),
        numberFormat: { default: { locale: 'en-US' } },
      });

      expect(numberLocalization.getOpenXmlCurrencyFormat('EUR')).not.toBe(messageLocaleFormat);
    });
  });
});
