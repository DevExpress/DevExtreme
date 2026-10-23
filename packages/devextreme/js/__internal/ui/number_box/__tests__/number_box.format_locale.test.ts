import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import coreLocalization from '@js/common/core/localization/core';
import numberLocalization from '@js/common/core/localization/number';
import config from '@js/core/config';
import type { Properties } from '@js/ui/number_box';
import NumberBox from '@js/ui/number_box';

const widgets: { dispose: () => void }[] = [];

const createNumberBox = (options: Partial<Properties>): HTMLInputElement => {
  const element = document.body.appendChild(document.createElement('div'));
  const instance = new NumberBox(element, options);

  widgets.push(instance);

  return element.querySelector('.dx-texteditor-input') as HTMLInputElement;
};

describe('explicit number preset keeps the message locale', () => {
  afterEach(() => {
    widgets.forEach((instance) => instance.dispose());
    widgets.length = 0;
    document.body.innerHTML = '';
  });

  it('keeps the message locale for an explicit fixedPoint format', () => {
    const savedLocale = coreLocalization.locale();
    const savedNumberFormat = config().numberFormat;

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

    try {
      const stringFormatInput = createNumberBox({
        value: 1234.56,
        format: 'fixedPoint',
      });
      const objectFormatInput = createNumberBox({
        value: 1234.56,
        format: { type: 'fixedPoint', precision: 0 },
      });

      expect(stringFormatInput.value).toBe('1.235');
      expect(objectFormatInput.value).toBe('1.235');
    } finally {
      const currentConfig = config();

      if (savedNumberFormat === undefined) {
        delete currentConfig.numberFormat;
      } else {
        currentConfig.numberFormat = savedNumberFormat;
      }

      coreLocalization.locale(savedLocale);
    }
  });

  it.each([
    { format: { maximumFractionDigits: 2 }, expectedText: '1.234,5' },
    { format: '#,##0.00', expectedText: '1.234,50' },
    { format: { type: 'currency', precision: 2 }, expectedText: '1.234,50 $' },
    { format: { maximumFractionDigits: 2, locale: 'en-US' }, expectedText: '1,234.5' },
    { format: { type: '#,##0.00', locale: 'en-US' }, expectedText: '1,234.50' },
    { format: undefined, expectedText: '1,234.5' },
  ])('formats and parses back with one locale for $format', ({ format, expectedText }) => {
    const savedLocale = coreLocalization.locale();
    const savedNumberFormat = config().numberFormat;

    coreLocalization.locale('de');
    config({
      ...config(),
      numberFormat: { default: { locale: 'en-US' } },
    });

    try {
      const element = document.body.appendChild(document.createElement('div'));
      const instance = new NumberBox(element, {
        value: 1234.5,
        format: format as Properties['format'],
      });

      widgets.push(instance);

      const input = element.querySelector('.dx-texteditor-input') as HTMLInputElement;
      const editor = instance as NumberBox & {
        _getParsedValue: (text: string, format: unknown) => number | undefined;
        _getFormatPattern: () => unknown;
      };

      expect(input.value).toBe(expectedText);
      expect(editor._getParsedValue(input.value, editor._getFormatPattern())).toBe(1234.5);
    } finally {
      const currentConfig = config();

      if (savedNumberFormat === undefined) {
        delete currentConfig.numberFormat;
      } else {
        currentConfig.numberFormat = savedNumberFormat;
      }

      coreLocalization.locale(savedLocale);
    }
  });

  it.each([
    { name: 'the global numberFormat locale', globalLocale: 'ar-EG', format: undefined },
    { name: 'an explicit format locale', globalLocale: undefined, format: { maximumFractionDigits: 2, locale: 'ar-EG' } },
  ])('parses back non-Latin digits of $name', ({ globalLocale, format }) => {
    const savedLocale = coreLocalization.locale();
    const savedNumberFormat = config().numberFormat;

    coreLocalization.locale('en');
    if (globalLocale) {
      config({ ...config(), numberFormat: { default: { locale: globalLocale } } });
    }

    try {
      const element = document.body.appendChild(document.createElement('div'));
      const instance = new NumberBox(element, {
        value: 1234.5,
        format: format as Properties['format'],
      });

      widgets.push(instance);

      const input = element.querySelector('.dx-texteditor-input') as HTMLInputElement;
      const editor = instance as NumberBox & {
        _getParsedValue: (text: string, format: unknown) => number | undefined;
        _getFormatPattern: () => unknown;
      };

      expect(input.value).toBe('١٬٢٣٤٫٥');
      expect(editor._getParsedValue(input.value, editor._getFormatPattern())).toBe(1234.5);
    } finally {
      const currentConfig = config();

      if (savedNumberFormat === undefined) {
        delete currentConfig.numberFormat;
      } else {
        currentConfig.numberFormat = savedNumberFormat;
      }

      coreLocalization.locale(savedLocale);
    }
  });

  it.each([
    { name: 'function', getFormat: (formatter: (value: number) => string): unknown => formatter },
    { name: 'formatter object', getFormat: (formatter: (value: number) => string): unknown => ({ formatter }) },
  ])('uses the message locale separators for an explicit $name format', ({ getFormat }) => {
    const savedLocale = coreLocalization.locale();
    const savedNumberFormat = config().numberFormat;

    coreLocalization.locale('de');
    config({
      ...config(),
      numberFormat: { default: { locale: 'en-US' } },
    });

    try {
      const formatter = (value: number): string => numberLocalization
        .format(value, { type: 'fixedPoint', precision: 2 });
      const element = document.body.appendChild(document.createElement('div'));
      const instance = new NumberBox(element, {
        value: 1234.5,
        format: getFormat(formatter) as Properties['format'],
      });

      widgets.push(instance);

      const input = element.querySelector('.dx-texteditor-input') as HTMLInputElement;
      const editor = instance as NumberBox & {
        _getDecimalSeparator: () => string;
        _getThousandsSeparator: () => string;
      };

      expect(input.value).toBe('1.234,50');
      expect(editor._getDecimalSeparator()).toBe(',');
      expect(editor._getThousandsSeparator()).toBe('.');
    } finally {
      const currentConfig = config();

      if (savedNumberFormat === undefined) {
        delete currentConfig.numberFormat;
      } else {
        currentConfig.numberFormat = savedNumberFormat;
      }

      coreLocalization.locale(savedLocale);
    }
  });

  it.each([
    { name: 'the global numberFormat locale', globalLocale: 'ar-EG', format: undefined },
    { name: 'an explicit fixedPoint format locale', globalLocale: undefined, format: { type: 'fixedPoint', precision: 1, locale: 'ar-EG' } },
    { name: 'an explicit Intl format locale', globalLocale: undefined, format: { maximumFractionDigits: 2, locale: 'ar-EG' } },
  ])('keeps the sign of a negative value with non-Latin digits of $name', ({ globalLocale, format }) => {
    const savedLocale = coreLocalization.locale();
    const savedNumberFormat = config().numberFormat;

    coreLocalization.locale('en');
    if (globalLocale) {
      config({ ...config(), numberFormat: { default: { locale: globalLocale } } });
    }

    try {
      const element = document.body.appendChild(document.createElement('div'));
      const instance = new NumberBox(element, {
        value: -1234.5,
        format: format as Properties['format'],
      });

      widgets.push(instance);

      const input = element.querySelector('.dx-texteditor-input') as HTMLInputElement;
      const editor = instance as NumberBox & {
        _getParsedValue: (text: string, format: unknown) => number | undefined;
        _getFormatPattern: () => unknown;
      };

      expect(editor._getParsedValue(input.value, editor._getFormatPattern())).toBe(-1234.5);
    } finally {
      const currentConfig = config();

      if (savedNumberFormat === undefined) {
        delete currentConfig.numberFormat;
      } else {
        currentConfig.numberFormat = savedNumberFormat;
      }

      coreLocalization.locale(savedLocale);
    }
  });
});
