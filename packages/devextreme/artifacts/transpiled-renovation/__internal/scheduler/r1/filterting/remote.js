"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineRemoteFilter = void 0;
var _common = require("../../../../core/utils/common");
var _date_serialization = _interopRequireDefault(require("../../../../core/utils/date_serialization"));
var _extend = require("../../../../core/utils/extend");
var _type = require("../../../../core/utils/type");
var _index = require("../utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FilterPosition = {
  dateFilter: 0,
  userFilter: 1
};
class RemoteFilterCombiner {
  constructor(options) {
    this.options = options;
  }
  get dataAccessors() {
    return this.options.dataAccessors;
  }
  get dataSourceFilter() {
    return this.options.dataSourceFilter;
  }
  get dateSerializationFormat() {
    return this.options.dateSerializationFormat;
  }
  get forceIsoDateParsing() {
    return (0, _type.isDefined)(this.options.forceIsoDateParsing) ? this.options.forceIsoDateParsing : true;
  }
  makeDateFilter(min, max) {
    const {
      startDateExpr,
      endDateExpr,
      recurrenceRuleExpr
    } = this.dataAccessors.expr;
    const dateFilter = [[[endDateExpr, '>=', min], [startDateExpr, '<', max]], 'or', [recurrenceRuleExpr, 'startswith', 'freq'], 'or', [[endDateExpr, min], [startDateExpr, min]]];
    if (!recurrenceRuleExpr) {
      dateFilter.splice(1, 2);
    }
    return dateFilter;
  }
  combineFilters(dateFilter, userFilter) {
    const combinedFilter = [];
    if (dateFilter) {
      combinedFilter.push(dateFilter);
    }
    if (userFilter) {
      combinedFilter.push(userFilter);
    }
    return this.serializeRemoteFilter(combinedFilter);
  }
  // TODO research (details in T838165 notes)
  serializeRemoteFilter(combinedFilter) {
    if (!Array.isArray(combinedFilter)) {
      return combinedFilter;
    }
    const {
      startDateExpr,
      endDateExpr
    } = this.dataAccessors.expr;
    const filter = (0, _extend.extend)([], combinedFilter);
    if ((0, _type.isString)(filter[0])) {
      if (this.forceIsoDateParsing && filter.length > 1) {
        if (filter[0] === startDateExpr || filter[0] === endDateExpr) {
          // TODO: wrap filter value to new Date only necessary for case T838165 (details in note)
          const lastFilterValue = filter[filter.length - 1];
          filter[filter.length - 1] = _date_serialization.default.serializeDate(new Date(lastFilterValue), this.dateSerializationFormat);
        }
      }
    }
    for (let i = 0; i < filter.length; i += 1) {
      filter[i] = this.serializeRemoteFilter(filter[i]);
    }
    return filter;
  }
  getUserFilter(dateFilter) {
    if (!this.dataSourceFilter || (0, _common.equalByValue)(this.dataSourceFilter, dateFilter)) {
      return undefined;
    }
    const containsDateFilter = this.dataSourceFilter.length > 0 && (0, _common.equalByValue)(this.dataSourceFilter[FilterPosition.dateFilter], dateFilter);
    const userFilter = containsDateFilter ? this.dataSourceFilter[FilterPosition.userFilter] : this.dataSourceFilter;
    return userFilter;
  }
  combine(min, max) {
    const [trimMin, trimMax] = (0, _index.getDatesWithoutTime)(min, max);
    const dateFilter = this.makeDateFilter(trimMin, trimMax);
    const userFilter = this.getUserFilter(dateFilter);
    const combinedFilter = this.combineFilters(dateFilter, userFilter);
    return combinedFilter;
  }
}
const combineRemoteFilter = options => new RemoteFilterCombiner(options).combine(options.min, options.max);
exports.combineRemoteFilter = combineRemoteFilter;