"use strict";

var _data = require("../../../../../core/utils/data");
var _timezone_calculator = require("../../timezone_calculator");
var _index = require("../index");
describe('excludeFromRecurrence', () => {
  const dataAccessors = {
    getter: {
      allDay: (0, _data.compileGetter)('allDay'),
      startDate: (0, _data.compileGetter)('startDate'),
      recurrenceException: (0, _data.compileGetter)('recurrenceException')
    },
    setter: {
      allDay: (0, _data.compileSetter)('allDay'),
      startDate: (0, _data.compileSetter)('startDate'),
      recurrenceException: (0, _data.compileSetter)('recurrenceException')
    },
    expr: {
      allDay: 'allDay',
      startDate: 'startDate',
      recurrenceException: 'recurrenceException'
    }
  };
  [{
    allDay: true,
    recurrenceException: undefined,
    expected: '20220515T122500Z'
  }, {
    allDay: true,
    recurrenceException: '20220615T181800Z',
    expected: '20220615T181800Z,20220515T122500Z'
  }, {
    allDay: false,
    recurrenceException: undefined,
    expected: '20220515T181800Z'
  }, {
    allDay: false,
    recurrenceException: '20220615T181800Z',
    expected: '20220615T181800Z,20220515T181800Z'
  }].forEach(_ref => {
    let {
      allDay,
      recurrenceException,
      expected
    } = _ref;
    it(`should return correct result if "allDay"=${allDay}, "recurrenceException"=${recurrenceException}`, () => {
      const exceptionDate = new Date('2022-05-15T18:18:00.00Z');
      const result = (0, _index.excludeFromRecurrence)({
        text: 'test appointment',
        allDay,
        startDate: new Date('2022-04-18T12:25:00.00Z'),
        endDate: new Date('2022-03-18T13:26:00.00Z'),
        recurrenceException
      }, exceptionDate, dataAccessors, (0, _timezone_calculator.createTimeZoneCalculator)(''));
      expect(result.recurrenceException).toBe(expected);
    });
  });
  it('should return correct result if exception date has no hours', () => {
    const exceptionDate = new Date('2022-05-15T00:00:00.00Z');
    const result = (0, _index.excludeFromRecurrence)({
      text: 'test appointment',
      startDate: new Date(2022, 3, 18, 12, 25),
      endDate: new Date(2022, 3, 18, 13, 26)
    }, exceptionDate, dataAccessors, (0, _timezone_calculator.createTimeZoneCalculator)(''));
    expect(result.recurrenceException).toBe('20220515T000000Z');
  });
});