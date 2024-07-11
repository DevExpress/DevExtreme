"use strict";

var validationFunctions = _interopRequireWildcard(require("./common/validation_functions"));
var _validator_rules = require("./validator_rules");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
describe('endDayHourMustBeGreaterThanStartDayHour', () => {
  const options = {
    startDayHour: 0,
    endDayHour: 24
  };
  let mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'greaterThan');
  });
  afterEach(() => {
    var _mock;
    (_mock = mock) === null || _mock === void 0 || _mock.mockReset();
  });
  it('should call greaterThan function', () => {
    (0, _validator_rules.endDayHourMustBeGreaterThanStartDayHour)(options);
    expect(mock).toHaveBeenCalledWith(options.endDayHour, options.startDayHour);
  });
  it('should return true if valid', () => {
    var _mock2;
    (_mock2 = mock) === null || _mock2 === void 0 || _mock2.mockImplementation(() => true);
    const result = (0, _validator_rules.endDayHourMustBeGreaterThanStartDayHour)(options);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid', () => {
    var _mock3;
    (_mock3 = mock) === null || _mock3 === void 0 || _mock3.mockImplementation(() => false);
    const result = (0, _validator_rules.endDayHourMustBeGreaterThanStartDayHour)({
      startDayHour: 10,
      endDayHour: 9
    });
    expect(result).toBe('endDayHour: 9 must be greater that startDayHour: 10.');
  });
  it('should be the function with the correct name', () => {
    const func = _validator_rules.endDayHourMustBeGreaterThanStartDayHour;
    expect(func.name).toBe('endDayHourGreaterThanStartDayHour');
  });
});
describe('visibleIntervalMustBeDivisibleByCellDuration', () => {
  const options = {
    cellDuration: 30,
    startDayHour: 0,
    endDayHour: 24
  };
  let mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'divisibleBy');
  });
  afterEach(() => {
    var _mock4;
    (_mock4 = mock) === null || _mock4 === void 0 || _mock4.mockReset();
  });
  it('should call divisibleBy function with correct values', () => {
    (0, _validator_rules.visibleIntervalMustBeDivisibleByCellDuration)(options);
    expect(mock).toHaveBeenCalledWith(1440, options.cellDuration);
  });
  it('should return true if valid', () => {
    var _mock5;
    (_mock5 = mock) === null || _mock5 === void 0 || _mock5.mockImplementation(() => true);
    const result = (0, _validator_rules.visibleIntervalMustBeDivisibleByCellDuration)(options);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid', () => {
    var _mock6;
    (_mock6 = mock) === null || _mock6 === void 0 || _mock6.mockImplementation(() => false);
    const result = (0, _validator_rules.visibleIntervalMustBeDivisibleByCellDuration)({
      cellDuration: 31,
      startDayHour: 9,
      endDayHour: 10
    });
    expect(result).toBe('endDayHour - startDayHour: 60 (minutes), must be divisible by cellDuration: 31 (minutes).');
  });
  it('should be the function with the correct name', () => {
    const func = _validator_rules.visibleIntervalMustBeDivisibleByCellDuration;
    expect(func.name).toBe('visibleIntervalMustBeDivisibleByCellDuration');
  });
});
describe('cellDurationMustBeLessThanVisibleInterval', () => {
  const options = {
    cellDuration: 30,
    startDayHour: 0,
    endDayHour: 24
  };
  let mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'lessThan');
  });
  afterEach(() => {
    var _mock7;
    (_mock7 = mock) === null || _mock7 === void 0 || _mock7.mockReset();
  });
  it('should call divisibleBy function with correct values', () => {
    (0, _validator_rules.cellDurationMustBeLessThanVisibleInterval)(options);
    expect(mock).toHaveBeenCalledWith(options.cellDuration, 1440, false);
  });
  it('should return true if valid', () => {
    var _mock8;
    (_mock8 = mock) === null || _mock8 === void 0 || _mock8.mockImplementation(() => true);
    const result = (0, _validator_rules.cellDurationMustBeLessThanVisibleInterval)(options);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid', () => {
    var _mock9;
    (_mock9 = mock) === null || _mock9 === void 0 || _mock9.mockImplementation(() => false);
    const result = (0, _validator_rules.cellDurationMustBeLessThanVisibleInterval)({
      cellDuration: 120,
      startDayHour: 9,
      endDayHour: 10
    });
    expect(result).toBe('endDayHour - startDayHour: 60 (minutes), must be greater or equal the cellDuration: 120 (minutes).');
  });
  it('should be the function with the correct name', () => {
    const func = _validator_rules.cellDurationMustBeLessThanVisibleInterval;
    expect(func.name).toBe('cellDurationMustBeLessThanVisibleInterval');
  });
});