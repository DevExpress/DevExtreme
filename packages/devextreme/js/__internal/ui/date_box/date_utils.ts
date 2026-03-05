import dateLocalization from '@js/common/core/localization/date';
import $ from '@js/core/renderer';
import dateSerialization from '@js/core/utils/date_serialization';
import { isDate } from '@js/core/utils/type';
import type { Format } from '@js/localization';
import type { DateLike, DateType } from '@js/ui/date_box';

const DATE_COMPONENTS = ['year', 'day', 'month', 'day'];
const TIME_COMPONENTS = ['hours', 'minutes', 'seconds', 'milliseconds'];

const ONE_MINUTE = 1000 * 60;
const ONE_DAY = ONE_MINUTE * 60 * 24;
const ONE_YEAR = ONE_DAY * 365;

type FormatKey = DateType | 'datetime-local';
type DateComponentKey = 'year' | 'day' | 'month' | 'hours' | 'minutes' | 'seconds' | 'milliseconds';
type ShortFormat = 'shortdate' | 'shorttime' | 'shortdateshorttime';

interface FormatInfo {
  getStandardPattern: () => string;
  components: DateComponentKey[];
}

const getStringFormat = (format: Format): string | null | undefined => {
  const formatType = typeof format;

  if (formatType === 'string') {
    return 'format';
  }

  if (typeof format === 'object' && 'type' in format) {
    return format.type;
  }

  return null;
};

