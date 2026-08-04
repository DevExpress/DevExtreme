import '@js/common/core/localization/currency';

import type { Format } from '@js/common/core/localization';
import dateLocalization from '@js/common/core/localization/date';
import numberLocalization from '@js/common/core/localization/number';
import dateUtils from '@js/core/utils/date';
import {
  isDate,
  isDefined,
  isFunction,
  isNumeric,
  isPlainObject,
  isString,
} from '@js/core/utils/type';
import { injector as dependencyInjector } from '@ts/core/utils/m_dependency_injector';

import { getGlobalFormatByDataType } from './global_format_config';

export default dependencyInjector({
  format(value, format) {
    const formatIsValid = (isString(format) && format !== '')
      || isPlainObject(format) || isFunction(format);
    const valueIsValid = isNumeric(value) || (isDate(value) && !isNaN(value.getTime()));

    if (!valueIsValid) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return isDefined(value) ? value.toString() : '';
    }

    if (!formatIsValid && isNumeric(value)) {
      const globalNumberFormat = getGlobalFormatByDataType('number');
      if (globalNumberFormat) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return numberLocalization.format(value, globalNumberFormat);
      }
    }

    if (!formatIsValid) {
      return isDefined(value) ? value.toString() : '';
    }

    if (isFunction(format)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return format(value);
    }

    const resolvedFormat = isString(format) ? { type: format } : format;

    if (isNumeric(value)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return numberLocalization.format(value, resolvedFormat);
    }

    if (isDate(value)) {
      return dateLocalization.format(value, resolvedFormat);
    }

    return undefined;
  },
  getTimeFormat(showSecond) {
    return showSecond ? 'longtime' : 'shorttime';
  },

  _normalizeFormat(format: Format[] | string) {
    if (!Array.isArray(format)) {
      return format;
    }

    const formatParts: Format[] = format;

    if (formatParts.length === 1) {
      return formatParts[0];
    }

    return function(date): string {
      return formatParts.map((formatPart) => dateLocalization.format(date, formatPart)).join(' ');
    };
  },

  getDateFormatByDifferences(dateDifferences, intervalFormat) {
    const resultFormat: Format[] = [];
    const needSpecialSecondFormatter = intervalFormat && dateDifferences.millisecond
      && !(dateDifferences.year || dateDifferences.month || dateDifferences.day);

    if (needSpecialSecondFormatter) {
      const secondFormatter = function(date): string {
        return `${date.getSeconds() + date.getMilliseconds() / 1000}s`;
      };
      resultFormat.push(secondFormatter);
    } else if (dateDifferences.millisecond) {
      resultFormat.push('millisecond');
    }

    if (dateDifferences.hour || dateDifferences.minute
      || (!needSpecialSecondFormatter && dateDifferences.second)) {
      resultFormat.unshift(this.getTimeFormat(dateDifferences.second));
    }

    if (dateDifferences.year && dateDifferences.month && dateDifferences.day) {
      if (intervalFormat && intervalFormat === 'month') {
        return 'monthandyear';
      }
      resultFormat.unshift('shortdate');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this._normalizeFormat(resultFormat);
    }

    if (dateDifferences.year && dateDifferences.month) {
      return 'monthandyear';
    }
    if (dateDifferences.year && dateDifferences.quarter) {
      return 'quarterandyear';
    }
    if (dateDifferences.year) {
      return 'year';
    }
    if (dateDifferences.quarter) {
      return 'quarter';
    }

    if (dateDifferences.month && dateDifferences.day) {
      if (intervalFormat) {
        const monthDayFormatter = function(date): string {
          const monthName = dateLocalization.getMonthNames('abbreviated')[date.getMonth()];
          return `${monthName} ${dateLocalization.format(date, 'day')}`;
        };
        resultFormat.unshift(monthDayFormatter);
      } else {
        resultFormat.unshift('monthandday');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this._normalizeFormat(resultFormat);
    }
    if (dateDifferences.month) {
      return 'month';
    }
    if (dateDifferences.day) {
      if (intervalFormat) {
        resultFormat.unshift('day');
      } else {
        const dayFormatter = function(date): string {
          const dayOfWeek = dateLocalization.format(date, 'dayofweek');
          return `${dayOfWeek}, ${dateLocalization.format(date, 'day')}`;
        };
        resultFormat.unshift(dayFormatter);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this._normalizeFormat(resultFormat);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._normalizeFormat(resultFormat);
  },
  getDateFormatByTicks(ticks) {
    // assigned in both branches below
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let maxDiff;

    if (ticks.length > 1) {
      maxDiff = dateUtils.getDatesDifferences(ticks[0], ticks[1]);
      for (let i = 1; i < ticks.length - 1; i += 1) {
        const currentDiff = dateUtils.getDatesDifferences(ticks[i], ticks[i + 1]);
        if (maxDiff.count < currentDiff.count) {
          maxDiff = currentDiff;
        }
      }
    } else {
      maxDiff = {
        year: true,
        month: true,
        day: true,
        hour: ticks[0].getHours() > 0,
        minute: ticks[0].getMinutes() > 0,
        second: ticks[0].getSeconds() > 0,
        millisecond: ticks[0].getMilliseconds() > 0,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.getDateFormatByDifferences(maxDiff);
  },

  getDateFormatByTickInterval(startValue, endValue, tickInterval) {
    const dateDifferencesConverter = { week: 'day' };
    const correctDateDifferences = function(dateDifferences, unitInterval, value): void {
      switch (unitInterval) {
        case 'year':
        case 'quarter':
          dateDifferences.month = value;
          /* falls through */
        case 'month':
          dateDifferences.day = value;
          /* falls through */
        case 'week':
        case 'day':
          dateDifferences.hour = value;
          /* falls through */
        case 'hour':
          dateDifferences.minute = value;
          /* falls through */
        case 'minute':
          dateDifferences.second = value;
          /* falls through */
        case 'second':
          dateDifferences.millisecond = value;
          break;
        default:
          break;
      }
    };
    const correctDifferencesByMaxDate = function(differences, minDate, maxDate): void {
      if (!maxDate.getMilliseconds() && maxDate.getSeconds()) {
        if (maxDate.getSeconds() - minDate.getSeconds() === 1) {
          differences.millisecond = true;
          differences.second = false;
        }
      } else if (!maxDate.getSeconds() && maxDate.getMinutes()) {
        if (maxDate.getMinutes() - minDate.getMinutes() === 1) {
          differences.second = true;
          differences.minute = false;
        }
      } else if (!maxDate.getMinutes() && maxDate.getHours()) {
        if (maxDate.getHours() - minDate.getHours() === 1) {
          differences.minute = true;
          differences.hour = false;
        }
      } else if (!maxDate.getHours() && maxDate.getDate() > 1) {
        if (maxDate.getDate() - minDate.getDate() === 1) {
          differences.hour = true;
          differences.day = false;
        }
      } else if (maxDate.getDate() === 1 && maxDate.getMonth()) {
        if (maxDate.getMonth() - minDate.getMonth() === 1) {
          differences.day = true;
          differences.month = false;
        }
      } else if (!maxDate.getMonth() && maxDate.getFullYear()) {
        if (maxDate.getFullYear() - minDate.getFullYear() === 1) {
          differences.month = true;
          differences.year = false;
        }
      }
    };
    const normalizedTickInterval = isString(tickInterval)
      ? tickInterval.toLowerCase()
      : tickInterval;
    const dateDifferences = dateUtils.getDatesDifferences(startValue, endValue);

    if (startValue !== endValue) {
      correctDifferencesByMaxDate(
        dateDifferences,
        startValue > endValue ? endValue : startValue,
        startValue > endValue ? startValue : endValue,
      );
    }

    correctDateDifferences(
      dateDifferences,
      dateUtils.getDateUnitInterval(dateDifferences),
      true,
    );

    const dateUnitInterval = dateUtils.getDateUnitInterval(normalizedTickInterval || 'second');
    correctDateDifferences(dateDifferences, dateUnitInterval, false);

    dateDifferences[dateDifferencesConverter[dateUnitInterval] || dateUnitInterval] = true;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.getDateFormatByDifferences(dateDifferences);
  },
});
