/* eslint-disable spellcheck/spell-checker */
import type { Format as LocalizationFormat, FormatObject } from '@js/localization';
import localizationCoreUtils from '@ts/core/localization/core';
import type { DateFormatter, Format } from '@ts/core/localization/date';
import { resolvePresetOverride } from '@ts/core/m_global_format_config';
import { extend } from '@ts/core/utils/m_extend';

interface DateArgs {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  ms?: number;
}

const SYMBOLS_TO_REMOVE_REGEX = /[\u200E\u200F]/g;
const NARROW_NO_BREAK_SPACE_REGEX = /[\u202F]/g;

const formattersCache: Record<string, DateFormatter> = {};
const getFormatter = (format: Intl.DateTimeFormatOptions): DateFormatter => {
  const key = `${localizationCoreUtils.locale()}/${JSON.stringify(format)}`;
  if (!formattersCache[key]) {
    formattersCache[key] = new Intl.DateTimeFormat(localizationCoreUtils.locale(), format).format;
  }

  return formattersCache[key];
};

function formatDateTime(date: Date, format: Intl.DateTimeFormatOptions): string {
  return getFormatter(format)(date)
    .replace(SYMBOLS_TO_REMOVE_REGEX, '')
    .replace(NARROW_NO_BREAK_SPACE_REGEX, ' ');
}

const getIntlFormatter = (format: Intl.DateTimeFormatOptions) => (date: Date): string => {
  // NOTE: Intl in some browsers formates dates with timezone offset
  // which was at the moment for this date.
  // But the method "new Date" creates date using current offset.
  // So, we decided to format dates in the UTC timezone.
  if (!format.timeZoneName) {
    const year = date.getFullYear();
    // NOTE: new Date(99,0,1) will return 1999 year, but 99 expected
    const recognizableAsTwentyCentury = String(year).length < 3;
    const safeYearShift = 400;
    const temporaryYearValue = recognizableAsTwentyCentury ? year + safeYearShift : year;
    const utcDate = new Date(
      Date.UTC(
        temporaryYearValue,
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
      ),
    );
    if (recognizableAsTwentyCentury) {
      utcDate.setFullYear(year);
    }
    const utcFormat = extend({ timeZone: 'UTC' }, format);

    return formatDateTime(utcDate, utcFormat);
  }

  return formatDateTime(date, format);
};

// eslint-disable-next-line @stylistic/max-len
const formatNumber = (number: number): string => new Intl.NumberFormat(localizationCoreUtils.locale()).format(number);

const getAlternativeNumeralsMap = (() => {
  const numeralsMapCache: Record<string, false | Record<string, number>> = {};

  return (locale: string): false | Record<string, number> => {
    if (!(locale in numeralsMapCache)) {
      if (formatNumber(0) === '0') {
        numeralsMapCache[locale] = false;
        return false;
      }
      numeralsMapCache[locale] = {};
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 10; ++i) {
        numeralsMapCache[locale][formatNumber(i)] = i;
      }
    }

    return numeralsMapCache[locale];
  };
})();

const normalizeNumerals = (dateString: string): string => {
  const alternativeNumeralsMap = getAlternativeNumeralsMap(localizationCoreUtils.locale());

  if (!alternativeNumeralsMap) {
    return dateString;
  }

  return dateString
    .split('')
    .map((sign) => (sign in alternativeNumeralsMap ? String(alternativeNumeralsMap[sign]) : sign))
    .join('');
};

const removeLeadingZeroes = (str: string): string => str.replace(/(\D)0+(\d)/g, '$1$2');
const dateStringEquals = (
  actual: string,
  expected: string,
): boolean => removeLeadingZeroes(actual) === removeLeadingZeroes(expected);

const normalizeMonth = (text: string): string => text.replace('d\u2019', 'de '); // NOTE: For "ca" locale

