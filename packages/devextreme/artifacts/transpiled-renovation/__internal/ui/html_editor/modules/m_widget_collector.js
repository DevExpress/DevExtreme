"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _iterator = require("../../../../core/utils/iterator");
class WidgetCollector {
  constructor() {
    this._collection = [];
  }
  clear() {
    this._collection = [];
  }
  add(name, instance) {
    this._collection.push({
      name,
      instance
    });
  }
  remove(name) {
    this._collection = this._collection.filter(item => item.name !== name);
  }
  getByName(widgetName) {
    let widget = null;
    // @ts-expect-error
    (0, _iterator.each)(this._collection, (index, _ref) => {
      let {
        name,
        instance
      } = _ref;
      if (name === widgetName) {
        widget = instance;
        return false;
      }
    });
    return widget;
  }
  each(handler) {
    this._collection.forEach(_ref2 => {
      let {
        name,
        instance
      } = _ref2;
      return instance && handler(name, instance);
    });
  }
}
exports.default = WidgetCollector;