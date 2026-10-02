/* eslint-disable spellcheck/spell-checker */
import '@ts/core/localization/globalize/core';
import '@ts/core/localization/globalize/number';
import 'globalize/date';

import type { Format as LocalizationFormat, FormatObject } from '@js/localization';
import {
  getDateFormatLocale,
  getFormatterOptions,
  resolvePresetOverride,
} from '@ts/core/global_format_config';
import type { DateFormatter, DateParser, Format } from '@ts/core/localization/date';
import dateLocalization from '@ts/core/localization/date';
import { bindDatePartsToLocale } from '@ts/core/localization/ldml/date.parser';
import * as iteratorUtils from '@ts/core/utils/m_iterator';
import { isObject } from '@ts/core/utils/m_type';
// eslint-disable-next-line import/no-extraneous-dependencies
import Globalize from 'globalize';

type GlobalizeFormat = {
  path: string;
  parts?: string[];
} | {
  pattern: string;
};

const ACCEPTABLE_JSON_FORMAT_PROPERTIES = ['skeleton', 'date', 'time', 'datetime', 'raw'];
const RTL_MARKS_REGEX = /[\u200E\u200F]/g;

type GlobalizeDateFormatOptions = FormatObject & {
  raw?: string;
  skeleton?: string;
  date?: string;
  time?: string;
  datetime?: string;
};

const resolveGlobalizeLocale = (formatLocale: string): string => {
  const currentLocale = Globalize.locale().locale as string;

  if (formatLocale === currentLocale) {
    return currentLocale;
  }

  Globalize.locale(formatLocale);
  try {
    return Globalize.locale().locale as string;
  } finally {
    Globalize.locale(currentLocale);
  }
};

interface GlobalizeInstance {
  cldr: { main: (path: string) => unknown };
  parseDate: (value: string, format?: GlobalizeDateFormatOptions | string) => Date | null;
}

const getGlobalizeByLocale = (formatLocale?: string): GlobalizeInstance => {
  if (!formatLocale) {
    return Globalize as GlobalizeInstance;
  }

  const resolvedLocale = resolveGlobalizeLocale(formatLocale);

  return resolvedLocale === Globalize.locale().locale
    ? Globalize as GlobalizeInstance
    : new Globalize(resolvedLocale) as GlobalizeInstance;
};

const getCldrMain = <TValue>(
  path: string,
  formatLocale?: string,
): TValue => getGlobalizeByLocale(formatLocale).cldr.main(path) as TValue;

const getGlobalizeDateFormatter = (
  formatLocale: string,
  format: GlobalizeDateFormatOptions | string,
): DateFormatter => {
  const resolvedLocale = resolveGlobalizeLocale(formatLocale);
  const currentLocale = Globalize.locale().locale;

  if (resolvedLocale === currentLocale) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Globalize.dateFormatter(format);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return new Globalize(resolvedLocale).dateFormatter(format);
};