const intlFormats = {
  day: { day: 'numeric' },
  date: { year: 'numeric', month: 'long', day: 'numeric' },
  dayofweek: { weekday: 'long' },
  longdate: {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  },
  longdatelongtime: {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
  },
  longtime: { hour: 'numeric', minute: 'numeric', second: 'numeric' },
  month: { month: 'long' },
  monthandday: { month: 'long', day: 'numeric' },
  monthandyear: { year: 'numeric', month: 'long' },
  shortdate: {},
  shorttime: { hour: 'numeric', minute: 'numeric' },
  shortyear: { year: '2-digit' },
  year: { year: 'numeric' },
};

Object.defineProperty(intlFormats, 'shortdateshorttime', {
  get() {
    const defaultOptions = Intl.DateTimeFormat(localizationCoreUtils.locale()).resolvedOptions();

    return {
      year: defaultOptions.year, month: defaultOptions.month, day: defaultOptions.day, hour: 'numeric', minute: 'numeric',
    };
  },
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const getIntlFormat = (format): Intl.DateTimeFormatOptions => typeof format === 'string' && intlFormats[format.toLowerCase()];

const monthNameStrategies = {
  standalone(monthIndex: number, monthFormat: Intl.DateTimeFormatOptions['month']): string {
    const date = new Date(1999, monthIndex, 13, 1);

    return getIntlFormatter({ month: monthFormat })(date);
  },
  format(monthIndex: number, monthFormat: Intl.DateTimeFormatOptions['month']): string {
    const date = new Date(0, monthIndex, 13, 1);
    const dateString = normalizeMonth(getIntlFormatter({ day: 'numeric', month: monthFormat })(date));
    const parts = dateString.split(' ').filter((part) => !part.includes('13'));

    if (parts.length === 1) {
      return parts[0];
    } if (parts.length === 2) {
      return parts[0].length > parts[1].length ? parts[0] : parts[1]; // NOTE: For "lt" locale
    }

    return monthNameStrategies.standalone(monthIndex, monthFormat);
  },
};

export default {
  engine(): string {
    return 'intl';
  },
  getMonthNames(format: Format, type: string): string[] {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const intlFormats: Record<Exclude<Format, 'short'>, Intl.DateTimeFormatOptions['month']> = {
      wide: 'long',
      abbreviated: 'short',
      narrow: 'narrow',
    };

    const monthFormat = intlFormats[format || 'wide'];

    // eslint-disable-next-line no-param-reassign
    type = type === 'format' ? type : 'standalone';

    return Array.from(
      { length: 12 },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (_, monthIndex): string => monthNameStrategies[type](monthIndex, monthFormat),
    );
  },

  getDayNames(format: Format): string[] {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const intlFormats: Record<Format, Intl.DateTimeFormatOptions['weekday']> = {
      wide: 'long',
      abbreviated: 'short',
      short: 'narrow',
      narrow: 'narrow',
    };

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const getIntlDayNames = (format: Intl.DateTimeFormatOptions['weekday']): string[] => Array.from(
      { length: 7 },
      (_, dayIndex) => getIntlFormatter({ weekday: format })(new Date(0, 0, dayIndex)),
    );

    return getIntlDayNames(intlFormats[format || 'wide']);
  },

  getPeriodNames(): string[] {
    const hour12Formatter = getIntlFormatter({ hour: 'numeric', hour12: true });

    return [1, 13].map((hours) => {
      const hourNumberText = formatNumber(1); // NOTE: For "bn" locale
      const timeParts = hour12Formatter(new Date(0, 0, 1, hours)).split(hourNumberText);

      if (timeParts.length !== 2) {
        return '';
      }

      const biggerPart = timeParts[0].length > timeParts[1].length ? timeParts[0] : timeParts[1];

      return biggerPart.trim();
    });
  },

  format(date: Date, format: LocalizationFormat): string | Date | undefined {
    if (!date) {
      return undefined;
    }

    if (!format) {
      return date;
    }

    // TODO: refactor (extract code form base)
    if (typeof format !== 'function' && !(format as FormatObject).formatter) {
      // eslint-disable-next-line no-param-reassign
      format = (format as FormatObject).type ?? format;
    }

    if (typeof format === 'string') {
      const presetOverride = resolvePresetOverride(format);

      if (presetOverride !== undefined) {
        if (typeof presetOverride === 'function') {
          return (presetOverride as DateFormatter)(date);
        }
        // eslint-disable-next-line no-param-reassign
        format = presetOverride as LocalizationFormat;
      }
    }

    const intlFormat = getIntlFormat(format);

    if (intlFormat) {
      return getIntlFormatter(intlFormat)(date);
    }

    const formatType = typeof format;
    if ((format as FormatObject).formatter || formatType === 'function' || formatType === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.callBase.apply(this, [date, format]);
    }

    // @ts-expect-error
    return getIntlFormatter(format)(date);
  },

  parse(dateString: string, format: FormatObject | string): Date | null | undefined {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let formatter: DateFormatter | undefined;

    if (format && !(format as FormatObject).parser && typeof dateString === 'string') {
      // eslint-disable-next-line no-param-reassign
      dateString = normalizeMonth(dateString);
      formatter = (date: Date): string => normalizeMonth(this.format(date, format));
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.callBase(dateString, formatter ?? format);
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _parseDateBySimpleFormat(dateString: string, format): Date | undefined {
    // eslint-disable-next-line no-param-reassign
    dateString = normalizeNumerals(dateString);

    const formatParts = this.getFormatParts(format);
    const dateParts = dateString
      .split(/\D+/)
      .filter((part) => part.length > 0);

    if (formatParts.length !== dateParts.length) {
      return undefined;
    }

    const dateArgs: DateArgs = this._generateDateArgs(formatParts, dateParts);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const constructDate = (dateArgs: DateArgs, ampmShift: boolean): Date => {
      const hoursShift = ampmShift ? 12 : 0;
      return new Date(
        dateArgs.year,
        dateArgs.month,
        dateArgs.day,
        (dateArgs.hours + hoursShift) % 24,
        dateArgs.minutes,
        dateArgs.seconds,
      );
    };
    const constructValidDate = (ampmShift: boolean): Date | undefined => {
      const parsedDate = constructDate(dateArgs, ampmShift);
      if (dateStringEquals(normalizeNumerals(this.format(parsedDate, format)), dateString)) {
        return parsedDate;
      }

      return undefined;
    };

    return constructValidDate(false) ?? constructValidDate(true);
  },

  _generateDateArgs(formatParts: (keyof DateArgs)[], dateParts: string[]): DateArgs {
    const currentDate = new Date();
    const dateArgs: DateArgs = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day: currentDate.getDate(),
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    formatParts.forEach((formatPart: keyof DateArgs, index: number): void => {
      const datePart = dateParts[index];
      let parsed = parseInt(datePart, 10);

      if (formatPart === 'month') {
        parsed -= 1;
      }

      dateArgs[formatPart] = parsed;
    });

    return dateArgs;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  formatUsesMonthName(format): boolean {
    if (typeof format === 'object' && !(format.type || format.format)) {
      return format.month === 'long';
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.callBase.apply(this, [format]);
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  formatUsesDayName(format): boolean {
    if (typeof format === 'object' && !(format.type || format.format)) {
      return format.weekday === 'long';
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.callBase.apply(this, [format]);
  },
  getTimeSeparator(): string {
    const formatOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };
    return normalizeNumerals(
      formatDateTime(new Date(2001, 1, 1, 11, 11), formatOptions),
    ).replace(/\d/g, '');
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getFormatParts(format): string[] {
    if (typeof format === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.callBase(format);
    }
    const intlFormat = extend({}, intlFormats[format.toLowerCase()]);
    const date = new Date(2001, 2, 4, 5, 6, 7);
    let formattedDate = getIntlFormatter(intlFormat)(date);

    formattedDate = normalizeNumerals(formattedDate);

    const formatParts = [
      { name: 'year', value: 1 },
      { name: 'month', value: 3 },
      { name: 'day', value: 4 },
      { name: 'hours', value: 5 },
      { name: 'minutes', value: 6 },
      { name: 'seconds', value: 7 },
    ];

    return formatParts
      .map((part) => ({
        name: part.name,
        index: formattedDate.indexOf(`${part.value}`),
      }))
      .filter((part) => part.index > -1)
      .sort((a, b) => a.index - b.index)
      .map((part) => part.name);
  },
};
