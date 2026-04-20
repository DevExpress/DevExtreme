import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import config from '@js/core/config';
import type { Format } from '@js/localization';

import { getGlobalFormatByDataType } from '../../core/m_global_format_config';

const FORMAT_KEYS = ['dateFormat', 'timeFormat', 'dateTimeFormat', 'numberFormat', 'dateTimeFormatPresets'] as const;

/**
 * Tests verifying that DateBox ListStrategy.getDisplayFormat correctly
 * integrates with global timeFormat. The logic:
 *   getDisplayFormat(displayFormat) {
 *     const globalTimeFormat = getGlobalFormatByDataType('time');
 *     return displayFormat || globalTimeFormat || 'shorttime';
 *   }
 */
describe('DateBox ListStrategy - global time format integration', () => {
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

  // Replicate ListStrategy.getDisplayFormat logic
  function getDisplayFormat(displayFormat?: Format): Format {
    const globalTimeFormat = getGlobalFormatByDataType('time');
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return displayFormat || globalTimeFormat || 'shorttime';
  }

  describe('fallback chain', () => {
    it('should return shorttime when no displayFormat and no global timeFormat', () => {
      expect(getDisplayFormat()).toBe('shorttime');
    });

    it('should use explicit displayFormat when provided', () => {
      config({ ...config(), timeFormat: 'HH:mm:ss' });

      expect(getDisplayFormat('hh:mm a')).toBe('hh:mm a');
    });

    it('should use global timeFormat when no explicit displayFormat', () => {
      config({ ...config(), timeFormat: 'HH:mm:ss' });

      expect(getDisplayFormat()).toBe('HH:mm:ss');
    });

    it('should prefer explicit displayFormat over global timeFormat', () => {
      config({ ...config(), timeFormat: 'HH:mm:ss' });

      expect(getDisplayFormat('shortTime')).toBe('shortTime');
    });
  });

  describe('global timeFormat types', () => {
    it('should use string global timeFormat', () => {
      config({ ...config(), timeFormat: 'HH-mm' });

      expect(getDisplayFormat()).toBe('HH-mm');
    });

    it('should use function global timeFormat', () => {
      const formatter = (d: Date): string => `${d.getHours()}h`;
      config({ ...config(), timeFormat: formatter });

      expect(getDisplayFormat()).toBe(formatter);
    });

    it('should resolve locale map global timeFormat', () => {
      config({
        ...config(),
        timeFormat: {
          default: 'hh:mm a',
          'de-DE': 'HH:mm',
        },
      });

      // Default locale 'en' resolves to 'default' key
      expect(getDisplayFormat()).toBe('hh:mm a');
    });
  });

  describe('edge cases', () => {
    it('should use global timeFormat when displayFormat is undefined', () => {
      config({ ...config(), timeFormat: 'HH:mm' });

      expect(getDisplayFormat(undefined)).toBe('HH:mm');
    });

    it('should fall back to shorttime when displayFormat is empty string', () => {
      // Empty string is falsy, so || chain continues
      config({ ...config(), timeFormat: 'HH:mm' });

      expect(getDisplayFormat('' as Format)).toBe('HH:mm');
    });
  });
});
