import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import config from '@js/core/config';

import { getGlobalFormatByDataType, resolvePresetOverride } from './m_global_format_config';

const GLOBAL_FORMAT_KEYS = ['dateFormat', 'timeFormat', 'dateTimeFormat', 'numberFormat', 'dateTimeFormatPresets'] as const;

describe('m_global_format_config', () => {
  let savedValues: Record<string, unknown>;

  beforeEach(() => {
    const currentConfig = config();

    savedValues = {};
    GLOBAL_FORMAT_KEYS.forEach((key) => {
      savedValues[key] = currentConfig[key];
    });
  });

  afterEach(() => {
    const currentConfig = config();

    GLOBAL_FORMAT_KEYS.forEach((key) => {
      if (savedValues[key] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete currentConfig[key];
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (currentConfig as any)[key] = savedValues[key];
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
});
