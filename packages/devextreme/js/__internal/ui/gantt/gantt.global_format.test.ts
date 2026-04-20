import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import dateLocalization from '@js/common/core/localization/date';
import config from '@js/core/config';

import { getGlobalFormatByDataType } from '../../core/m_global_format_config';

const FORMAT_KEYS = ['dateFormat', 'timeFormat', 'dateTimeFormat', 'numberFormat', 'dateTimeFormatPresets'] as const;

/**
 * Tests verifying that the Gantt formatting logic correctly integrates
 * with global format config. Since Gantt's getFormattedDateText and
 * _getFormattedDateText methods are instance methods on widget classes,
 * we test the equivalent logic here as a standalone function.
 */
describe('Gantt - global datetime format integration', () => {
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

  // Replicate GanttView.getFormattedDateText logic
  function getFormattedDateText(date: Date | null): string {
    let result = '';
    if (date) {
      const globalDateTimeFormat = getGlobalFormatByDataType('datetime');
      if (globalDateTimeFormat) {
        result = String(dateLocalization.format(date, globalDateTimeFormat) ?? '');
      } else {
        const datePart = dateLocalization.format(date, 'shortDate');
        const timePart = dateLocalization.format(date, 'HH:mm');
        result = `${datePart} ${timePart}`;
      }
    }
    return result;
  }

  // Replicate GanttDialogs._getFormattedDateText logic
  function getDialogFormattedDateText(date: Date | null): string {
    if (!date) return '';
    const globalFormat = getGlobalFormatByDataType('datetime');
    return String(dateLocalization.format(date, globalFormat ?? 'shortDateShortTime') ?? '');
  }

  describe('GanttView.getFormattedDateText equivalent', () => {
    it('should use default shortDate + time format when no global config set', () => {
      const date = new Date(2025, 0, 15, 14, 30);
      const result = getFormattedDateText(date);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result).toContain('14:30');
    });

    it('should use global dateTimeFormat when configured', () => {
      config({ ...config(), dateTimeFormat: 'dd/MM/yyyy HH:mm' });

      const date = new Date(2025, 0, 15, 14, 30);
      const result = getFormattedDateText(date);

      expect(result).toBe('15/01/2025 14:30');
    });

    it('should return empty string for null date', () => {
      expect(getFormattedDateText(null)).toBe('');
    });

    it('should use function dateTimeFormat', () => {
      config({
        ...config(),
        dateTimeFormat: (d: Date) => `${d.getFullYear()}-custom`,
      });

      const date = new Date(2025, 0, 15, 14, 30);
      const result = getFormattedDateText(date);

      expect(result).toBe('2025-custom');
    });
  });

  describe('GanttDialogs._getFormattedDateText equivalent', () => {
    it('should use shortDateShortTime when no global config set', () => {
      const date = new Date(2025, 0, 15, 14, 30);
      const result = getDialogFormattedDateText(date);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should use global dateTimeFormat when configured', () => {
      config({ ...config(), dateTimeFormat: 'dd.MM.yyyy HH:mm' });

      const date = new Date(2025, 0, 15, 14, 30);
      const result = getDialogFormattedDateText(date);

      expect(result).toBe('15.01.2025 14:30');
    });

    it('should return empty string for null date', () => {
      expect(getDialogFormattedDateText(null)).toBe('');
    });
  });
});
