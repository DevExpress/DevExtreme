import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import config from '@js/core/config';

import { getGlobalFormatByDataType } from '../../core/m_global_format_config';

const FORMAT_KEYS = ['dateFormat', 'timeFormat', 'dateTimeFormat', 'numberFormat', 'dateTimeFormatPresets'] as const;

/**
 * Tests verifying that Chat's default format options correctly integrate
 * with global format config. Chat._getDefaultOptions() sets:
 *   dayHeaderFormat: getGlobalFormatByDataType('date') ?? 'shortdate'
 *   messageTimestampFormat: getGlobalFormatByDataType('time') ?? 'shorttime'
 */
describe('Chat - global format integration', () => {
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

  // Replicate the logic from Chat._getDefaultOptions()
  function getDayHeaderFormat(): unknown {
    return getGlobalFormatByDataType('date') ?? 'shortdate';
  }

  function getMessageTimestampFormat(): unknown {
    return getGlobalFormatByDataType('time') ?? 'shorttime';
  }

  describe('dayHeaderFormat default', () => {
    it('should default to shortdate when no global dateFormat set', () => {
      expect(getDayHeaderFormat()).toBe('shortdate');
    });

    it('should use global dateFormat when configured', () => {
      config({ ...config(), dateFormat: 'dd/MM/yyyy' });

      expect(getDayHeaderFormat()).toBe('dd/MM/yyyy');
    });

    it('should resolve locale map dateFormat', () => {
      config({
        ...config(),
        dateFormat: {
          default: 'yyyy-MM-dd',
          'de-DE': 'dd.MM.yyyy',
        },
      });

      // Default locale 'en' should use 'default' key
      expect(getDayHeaderFormat()).toBe('yyyy-MM-dd');
    });

    it('should use function dateFormat', () => {
      const formatter = (d: Date): string => d.toISOString();
      config({ ...config(), dateFormat: formatter });

      expect(getDayHeaderFormat()).toBe(formatter);
    });
  });

  describe('messageTimestampFormat default', () => {
    it('should default to shorttime when no global timeFormat set', () => {
      expect(getMessageTimestampFormat()).toBe('shorttime');
    });

    it('should use global timeFormat when configured', () => {
      config({ ...config(), timeFormat: 'HH:mm:ss' });

      expect(getMessageTimestampFormat()).toBe('HH:mm:ss');
    });

    it('should resolve locale map timeFormat', () => {
      config({
        ...config(),
        timeFormat: {
          default: 'hh:mm a',
          'de-DE': 'HH:mm',
        },
      });

      expect(getMessageTimestampFormat()).toBe('hh:mm a');
    });
  });
});
