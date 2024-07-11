"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class ConverterController {
  constructor() {
    this._converters = {};
    this._converters = {};
  }
  addConverter(name, converter) {
    this._converters[name] = converter;
  }
  getConverter(name) {
    return this._converters[name];
  }
}
const controller = new ConverterController();
var _default = exports.default = controller;