const dateUtils = {
  SUPPORTED_FORMATS: ['date', 'time', 'datetime'],

  ONE_MINUTE,
  ONE_DAY,
  ONE_YEAR,

  MIN_DATEVIEW_DEFAULT_DATE: new Date(1900, 0, 1),
  MAX_DATEVIEW_DEFAULT_DATE: ((): Date => {
    const newDate = new Date();
    return new Date(newDate.getFullYear() + 50, newDate.getMonth(), newDate.getDate(), 23, 59, 59);
  })(),

  FORMATS_INFO: {
    date: {
      getStandardPattern(): string {
        return 'yyyy-MM-dd';
      },
      components: DATE_COMPONENTS,
    },
    time: {
      getStandardPattern(): string {
        return 'HH:mm';
      },
      components: TIME_COMPONENTS,
    },
    datetime: {
      getStandardPattern(): string {
        let standardPattern = 'yyyy-MM-ddTHH:mm:ssZ';

        (function androidFormatDetection(): void {
          const androidFormatPattern = 'yyyy-MM-ddTHH:mmZ';
          const testDateString = '2000-01-01T01:01Z';

          const $input = $('<input>').attr('type', 'datetime');
          $input.val(testDateString);

          if ($input.val()) {
            standardPattern = androidFormatPattern;
          }
        }());

        standardPattern ??= 'yyyy-MM-ddTHH:mm:ssZ';

        dateUtils.FORMATS_INFO.datetime.getStandardPattern = (): string => standardPattern;

        return standardPattern;
      },
      components: [...DATE_COMPONENTS, ...TIME_COMPONENTS],
    },
    'datetime-local': {
      getStandardPattern() {
        return 'yyyy-MM-ddTHH:mm:ss';
      },
      components: [...DATE_COMPONENTS, 'hours', 'minutes', 'seconds'],
    },
  } as Record<FormatKey, FormatInfo>,

  FORMATS_MAP: {
    date: 'shortdate',
    time: 'shorttime',
    datetime: 'shortdateshorttime',
  } as Record<DateType, ShortFormat>,

  SUBMIT_FORMATS_MAP: {
    date: 'date',
    time: 'time',
    datetime: 'datetime-local',
  } as Record<DateType, FormatKey>,

  toStandardDateFormat(date: DateLike | undefined, type: string): string {
    const pattern = dateUtils.FORMATS_INFO[type].getStandardPattern();

    return dateSerialization.serializeDate(date, pattern) as string;
  },

  fromStandardDateFormat(text: string): Date | undefined {
    const date = dateSerialization.dateParser(text);
    return isDate(date) ? date : undefined;
  },

  getMaxMonthDay(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  },

  mergeDates(
    oldValue: Date | null | undefined,
    newValue: Date | null | undefined,
    format: FormatKey,
  ): Date | null {
    let oldDate = oldValue;
    if (!newValue) {
      return newValue ?? null;
    }
    if (!oldDate || isNaN(oldDate.getTime())) {
      const now = new Date(0);
      oldDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const result = new Date(oldDate.valueOf());
    const formatInfo = dateUtils.FORMATS_INFO[format];

    formatInfo.components.forEach((component: DateComponentKey) => {
      const componentInfo = dateUtils.DATE_COMPONENTS_INFO[component];
      result[componentInfo.setter](newValue[componentInfo.getter]());
    });

    return result;
  },

  getLongestCaptionIndex(captionArray: string[]): number {
    let longestIndex = 0;
    let longestCaptionLength = 0;

    for (let i = 0; i < captionArray.length; i += 1) {
      if (captionArray[i].length > longestCaptionLength) {
        longestIndex = i;
        longestCaptionLength = captionArray[i].length;
      }
    }
    return longestIndex;
  },

  formatUsesMonthName(format: string): boolean {
    return dateLocalization.formatUsesMonthName(format);
  },

  formatUsesDayName(format: string): boolean {
    return dateLocalization.formatUsesDayName(format);
  },

  getLongestDate(format: Format, monthNames: string[], dayNames: string[]): Date {
    const stringFormat = getStringFormat(format);
    let month = 9;

    if (!stringFormat || dateUtils.formatUsesMonthName(stringFormat)) {
      month = dateUtils.getLongestCaptionIndex(monthNames);
    }

    const longestDate = new Date(1888, month, 21, 23, 59, 59, 999);

    if (!stringFormat || dateUtils.formatUsesDayName(stringFormat)) {
      const date = longestDate.getDate()
        - longestDate.getDay() + dateUtils.getLongestCaptionIndex(dayNames);
      longestDate.setDate(date);
    }

    return longestDate;
  },

  normalizeTime(date: Date): void {
    date.setSeconds(0);
    date.setMilliseconds(0);
  },

  DATE_COMPONENTS_INFO: {
    year: {
      getter: 'getFullYear',
      setter: 'setFullYear',
      formatter(value: number, date: Date) {
        const formatDate = new Date(date.getTime());
        formatDate.setFullYear(value);
        return dateLocalization.format(formatDate, 'yyyy');
      },
      startValue: undefined,
      endValue: undefined,
    },

    day: {
      getter: 'getDate',
      setter: 'setDate',
      formatter(value: number, date: Date) {
        const formatDate = new Date(date.getTime());
        formatDate.setDate(value);
        return dateLocalization.format(formatDate, 'd');
      },
      startValue: 1,
      endValue: undefined,
    },

    month: {
      getter: 'getMonth',
      setter: 'setMonth',
      formatter(value: number) {
        return dateLocalization.getMonthNames()[value];
      },
      startValue: 0,
      endValue: 11,
    },

    hours: {
      getter: 'getHours',
      setter: 'setHours',
      formatter(value: number) {
        return dateLocalization.format(new Date(0, 0, 0, value), 'hour');
      },
      startValue: 0,
      endValue: 23,
    },

    minutes: {
      getter: 'getMinutes',
      setter: 'setMinutes',
      formatter(value: number) {
        return dateLocalization.format(new Date(0, 0, 0, 0, value), 'minute');
      },
      startValue: 0,
      endValue: 59,
    },

    seconds: {
      getter: 'getSeconds',
      setter: 'setSeconds',
      formatter(value: number) {
        return dateLocalization.format(new Date(0, 0, 0, 0, 0, value), 'second');
      },
      startValue: 0,
      endValue: 59,
    },

    milliseconds: {
      getter: 'getMilliseconds',
      setter: 'setMilliseconds',
      formatter(value: number) {
        return dateLocalization.format(new Date(0, 0, 0, 0, 0, 0, value), 'millisecond');
      },
      startValue: 0,
      endValue: 999,
    },
  } as Record<DateComponentKey, {
    getter: string;
    setter: string;
    formatter: (value: number, date?: Date) => string;
    startValue: number | undefined;
    endValue: number | undefined;
  }>,
};

export default dateUtils;
