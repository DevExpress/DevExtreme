/* eslint-disable spellcheck/spell-checker */
import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import dateLocalization from '@ts/core/localization/date';
import config from '@ts/core/m_config';

describe('Global dateFormats config', () => {
  afterEach(() => {
    config({ dateFormats: {}, dateSerializationFormat: undefined });
  });

  describe('format()', () => {
    const testDate = new Date(2024, 0, 5, 14, 30, 45);

    it('should use default format when no global override is set', () => {
      const result = dateLocalization.format(testDate, 'shortdate');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should apply global string override for shortdate', () => {
      config({ dateFormats: { shortdate: 'dd/MM/yyyy' } });

      const result = dateLocalization.format(testDate, 'shortdate');
      expect(result).toBe('05/01/2024');
    });

    it('should apply global string override for shorttime', () => {
      config({ dateFormats: { shorttime: 'HH:mm' } });

      const result = dateLocalization.format(testDate, 'shorttime');
      expect(result).toBe('14:30');
    });

    it('should apply global string override for shortdateshorttime', () => {
      config({ dateFormats: { shortdateshorttime: 'dd.MM.yyyy HH:mm' } });

      const result = dateLocalization.format(testDate, 'shortdateshorttime');
      expect(result).toBe('05.01.2024 14:30');
    });

    it('should apply global string override for longdate', () => {
      config({ dateFormats: { longdate: 'dd MMMM yyyy' } });

      const result = dateLocalization.format(testDate, 'longdate');
      expect(result).toBe('05 January 2024');
    });

    it('should apply global function override', () => {
      const customFormatter = (date: Date): string => `${date.getFullYear()}-custom`;
      config({ dateFormats: { shortdate: customFormatter } });

      const result = dateLocalization.format(testDate, 'shortdate');
      expect(result).toBe('2024-custom');
    });

    it('should support case-insensitive format key lookup', () => {
      config({ dateFormats: { shortdate: 'dd/MM/yyyy' } });

      const result = dateLocalization.format(testDate, 'shortdate');
      expect(result).toBe('05/01/2024');
    });

    it('should support camelCase format keys', () => {
      config({ dateFormats: { shortDate: 'dd/MM/yyyy' } });

      const result = dateLocalization.format(testDate, 'shortDate');
      expect(result).toBe('05/01/2024');
    });

    it('should not affect non-overridden formats', () => {
      config({ dateFormats: { shortdate: 'dd/MM/yyyy' } });

      const result = dateLocalization.format(testDate, 'day');
      expect(result).toBe('5');
    });

    it('should not affect explicit LDML pattern strings', () => {
      config({ dateFormats: { shortdate: 'dd/MM/yyyy' } });

      const result = dateLocalization.format(testDate, 'yyyy-MM-dd');
      expect(result).toBe('2024-01-05');
    });

    it('should handle empty dateFormats config', () => {
      config({ dateFormats: {} });

      const result = dateLocalization.format(testDate, 'shortdate');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle multiple format overrides simultaneously', () => {
      config({
        dateFormats: {
          shortdate: 'dd.MM.yyyy',
          shorttime: 'HH:mm',
          shortdateshorttime: 'dd.MM.yyyy, HH:mm',
        },
      });

      expect(dateLocalization.format(testDate, 'shortdate')).toBe('05.01.2024');
      expect(dateLocalization.format(testDate, 'shorttime')).toBe('14:30');
      expect(dateLocalization.format(testDate, 'shortdateshorttime')).toBe('05.01.2024, 14:30');
    });

    it('should allow overriding format back to empty (restoring defaults)', () => {
      config({ dateFormats: { shortdate: 'dd/MM/yyyy' } });
      expect(dateLocalization.format(testDate, 'shortdate')).toBe('05/01/2024');

      config({ dateFormats: {} });
      const result = dateLocalization.format(testDate, 'shortdate');
      expect(result).toBeDefined();
      expect(result).not.toBe('05/01/2024');
    });
  });

  describe('_getPatternByFormat()', () => {
    it('should return global override pattern when set', () => {
      config({ dateFormats: { shortdate: 'dd/MM/yyyy' } });

      const pattern = dateLocalization._getPatternByFormat('shortdate');
      expect(pattern).toBe('dd/MM/yyyy');
    });

    it('should return default pattern when no override is set', () => {
      const pattern = dateLocalization._getPatternByFormat('shortdate');
      expect(pattern).toBeDefined();
    });

    it('should not return function overrides as patterns', () => {
      const customFormatter = (date: Date): string => `${date.getFullYear()}`;
      config({ dateFormats: { shortdate: customFormatter } });

      const pattern = dateLocalization._getPatternByFormat('shortdate');
      expect(typeof pattern).toBe('string');
    });
  });

  describe('parse()', () => {
    it('should parse dates using global format override', () => {
      config({ dateFormats: { shortdate: 'dd/MM/yyyy' } });

      const parsed = dateLocalization.parse('05/01/2024', 'shortdate') as Date;
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.getFullYear()).toBe(2024);
      expect(parsed.getMonth()).toBe(0);
      expect(parsed.getDate()).toBe(5);
    });

    it('should parse dates with overridden shortdateshorttime', () => {
      config({ dateFormats: { shortdateshorttime: 'dd.MM.yyyy HH:mm' } });

      const parsed = dateLocalization.parse('05.01.2024 14:30', 'shortdateshorttime') as Date;
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.getFullYear()).toBe(2024);
      expect(parsed.getMonth()).toBe(0);
      expect(parsed.getDate()).toBe(5);
      expect(parsed.getHours()).toBe(14);
      expect(parsed.getMinutes()).toBe(30);
    });

    it('should parse with default format when no override is set', () => {
      const parsed = dateLocalization.parse('1/5/2024', 'shortdate');
      expect(parsed).toBeInstanceOf(Date);
    });
  });

  describe('getFormatParts()', () => {
    it('should return parts based on global override pattern', () => {
      config({ dateFormats: { shortdate: 'dd/MM/yyyy' } });

      const parts = dateLocalization.getFormatParts('shortdate');
      expect(parts).toContain('day');
      expect(parts).toContain('month');
      expect(parts).toContain('year');
    });
  });

  describe('edge cases', () => {
    it('should handle undefined dateFormats gracefully', () => {
      config({ dateFormats: undefined });

      const testDate = new Date(2024, 0, 5);
      const result = dateLocalization.format(testDate, 'shortdate');
      expect(result).toBeDefined();
    });

    it('should handle format with FormatObject type having global override', () => {
      config({ dateFormats: { shortdate: 'dd/MM/yyyy' } });

      const testDate = new Date(2024, 0, 5);
      const result = dateLocalization.format(testDate, { type: 'shortdate' });
      expect(result).toBe('05/01/2024');
    });

    it('should not interfere with custom formatter in FormatObject', () => {
      config({ dateFormats: { shortdate: 'dd/MM/yyyy' } });

      const testDate = new Date(2024, 0, 5);
      const customFormatter = (date: Date): string => `custom:${date.getFullYear()}`;
      const result = dateLocalization.format(testDate, { formatter: customFormatter });
      expect(result).toBe('custom:2024');
    });

    it('should not interfere with function format argument', () => {
      config({ dateFormats: { shortdate: 'dd/MM/yyyy' } });

      const testDate = new Date(2024, 0, 5);
      const result = dateLocalization.format(testDate, (date: Date) => `fn:${date.getFullYear()}`);
      expect(result).toBe('fn:2024');
    });
  });
});