if (Globalize?.formatDate) {
  if (Globalize.locale().locale === 'en') {
    Globalize.locale('en');
  }

  const formattersCache: Record<string, DateFormatter> = {};

  const FORMATS_TO_GLOBALIZE_MAP: Record<string, GlobalizeFormat> = {
    shortdate: {
      path: 'dateTimeFormats/availableFormats/yMd',
    },
    shorttime: {
      path: 'timeFormats/short',
    },
    longdate: {
      path: 'dateFormats/full',
    },
    longtime: {
      path: 'timeFormats/medium',
    },
    monthandday: {
      path: 'dateTimeFormats/availableFormats/MMMMd',
    },
    monthandyear: {
      path: 'dateTimeFormats/availableFormats/yMMMM',
    },
    quarterandyear: {
      path: 'dateTimeFormats/availableFormats/yQQQ',
    },
    day: {
      path: 'dateTimeFormats/availableFormats/d',
    },
    year: {
      path: 'dateTimeFormats/availableFormats/y',
    },
    shortdateshorttime: {
      path: 'dateTimeFormats/short',
      parts: ['shorttime', 'shortdate'],
    },
    longdatelongtime: {
      path: 'dateTimeFormats/medium',
      parts: ['longtime', 'longdate'],
    },
    month: {
      pattern: 'LLLL',
    },
    shortyear: {
      pattern: 'yy',
    },
    dayofweek: {
      pattern: 'EEEE',
    },
    quarter: {
      pattern: 'QQQ',
    },
    millisecond: {
      pattern: 'SSS',
    },
    hour: {
      pattern: 'HH',
    },
    minute: {
      pattern: 'mm',
    },
    second: {
      pattern: 'ss',
    },
  };

  const globalizeDateLocalization = {
    engine(): string {
      return 'globalize';
    },

    _getGlobalizeFormatterOptions(
      format: string,
      formatLocale?: string,
    ): GlobalizeDateFormatOptions {
      if (format.toLowerCase() === 'datetime-local') {
        return { raw: 'yyyy-MM-ddTHH\':\'mm\':\'ss' };
      }

      return {
        raw: this._getPatternByFormat(format, formatLocale) || format,
      };
    },

    _getPatternByFormat(format: string, formatLocale?: string): string | undefined {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      const lowerFormat = format.toLowerCase();
      const globalizeFormat: GlobalizeFormat | undefined = FORMATS_TO_GLOBALIZE_MAP[lowerFormat];

      if (lowerFormat === 'datetime-local') {
        return 'yyyy-MM-ddTHH\':\'mm\':\'ss';
      }

      if (!globalizeFormat) {
        return undefined;
      }

      let result: string = 'path' in globalizeFormat
        ? that._getFormatStringByPath(globalizeFormat.path, formatLocale)
        : globalizeFormat.pattern;

      if ('parts' in globalizeFormat) {
        iteratorUtils.each(globalizeFormat.parts, (index: number, part: string): void => {
          result = result.replace(`{${index}}`, that._getPatternByFormat(part, formatLocale) ?? '');
        });
      }
      return result;
    },

    _getFormatStringByPath(path: string, formatLocale?: string): string {
      return getCldrMain<string>(`dates/calendars/gregorian/${path}`, formatLocale);
    },

    getPeriodNames(format?: Format, type?: string, formatLocale?: string): string[] {
      const nameFormat = format || 'wide';
      const nameType = type === 'format' ? type : 'stand-alone';

      const json = getCldrMain<Record<string, string>>(
        `dates/calendars/gregorian/dayPeriods/${nameType}/${nameFormat}`,
        formatLocale,
      );
      return [json.am, json.pm];
    },

    getMonthNames(format: Format, type?: string, formatLocale?: string): string[] {
      const nameType = type === 'format' ? type : 'stand-alone';
      const months = getCldrMain<Record<string, string>>(
        `dates/calendars/gregorian/months/${nameType}/${format || 'wide'}`,
        formatLocale,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return iteratorUtils.map(months, (month: string): string => month);
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getDayNames(format: Format, type?: string, formatLocale?: string): string[] {
      const days = getCldrMain<Record<string, string>>(
        `dates/calendars/gregorian/days/stand-alone/${format || 'wide'}`,
        formatLocale,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return iteratorUtils.map(days, (day: string): string => day);
    },

    getTimeSeparator(): string {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Globalize.locale().main('numbers/symbols-numberSystem-latn/timeSeparator');
    },

    removeRtlMarks(text: string): string {
      return text.replace(RTL_MARKS_REGEX, '');
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
        // @ts-expect-error
        return (format.formatter as DateFormatter)(date);
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

      // eslint-disable-next-line @typescript-eslint/init-declarations
      let formatter: DateFormatter;
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let formatCacheKey: string;
      const formatLocale = getDateFormatLocale(sourceFormat, resolvedFormat);

      if (typeof resolvedFormat === 'string') {
        const resolvedLocale = resolveGlobalizeLocale(formatLocale);
        formatCacheKey = `${resolvedLocale}:${resolvedFormat}`;
        formatter = formattersCache[formatCacheKey];
        if (!formatter) {
          const globalizeFormat = this._getGlobalizeFormatterOptions(resolvedFormat, formatLocale);

          formatter = getGlobalizeDateFormatter(formatLocale, globalizeFormat);
          formattersCache[formatCacheKey] = formatter;
        }
      } else if (isObject(resolvedFormat)) {
        const typedFormat = resolvedFormat as FormatObject;
        const typeFormat = typedFormat.type;

        if (typeFormat && typeof typeFormat === 'string') {
          const resolvedLocale = resolveGlobalizeLocale(formatLocale);
          formatCacheKey = `${resolvedLocale}:${typeFormat}`;
          formatter = formattersCache[formatCacheKey];
          if (!formatter) {
            const globalizeFormat = this._getGlobalizeFormatterOptions(typeFormat, formatLocale);

            formatter = getGlobalizeDateFormatter(formatLocale, globalizeFormat);
            formattersCache[formatCacheKey] = formatter;
          }
        } else {
          const formatterOptions = getFormatterOptions(typedFormat) as FormatObject;

          if (!this._isAcceptableFormat(formatterOptions)) {
            return undefined;
          }

          formatter = getGlobalizeDateFormatter(formatLocale, formatterOptions);
        }
      } else {
        return undefined;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.removeRtlMarks(formatter(date));
    },

    parse(text: string, format?: FormatObject | DateParser | string): Date | null | undefined {
      if (!text) {
        return undefined;
      }

      if (typeof format === 'function') {
        const parsedValue: Date | null | undefined = this.callBase(text, format);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return parsedValue ?? Globalize.parseDate(text);
      }

      if (!format) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Globalize.parseDate(text);
      }

      const formatLocale = getDateFormatLocale(format);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const dateParts = bindDatePartsToLocale(this, formatLocale);
      const parserFormat = getFormatterOptions(format) as FormatObject | string;

      if (isObject(parserFormat) && !this._isAcceptableFormat(parserFormat)) {
        const parsedValue: Date | null | undefined = this.callBase(text, format, dateParts);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return parsedValue ?? getGlobalizeByLocale(formatLocale).parseDate(text);
      }

      if ((parserFormat as FormatObject).parser) {
        return ((parserFormat as FormatObject).parser as DateParser)(text);
      }

      const globalizeFormat = typeof parserFormat === 'string'
        ? { raw: this._getPatternByFormat(parserFormat, formatLocale) || parserFormat }
        : parserFormat;

      const parsedDate: Date | null | undefined = getGlobalizeByLocale(formatLocale)
        .parseDate(text, globalizeFormat);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return parsedDate ?? this.callBase(text, globalizeFormat, dateParts);
    },

    _isAcceptableFormat(format: FormatObject): boolean {
      if (format.parser) {
        return true;
      }

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < ACCEPTABLE_JSON_FORMAT_PROPERTIES.length; i += 1) {
        if (Object.prototype.hasOwnProperty.call(format, ACCEPTABLE_JSON_FORMAT_PROPERTIES[i])) {
          return true;
        }
      }

      return false;
    },

    firstDayOfWeekIndex(): number {
      const firstDay = Globalize.locale().supplemental.weekData.firstDay();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this._getDayKeys().indexOf(firstDay);
    },

    _getDayKeys(): string[] {
      const days: Record<string, string> = Globalize.locale().main('dates/calendars/gregorian/days/format/short');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return iteratorUtils.map(days, (_, key: string): string => key);
    },
  };

  dateLocalization.resetInjection();
  dateLocalization.inject(globalizeDateLocalization);
}
