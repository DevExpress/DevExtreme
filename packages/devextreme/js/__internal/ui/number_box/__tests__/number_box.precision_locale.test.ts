import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import config from '@js/core/config';
import NumberBox from '@js/ui/number_box';
import type { CaretRange } from '@ts/ui/text_box/utils.caret';

interface NumberBoxMaskInternals {
  _tryParse: (text: string, selection: CaretRange, char?: string) => number | undefined;
  _getDecimalSeparator: () => string;
  _getPrecisionLimits: (pattern: string) => { min: number; max: number };
}

const widgets: NumberBox[] = [];

describe('NumberBox precision limits with a locale-only Intl format', () => {
  afterEach(() => {
    widgets.forEach((widget) => widget.dispose());
    widgets.length = 0;
    document.body.innerHTML = '';
    config({ numberFormat: undefined });
    jest.restoreAllMocks();
  });

  const createEditor = (format?: Record<string, unknown>): NumberBoxMaskInternals => {
    const element = document.body.appendChild(document.createElement('div'));
    const instance = new NumberBox(element, { value: 1234, format });

    widgets.push(instance);

    return instance as unknown as NumberBoxMaskInternals;
  };

  const typeDecimalSeparator = (editor: NumberBoxMaskInternals): number | undefined => editor
    ._tryParse('1234', { start: 4, end: 4 }, editor._getDecimalSeparator());

  it('accepts the decimal separator when the format only specifies a locale', () => {
    const editor = createEditor({ locale: 'fr' });

    expect(editor._getDecimalSeparator()).toBe(',');
    expect(typeDecimalSeparator(editor)).toBeDefined();
  });

  it('accepts the decimal separator when the format is an empty object', () => {
    const editor = createEditor({});

    expect(typeDecimalSeparator(editor)).toBeDefined();
  });

  it('accepts the decimal separator when the global number format only specifies a locale', () => {
    config({ numberFormat: { default: { locale: 'fr' } } });
    const editor = createEditor();

    expect(editor._getDecimalSeparator()).toBe(',');
    expect(typeDecimalSeparator(editor)).toBeDefined();
  });

  it('accepts the decimal separator when the global number format is an empty object', () => {
    config({ numberFormat: { default: {} } });
    const editor = createEditor();

    expect(typeDecimalSeparator(editor)).toBeDefined();
  });

  it('limits fraction digits to the Intl default for a locale-only format', () => {
    const editor = createEditor({ locale: 'fr' });

    expect(editor._tryParse('1234,567', { start: 8, end: 8 }, '8')).toBe(1234.567);
  });

  it('accepts the decimal separator when the format only limits significant digits', () => {
    const editor = createEditor({ locale: 'fr', maximumSignificantDigits: 6 });

    expect(typeDecimalSeparator(editor)).toBeDefined();
  });

  it('rejects the decimal separator when the format forbids fraction digits', () => {
    const editor = createEditor({ locale: 'fr', maximumFractionDigits: 0 });

    expect(typeDecimalSeparator(editor)).toBeUndefined();
  });

  it('uses the pattern precision when Intl is unavailable', () => {
    const editor = createEditor({ locale: 'fr' });
    const intl = globalThis.Intl;

    Reflect.deleteProperty(globalThis, 'Intl');

    try {
      expect(editor._getPrecisionLimits('#,##0.00##')).toEqual({ min: 2, max: 4 });
    } finally {
      Object.defineProperty(globalThis, 'Intl', {
        value: intl,
        configurable: true,
        writable: true,
      });
    }
  });
});
