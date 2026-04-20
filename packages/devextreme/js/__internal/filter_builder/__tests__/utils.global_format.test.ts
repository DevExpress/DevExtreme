import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import config from '@js/core/config';
import type { Field } from '@js/ui/filter_builder';

import { getCurrentValueText } from '../m_utils';

const FORMAT_KEYS = ['dateFormat', 'timeFormat', 'dateTimeFormat', 'numberFormat', 'dateTimeFormatPresets'] as const;

describe('FilterBuilder - global format integration', () => {
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

  describe('date fields with global dateFormat', () => {
    it('should use global dateFormat when field has no explicit format', () => {
      config({ ...config(), dateFormat: 'dd/MM/yyyy' });

      const field: Field = { dataType: 'date' };
      const value = new Date(2025, 0, 15);

      expect(getCurrentValueText(field, value, null)).toBe('15/01/2025');
    });

    it('should prefer explicit field.format over global dateFormat', () => {
      config({ ...config(), dateFormat: 'dd/MM/yyyy' });

      const field: Field = { dataType: 'date', format: 'yyyy-MM-dd' };
      const value = new Date(2025, 0, 15);

      expect(getCurrentValueText(field, value, null)).toBe('2025-01-15');
    });

    it('should fall back to shortDate when no global dateFormat and no field format', () => {
      const field: Field = { dataType: 'date' };
      const value = new Date(2025, 0, 15);

      const result = getCurrentValueText(field, value, null);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('datetime fields with global dateTimeFormat', () => {
    it('should use global dateTimeFormat when field has no explicit format', () => {
      config({ ...config(), dateTimeFormat: 'dd/MM/yyyy HH:mm' });

      const field: Field = { dataType: 'datetime' };
      const value = new Date(2025, 0, 15, 14, 30);

      expect(getCurrentValueText(field, value, null)).toBe('15/01/2025 14:30');
    });

    it('should prefer explicit field.format over global dateTimeFormat', () => {
      config({ ...config(), dateTimeFormat: 'dd/MM/yyyy HH:mm' });

      const field: Field = { dataType: 'datetime', format: 'yyyy-MM-dd' };
      const value = new Date(2025, 0, 15, 14, 30);

      expect(getCurrentValueText(field, value, null)).toBe('2025-01-15');
    });
  });

  describe('number fields', () => {
    it('should use built-in shortDate format for date field when no global format set', () => {
      const field: Field = { dataType: 'date' };
      const value = new Date(2017, 8, 5, 12, 30, 0);

      // This is the existing behavior — should keep working
      expect(getCurrentValueText(field, value, null)).toBe('9/5/2017');
    });
  });

  describe('dateTimeFormatPresets interaction', () => {
    it('should apply preset override to shortDate default format', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: 'dd.MM.yyyy',
        },
      });

      const field: Field = { dataType: 'date' };
      const value = new Date(2025, 0, 15);

      // With no global dateFormat set, falls back to DEFAULT_FORMAT['date'] = 'shortDate'
      // The preset override should be applied via dateLocalization.format()
      expect(getCurrentValueText(field, value, null)).toBe('15.01.2025');
    });
  });
});
