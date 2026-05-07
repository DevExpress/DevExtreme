/* eslint-disable spellcheck/spell-checker */
import type { Format as LocalizationFormat, FormatObject } from '@js/localization';
import firstDayOfWeekData from '@ts/core/localization/cldr-data/first_day_of_week_data';
import localizationCore from '@ts/core/localization/core';
import defaultDateNames from '@ts/core/localization/default_date_names';
import intlDateLocalization from '@ts/core/localization/intl/date';
import { getFormat as getLDMLDateFormat } from '@ts/core/localization/ldml/date.format';
import { getFormatter as getLDMLDateFormatter } from '@ts/core/localization/ldml/date.formatter';
import { getParser as getLDMLDateParser } from '@ts/core/localization/ldml/date.parser';
import numberLocalization from '@ts/core/localization/number';
import errors from '@ts/core/m_errors';
import { injector as dependencyInjector } from '@ts/core/utils/m_dependency_injector';
import { each } from '@ts/core/utils/m_iterator';
import { isString } from '@ts/core/utils/m_type';

export type BaseFormat = 'abbreviated' | 'short' | 'narrow';
export type Format = BaseFormat | 'wide';

export type DateFormatter = (date: Date) => string;
export type DateParser = (value: string) => Date;

const DEFAULT_DAY_OF_WEEK_INDEX = 0;
const hasIntl = typeof Intl !== 'undefined';

const FORMATS_TO_PATTERN_MAP = {
  shortdate: 'M/d/y',
  shorttime: 'h:mm a',
  longdate: 'EEEE, MMMM d, y',
  longtime: 'h:mm:ss a',
  monthandday: 'MMMM d',
  monthandyear: 'MMMM y',
  quarterandyear: 'QQQ y',
  day: 'd',
  year: 'y',
  shortdateshorttime: 'M/d/y, h:mm a',
  longdatelongtime: 'EEEE, MMMM d, y, h:mm:ss a',
  month: 'LLLL',
  shortyear: 'yy',
  dayofweek: 'EEEE',
  quarter: 'QQQ',
  hour: 'HH',
  minute: 'mm',
  second: 'ss',
  millisecond: 'SSS',
  'datetime-local': 'yyyy-MM-ddTHH\':\'mm\':\'ss',
};

const possiblePartPatterns = {
  year: ['y', 'yy', 'yyyy'],
  day: ['d', 'dd'],
  month: ['M', 'MM', 'MMM', 'MMMM'],
  hours: ['H', 'HH', 'h', 'hh', 'ah'],
  minutes: ['m', 'mm'],
  seconds: ['s', 'ss'],
  milliseconds: ['S', 'SS', 'SSS'],
};

const dateLocalization = dependencyInjector({
  engine(): string {
    return 'base';
  },
  _getPatternByFormat(format: string): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return FORMATS_TO_PATTERN_MAP[format.toLowerCase()];
  },
  _expandPattern(pattern: string): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getPatternByFormat(pattern) || pattern;
  },
  formatUsesMonthName(format: string): boolean {
    return this._expandPattern(format).indexOf('MMMM') !== -1;
  },

  formatUsesDayName(format: string): boolean {
    return this._expandPattern(format).indexOf('EEEE') !== -1;
  },
  getFormatParts(format: string): string[] {
    const pattern: string = this._getPatternByFormat(format) || format;
    const result: string[] = [];

    each(pattern.split(/\W+/), (_, formatPart: string): void => {
      each(possiblePartPatterns, (partName: string, possiblePatterns: string[]): void => {
        if (possiblePatterns.includes(formatPart)) {
          result.push(partName);
        }
      });
    });

    return result;
  },
  getMonthNames(format: BaseFormat): string[] {
    return defaultDateNames.getMonthNames(format);
  },
  getDayNames(format: BaseFormat): string[] {
    return defaultDateNames.getDayNames(format);
  },
  getQuarterNames(format: BaseFormat): string[] {
    return defaultDateNames.getQuarterNames(format);
  },
  getPeriodNames(format: BaseFormat): string[] {
    return defaultDateNames.getPeriodNames(format);
  },
  getTimeSeparator(): string {
    return ':';
  },

  is24HourFormat(format): boolean | undefined {
    const amTime = new Date(2017, 0, 20, 11, 0, 0, 0);
    const pmTime = new Date(2017, 0, 20, 23, 0, 0, 0);
    const amTimeFormatted = this.format(amTime, format);
    const pmTimeFormatted = this.format(pmTime, format);

    for (let i = 0; i < amTimeFormatted.length; i += 1) {
      if (amTimeFormatted[i] !== pmTimeFormatted[i]) {
        return !isNaN(parseInt(amTimeFormatted[i], 10));
      }
    }

    return undefined;
  },

  format(date: Date, format: LocalizationFormat): Date | string | undefined {
    if (!date) {
      return undefined;
    }

    if (!format) {
      return date;
    }

    // eslint-disable-next-line @typescript-eslint/init-declarations
    let formatter: DateFormatter | undefined;

    if (typeof format === 'function') {
      formatter = format as DateFormatter;
    } else if ((format as FormatObject).formatter) {
      formatter = (format as FormatObject).formatter as DateFormatter;
    } else {
      // eslint-disable-next-line no-param-reassign
      format = (format as FormatObject).type ?? format;
      if (isString(format)) {
        // eslint-disable-next-line no-param-reassign
        format = (FORMATS_TO_PATTERN_MAP[(format as string).toLowerCase()] || format) as string;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return numberLocalization.convertDigits(getLDMLDateFormatter(format, this)(date));
      }
    }

    if (!formatter) {
      // TODO: log warning or error
      return undefined;
    }

    return formatter(date);
  },

  parse(text: string, format: FormatObject | string): Date | null | undefined {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let ldmlFormat: string | undefined;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let formatter: DateFormatter;

    if (!text) {
      return undefined;
    }

    if (!format) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.parse(text, 'shortdate');
    }

    if (typeof format === 'object' && format.parser) {
      return (format.parser as DateParser)(text);
    }

    if (typeof format === 'string' && !FORMATS_TO_PATTERN_MAP[format.toLowerCase()]) {
      ldmlFormat = format;
    } else {
      formatter = (value: Date): string => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const text: string = that.format(value, format);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return numberLocalization.convertDigits(text, true);
      };
      try {
        ldmlFormat = getLDMLDateFormat(formatter);
        // eslint-disable-next-line
      } catch (e) {}
    }

    if (ldmlFormat) {
      // eslint-disable-next-line no-param-reassign
      text = numberLocalization.convertDigits(text, true);
      return getLDMLDateParser(ldmlFormat, this)(text);
    }

    errors.log('W0012');
    const result = new Date(text);

    if (!result || isNaN(result.getTime())) {
      return undefined;
    }

    return result;
  },

  firstDayOfWeekIndex(): number {
    const index: number | undefined = localizationCore.getValueByClosestLocale(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (locale: string): number | undefined => firstDayOfWeekData[locale],
    );

    return index ?? DEFAULT_DAY_OF_WEEK_INDEX;
  },
});

if (hasIntl) {
  dateLocalization.inject(intlDateLocalization);
}

export default dateLocalization;
