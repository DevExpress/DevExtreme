import {
    getTrimDates,
} from './utils';
import { equalByValue } from '../../../../core/utils/common';
import { extend } from '../../../../core/utils/extend';
import dateSerialization from '../../../../core/utils/date_serialization';
import { isString } from '../../../../core/utils/type';

const DATE_FILTER_POSITION = 0;
const USER_FILTER_POSITION = 1;

class RemoteFilterCombiner {
    constructor(options) {
        this.options = options;
    }

    get dataAccessors() { return this.options.dataAccessors; }
    get dataSourceFilter() { return this.options.dataSourceFilter; }
    get dateSerializationFormat() { return this.options.dateSerializationFormat; }
    get forceIsoDateParsing() { return this.options.forceIsoDateParsing; }

    makeDateFilter(min, max) {
        const {
            startDateExpr,
            endDateExpr,
            recurrenceRuleExpr
        } = this.dataAccessors.expr;

        const dateFilter = [
            [
                [endDateExpr, '>=', min],
                [startDateExpr, '<', max]
            ],
            'or',
            [recurrenceRuleExpr, 'startswith', 'freq'],
            'or',
            [
                [endDateExpr, min],
                [startDateExpr, min]
            ]
        ];

        if(!recurrenceRuleExpr) {
            dateFilter.splice(1, 2);
        }

        dateFilter.name = 'dateFilter';

        return dateFilter;
    }

    isContainsDateFilter(dateFilter) {
        if(!dateFilter || !this.dataSourceFilter) {
            return false;
        }

        if(equalByValue(this.dataSourceFilter, dateFilter)) {
            return true;
        }

        return this.dataSourceFilter.length &&
            equalByValue(this.dataSourceFilter[DATE_FILTER_POSITION], dateFilter);
    }

    combineFilters(dateFilter, userFilter) {
        const combinedFilter = [];

        dateFilter && combinedFilter.push(dateFilter);
        userFilter && combinedFilter.push(userFilter);

        return this.serializeRemoteFilter(combinedFilter);
    }

    // TODO research and rework (details in T838165 notes)
    serializeRemoteFilter(combinedFilter) {
        if(!Array.isArray(combinedFilter)) {
            return combinedFilter;
        }

        const {
            startDateExpr,
            endDateExpr
        } = this.dataAccessors.expr;
        const filter = extend([], combinedFilter);

        if(isString(filter[0])) {
            if(this.forceIsoDateParsing && filter.length > 1) {
                if(filter[0] === startDateExpr || filter[0] === endDateExpr) {
                    // TODO: wrap filter value to new Date only necessary for case T838165 (details in note)
                    const lastFilterValue = filter[filter.length - 1];
                    filter[filter.length - 1] = dateSerialization.serializeDate(new Date(lastFilterValue), this.dateSerializationFormat);
                }
            }
        }

        for(let i = 0; i < filter.length; i++) {
            filter[i] = this.serializeRemoteFilter(filter[i]);
        }

        return filter;
    }

    combine(min, max) {
        const [trimMin, trimMax] = getTrimDates(min, max);
        const dateFilter = this.makeDateFilter(trimMin, trimMax);
        const userFilter = this.isContainsDateFilter(dateFilter)
            ? this.dataSourceFilter[USER_FILTER_POSITION]
            : this.dataSourceFilter;

        const combinedFilter = this.combineFilters(dateFilter, userFilter);

        return combinedFilter;
    }
}

const combinedRemoteFilter = (dataSourceFilter, dataAccessors, min, max, dateSerializationFormat, forceIsoDateParsing = true) => {
    return new RemoteFilterCombiner({
        dataAccessors,
        dataSourceFilter,
        dateSerializationFormat,
        forceIsoDateParsing,
    }).combine(min, max);
};

export default combinedRemoteFilter;
