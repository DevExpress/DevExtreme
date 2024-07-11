"use strict";

var _remote = require("../remote");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
describe('Remote filtering', () => {
  describe('combineRemoteFilter', () => {
    const FilterPosition = {
      dateFilter: 0,
      userFilter: 1
    };
    const defaultDataAccessors = {
      expr: {
        startDateExpr: 'startDate',
        endDateExpr: 'endDate'
      }
    };
    const dateFilter = [[['endDate', '>=', new Date(2021, 10, 23)], ['startDate', '<', new Date(2021, 10, 24)]], 'or', [['endDate', new Date(2021, 10, 23)], ['startDate', new Date(2021, 10, 23)]]];
    const userFilter = ['startDate', '>', new Date(2021, 10, 23, 15, 25)];
    it('should return correct filter', () => {
      const combinedFilter = (0, _remote.combineRemoteFilter)({
        dataAccessors: defaultDataAccessors,
        dateSerializationFormat: '',
        min: new Date(2021, 10, 23, 15, 15),
        max: new Date(2021, 10, 23, 16, 16)
      });
      expect(combinedFilter).toHaveLength(1);
      expect(combinedFilter[FilterPosition.dateFilter]).toEqual(dateFilter);
    });
    it('should return correct filter if recurrenceRuleExpr', () => {
      const combinedFilter = (0, _remote.combineRemoteFilter)({
        dataAccessors: {
          expr: _extends({}, defaultDataAccessors.expr, {
            recurrenceRuleExpr: 'recurrenceRule'
          })
        },
        dateSerializationFormat: '',
        min: new Date(2021, 10, 23, 15, 15),
        max: new Date(2021, 10, 23, 16, 16)
      });
      expect(combinedFilter).toHaveLength(1);
      expect(combinedFilter[FilterPosition.dateFilter]).toEqual([[['endDate', '>=', new Date(2021, 10, 23)], ['startDate', '<', new Date(2021, 10, 24)]], 'or', ['recurrenceRule', 'startswith', 'freq'], 'or', [['endDate', new Date(2021, 10, 23)], ['startDate', new Date(2021, 10, 23)]]]);
    });
    describe('userFilter', () => {
      it('should return correct filter if userFilter is present', () => {
        const combinedFilter = (0, _remote.combineRemoteFilter)({
          dataAccessors: defaultDataAccessors,
          dataSourceFilter: ['startDate', '>', new Date(2021, 10, 23, 15, 25)],
          dateSerializationFormat: '',
          min: new Date(2021, 10, 23, 15, 15),
          max: new Date(2021, 10, 23, 16, 16)
        });
        expect(combinedFilter).toHaveLength(2);
        expect(combinedFilter[FilterPosition.dateFilter]).toEqual(dateFilter);
        expect(combinedFilter[FilterPosition.userFilter]).toEqual(userFilter);
      });
      it('should return correct filter if userFilter is present and dateSerializationFormat', () => {
        const combinedFilter = (0, _remote.combineRemoteFilter)({
          dataAccessors: defaultDataAccessors,
          dataSourceFilter: ['startDate', '>', new Date(2021, 10, 23, 15, 25)],
          dateSerializationFormat: 'yyyy',
          min: new Date(2021, 10, 23, 15, 15),
          max: new Date(2021, 10, 23, 16, 16)
        });
        expect(combinedFilter).toHaveLength(2);
        expect(combinedFilter[FilterPosition.dateFilter]).toEqual([[['endDate', '>=', '2021'], ['startDate', '<', '2021']], 'or', [['endDate', '2021'], ['startDate', '2021']]]);
        expect(combinedFilter[FilterPosition.userFilter]).toEqual(['startDate', '>', '2021']);
      });
      it('should return correct filter if userFilter is present and dateSerializationFormat and forceIsoDateString is false', () => {
        const combinedFilter = (0, _remote.combineRemoteFilter)({
          dataAccessors: defaultDataAccessors,
          dataSourceFilter: ['startDate', '>', new Date(2021, 10, 23, 15, 25)],
          min: new Date(2021, 10, 23, 15, 15),
          max: new Date(2021, 10, 23, 16, 16),
          dateSerializationFormat: 'yyyy-MM-dd',
          forceIsoDateParsing: false
        });
        expect(combinedFilter).toHaveLength(2);
        expect(combinedFilter[FilterPosition.dateFilter]).toEqual(dateFilter);
        expect(combinedFilter[FilterPosition.userFilter]).toEqual(userFilter);
      });
    });
    describe('dateFilter present', () => {
      it('should return correct filter if dateFilter is a part of the dataSourceFilter', () => {
        const combinedFilter = (0, _remote.combineRemoteFilter)({
          dataAccessors: defaultDataAccessors,
          dataSourceFilter: [dateFilter],
          dateSerializationFormat: '',
          min: new Date(2021, 10, 23, 15, 15),
          max: new Date(2021, 10, 23, 16, 16)
        });
        expect(combinedFilter).toHaveLength(1);
        expect(combinedFilter[FilterPosition.dateFilter]).toEqual(dateFilter);
      });
      it('should return correct filter if dataSourceFilter is equals to the dateFilter', () => {
        const combinedFilter = (0, _remote.combineRemoteFilter)({
          dataAccessors: defaultDataAccessors,
          dataSourceFilter: dateFilter,
          dateSerializationFormat: '',
          min: new Date(2021, 10, 23, 15, 15),
          max: new Date(2021, 10, 23, 16, 16)
        });
        expect(combinedFilter).toEqual([dateFilter]);
      });
    });
  });
});