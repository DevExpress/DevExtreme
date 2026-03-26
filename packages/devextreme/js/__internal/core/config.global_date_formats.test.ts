/* eslint-disable spellcheck/spell-checker */
import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import config from '@ts/core/m_config';

describe('Global config - dateFormats and dateSerializationFormat', () => {
  afterEach(() => {
    config({ dateFormats: {}, dateSerializationFormat: '' });
  });

  describe('dateFormats', () => {
    it('should default to empty object', () => {
      expect(config().dateFormats).toEqual({});
    });

    it('should accept string format overrides', () => {
      config({ dateFormats: { shortdate: 'dd/MM/yyyy' } });
      expect(config().dateFormats.shortdate).toBe('dd/MM/yyyy');
    });

    it('should accept function format overrides', () => {
      const formatter = (date: Date): string => `${date.getFullYear()}`;
      config({ dateFormats: { shortdate: formatter } });
      expect(config().dateFormats.shortdate).toBe(formatter);
    });

    it('should accept multiple format overrides', () => {
      config({
        dateFormats: {
          shortdate: 'dd/MM/yyyy',
          shorttime: 'HH:mm',
          shortdateshorttime: 'dd/MM/yyyy HH:mm',
        },
      });

      expect(config().dateFormats.shortdate).toBe('dd/MM/yyyy');
      expect(config().dateFormats.shorttime).toBe('HH:mm');
      expect(config().dateFormats.shortdateshorttime).toBe('dd/MM/yyyy HH:mm');
    });

    it('should be clearable by setting to empty object', () => {
      config({ dateFormats: { shortdate: 'dd/MM/yyyy' } });
      config({ dateFormats: {} });
      expect(config().dateFormats).toEqual({});
    });
  });

  describe('dateSerializationFormat', () => {
    it('should have falsy default value', () => {
      expect(config().dateSerializationFormat || undefined).toBeUndefined();
    });

    it('should accept a format string', () => {
      config({ dateSerializationFormat: 'yyyy-MM-dd' });
      expect(config().dateSerializationFormat).toBe('yyyy-MM-dd');
    });

    it('should accept ISO format with time', () => {
      config({ dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ss' });
      expect(config().dateSerializationFormat).toBe('yyyy-MM-ddTHH:mm:ss');
    });

    it('should be clearable by setting to empty string', () => {
      config({ dateSerializationFormat: 'yyyy-MM-dd' });
      config({ dateSerializationFormat: '' });
      expect(config().dateSerializationFormat).toBe('');
    });
  });

  describe('coexistence with other config options', () => {
    it('should not affect existing config options', () => {
      const originalRtl = config().rtlEnabled;
      const originalCurrency = config().defaultCurrency;

      config({
        dateFormats: { shortdate: 'dd/MM/yyyy' },
        dateSerializationFormat: 'yyyy-MM-dd',
      });

      expect(config().rtlEnabled).toBe(originalRtl);
      expect(config().defaultCurrency).toBe(originalCurrency);
    });

    it('should persist alongside other config changes', () => {
      config({ dateFormats: { shortdate: 'dd/MM/yyyy' } });
      config({ editorStylingMode: 'outlined' });

      expect(config().dateFormats.shortdate).toBe('dd/MM/yyyy');
    });
  });
});
