"use strict";

var _validator = require("./validator");
const widgetOptions = {
  A: 5,
  B: '5'
};
describe('Validator', () => {
  it('should return "true" if there are no errors', () => {
    const validator = new _validator.Validator(_ref => {
      let {
        A
      } = _ref;
      return A;
    }, [() => true, () => true, () => true]);
    const result = validator.validate(widgetOptions);
    expect(result).toBe(true);
  });
  it('should return "true" with empty rules array', () => {
    const validator = new _validator.Validator(_ref2 => {
      let {
        A
      } = _ref2;
      return A;
    }, []);
    const result = validator.validate(widgetOptions);
    expect(result).toBe(true);
  });
  it('should return object with errors if some rules return errors', () => {
    const firstFailedRule = () => 'error_1';
    const secondFailedRule = () => 'error_2';
    Object.defineProperty(firstFailedRule, 'name', {
      value: 'rule_1',
      writable: false
    });
    Object.defineProperty(secondFailedRule, 'name', {
      value: 'rule_2',
      writable: false
    });
    const expectedResult = {
      rule_1: 'error_1',
      rule_2: 'error_2'
    };
    const validator = new _validator.Validator(_ref3 => {
      let {
        A
      } = _ref3;
      return A;
    }, [firstFailedRule, jest.fn(() => true), secondFailedRule]);
    const result = validator.validate(widgetOptions);
    expect(result).toEqual(expectedResult);
  });
});