"use strict";

var _data = require("../../../../../core/utils/data");
var _timezone_calculator = require("../../timezone_calculator");
var _data2 = require("../data");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const defaultDataAccessors = {
  getter: {
    startDate: (0, _data.compileGetter)('startDate'),
    endDate: (0, _data.compileGetter)('endDate'),
    recurrenceRule: (0, _data.compileGetter)('recurrenceRule'),
    visible: (0, _data.compileGetter)('visible')
  },
  setter: {
    startDate: (0, _data.compileSetter)('startDate'),
    endDate: (0, _data.compileSetter)('endDate')
  },
  expr: {
    startDateExpr: 'startDate',
    endDateExpr: 'endDate',
    recurrenceRuleExpr: 'recurrenceRule',
    visibleExpr: 'visible'
  }
};
describe('Data API', () => {
  describe('getPreparedDataItems', () => {
    it('should prepare correct data items', () => {
      const data = [{
        startDate: new Date(2021, 9, 8),
        endDate: new Date(2021, 9, 9),
        recurrenceRule: 'FREQ=WEEKLY'
      }];
      const expectedResult = {
        allDay: false,
        endDate: new Date(2021, 9, 9),
        hasRecurrenceRule: true,
        rawAppointment: data[0],
        recurrenceException: undefined,
        recurrenceRule: 'FREQ=WEEKLY',
        startDate: new Date(2021, 9, 8),
        visible: true
      };
      const result = (0, _data2.getPreparedDataItems)(data, defaultDataAccessors, 30, (0, _timezone_calculator.createTimeZoneCalculator)(''));
      expect(result).toEqual([expectedResult]);
    });
    [null, undefined, ''].forEach(recurrenceRule => {
      it(`should prepare correct data items if recurrenceRule=${recurrenceRule}`, () => {
        const data = [{
          startDate: new Date(2021, 9, 8),
          endDate: new Date(2021, 9, 9),
          recurrenceRule: recurrenceRule
        }];
        const expectedResult = {
          allDay: false,
          endDate: new Date(2021, 9, 9),
          hasRecurrenceRule: false,
          rawAppointment: data[0],
          recurrenceException: undefined,
          recurrenceRule: recurrenceRule,
          startDate: new Date(2021, 9, 8),
          visible: true
        };
        const result = (0, _data2.getPreparedDataItems)(data, defaultDataAccessors, 30, (0, _timezone_calculator.createTimeZoneCalculator)(''));
        expect(result).toEqual([expectedResult]);
      });
    });
    [{
      visible: null,
      expected: true
    }, {
      visible: undefined,
      expected: true
    }, {
      visible: true,
      expected: true
    }, {
      visible: false,
      expected: false
    }].forEach(_ref => {
      let {
        visible,
        expected
      } = _ref;
      it(`should correctly set visible if appointment visible is ${visible}`, () => {
        const data = [{
          startDate: new Date(2021, 9, 8),
          endDate: new Date(2021, 9, 9),
          visible
        }];
        const result = (0, _data2.getPreparedDataItems)(data, defaultDataAccessors, 30, (0, _timezone_calculator.createTimeZoneCalculator)(''));
        expect(result).toMatchObject([{
          visible: expected
        }]);
      });
    });
    it('should return empty array if no dataItems', () => {
      let result = (0, _data2.getPreparedDataItems)(undefined, defaultDataAccessors, 30, (0, _timezone_calculator.createTimeZoneCalculator)(''));
      expect(result).toEqual([]);
      result = (0, _data2.getPreparedDataItems)([], defaultDataAccessors, 30, (0, _timezone_calculator.createTimeZoneCalculator)(''));
      expect(result).toEqual([]);
    });
    it('should return empty array without startDate', () => {
      const data = [{
        endDate: new Date(2021, 9, 9)
      }];
      const result = (0, _data2.getPreparedDataItems)(data, defaultDataAccessors, 30, (0, _timezone_calculator.createTimeZoneCalculator)(''));
      expect(result).toEqual([]);
    });
    it('should return correct value without endDate', () => {
      const data = [{
        startDate: new Date(2021, 9, 9, 17)
      }];
      const expectedResult = {
        allDay: false,
        endDate: new Date(2021, 9, 9, 17, 30),
        hasRecurrenceRule: false,
        rawAppointment: data[0],
        recurrenceException: undefined,
        recurrenceRule: undefined,
        startDate: new Date(2021, 9, 9, 17),
        visible: true
      };
      const result = (0, _data2.getPreparedDataItems)(data, defaultDataAccessors, 30, (0, _timezone_calculator.createTimeZoneCalculator)(''));
      expect(result).toEqual([expectedResult]);
    });
    it('should return timezones of start date and end date if them exists', () => {
      const expectedTimezones = {
        startDateTimeZone: 'Etc/GMT+10',
        endDateTimeZone: 'Etc/GMT-10'
      };
      const data = [_extends({
        startDate: new Date(2021, 9, 8),
        endDate: new Date(2021, 9, 9)
      }, expectedTimezones)];
      const result = (0, _data2.getPreparedDataItems)(data, defaultDataAccessors, 30, (0, _timezone_calculator.createTimeZoneCalculator)(''));
      expect(result).toMatchObject([expectedTimezones]);
    });
  });
  describe('resolveDataItems', () => {
    it('should return correct items if loaded Array', () => {
      const data = [1, 2, 3];
      expect((0, _data2.resolveDataItems)(data)).toBe(data);
    });
    it('should return correct items if loaded Object', () => {
      const options = {
        data: [1, 2, 3]
      };
      expect((0, _data2.resolveDataItems)(options)).toBe(options.data);
    });
  });
});