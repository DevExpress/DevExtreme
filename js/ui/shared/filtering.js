import { isDate, isDefined } from '../../core/utils/type';
import { map } from '../../core/utils/iterator';

const DEFAULT_DATE_INTERVAL = ['year', 'month', 'day'];
const DEFAULT_DATETIME_INTERVAL = ['year', 'month', 'day', 'hour', 'minute'];

const isDateType = function(dataType) {
    return dataType === 'date' || dataType === 'datetime';
};

const getGroupInterval = function(column) {
    let index;
    let result = [];
    const dateIntervals = ['year', 'month', 'day', 'hour', 'minute', 'second'];
    const groupInterval = column.headerFilter && column.headerFilter.groupInterval;
    const interval = groupInterval === 'quarter' ? 'month' : groupInterval;

    if(isDateType(column.dataType) && groupInterval !== null) {
        result = column.dataType === 'datetime' ? DEFAULT_DATETIME_INTERVAL : DEFAULT_DATE_INTERVAL;
        index = dateIntervals.indexOf(interval);

        if(index >= 0) {
            result = dateIntervals.slice(0, index);
            result.push(groupInterval);
            return result;
        }

        return result;
    } else if(isDefined(groupInterval)) {
        return Array.isArray(groupInterval) ? groupInterval : [groupInterval];
    }
};

export default (function() {
    const getFilterSelector = function(column, target) {
        let selector = column.dataField || column.selector;
        if(target === 'search') {
            selector = column.displayField || column.calculateDisplayValue || selector;
        }
        return selector;
    };

    const isZeroTime = function(date) {
        return date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() < 1;
    };

    const getDateValues = function(dateValue) {
        if(isDate(dateValue)) {
            return [dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate(), dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds()];
        }
        return map(('' + dateValue).split('/'), function(value, index) {
            return index === 1 ? Number(value) - 1 : Number(value);
        });
    };

    const getFilterExpressionByRange = function(filterValue, target) {
        const column = this;
        let endFilterValue;
        let startFilterExpression;
        let endFilterExpression;
        const selector = getFilterSelector(column, target);

        if(Array.isArray(filterValue) && isDefined(filterValue[0]) && isDefined(filterValue[1])) {
            startFilterExpression = [selector, '>=', filterValue[0]];
            endFilterExpression = [selector, '<=', filterValue[1]];

            if(isDateType(column.dataType) && isZeroTime(filterValue[1])) {
                endFilterValue = new Date(filterValue[1].getTime());
                if(column.dataType === 'date') {
                    endFilterValue.setDate(filterValue[1].getDate() + 1);
                }
                endFilterExpression = [selector, '<', endFilterValue];
            }

            return [startFilterExpression, 'and', endFilterExpression];
        }
    };

    const getFilterExpressionForDate = function(filterValue, selectedFilterOperation, target) {
        const column = this;
        let dateStart;
        let dateEnd;
        let dateInterval;
        const values = getDateValues(filterValue);
        const selector = getFilterSelector(column, target);

        if(target === 'headerFilter') {
            dateInterval = getGroupInterval(column)[values.length - 1];
        } else if(column.dataType === 'datetime') {
            dateInterval = 'minute';
        }

        switch(dateInterval) {
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

        switch(selectedFilterOperation) {
            case '<':
                return [selector, '<', dateStart];
            case '<=':
                return [selector, '<', dateEnd];
            case '>':
                return [selector, '>=', dateEnd];
            case '>=':
                return [selector, '>=', dateStart];
            case '<>':
                return [[selector, '<', dateStart], 'or', [selector, '>=', dateEnd]];
            default:
                return [[selector, '>=', dateStart], 'and', [selector, '<', dateEnd]];
        }
    };

    const getFilterExpressionForNumber = function(filterValue, selectedFilterOperation, target) {
        const column = this;
        const selector = getFilterSelector(column, target);
        const groupInterval = getGroupInterval(column);

        if(target === 'headerFilter' && groupInterval && isDefined(filterValue)) {
            const values = ('' + filterValue).split('/');
            const value = Number(values[values.length - 1]);

            const interval = groupInterval[values.length - 1];
            const startFilterValue = [selector, '>=', value];
            const endFilterValue = [selector, '<', value + interval];
            const condition = [startFilterValue, 'and', endFilterValue];
            return condition;
        }

        return [selector, selectedFilterOperation || '=', filterValue];
    };

    return {
        defaultCalculateFilterExpression: function(filterValue, selectedFilterOperation, target) {
            const column = this;
            const selector = getFilterSelector(column, target);
            const isSearchByDisplayValue = column.calculateDisplayValue && target === 'search';
            const dataType = isSearchByDisplayValue && column.lookup && column.lookup.dataType || column.dataType;
            let filter = null;

            if((target === 'headerFilter' || target === 'filterBuilder') && filterValue === null) {
                filter = [selector, selectedFilterOperation || '=', null];
                if(dataType === 'string') {
                    filter = [filter, selectedFilterOperation === '=' ? 'or' : 'and', [selector, selectedFilterOperation || '=', '']];
                }
            } else if(dataType === 'string' && (!column.lookup || isSearchByDisplayValue)) {
                filter = [selector, selectedFilterOperation || 'contains', filterValue];
            } else if(selectedFilterOperation === 'between') {
                return getFilterExpressionByRange.apply(column, [filterValue, target]);
            } else if(isDateType(dataType) && isDefined(filterValue)) {
                return getFilterExpressionForDate.apply(column, arguments);
            } else if(dataType === 'number') {
                return getFilterExpressionForNumber.apply(column, arguments);
            } else {
                filter = [selector, selectedFilterOperation || '=', filterValue];
            }

            return filter;
        },

        getGroupInterval: getGroupInterval
    };
}());
