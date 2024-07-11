"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _date = _interopRequireDefault(require("../../core/utils/date"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const toMs = _date.default.dateToMilliseconds;
class DateAdapterCore {
  constructor(source) {
    this._source = new Date(source.getTime ? source.getTime() : source);
  }
  get source() {
    return this._source;
  }
  result() {
    return this._source;
  }
  getTimezoneOffset() {
    let format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    const value = this._source.getTimezoneOffset();
    if (format === 'minute') {
      return value * toMs('minute');
    }
    return value;
  }
  getTime() {
    return this._source.getTime();
  }
  setTime(value) {
    this._source.setTime(value);
    return this;
  }
  addTime(value) {
    this._source.setTime(this._source.getTime() + value);
    return this;
  }
  setMinutes(value) {
    this._source.setMinutes(value);
    return this;
  }
  addMinutes(value) {
    this._source.setMinutes(this._source.getMinutes() + value);
    return this;
  }
  subtractMinutes(value) {
    this._source.setMinutes(this._source.getMinutes() - value);
    return this;
  }
}
const DateAdapter = date => new DateAdapterCore(date);
var _default = exports.default = DateAdapter;