"use strict";

exports.correctValueType = correctValueType;
exports.getParser = void 0;
var _common = require("../../core/utils/common");
var _date_serialization = _interopRequireDefault(require("../../core/utils/date_serialization"));
var _type = require("../../core/utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const parsers = {
  string: function (val) {
    return (0, _type.isDefined)(val) ? '' + val : val;
  },
  numeric: function (val) {
    if (!(0, _type.isDefined)(val)) {
      return val;
    }
    let parsedVal = Number(val);
    if (isNaN(parsedVal)) {
      parsedVal = undefined;
    }
    return parsedVal;
  },
  datetime: function (val) {
    if (!(0, _type.isDefined)(val)) {
      return val;
    }
    let parsedVal;
    const numVal = Number(val);
    if (!isNaN(numVal)) {
      parsedVal = new Date(numVal);
    } else {
      parsedVal = _date_serialization.default.deserializeDate(val);
    }
    if (isNaN(Number(parsedVal))) {
      parsedVal = undefined;
    }
    return parsedVal;
  }
};
function correctValueType(type) {
  return type === 'numeric' || type === 'datetime' || type === 'string' ? type : '';
}
const getParser = function (valueType) {
  return parsers[correctValueType(valueType)] || _common.noop;
};
exports.getParser = getParser;