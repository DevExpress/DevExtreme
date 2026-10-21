import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import coreLocalization from '@js/common/core/localization/core';
import dateLocalization from '@js/common/core/localization/date';
import numberLocalization from '@js/common/core/localization/number';
import config from '@js/core/config';
import { getGlobalFormatByDataType } from '@ts/core/global_format_config';
import internalDateLocalization from '@ts/core/localization/date';
import { Export } from '@ts/exporter/exceljs/export';

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

    it('should keep the message locale for an explicit fixedPoint preset', () => {
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

      expect(numberLocalization.format(1234.56, { type: 'fixedPoint', precision: 0 })).toBe('1.235');
      expect(numberLocalization.format(1234.56)).toBe('1,234.56');
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

    it.each([
      { format: { maximumFractionDigits: 2 }, text: '1.234,5', separators: [',', '.'] },
      { format: { type: 'fixedPoint', precision: 1 }, text: '1.234,5', separators: [',', '.'] },
      { format: '#,##0.00', text: '1.234,50', separators: [',', '.'] },
      { format: { type: '#,##0.00' }, text: '1.234,50', separators: [',', '.'] },
      { format: { type: 'currency', precision: 2 }, text: '1.234,50 $', separators: [',', '.'] },
      { format: { style: 'currency', currency: 'USD' }, text: '1.234,50 $', separators: [',', '.'] },
      { format: 'percent', text: '123.450 %', separators: [',', '.'] },
      {
        format: { maximumFractionDigits: 2, locale: 'en-US' }, text: '1,234.5', separators: ['.', ','],
      },
      { format: { type: '#,##0.00', locale: 'en-US' }, text: '1,234.50', separators: ['.', ','] },
      { format: undefined, text: '1,234.5', separators: ['.', ','] },
    ])('should format and parse back with the same locale for $format', ({ format, text, separators }) => {
      coreLocalization.locale('de');
      config({
        ...config(),
        numberFormat: { default: { locale: 'en-US' } },
      });

      const formatted = numberLocalization.format(1234.5, format as never);

      expect(formatted).toBe(text);
      expect([
        numberLocalization.getDecimalSeparator(format as never),
        numberLocalization.getThousandsSeparator(format as never),
      ]).toEqual(separators);
      expect(numberLocalization.parse(formatted, format as never)).toBe(1234.5);
    });

    it('should not apply numberFormat locale to explicit Intl options without a locale', () => {
      coreLocalization.locale('de');
      config({
        ...config(),
        numberFormat: { default: { locale: 'en-US', minimumFractionDigits: 2 } },
      });

      expect(numberLocalization.format(1234.5, {
        maximumFractionDigits: 1, useGrouping: true,
      } as never)).toBe('1.234,5');
      expect(numberLocalization.format(1234.5, {
        maximumFractionDigits: 1, useGrouping: true, locale: 'en-US',
      } as never)).toBe('1,234.5');
      expect(numberLocalization.format(1234.5)).toBe('1,234.50');
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
      { alias: 'longDate', expected: 'Thursday, January 2, 2020' },
      { alias: { default: { type: 'longDate' } }, expected: 'Thursday, January 2, 2020' },
    ])('should keep the message locale when shortDate is aliased to $alias', ({ alias, expected }) => {
      coreLocalization.locale('en');
      config({
        ...config(),
        dateFormat: { default: { type: 'shortDate', locale: 'de-DE' } },
        dateTimeFormatPresets: { shortDate: alias },
      } as never);

      expect(dateLocalization.format(new Date(2020, 0, 2), 'shortDate')).toBe(expected);
    });

    it('should keep the message locale when a preset is aliased to Intl date fields', () => {
      coreLocalization.locale('en');
      config({
        ...config(),
        dateFormat: { default: { locale: 'de-DE' } },
        dateTimeFormatPresets: {
          longDate: {
            default: {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            },
          },
          shortDate: { default: { year: 'numeric', month: 'long', day: 'numeric' } },
        },
      } as never);

      expect(dateLocalization.format(new Date(2020, 0, 2), 'longDate')).toBe('Thursday, January 2, 2020');
      expect(dateLocalization.format(new Date(2020, 0, 2), 'shortDate')).toBe('January 2, 2020');
      expect(dateLocalization.format(new Date(2020, 0, 2), { type: 'shortDate' })).toBe('January 2, 2020');
    });

    it('should use the alias locale when a preset is aliased to Intl fields with a locale', () => {
      coreLocalization.locale('en');
      config({
        ...config(),
        dateFormat: { default: { locale: 'de-DE' } },
        dateTimeFormatPresets: {
          longDate: {
            default: {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              locale: 'de-DE',
            },
          },
        },
      } as never);

      expect(dateLocalization.format(new Date(2020, 0, 2), 'longDate')).toBe('Donnerstag, 2. Januar 2020');
    });

    it('should keep the message locale for explicit Intl fields and LDML patterns', () => {
      coreLocalization.locale('en');
      config({
        ...config(),
        dateFormat: { default: { locale: 'de-DE' } },
        timeFormat: { default: { locale: 'de-DE' } },
        dateTimeFormat: { default: { locale: 'de-DE' } },
      });
      const date = new Date(2020, 0, 2, 14, 5);

      expect(dateLocalization.format(date, { year: 'numeric', month: 'long', day: 'numeric' }))
        .toBe('January 2, 2020');
      expect(dateLocalization.format(date, { hour: 'numeric', minute: 'numeric' }))
        .toBe('2:05 PM');
      expect(dateLocalization.format(date, {
        year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',
      })).toBe('1/2/2020, 2:05 PM');
      expect(dateLocalization.format(date, 'dd MMMM yyyy')).toBe('02 January 2020');
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

    it('should keep the message locale for an explicit shortDate preset', () => {
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

      expect(dateLocalization.format(new Date(2020, 0, 2), 'shortDate')).toBe('1/2/2020');
      expect(dateLocalization.format(new Date(2020, 0, 2), { type: 'shortDate' })).toBe('1/2/2020');
      expect(dateLocalization.format(
        new Date(2020, 0, 2),
        getGlobalFormatByDataType('date'),
      )).toBe('2.1.2020');
    });

    it('should use the dateTimeFormatPresets locale for an explicit preset', () => {
      coreLocalization.locale('en');
      config({
        ...config(),
        dateFormat: {
          default: {
            locale: 'ja',
            type: 'shortDate',
          },
        },
        dateTimeFormatPresets: {
          shortDate: { default: { type: 'shortDate', locale: 'de-DE' } },
        },
      } as never);

      expect(dateLocalization.format(new Date(2020, 0, 2), { type: 'shortDate' })).toBe('2.1.2020');
    });

    it('should keep the message locale for an explicit shortTime preset', () => {
      coreLocalization.locale('en');
      config({
        ...config(),
        timeFormat: {
          default: {
            locale: 'de-DE',
            type: 'shortTime',
          },
        },
      });
      const date = new Date(2020, 0, 2, 14, 5);

      expect(dateLocalization.format(date, 'shortTime')).toBe('2:05 PM');
      expect(dateLocalization.format(date, { type: 'shortTime' })).toBe('2:05 PM');
      expect(dateLocalization.format(date, getGlobalFormatByDataType('time'))).toBe('14:05');
    });

    it('should keep the message locale for an explicit shortDateShortTime preset', () => {
      coreLocalization.locale('en');
      config({
        ...config(),
        dateTimeFormat: {
          default: {
            locale: 'de-DE',
            type: 'shortDateShortTime',
          },
        },
      });
      const date = new Date(2020, 0, 2, 14, 5);

      expect(dateLocalization.format(date, 'shortDateShortTime')).toBe('1/2/2020, 2:05 PM');
      expect(dateLocalization.format(date, { type: 'shortDateShortTime' })).toBe('1/2/2020, 2:05 PM');
      expect(dateLocalization.format(date, getGlobalFormatByDataType('datetime'))).toBe('2.1.2020, 14:05');
    });

    it('should use the dateTimeFormatPresets locale for explicit time presets', () => {
      coreLocalization.locale('en');
      config({
        ...config(),
        timeFormat: { default: { locale: 'ja', type: 'shortTime' } },
        dateTimeFormat: { default: { locale: 'ja', type: 'shortDateShortTime' } },
        dateTimeFormatPresets: {
          shortTime: { default: { type: 'shortTime', locale: 'de-DE' } },
          shortDateShortTime: { default: { type: 'shortDateShortTime', locale: 'de-DE' } },
        },
      } as never);
      const date = new Date(2020, 0, 2, 14, 5);

      expect(dateLocalization.format(date, { type: 'shortTime' })).toBe('14:05');
      expect(dateLocalization.format(date, { type: 'shortDateShortTime' })).toBe('2.1.2020, 14:05');
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

    it('should format LDML month and day names using the format locale', () => {
      coreLocalization.locale('en');

      expect(dateLocalization.format(new Date(2020, 5, 15), {
        type: 'EEEE, dd MMMM yyyy',
        locale: 'de',
      })).toBe('Montag, 15 Juni 2020');
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

    it('should parse an explicit longDate preset in the message locale', () => {
      coreLocalization.locale('de');
      config({
        ...config(),
        dateFormat: { default: { type: 'longDate', locale: 'en-US' } },
      });

      const text = dateLocalization.format(date, 'longDate') as string;

      expect(text).toBe('Donnerstag, 2. Januar 2020');
      expect(dateLocalization.parse(text, 'longDate')).toEqual(date);
    });

    it('should parse month names using the global dateFormat when that format is applied', () => {
      coreLocalization.locale('de');
      config({
        ...config(),
        dateFormat: { default: { type: 'longDate', locale: 'en-US' } },
      });

      const parsed = dateLocalization.parse(
        'Thursday, January 2, 2020',
        getGlobalFormatByDataType('date') as never,
      ) as Date;

      expect(parsed).toEqual(date);
    });

    it('should not take the time separator for an explicit LDML pattern from timeFormat', () => {
      coreLocalization.locale('en');
      config({ ...config(), timeFormat: { default: { locale: 'fi' } } });

      expect((dateLocalization.parse('14:05', 'HH:mm') as Date).getHours()).toBe(14);
      expect(dateLocalization.parse('14.05', 'HH:mm')).toBeFalsy();
      expect((dateLocalization.parse('14.05', { type: 'HH:mm', locale: 'fi' } as never) as Date)
        .getHours()).toBe(14);
    });

    it.each([
      { locale: 'ar-EG', separator: ':' },
      { locale: 'fa', separator: ':' },
      { locale: 'da', separator: '.' },
      { locale: 'en', separator: ':' },
    ])('should return only the time separator of the $locale locale', ({ locale, separator }) => {
      coreLocalization.locale('en');

      expect(internalDateLocalization.getTimeSeparator(locale)).toBe(separator);
    });

    it('should parse an LDML pattern using the format locale month names', () => {
      coreLocalization.locale('en');
      const format = { type: 'dd MMMM yyyy', locale: 'de' };

      const parsed = dateLocalization.parse('15 Juni 2020', format as never) as Date;

      expect(parsed).toEqual(new Date(2020, 5, 15));
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

    it('should use the explicit format locale for the OpenXML currency format of an export', () => {
      coreLocalization.locale('de');
      const messageLocaleFormat = numberLocalization.getOpenXmlCurrencyFormat('EUR');
      const enLocaleFormat = numberLocalization.getOpenXmlCurrencyFormat('EUR', 'en-US');

      config({
        ...config(),
        numberFormat: { default: { locale: 'en-US' } },
      });

      const toExcel = (format: unknown): string | undefined => Export
        .tryConvertToExcelNumberFormat(format, 'number');
      const expectedFor = (openXmlFormat: string | undefined): string => (
        String(openXmlFormat).replace(/\{0\}/g, '')
      );

      expect(numberLocalization.getOpenXmlCurrencyFormat('EUR', 'de')).toBe(messageLocaleFormat);
      expect(toExcel({ type: 'currency', currency: 'EUR', precision: 0 }))
        .toBe(expectedFor(messageLocaleFormat));
      expect(toExcel({
        type: 'currency', currency: 'EUR', precision: 0, locale: 'en-US',
      })).toBe(expectedFor(enLocaleFormat));
    });
  });

  describe('date export', () => {
    const toExcel = (format: unknown): string | undefined => Export
      .tryConvertToExcelNumberFormat(format, 'date');
    const exportInLocale = (locale: string, format: string): string | undefined => {
      const savedLocale = coreLocalization.locale();

      coreLocalization.locale(locale);
      try {
        return toExcel(format);
      } finally {
        coreLocalization.locale(savedLocale);
      }
    };

    it.each(['shortDate', 'longDate', 'monthAndYear'])('should export a %s format with its own locale', (type) => {
      const expected = exportInLocale('de-DE', type);

      coreLocalization.locale('en');

      expect(expected?.startsWith('[$-407]')).toBe(true);
      expect(toExcel({ type, locale: 'de-DE' })).toBe(expected);
      expect(toExcel(type)).not.toBe(expected);
    });

    it('should export a column with the global dateFormat in the dateFormat locale', () => {
      const expected = exportInLocale('de-DE', 'shortDate');

      coreLocalization.locale('en');
      config({
        ...config(),
        dateFormat: { default: { type: 'shortDate', locale: 'de-DE' } },
      });

      expect(toExcel(getGlobalFormatByDataType('date'))).toBe(expected);
    });
  });
});
