"use strict";

var _validator_rules = require("../../../scheduler/options_validator/common/validator_rules");
var validationFunctions = _interopRequireWildcard(require("./validation_functions"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
describe('mustBeInteger', () => {
  let mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'isInteger');
  });
  afterEach(() => {
    var _mock;
    (_mock = mock) === null || _mock === void 0 || _mock.mockReset();
  });
  it('should call isInteger function', () => {
    (0, _validator_rules.mustBeInteger)(10);
    expect(mock).toHaveBeenCalledWith(10);
  });
  it('should return true if valid', () => {
    var _mock2;
    (_mock2 = mock) === null || _mock2 === void 0 || _mock2.mockImplementation(() => true);
    const result = (0, _validator_rules.mustBeInteger)(10);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid', () => {
    var _mock3;
    (_mock3 = mock) === null || _mock3 === void 0 || _mock3.mockImplementation(() => false);
    const result = (0, _validator_rules.mustBeInteger)(10.5);
    expect(result).toBe('10.5 must be an integer.');
  });
  it('should be the function with the correct name', () => {
    const func = _validator_rules.mustBeInteger;
    expect(func.name).toBe('mustBeInteger');
  });
});
describe('mustBeGreaterThan', () => {
  let mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'greaterThan');
  });
  afterEach(() => {
    var _mock4;
    (_mock4 = mock) === null || _mock4 === void 0 || _mock4.mockReset();
  });
  it('should call greaterThan function', () => {
    const func = (0, _validator_rules.mustBeGreaterThan)(10, true);
    func(15);
    expect(mock).toHaveBeenCalledWith(15, 10, true);
  });
  it('should return true if valid', () => {
    var _mock5;
    (_mock5 = mock) === null || _mock5 === void 0 || _mock5.mockImplementation(() => true);
    const func = (0, _validator_rules.mustBeGreaterThan)(10, true);
    const result = func(15);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid with strict: true', () => {
    var _mock6;
    (_mock6 = mock) === null || _mock6 === void 0 || _mock6.mockImplementation(() => false);
    const func = (0, _validator_rules.mustBeGreaterThan)(15, true);
    const result = func(10);
    expect(result).toBe('10 must be > than 15.');
  });
  it('should return error (string) if invalid with strict: false', () => {
    var _mock7;
    (_mock7 = mock) === null || _mock7 === void 0 || _mock7.mockImplementation(() => false);
    const func = (0, _validator_rules.mustBeGreaterThan)(15, false);
    const result = func(10);
    expect(result).toBe('10 must be >= than 15.');
  });
  it('should be the function with the correct name', () => {
    const func = (0, _validator_rules.mustBeGreaterThan)(15, false);
    expect(func.name).toBe('mustBeGreaterThan');
  });
});
describe('mustBeLessThan', () => {
  let mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'lessThan');
  });
  afterEach(() => {
    var _mock8;
    (_mock8 = mock) === null || _mock8 === void 0 || _mock8.mockReset();
  });
  it('should call lessThan function', () => {
    const func = (0, _validator_rules.mustBeLessThan)(10, true);
    func(5);
    expect(mock).toHaveBeenCalledWith(5, 10, true);
  });
  it('should return true if valid', () => {
    var _mock9;
    (_mock9 = mock) === null || _mock9 === void 0 || _mock9.mockImplementation(() => true);
    const func = (0, _validator_rules.mustBeLessThan)(10, true);
    const result = func(5);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid with strict: true', () => {
    var _mock10;
    (_mock10 = mock) === null || _mock10 === void 0 || _mock10.mockImplementation(() => false);
    const func = (0, _validator_rules.mustBeLessThan)(10, true);
    const result = func(15);
    expect(result).toBe('15 must be < than 10.');
  });
  it('should return error (string) if invalid with strict: false', () => {
    var _mock11;
    (_mock11 = mock) === null || _mock11 === void 0 || _mock11.mockImplementation(() => false);
    const func = (0, _validator_rules.mustBeLessThan)(10, false);
    const result = func(15);
    expect(result).toBe('15 must be <= than 10.');
  });
  it('should be the function with the correct name', () => {
    const func = (0, _validator_rules.mustBeLessThan)(15, false);
    expect(func.name).toBe('mustBeLessThan');
  });
});
describe('mustBeInRange', () => {
  let mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'inRange');
  });
  afterEach(() => {
    var _mock12;
    (_mock12 = mock) === null || _mock12 === void 0 || _mock12.mockReset();
  });
  it('should call inRange function', () => {
    const func = (0, _validator_rules.mustBeInRange)([0, 10]);
    func(5);
    expect(mock).toHaveBeenCalledWith(5, [0, 10]);
  });
  it('should return true if valid', () => {
    var _mock13;
    (_mock13 = mock) === null || _mock13 === void 0 || _mock13.mockImplementation(() => true);
    const func = (0, _validator_rules.mustBeInRange)([0, 10]);
    const result = func(5);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid ', () => {
    var _mock14;
    (_mock14 = mock) === null || _mock14 === void 0 || _mock14.mockImplementation(() => false);
    const func = (0, _validator_rules.mustBeInRange)([0, 10]);
    const result = func(15);
    expect(result).toBe('15 must be in range [0, 10].');
  });
  it('should be the function with the correct name', () => {
    const func = (0, _validator_rules.mustBeInRange)([0, 10]);
    expect(func.name).toBe('mustBeInRange');
  });
});
describe('mustBeDivisibleBy', () => {
  let mock = null;
  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'divisibleBy');
  });
  afterEach(() => {
    var _mock15;
    (_mock15 = mock) === null || _mock15 === void 0 || _mock15.mockReset();
  });
  it('should call divisibleBy function', () => {
    const func = (0, _validator_rules.mustBeDivisibleBy)(10);
    func(100);
    expect(mock).toHaveBeenCalledWith(100, 10);
  });
  it('should return true if valid', () => {
    var _mock16;
    (_mock16 = mock) === null || _mock16 === void 0 || _mock16.mockImplementation(() => true);
    const func = (0, _validator_rules.mustBeDivisibleBy)(5);
    const result = func(10);
    expect(result).toBe(true);
  });
  it('should return error (string) if invalid ', () => {
    var _mock17;
    (_mock17 = mock) === null || _mock17 === void 0 || _mock17.mockImplementation(() => false);
    const func = (0, _validator_rules.mustBeDivisibleBy)(5);
    const result = func(6);
    expect(result).toBe('6 must be divisible by 5.');
  });
  it('should be the function with the correct name', () => {
    const func = (0, _validator_rules.mustBeDivisibleBy)(5);
    expect(func.name).toBe('mustBeDivisibleBy');
  });
});