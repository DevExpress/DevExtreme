import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import config from '@js/core/config';

const FORMAT_KEYS = ['dateFormat', 'timeFormat', 'dateTimeFormat', 'numberFormat', 'dateTimeFormatPresets'] as const;

describe('config() - clearing format properties with undefined', () => {
  let savedValues: Record<string, unknown>;

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (currentConfig as any)[key] = savedValues[key];
    });
  });

  it('should clear dateFormat when set to undefined', () => {
    config({ dateFormat: 'dd/MM/yyyy' });
    expect(config().dateFormat).toBe('dd/MM/yyyy');

    config({ dateFormat: undefined });
    expect(config().dateFormat).toBeUndefined();
  });

  it('should clear timeFormat when set to undefined', () => {
    config({ timeFormat: 'HH:mm:ss' });
    expect(config().timeFormat).toBe('HH:mm:ss');

    config({ timeFormat: undefined });
    expect(config().timeFormat).toBeUndefined();
  });

  it('should clear dateTimeFormat when set to undefined', () => {
    config({ dateTimeFormat: 'dd/MM/yyyy HH:mm' });
    expect(config().dateTimeFormat).toBe('dd/MM/yyyy HH:mm');

    config({ dateTimeFormat: undefined });
    expect(config().dateTimeFormat).toBeUndefined();
  });

  it('should clear numberFormat when set to undefined', () => {
    config({ numberFormat: '#,##0.00' });
    expect(config().numberFormat).toBe('#,##0.00');

    config({ numberFormat: undefined });
    expect(config().numberFormat).toBeUndefined();
  });

  it('should clear dateTimeFormatPresets when set to undefined', () => {
    config({ dateTimeFormatPresets: { shortDate: 'dd/MM/yyyy' } });
    expect(config().dateTimeFormatPresets).toEqual({ shortDate: 'dd/MM/yyyy' });

    config({ dateTimeFormatPresets: undefined });
    expect(config().dateTimeFormatPresets).toBeUndefined();
  });

  it('should clear all format keys at once', () => {
    config({
      dateFormat: 'dd/MM/yyyy',
      timeFormat: 'HH:mm',
      dateTimeFormat: 'dd/MM/yyyy HH:mm',
      numberFormat: '#,##0.00',
      dateTimeFormatPresets: { shortDate: 'dd/MM/yyyy' },
    });

    config({
      dateFormat: undefined,
      timeFormat: undefined,
      dateTimeFormat: undefined,
      numberFormat: undefined,
      dateTimeFormatPresets: undefined,
    });

    expect(config().dateFormat).toBeUndefined();
    expect(config().timeFormat).toBeUndefined();
    expect(config().dateTimeFormat).toBeUndefined();
    expect(config().numberFormat).toBeUndefined();
    expect(config().dateTimeFormatPresets).toBeUndefined();
  });

  it('should not affect non-format properties when clearing format keys', () => {
    const originalRtl = config().rtlEnabled;

    config({
      dateFormat: 'dd/MM/yyyy',
      rtlEnabled: true,
    });

    config({
      dateFormat: undefined,
    });

    expect(config().dateFormat).toBeUndefined();
    expect(config().rtlEnabled).toBe(true);

    // Restore
    config({ rtlEnabled: originalRtl });
  });

  it('should allow re-setting a format after clearing', () => {
    config({ dateFormat: 'dd/MM/yyyy' });
    config({ dateFormat: undefined });
    config({ dateFormat: 'yyyy-MM-dd' });

    expect(config().dateFormat).toBe('yyyy-MM-dd');
  });

  it('should not clear a format key if it is not in the newConfig object', () => {
    config({ dateFormat: 'dd/MM/yyyy', timeFormat: 'HH:mm' });

    // Only clear dateFormat, timeFormat should remain
    config({ dateFormat: undefined });

    expect(config().dateFormat).toBeUndefined();
    expect(config().timeFormat).toBe('HH:mm');
  });
});
