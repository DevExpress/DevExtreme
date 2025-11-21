import { map } from '@js/core/utils/iterator';
import { isDate, isDefined } from '@js/core/utils/type';

const DEFAULT_DATE_INTERVAL = ['year', 'month', 'day'];
const DEFAULT_DATETIME_INTERVAL = ['year', 'month', 'day', 'hour', 'minute'];

const isDateType = (dataType): boolean => dataType === 'date' || dataType === 'datetime';

// @ts-expect-error ts-error
// eslint-disable-next-line consistent-return
const getGroupInterval = (column): string[] | undefined => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let index;
  let result: string[] = [];
  const dateIntervals = ['year', 'month', 'day', 'hour', 'minute', 'second'];
  const groupInterval = column.headerFilter?.groupInterval;
  const interval = groupInterval === 'quarter' ? 'month' : groupInterval;

  if (isDateType(column.dataType) && groupInterval !== null) {
    result = column.dataType === 'datetime' ? DEFAULT_DATETIME_INTERVAL : DEFAULT_DATE_INTERVAL;
    index = dateIntervals.indexOf(interval);

    if (index >= 0) {
      result = dateIntervals.slice(0, index);
      result.push(groupInterval);
      return result;
    }

    return result;
  }

  if (isDefined(groupInterval)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Array.isArray(groupInterval) ? groupInterval : [groupInterval];
  }
};

// eslint-disable-next-line @stylistic/max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unsafe-return
const getNormalizedCalculateDisplayValue = (column) => (column.calculateDisplayValue?.context
  ? column.calculateDisplayValue
  : null);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (function () {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getFilterSelector = (column, target) => {
    let selector = column.dataField || column.selector;
    if (target === 'search') {
      selector = column.displayField || getNormalizedCalculateDisplayValue(column) || selector;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return selector;
  };

  const isZeroTime = (date): boolean => date.getHours()
    + date.getMinutes()
    + date.getSeconds()
    + date.getMilliseconds()
    < 1;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getDateValues = (dateValue) => {
    if (isDate(dateValue)) {
      return [
        dateValue.getFullYear(),
        dateValue.getMonth(),
        dateValue.getDate(),
        dateValue.getHours(),
        dateValue.getMinutes(),
        dateValue.getSeconds(),
      ];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return map(
      `${dateValue}`.split('/'),
      (value, index): number => (index === 1 ? Number(value) - 1 : Number(value)),
    );
  };

  // @ts-expect-error ts-error
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,consistent-return
  const getFilterExpressionByRange = function (filterValue, target) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const column = this;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let endFilterValue;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let startFilterExpression;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let endFilterExpression;
    const selector = getFilterSelector(column, target);

    if (Array.isArray(filterValue) && isDefined(filterValue[0]) && isDefined(filterValue[1])) {
      startFilterExpression = [selector, '>=', filterValue[0]];
      endFilterExpression = [selector, '<=', filterValue[1]];

      if (isDateType(column.dataType) && isZeroTime(filterValue[1])) {
        endFilterValue = new Date(filterValue[1].getTime());
        if (column.dataType === 'date') {
          endFilterValue.setDate(filterValue[1].getDate() + 1);
        }
        endFilterExpression = [selector, '<', endFilterValue];
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return [startFilterExpression, 'and', endFilterExpression];
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getFilterExpressionForDate = function (filterValue, selectedFilterOperation, target) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const column = this;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let dateStart;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let dateEnd;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let dateInterval;
    const values = getDateValues(filterValue);
    const selector = getFilterSelector(column, target);

    if (target === 'headerFilter') {
      dateInterval = getGroupInterval(column)?.[values.length - 1];
    } else if (column.dataType === 'datetime') {
      dateInterval = 'minute';
    }

    switch (dateInterval) {
      case 'year':
        dateStart = new Date(values[0], 0, 1);
        dateEnd = new Date(values[0] + 1, 0, 1);
        break;
      case 'month':
        dateStart = new Date(values[0], values[1], 1);
        dateEnd = new Date(values[0], values[1] + 1, 1);
        break;
      case 'quarter':
        dateStart = new Date(values[0], 3 * values[1], 1);
        dateEnd = new Date(values[0], 3 * values[1] + 3, 1);
        break;
      case 'hour':
        dateStart = new Date(values[0], values[1], values[2], values[3]);
        dateEnd = new Date(values[0], values[1], values[2], values[3] + 1);
        break;
      case 'minute':
        dateStart = new Date(values[0], values[1], values[2], values[3], values[4]);
        dateEnd = new Date(values[0], values[1], values[2], values[3], values[4] + 1);
        break;
      case 'second':
        dateStart = new Date(values[0], values[1], values[2], values[3], values[4], values[5]);
        dateEnd = new Date(values[0], values[1], values[2], values[3], values[4], values[5] + 1);
        break;
      default:
        dateStart = new Date(values[0], values[1], values[2]);
        dateEnd = new Date(values[0], values[1], values[2] + 1);
    }

    switch (selectedFilterOperation) {
      case '<':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return [selector, '<', dateStart];
      case '<=':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return [selector, '<', dateEnd];
      case '>':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return [selector, '>=', dateEnd];
      case '>=':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return [selector, '>=', dateStart];
      case '<>':
        return [[selector, '<', dateStart], 'or', [selector, '>=', dateEnd]];
      default:
        return [[selector, '>=', dateStart], 'and', [selector, '<', dateEnd]];
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getFilterExpressionForNumber = function (filterValue, selectedFilterOperation, target) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const column = this;
    const selector = getFilterSelector(column, target);
    const groupInterval = getGroupInterval(column);

    if (target === 'headerFilter' && groupInterval && isDefined(filterValue)) {
      const values = `${filterValue}`.split('/');
      const value = Number(values[values.length - 1]);

      const interval = groupInterval[values.length - 1];
      const startFilterValue = [selector, '>=', value];
      const endFilterValue = [selector, '<', value + interval];
      const condition = [startFilterValue, 'and', endFilterValue];
      return condition;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return [selector, selectedFilterOperation || '=', filterValue];
  };

  return {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    defaultCalculateFilterExpression(filterValue, selectedFilterOperation, target) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const column = this;
      const selector = getFilterSelector(column, target);
      const isSearchByDisplayValue = column.calculateDisplayValue && target === 'search';
      // eslint-disable-next-line @stylistic/no-mixed-operators
      const dataType = isSearchByDisplayValue && column.lookup?.dataType || column.dataType;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let filter: any = null;

      if ((target === 'headerFilter' || target === 'filterBuilder') && filterValue === null) {
        filter = [selector, selectedFilterOperation || '=', null];
        if (dataType === 'string') {
          filter = [filter, selectedFilterOperation === '=' ? 'or' : 'and', [selector, selectedFilterOperation || '=', '']];
        }
      } else if (dataType === 'string' && (!column.lookup || isSearchByDisplayValue)) {
        filter = [selector, selectedFilterOperation || 'contains', filterValue];
      } else if (selectedFilterOperation === 'between') {
        return getFilterExpressionByRange.apply(column, [filterValue, target]);
      } else if (isDateType(dataType) && isDefined(filterValue)) {
        // @ts-expect-error ts-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,prefer-rest-params
        return getFilterExpressionForDate.apply(column, arguments);
      } else if (dataType === 'number') {
        // @ts-expect-error ts-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,prefer-rest-params
        return getFilterExpressionForNumber.apply(column, arguments);
      } else {
        filter = [selector, selectedFilterOperation || '=', filterValue];
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return filter;
    },

    getGroupInterval,
  };
}());
