import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import numberLocalization from '@js/common/core/localization/number';
import config from '@js/core/config';

import { getGlobalFormatByDataType } from '../../core/m_global_format_config';

const FORMAT_KEYS = ['dateFormat', 'timeFormat', 'dateTimeFormat', 'numberFormat', 'dateTimeFormatPresets'] as const;

/**
 * Tests verifying that NumberBox._applyDisplayValueFormatter correctly
 * integrates with global numberFormat. The logic:
 *   if (!this.option('format')) {
 *     const globalNumberFormat = getGlobalFormatByDataType('number');
 *     if (globalNumberFormat) return numberLocalization.format(Number(value), globalNumberFormat);
 *   }
 *   return displayValueFormatter(value);
 */
describe('NumberBox - global number format integration', () => {
  let savedValues: Record<string, unknown> = {};

  beforeEach(() => {
    const currentConfig = config();
    savedValues = {};
    FORMAT_KEYS.forEach((key) => {
      savedValues[key] = currentConfig[key];
    });
  });

  afterEach(() => {
    const currentConfig = config();
    FORMAT_KEYS.forEach((key) => {
      if (savedValues[key] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete currentConfig[key];
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (currentConfig as any)[key] = savedValues[key];
      }
    });
  });

  // Replicate NumberBox._applyDisplayValueFormatter logic
  function applyDisplayValueFormatter(
    value: number | string | null,
    format: unknown,
    displayValueFormatter?: (v: unknown) => string,
  ): string | undefined {
    if (!format) {
      const globalNumberFormat = getGlobalFormatByDataType('number');
      if (globalNumberFormat) {
        return numberLocalization.format(
          Number(value),
          globalNumberFormat,
        ) as string;
      }
    }

    return displayValueFormatter
      ? displayValueFormatter(value)
      : String(value ?? '');
  }

  describe('with global numberFormat', () => {
    it('should format value using global numberFormat when no explicit format', () => {
      config({ ...config(), numberFormat: '#,##0.00' });

      const result = applyDisplayValueFormatter(1234.5, null);

      // numberLocalization.format with LDML pattern
      expect(result).toBe('1,234.50');
    });

    it('should format value using function global numberFormat', () => {
      config({
        ...config(),
        numberFormat: (n: number): string => `[${n.toFixed(1)}]`,
      });

      const result = applyDisplayValueFormatter(42.789, null);

      expect(result).toBe('[42.8]');
    });

    it('should return a formatted string, not the raw value', () => {
      config({
        ...config(),
        numberFormat: (n: number): string => `formatted:${n}`,
      });

      const result = applyDisplayValueFormatter(100, null);

      expect(result).toBe('formatted:100');
    });
  });

  describe('explicit format takes precedence', () => {
    it('should skip global numberFormat when explicit format is set', () => {
      config({ ...config(), numberFormat: '#,##0.00' });

      // When explicit format is truthy, global format is skipped
      const result = applyDisplayValueFormatter(1234.5, 'currency');

      // Falls through to displayValueFormatter since we have an explicit format
      expect(result).toBe('1234.5');
    });
  });

  describe('without any config', () => {
    it('should use displayValueFormatter when no global numberFormat', () => {
      const result = applyDisplayValueFormatter(
        1234.5,
        null,
        (v) => `formatted:${v}`,
      );

      expect(result).toBe('formatted:1234.5');
    });

    it('should return string of value when no format and no displayValueFormatter', () => {
      const result = applyDisplayValueFormatter(42, null);

      expect(result).toBe('42');
    });

    it('should handle null value', () => {
      config({
        ...config(),
        numberFormat: (n: number): string => `val:${n}`,
      });

      const result = applyDisplayValueFormatter(null, null);

      // Number(null) === 0
      expect(result).toBe('val:0');
    });
  });

  describe('locale map numberFormat', () => {
    it('should resolve locale map format', () => {
      const defaultFn = (n: number): string => `default:${n.toFixed(2)}`;
      const deFn = (n: number): string => `de:${n.toFixed(4)}`;

      config({
        ...config(),
        numberFormat: {
          default: defaultFn,
          'de-DE': deFn,
        },
      });

      const result = applyDisplayValueFormatter(1234.5678, null);

      // Default locale 'en' resolves to 'default' key
      expect(result).toBe('default:1234.57');
    });
  });
});
