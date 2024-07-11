"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mustBeLessThan = exports.mustBeInteger = exports.mustBeInRange = exports.mustBeGreaterThan = exports.mustBeDivisibleBy = void 0;
var _index = require("../core/index");
var _validation_functions = require("./validation_functions");
const mustBeInteger = exports.mustBeInteger = (0, _index.createValidatorRule)('mustBeInteger', value => (0, _validation_functions.isInteger)(value) || `${value} must be an integer.`);
const mustBeGreaterThan = function (minimalValue) {
  let strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return (0, _index.createValidatorRule)('mustBeGreaterThan', value => (0, _validation_functions.greaterThan)(value, minimalValue, strict) || `${value} must be ${strict ? '>' : '>='} than ${minimalValue}.`);
};
exports.mustBeGreaterThan = mustBeGreaterThan;
const mustBeLessThan = function (maximalValue) {
  let strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return (0, _index.createValidatorRule)('mustBeLessThan', value => (0, _validation_functions.lessThan)(value, maximalValue, strict) || `${value} must be ${strict ? '<' : '<='} than ${maximalValue}.`);
};
exports.mustBeLessThan = mustBeLessThan;
const mustBeInRange = range => (0, _index.createValidatorRule)('mustBeInRange', value => (0, _validation_functions.inRange)(value, range) || `${value} must be in range [${range[0]}, ${range[1]}].`);
exports.mustBeInRange = mustBeInRange;
const mustBeDivisibleBy = divider => (0, _index.createValidatorRule)('mustBeDivisibleBy', value => (0, _validation_functions.divisibleBy)(value, divider) || `${value} must be divisible by ${divider}.`);
exports.mustBeDivisibleBy = mustBeDivisibleBy;