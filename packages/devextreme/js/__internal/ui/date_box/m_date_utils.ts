import dateLocalization from '@js/common/core/localization/date';
import $ from '@js/core/renderer';
import dateSerialization from '@js/core/utils/date_serialization';
import { each } from '@js/core/utils/iterator';
import { isDate } from '@js/core/utils/type';

const DATE_COMPONENTS = ['year', 'day', 'month', 'day'];
const TIME_COMPONENTS = ['hours', 'minutes', 'seconds', 'milliseconds'];

const ONE_MINUTE = 1000 * 60;
const ONE_DAY = ONE_MINUTE * 60 * 24;
const ONE_YEAR = ONE_DAY * 365;

const getStringFormat = function (format) {
  const formatType = typeof format;

  if (formatType === 'string') {
    return 'format';
  }

  if (formatType === 'object' && format.type !== undefined) {
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
  MAX_DATEVIEW_DEFAULT_DATE: (function () {
    const newDate = new Date();
    return new Date(newDate.getFullYear() + 50, newDate.getMonth(), newDate.getDate(), 23, 59, 59);
  }()),

  FORMATS_INFO: {
    date: {
      getStandardPattern() {
        return 'yyyy-MM-dd';
      },
      components: DATE_COMPONENTS,
    },
    time: {
      getStandardPattern() {
        return 'HH:mm';
      },
      components: TIME_COMPONENTS,
    },
    datetime: {
      getStandardPattern() {
        let standardPattern;

        (function androidFormatDetection() {
          const androidFormatPattern = 'yyyy-MM-ddTHH:mmZ';
          const testDateString = '2000-01-01T01:01Z';

          const $input = $('<input>').attr('type', 'datetime');
          $input.val(testDateString);

          if ($input.val()) {
            standardPattern = androidFormatPattern;
          }
        }());

        if (!standardPattern) {
          standardPattern = 'yyyy-MM-ddTHH:mm:ssZ';
        }

        dateUtils.FORMATS_INFO.datetime.getStandardPattern = function () {
          return standardPattern;
        };

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
  },

  FORMATS_MAP: {
    date: 'shortdate',
    time: 'shorttime',
    datetime: 'shortdateshorttime',
  },

  SUBMIT_FORMATS_MAP: {
    date: 'date',
    time: 'time',
    datetime: 'datetime-local',
  },

  toStandardDateFormat(date, type) {
    const pattern = dateUtils.FORMATS_INFO[type].getStandardPattern();

    return dateSerialization.serializeDate(date, pattern);
  },

  fromStandardDateFormat(text) {
    const date = dateSerialization.dateParser(text);
    return isDate(date) ? date : undefined;
  },

  getMaxMonthDay(year, month) {
    return new Date(year, month + 1, 0).getDate();
  },

  mergeDates(oldValue, newValue, format) {
    if (!newValue) {
      return newValue || null;
    }
    if (!oldValue || isNaN(oldValue.getTime())) {
      // @ts-expect-error
      const now = new Date(null);
      oldValue = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const result = new Date(oldValue.valueOf());
    const formatInfo = dateUtils.FORMATS_INFO[format];

    each(formatInfo.components, function () {
      // @ts-expect-error
      const componentInfo = dateUtils.DATE_COMPONENTS_INFO[this];
      result[componentInfo.setter](newValue[componentInfo.getter]());
    });

    return result;
  },

  getLongestCaptionIndex(captionArray) {
    let longestIndex = 0;
    let longestCaptionLength = 0;
    let i;
    for (i = 0; i < captionArray.length; ++i) {
      if (captionArray[i].length > longestCaptionLength) {
        longestIndex = i;
        longestCaptionLength = captionArray[i].length;
      }
    }
    return longestIndex;
  },

  formatUsesMonthName(format) {
    // @ts-expect-error
    return dateLocalization.formatUsesMonthName(format);
  },

  formatUsesDayName(format) {
    // @ts-expect-error
    return dateLocalization.formatUsesDayName(format);
  },

  getLongestDate(format, monthNames, dayNames) {
    const stringFormat = getStringFormat(format);
    let month = 9;

    if (!stringFormat || dateUtils.formatUsesMonthName(stringFormat)) {
      month = dateUtils.getLongestCaptionIndex(monthNames);
    }

    const longestDate = new Date(1888, month, 21, 23, 59, 59, 999);

    if (!stringFormat || dateUtils.formatUsesDayName(stringFormat)) {
      const date = longestDate.getDate() - longestDate.getDay() + dateUtils.getLongestCaptionIndex(dayNames);
      longestDate.setDate(date);
    }

    return longestDate;
  },

  normalizeTime(date) {
    date.setSeconds(0);
    date.setMilliseconds(0);
  },
};
// @ts-expect-error
dateUtils.DATE_COMPONENTS_INFO = {
  year: {
    getter: 'getFullYear',
    setter: 'setFullYear',
    formatter(value, date) {
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
    formatter(value, date) {
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
    formatter(value) {
      return dateLocalization.getMonthNames()[value];
    },
    startValue: 0,
    endValue: 11,
  },

  hours: {
    getter: 'getHours',
    setter: 'setHours',
    formatter(value) {
      return dateLocalization.format(new Date(0, 0, 0, value), 'hour');
    },
    startValue: 0,
    endValue: 23,
  },

  minutes: {
    getter: 'getMinutes',
    setter: 'setMinutes',
    formatter(value) {
      return dateLocalization.format(new Date(0, 0, 0, 0, value), 'minute');
    },
    startValue: 0,
    endValue: 59,
  },

  seconds: {
    getter: 'getSeconds',
    setter: 'setSeconds',
    formatter(value) {
      return dateLocalization.format(new Date(0, 0, 0, 0, 0, value), 'second');
    },
    startValue: 0,
    endValue: 59,
  },

  milliseconds: {
    getter: 'getMilliseconds',
    setter: 'setMilliseconds',
    formatter(value) {
      return dateLocalization.format(new Date(0, 0, 0, 0, 0, 0, value), 'millisecond');
    },
    startValue: 0,
    endValue: 999,
  },
};

export default dateUtils;
