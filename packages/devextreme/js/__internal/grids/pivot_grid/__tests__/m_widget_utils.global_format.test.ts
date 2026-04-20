import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import config from '@js/core/config';

import { setDefaultFieldValueFormatting } from '../m_widget_utils';

const FORMAT_KEYS = ['dateFormat', 'timeFormat', 'dateTimeFormat', 'numberFormat', 'dateTimeFormatPresets'] as const;

describe('PivotGrid - setDefaultFieldValueFormatting global format', () => {
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

  describe('date field formatting', () => {
    it('should use global dateFormat when no format or groupInterval is set', () => {
      config({ ...config(), dateFormat: 'dd/MM/yyyy' });

      const field: Record<string, unknown> = { dataType: 'date' };
      setDefaultFieldValueFormatting(field);

      expect(field.format).toBe('dd/MM/yyyy');
    });

    it('should use DATE_INTERVAL_FORMATS when groupInterval is set (e.g. month)', () => {
      config({ ...config(), dateFormat: 'dd/MM/yyyy' });

      const field: Record<string, unknown> = { dataType: 'date', groupInterval: 'month' };
      setDefaultFieldValueFormatting(field);

      // groupInterval "month" maps to a function in DATE_INTERVAL_FORMATS
      expect(typeof field.format).toBe('function');
    });

    it('should prefer DATE_INTERVAL_FORMATS over global dateFormat', () => {
      config({ ...config(), dateFormat: 'dd/MM/yyyy' });

      const field: Record<string, unknown> = { dataType: 'date', groupInterval: 'quarter' };
      setDefaultFieldValueFormatting(field);

      // quarter maps to a DATE_INTERVAL_FORMATS function
      expect(typeof field.format).toBe('function');
    });

    it('should not set format when groupInterval has no matching DATE_INTERVAL_FORMAT and no global dateFormat', () => {
      const field: Record<string, unknown> = { dataType: 'date', groupInterval: 'year' };
      setDefaultFieldValueFormatting(field);

      // 'year' has no entry in DATE_INTERVAL_FORMATS and no global dateFormat
      expect(field.format).toBeUndefined();
    });

    it('should use global dateFormat when groupInterval has no matching DATE_INTERVAL_FORMAT', () => {
      config({ ...config(), dateFormat: 'dd/MM/yyyy' });

      const field: Record<string, unknown> = { dataType: 'date', groupInterval: 'year' };
      setDefaultFieldValueFormatting(field);

      expect(field.format).toBe('dd/MM/yyyy');
    });

    it('should not override explicit field.format', () => {
      config({ ...config(), dateFormat: 'dd/MM/yyyy' });

      const field: Record<string, unknown> = { dataType: 'date', format: 'yyyy-MM-dd' };
      setDefaultFieldValueFormatting(field);

      expect(field.format).toBe('yyyy-MM-dd');
    });
  });

  describe('non-date fields', () => {
    it('should not set format for number field without groupInterval', () => {
      config({ ...config(), numberFormat: '#,##0.00' });

      const field: Record<string, unknown> = { dataType: 'number' };
      setDefaultFieldValueFormatting(field);

      // Number fields don't get a default format from setDefaultFieldValueFormatting
      // (number format is handled via formatHelper.format at display time)
      expect(field.format).toBeUndefined();
    });

    it('should not set format for string field', () => {
      const field: Record<string, unknown> = { dataType: 'string' };
      setDefaultFieldValueFormatting(field);

      expect(field.format).toBeUndefined();
    });
  });
});
