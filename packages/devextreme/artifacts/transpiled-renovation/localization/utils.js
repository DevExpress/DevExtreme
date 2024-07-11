"use strict";

exports.toFixed = toFixed;
var _math = require("../core/utils/math");
const DECIMAL_BASE = 10;
function roundByAbs(value) {
  const valueSign = (0, _math.sign)(value);
  return valueSign * Math.round(Math.abs(value));
}
function adjustValue(value, precision) {
  const precisionMultiplier = Math.pow(DECIMAL_BASE, precision);
  const intermediateValue = (0, _math.multiplyInExponentialForm)(value, precision);
  return roundByAbs(intermediateValue) / precisionMultiplier;
}
function toFixed(value, precision) {
  const valuePrecision = precision || 0;
  const adjustedValue = valuePrecision > 0 ? adjustValue(...arguments) : value;
  return adjustedValue.toFixed(valuePrecision);
}