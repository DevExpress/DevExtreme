"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createValidatorRule = void 0;
const createValidatorRule = (name, ruleFunc) => {
  Object.defineProperty(ruleFunc, 'name', {
    value: name,
    writable: false
  });
  return ruleFunc;
};
exports.createValidatorRule = createValidatorRule;