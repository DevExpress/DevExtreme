"use strict";

var _jestEach = _interopRequireDefault(require("jest-each"));
var _validation_functions = require("./validation_functions");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
describe('isInteger', () => {
  (0, _jestEach.default)`
    value   | expectedResult
    ${1}    | ${true}
    ${1.5}  | ${false}
    ${-1}   | ${true}
    ${-1.5} | ${false}
    ${0}    | ${true}
  `.it('should detect integer correctly', _ref => {
    let {
      value,
      expectedResult
    } = _ref;
    const result = (0, _validation_functions.isInteger)(value);
    expect(result).toEqual(expectedResult);
  });
});
describe('greaterThat', () => {
  (0, _jestEach.default)`
    value   | min     | strict    | expectedResult
    ${10}   | ${5}    | ${true}   | ${true}
    ${10}   | ${15}   | ${true}   | ${false}
    ${10}   | ${10}   | ${true}   | ${false}
    ${0}    | ${0}    | ${true}   | ${false}
    ${-10}  | ${-10}  | ${true}   | ${false}
    ${-10}  | ${-5}   | ${true}   | ${false}
    ${-10}  | ${-15}  | ${true}   | ${true}
    ${10}   | ${5}    | ${false}  | ${true}
    ${10}   | ${15}   | ${false}  | ${false}
    ${10}   | ${10}   | ${false}  | ${true}
    ${0}    | ${0}    | ${false}  | ${true}
    ${-10}  | ${-10}  | ${false}  | ${true}
    ${-10}  | ${-5}   | ${false}  | ${false}
    ${-10}  | ${-15}  | ${false}  | ${true}
  `.it('should compare numbers correctly', _ref2 => {
    let {
      value,
      min,
      strict,
      expectedResult
    } = _ref2;
    const result = (0, _validation_functions.greaterThan)(value, min, strict);
    expect(result).toEqual(expectedResult);
  });
});
describe('lessThat', () => {
  (0, _jestEach.default)`
    value   | min     | strict    | expectedResult
    ${10}   | ${5}    | ${true}   | ${false}
    ${10}   | ${15}   | ${true}   | ${true}
    ${10}   | ${10}   | ${true}   | ${false}
    ${0}    | ${0}    | ${true}   | ${false}
    ${-10}  | ${-10}  | ${true}   | ${false}
    ${-10}  | ${-5}   | ${true}   | ${true}
    ${-10}  | ${-15}  | ${true}   | ${false}
    ${10}   | ${5}    | ${false}  | ${false}
    ${10}   | ${15}   | ${false}  | ${true}
    ${10}   | ${10}   | ${false}  | ${true}
    ${0}    | ${0}    | ${false}  | ${true}
    ${-10}  | ${-10}  | ${false}  | ${true}
    ${-10}  | ${-5}   | ${false}  | ${true}
    ${-10}  | ${-15}  | ${false}  | ${false}
  `.it('should compare numbers correctly', _ref3 => {
    let {
      value,
      min,
      strict,
      expectedResult
    } = _ref3;
    const result = (0, _validation_functions.lessThan)(value, min, strict);
    expect(result).toEqual(expectedResult);
  });
});
describe('inRange', () => {
  (0, _jestEach.default)`
    value | range         | expectedResult
    ${5}  | ${[-10, 10]}  | ${true}
    ${5}  | ${[5, 10]}    | ${true}
    ${5}  | ${[-10, 5]}   | ${true}
    ${5}  | ${[-10, 4]}   | ${false}
    ${5}  | ${[6, 10]}    | ${false}
    ${-5} | ${[-10, 10]}  | ${true}
    ${-5} | ${[-5, 0]}    | ${true}
    ${-5} | ${[-10, -5]}  | ${true}
    ${-5} | ${[-10, -6]}  | ${false}
    ${-5} | ${[-4, 0]}    | ${false}
  `.it('should determine interval correctly', _ref4 => {
    let {
      value,
      range,
      expectedResult
    } = _ref4;
    const result = (0, _validation_functions.inRange)(value, range);
    expect(result).toEqual(expectedResult);
  });
});
describe('divisibleBy', () => {
  (0, _jestEach.default)`
    value  | divider  | expectedResult
    ${4}   | ${2}     | ${true}
    ${5}   | ${2}     | ${false}
    ${0}   | ${111}   | ${true}
    ${4}   | ${-2}     | ${true}
    ${5}   | ${-2}     | ${false}
    ${0}   | ${-111}   | ${true}
    ${-4}  | ${2}     | ${true}
    ${-5}  | ${2}     | ${false}
    ${4}   | ${-2}     | ${true}
    ${5}   | ${-2}     | ${false}
  `.it('should determine divisible by correctly', _ref5 => {
    let {
      value,
      divider,
      expectedResult
    } = _ref5;
    const result = (0, _validation_functions.divisibleBy)(value, divider);
    expect(result).toEqual(expectedResult);
  });
});