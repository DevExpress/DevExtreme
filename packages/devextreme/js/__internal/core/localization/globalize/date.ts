/* eslint-disable spellcheck/spell-checker */
import '@ts/core/localization/globalize/core';
import '@ts/core/localization/globalize/number';
import 'globalize/date';

import type { Format as LocalizationFormat, FormatObject } from '@js/localization';
import type { DateFormatter, DateParser, Format } from '@ts/core/localization/date';
import dateLocalization from '@ts/core/localization/date';
import config from '@ts/core/m_config';
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

    _getPatternByFormat(format: string): string | undefined {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      const lowerFormat = format.toLowerCase();

      const globalDateFormats = config().dateFormats;
      if (globalDateFormats) {
        const globalOverride = globalDateFormats[format] ?? globalDateFormats[lowerFormat];
        if (typeof globalOverride === 'string') {
          return globalOverride;
        }
      }

      const globalizeFormat: GlobalizeFormat | undefined = FORMATS_TO_GLOBALIZE_MAP[lowerFormat];

      if (lowerFormat === 'datetime-local') {
        return 'yyyy-MM-ddTHH\':\'mm\':\'ss';
      }

      if (!globalizeFormat) {
        return undefined;
      }

      let result: string = 'path' in globalizeFormat
        ? that._getFormatStringByPath(globalizeFormat.path)
        : globalizeFormat.pattern;

      if ('parts' in globalizeFormat) {
        iteratorUtils.each(globalizeFormat.parts, (index: number, part: string): void => {
          result = result.replace(`{${index}}`, that._getPatternByFormat(part));
        });
      }
      return result;
    },

    _getFormatStringByPath(path: string): string {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Globalize.locale().main(`dates/calendars/gregorian/${path}`);
    },

    getPeriodNames(format: Format, type: string): string[] {
      // eslint-disable-next-line no-param-reassign
      format = format || 'wide';
      // eslint-disable-next-line no-param-reassign
      type = type === 'format' ? type : 'stand-alone';

      const json: Record<string, string> = Globalize.locale().main(`dates/calendars/gregorian/dayPeriods/${type}/${format}`);
      return [json.am, json.pm];
    },

    getMonthNames(format: Format, type: string): string[] {
      const months: Record<string, string> = Globalize.locale().main(`dates/calendars/gregorian/months/${type === 'format' ? type : 'stand-alone'}/${format || 'wide'}`);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return iteratorUtils.map(months, (month: string): string => month);
    },

    getDayNames(format: Format): string[] {
      const days: Record<string, string> = Globalize.locale().main(`dates/calendars/gregorian/days/stand-alone/${format || 'wide'}`);

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

      // eslint-disable-next-line @typescript-eslint/init-declarations
      let formatter: DateFormatter;
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let formatCacheKey: string;

      if (typeof format === 'function') {
        return (format as DateFormatter)(date);
      }

      if ((format as FormatObject).formatter) {
        // @ts-expect-error
        return (format.formatter as DateFormatter)(date);
      }

      // eslint-disable-next-line no-param-reassign
      format = (format as FormatObject).type ?? format;

      if (typeof format === 'string') {
        const globalDateFormats = config().dateFormats;
        if (globalDateFormats) {
          const globalOverride = (
            globalDateFormats[format] ?? globalDateFormats[format.toLowerCase()]
          );
          if (typeof globalOverride === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.removeRtlMarks(globalOverride(date));
          }
        }

        formatCacheKey = `${Globalize.locale().locale}:${format}`;
        formatter = formattersCache[formatCacheKey];
        if (!formatter) {
          // eslint-disable-next-line no-param-reassign
          format = {
            // @ts-expect-error
            raw: this._getPatternByFormat(format) || format,
          };

          formatter = Globalize.dateFormatter(format);
          formattersCache[formatCacheKey] = formatter;
        }
      } else {
        if (!this._isAcceptableFormat(format)) {
          return undefined;
        }

        formatter = Globalize.dateFormatter(format);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.removeRtlMarks(formatter(date));
    },

    parse(text: string, format: FormatObject | DateParser | string): Date | null | undefined {
      if (!text) {
        return undefined;
      }

      if (!format || typeof format === 'function' || (isObject(format) && !this._isAcceptableFormat(format))) {
        if (format) {
          const parsedValue: Date | null | undefined = this.callBase(text, format);
          if (parsedValue) {
            return parsedValue;
          }
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Globalize.parseDate(text);
      }

      if ((format as FormatObject).parser) {
        // @ts-expect-error
        return (format.parser as DateParser)(text);
      }

      if (typeof format === 'string') {
        // eslint-disable-next-line no-param-reassign
        format = {
          // @ts-expect-error
          raw: this._getPatternByFormat(format) || format,
        };
      }

      const parsedDate: Date | null | undefined = Globalize.parseDate(text, format);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return parsedDate ?? this.callBase(text, format);
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
