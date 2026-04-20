import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import dateLocalization from '@js/common/core/localization/date';
import config from '@js/core/config';

const GLOBAL_FORMAT_KEYS = ['dateFormat', 'timeFormat', 'dateTimeFormat', 'numberFormat', 'dateTimeFormatPresets'] as const;

const saveAndRestore = (): { save: () => void; restore: () => void } => {
  let savedValues: Record<string, unknown> = {};

  return {
    save() {
      const currentConfig = config();

      savedValues = {};
      GLOBAL_FORMAT_KEYS.forEach((key) => {
        savedValues[key] = currentConfig[key];
      });
    },
    restore() {
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
    },
  };
};

describe('date localization - dateTimeFormatPresets', () => {
  const { save, restore } = saveAndRestore();

  beforeEach(() => { save(); });
  afterEach(() => { restore(); });

  describe('string preset override', () => {
    it('should override shortDate with custom LDML pattern', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: 'dd/MM/yyyy',
        },
      });

      const result = dateLocalization.format(new Date(2020, 0, 2), 'shortDate');

      expect(result).toBe('02/01/2020');
    });

    it('should override shortTime with custom LDML pattern', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortTime: 'HH:mm:ss',
        },
      });

      const result = dateLocalization.format(new Date(2020, 0, 2, 14, 5, 30), 'shortTime');

      expect(result).toBe('14:05:30');
    });

    it('should override longDate with custom LDML pattern', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          longDate: 'dd MMMM yyyy',
        },
      });

      const result = dateLocalization.format(new Date(2020, 0, 2), 'longDate');

      expect(result).toBe('02 January 2020');
    });

    it('should override shortDateShortTime with custom LDML pattern', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDateShortTime: 'dd/MM/yyyy HH:mm',
        },
      });

      const result = dateLocalization.format(new Date(2020, 0, 2, 14, 5), 'shortDateShortTime');

      expect(result).toBe('02/01/2020 14:05');
    });
  });

  describe('function preset override', () => {
    it('should use function override for shortDate', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: (d: Date) => `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`,
        },
      });

      const result = dateLocalization.format(new Date(2020, 0, 2), 'shortDate');

      expect(result).toBe('2-1-2020');
    });

    it('should use function override for shortTime', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortTime: (d: Date) => `${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')}`,
        },
      });

      const result = dateLocalization.format(new Date(2020, 0, 2, 14, 5), 'shortTime');

      expect(result).toBe('14h05');
    });
  });

  describe('case insensitivity', () => {
    it('should apply override regardless of case in format name', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: 'dd/MM/yyyy',
        },
      });

      const date = new Date(2020, 0, 2);

      expect(dateLocalization.format(date, 'shortdate')).toBe('02/01/2020');
      expect(dateLocalization.format(date, 'SHORTDATE')).toBe('02/01/2020');
      expect(dateLocalization.format(date, 'ShortDate')).toBe('02/01/2020');
    });
  });

  describe('locale map in preset', () => {
    it('should resolve preset with default locale', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: {
            default: 'dd/MM/yyyy',
            'de-DE': 'dd.MM.yyyy',
          },
        },
      });

      const result = dateLocalization.format(new Date(2020, 0, 2), 'shortDate');

      expect(result).toBe('02/01/2020');
    });
  });

  describe('no override', () => {
    it('should use built-in format when no preset override is configured', () => {
      const result = dateLocalization.format(new Date(2020, 0, 2), 'shortDate');

      // Built-in Intl format for en locale
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should leave non-preset string formats unaffected', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: 'dd/MM/yyyy',
        },
      });

      const result = dateLocalization.format(new Date(2020, 0, 2), 'yyyy-MM-dd');

      // LDML pattern should be used directly, not affected by preset overrides
      expect(result).toBe('2020-01-02');
    });

    it('should leave FormatObject formats unaffected', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: 'dd/MM/yyyy',
        },
      });

      const customFormatter = (value: number | Date): string => {
        const d = value instanceof Date ? value : new Date(value);
        return `custom:${d.getFullYear()}`;
      };
      const result = dateLocalization.format(new Date(2020, 0, 2), { formatter: customFormatter });

      expect(result).toBe('custom:2020');
    });

    it('should not affect formatting when dateTimeFormatPresets is empty', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {},
      });

      const result = dateLocalization.format(new Date(2020, 0, 2), 'shortDate');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('unknown preset key', () => {
    it('should safely ignore unknown preset keys', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          unknownFormat: 'dd/MM/yyyy',
        },
      });

      // Known presets should still work normally
      const result = dateLocalization.format(new Date(2020, 0, 2), 'shortDate');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('preset override aliases another preset', () => {
    it('should support aliasing one preset to another', () => {
      config({
        ...config(),
        dateTimeFormatPresets: {
          shortDate: 'longDate',
        },
      });

      const dateLong = dateLocalization.format(new Date(2020, 0, 2), 'longDate');
      const dateShort = dateLocalization.format(new Date(2020, 0, 2), 'shortDate');

      // shortDate should now format like longDate
      expect(dateShort).toBe(dateLong);
    });
  });
});

describe('date localization - global *Format precedence', () => {
  const { save, restore } = saveAndRestore();

  beforeEach(() => { save(); });
  afterEach(() => { restore(); });

  it('should apply dateFormat for direct calls with the resolved format', () => {
    config({
      ...config(),
      dateFormat: 'dd/MM/yyyy',
    });

    const result = dateLocalization.format(new Date(2020, 0, 2), config().dateFormat);

    expect(result).toBe('02/01/2020');
  });

  it('should apply dateTimeFormat for direct calls with the resolved format', () => {
    config({
      ...config(),
      dateTimeFormat: 'dd/MM/yyyy, HH:mm',
    });

    const result = dateLocalization.format(new Date(2020, 0, 2, 14, 5), config().dateTimeFormat);

    expect(result).toBe('02/01/2020, 14:05');
  });
});
