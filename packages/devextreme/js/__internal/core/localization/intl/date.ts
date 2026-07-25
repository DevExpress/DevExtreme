/* eslint-disable spellcheck/spell-checker */
import type { Format as LocalizationFormat, FormatObject } from '@js/localization';
import localizationCoreUtils from '@ts/core/localization/core';
import type { DateFormatter, Format } from '@ts/core/localization/date';
import {
  getEffectiveFormatLocale,
  getFormatterOptions,
  resolvePresetOverride,
} from '@ts/core/m_global_format_config';
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
const getFormatter = (
  format: Intl.DateTimeFormatOptions,
  formatLocale = localizationCoreUtils.locale(),
): DateFormatter => {
  const key = `${formatLocale}/${JSON.stringify(format)}`;
  if (!formattersCache[key]) {
    formattersCache[key] = new Intl.DateTimeFormat(formatLocale, format).format;
  }

  return formattersCache[key];
};

function formatDateTime(
  date: Date,
  format: Intl.DateTimeFormatOptions,
  formatLocale = localizationCoreUtils.locale(),
): string {
  return getFormatter(format, formatLocale)(date)
    .replace(SYMBOLS_TO_REMOVE_REGEX, '')
    .replace(NARROW_NO_BREAK_SPACE_REGEX, ' ');
}

const getIntlFormatter = (
  format: Intl.DateTimeFormatOptions,
  formatLocale = localizationCoreUtils.locale(),
) => (date: Date): string => {
  if (!format.timeZoneName) {
    const year = date.getFullYear();
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

    return formatDateTime(utcDate, utcFormat, formatLocale);
  }

  return formatDateTime(date, format, formatLocale);
};

const formatNumber = (number: number): string => new Intl.NumberFormat(
  localizationCoreUtils.locale(),
).format(number);

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

const normalizeMonth = (text: string): string => text.replace('d\u2019', 'de ');

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
    const formatLocale = getEffectiveFormatLocale(undefined, 'datetime');
    const defaultOptions = Intl.DateTimeFormat(formatLocale).resolvedOptions();

    return {
      year: defaultOptions.year, month: defaultOptions.month, day: defaultOptions.day, hour: 'numeric', minute: 'numeric',
    };
  },
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const getIntlFormat = (format): Intl.DateTimeFormatOptions => typeof format === 'string' && intlFormats[format.toLowerCase()];

const formatWithIntlPreset = (
  date: Date,
  sourceFormat: LocalizationFormat,
  resolvedFormat: LocalizationFormat,
  presetName: string,
): string | undefined => {
  const intlFormat = getIntlFormat(presetName);

  if (!intlFormat) {
    return undefined;
  }

  const formatLocale = getEffectiveFormatLocale(
    typeof sourceFormat === 'object' ? sourceFormat : undefined,
    undefined,
    presetName,
  );

  return getIntlFormatter(intlFormat, formatLocale)(date);
};

const formatWithIntlOptions = (
  date: Date,
  format: FormatObject | Intl.DateTimeFormatOptions,
): string => {
  const typeFormat = (format as FormatObject).type;

  if (typeFormat && typeof typeFormat === 'string') {
    const intlPresetResult = formatWithIntlPreset(date, format, format, typeFormat);

    if (intlPresetResult !== undefined) {
      return intlPresetResult;
    }
  }

  const formatLocale = getEffectiveFormatLocale(format, undefined, typeFormat);
  const formatterOptions = getFormatterOptions(format) as Intl.DateTimeFormatOptions;

  return getIntlFormatter(formatterOptions, formatLocale)(date);
};

const monthNameStrategies = {
  standalone(monthIndex: number, monthFormat: Intl.DateTimeFormatOptions['month']): string {
    const date = new Date(1999, monthIndex, 13, 1);
    const messageLocale = localizationCoreUtils.locale();

    return getIntlFormatter({ month: monthFormat }, messageLocale)(date);
  },
  format(monthIndex: number, monthFormat: Intl.DateTimeFormatOptions['month']): string {
    const date = new Date(0, monthIndex, 13, 1);
    const messageLocale = localizationCoreUtils.locale();
    const dateString = normalizeMonth(
      getIntlFormatter({ day: 'numeric', month: monthFormat }, messageLocale)(date),
    );
    const parts = dateString.split(' ').filter((part) => !part.includes('13'));

    if (parts.length === 1) {
      return parts[0];
    } if (parts.length === 2) {
      return parts[0].length > parts[1].length ? parts[0] : parts[1];
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
    const intlDayFormats: Record<Format, Intl.DateTimeFormatOptions['weekday']> = {
      wide: 'long',
      abbreviated: 'short',
      short: 'narrow',
      narrow: 'narrow',
    };

    const messageLocale = localizationCoreUtils.locale();
    const getIntlDayNames = (
      dayFormat: Intl.DateTimeFormatOptions['weekday'],
    ): string[] => Array.from(
      { length: 7 },
      (_, dayIndex) => getIntlFormatter(
        { weekday: dayFormat },
        messageLocale,
      )(new Date(0, 0, dayIndex)),
    );

    return getIntlDayNames(intlDayFormats[format || 'wide']);
  },

  getPeriodNames(): string[] {
    const messageLocale = localizationCoreUtils.locale();
    const hour12Formatter = getIntlFormatter(
      { hour: 'numeric', hour12: true },
      messageLocale,
    );

    return [1, 13].map((hours) => {
      const hourNumberText = formatNumber(1);
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

    if (typeof format === 'function') {
      return (format as DateFormatter)(date);
    }

    if ((format as FormatObject).formatter) {
      return ((format as FormatObject).formatter as DateFormatter)(date);
    }

    const sourceFormat = format;
    let resolvedFormat: LocalizationFormat = (format as FormatObject).type ?? format;

    if (typeof resolvedFormat === 'string') {
      const presetOverride = resolvePresetOverride(resolvedFormat);

      if (presetOverride !== undefined) {
        if (typeof presetOverride === 'function') {
          return (presetOverride as DateFormatter)(date);
        }

        resolvedFormat = presetOverride as LocalizationFormat;
      }
    }

    if (typeof resolvedFormat === 'string') {
      const intlPresetResult = formatWithIntlPreset(
        date,
        sourceFormat,
        resolvedFormat,
        resolvedFormat,
      );

      if (intlPresetResult !== undefined) {
        return intlPresetResult;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.callBase.apply(this, [date, resolvedFormat]);
    }

    if (typeof resolvedFormat === 'object') {
      return formatWithIntlOptions(date, resolvedFormat as FormatObject);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.callBase.apply(this, [date, resolvedFormat]);
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

    const constructDate = (args: DateArgs, ampmShift: boolean): Date => {
      const hoursShift = ampmShift ? 12 : 0;
      return new Date(
        args.year,
        args.month,
        args.day,
        (args.hours + hoursShift) % 24,
        args.minutes,
        args.seconds,
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
    const formatLocale = getEffectiveFormatLocale(undefined, 'time');
    const formatOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };
    return normalizeNumerals(
      formatDateTime(new Date(2001, 1, 1, 11, 11), formatOptions, formatLocale),
    ).replace(/\d/g, '');
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getFormatParts(format): string[] {
    if (typeof format === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.callBase(format);
    }
    const intlFormat = extend({}, intlFormats[format.toLowerCase()]);
    const messageLocale = localizationCoreUtils.locale();
    const date = new Date(2001, 2, 4, 5, 6, 7);
    let formattedDate = getIntlFormatter(intlFormat, messageLocale)(date);

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
