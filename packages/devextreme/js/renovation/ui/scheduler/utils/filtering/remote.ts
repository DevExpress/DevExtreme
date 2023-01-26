import { equalByValue } from '../../../../../core/utils/common';
import { DataAccessorType } from '../../types';
import { extend } from '../../../../../core/utils/extend';
import dateSerialization from '../../../../../core/utils/date_serialization';
import { isDefined, isString } from '../../../../../core/utils/type';
import getDatesWithoutTime from './getDatesWithoutTime';
import { CombineRemoteFilterType, DateFilterType, RemoteFilterOptions } from './types';

const FilterPosition = {
  dateFilter: 0,
  userFilter: 1,
};

class RemoteFilterCombiner {
  options: RemoteFilterOptions;

  constructor(options: RemoteFilterOptions) {
    this.options = options;
  }

  get dataAccessors(): DataAccessorType { return this.options.dataAccessors; }

  get dataSourceFilter(): unknown[] | undefined { return this.options.dataSourceFilter; }

  get dateSerializationFormat(): string | undefined { return this.options.dateSerializationFormat; }

  get forceIsoDateParsing(): boolean {
    return isDefined(this.options.forceIsoDateParsing)
      ? this.options.forceIsoDateParsing
      : true;
  }

  makeDateFilter(min: Date, max: Date): DateFilterType[] {
    const {
      startDateExpr,
      endDateExpr,
      recurrenceRuleExpr,
    } = this.dataAccessors.expr;

    const dateFilter: DateFilterType[] = [
      [
        [endDateExpr, '>=', min],
        [startDateExpr, '<', max],
      ],
      'or',
      [recurrenceRuleExpr, 'startswith', 'freq'],
      'or',
      [
        [endDateExpr, min],
        [startDateExpr, min],
      ],
    ];

    if (!recurrenceRuleExpr) {
      dateFilter.splice(1, 2);
    }

    return dateFilter;
  }

  combineFilters(dateFilter: DateFilterType[], userFilter?: unknown[]): unknown[] {
    const combinedFilter: unknown[] = [];

    dateFilter && combinedFilter.push(dateFilter);
    userFilter && combinedFilter.push(userFilter);

    return this.serializeRemoteFilter(combinedFilter);
  }

  // TODO research (details in T838165 notes)
  serializeRemoteFilter(combinedFilter: unknown[]): unknown[] {
    if (!Array.isArray(combinedFilter)) {
      return combinedFilter;
    }

    const {
      startDateExpr,
      endDateExpr,
    } = this.dataAccessors.expr;
    const filter = extend([], combinedFilter) as unknown[];

    if (isString(filter[0])) {
      if (this.forceIsoDateParsing && filter.length > 1) {
        if (filter[0] === startDateExpr || filter[0] === endDateExpr) {
          // TODO: wrap filter value to new Date only necessary for case T838165 (details in note)
          const lastFilterValue = filter[filter.length - 1] as Date;
          filter[filter.length - 1] = dateSerialization.serializeDate(
            new Date(lastFilterValue),
            this.dateSerializationFormat,
          );
        }
      }
    }

    for (let i = 0; i < filter.length; i += 1) {
      filter[i] = this.serializeRemoteFilter(filter[i] as unknown[]);
    }

    return filter;
  }

  getUserFilter(dateFilter: DateFilterType[]): unknown[] | undefined {
    if (!this.dataSourceFilter || equalByValue(this.dataSourceFilter, dateFilter)) {
      return undefined;
    }

    const containsDateFilter = this.dataSourceFilter.length > 0
      && equalByValue(this.dataSourceFilter[FilterPosition.dateFilter], dateFilter);

    const userFilter = containsDateFilter
      ? this.dataSourceFilter[FilterPosition.userFilter]
      : this.dataSourceFilter;

    return userFilter as unknown[];
  }

  combine(min: Date, max: Date): unknown[] {
    const [trimMin, trimMax] = getDatesWithoutTime(min, max);
    const dateFilter = this.makeDateFilter(trimMin, trimMax);
    const userFilter = this.getUserFilter(dateFilter);

    const combinedFilter = this.combineFilters(dateFilter, userFilter as unknown[]);

    return combinedFilter;
  }
}

const combineRemoteFilter = (
  options: CombineRemoteFilterType,
): unknown[] => new RemoteFilterCombiner(options).combine(options.min, options.max);

export default combineRemoteFilter;
