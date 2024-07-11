"use strict";

var _math = require("../../core/utils/math");
var _jestEach = _interopRequireDefault(require("jest-each"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
describe('Math utils tests', () => {
  describe('shiftIntegerByModule', () => {
    (0, _jestEach.default)`
      value         | module   | expectedResult
      ${0}          | ${2}    | ${0}
      ${2}          | ${2}    | ${0}
      ${2}          | ${4}    | ${2}
      ${2}          | ${1000} | ${2}
      ${4}          | ${2}    | ${0}
      ${5}          | ${2}    | ${1}
      ${6}          | ${2}    | ${0}
      ${1e10}       | ${10}   | ${0}
      ${1e10 + 3}   | ${10}   | ${3}
      ${-9}         | ${3}    | ${0}
      ${-1}         | ${6}    | ${5}
      ${-3}         | ${9}    | ${6}
      ${-5}         | ${9}    | ${4}
      ${-1e10}      | ${10}   | ${0}
      ${-1e10 + 3}  | ${10}   | ${3}
    `.it('should return correct result', _ref => {
      let {
        value,
        module,
        expectedResult
      } = _ref;
      const result = (0, _math.shiftIntegerByModule)(value, module);
      expect(result).toEqual(expectedResult);
    });
    it('should throw error if value isn\'t integer', () => {
      expect(() => (0, _math.shiftIntegerByModule)(1.5, 3)).toThrow();
    });
    it('should throw error if module value isn\'t integer', () => {
      expect(() => (0, _math.shiftIntegerByModule)(2, 2.5)).toThrow();
    });
    it('should throw error if module value equals zero', () => {
      expect(() => (0, _math.shiftIntegerByModule)(2, 0)).toThrow();
    });
    it('should throw error if module value less than zero', () => {
      expect(() => (0, _math.shiftIntegerByModule)(2, -2)).toThrow();
    });
  });
});