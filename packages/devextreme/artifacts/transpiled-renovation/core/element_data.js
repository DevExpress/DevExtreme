"use strict";

exports.afterCleanData = afterCleanData;
exports.beforeCleanData = beforeCleanData;
exports.cleanData = cleanData;
exports.cleanDataRecursive = cleanDataRecursive;
exports.data = data;
exports.getDataStrategy = getDataStrategy;
exports.removeData = removeData;
exports.strategyChanging = exports.setDataStrategy = void 0;
var _dom_adapter = _interopRequireDefault(require("./dom_adapter"));
var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));
var _memorized_callbacks = _interopRequireDefault(require("./memorized_callbacks"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const dataMap = new WeakMap();
let strategy;
const strategyChanging = exports.strategyChanging = new _memorized_callbacks.default();
let beforeCleanDataFunc = function () {};
let afterCleanDataFunc = function () {};
const setDataStrategy = function (value) {
  strategyChanging.fire(value);
  strategy = value;
  const cleanData = strategy.cleanData;
  strategy.cleanData = function (nodes) {
    beforeCleanDataFunc(nodes);
    const result = cleanData.call(this, nodes);
    afterCleanDataFunc(nodes);
    return result;
  };
};
exports.setDataStrategy = setDataStrategy;
setDataStrategy({
  data: function () {
    const element = arguments[0];
    const key = arguments[1];
    const value = arguments[2];
    if (!element) return;
    let elementData = dataMap.get(element);
    if (!elementData) {
      elementData = {};
      dataMap.set(element, elementData);
    }
    if (key === undefined) {
      return elementData;
    }
    if (arguments.length === 2) {
      return elementData[key];
    }
    elementData[key] = value;
    return value;
  },
  removeData: function (element, key) {
    if (!element) return;
    if (key === undefined) {
      dataMap.delete(element);
    } else {
      const elementData = dataMap.get(element);
      if (elementData) {
        delete elementData[key];
      }
    }
  },
  cleanData: function (elements) {
    for (let i = 0; i < elements.length; i++) {
      _events_engine.default.off(elements[i]);
      dataMap.delete(elements[i]);
    }
  }
});
function getDataStrategy() {
  return strategy;
}
function data() {
  return strategy.data.apply(this, arguments);
}
function beforeCleanData(callback) {
  beforeCleanDataFunc = callback;
}
function afterCleanData(callback) {
  afterCleanDataFunc = callback;
}
function cleanData(nodes) {
  return strategy.cleanData.call(this, nodes);
}
function removeData(element, key) {
  return strategy.removeData.call(this, element, key);
}
function cleanDataRecursive(element, cleanSelf) {
  if (!_dom_adapter.default.isElementNode(element)) {
    return;
  }
  const childElements = element.getElementsByTagName('*');
  strategy.cleanData(childElements);
  if (cleanSelf) {
    strategy.cleanData([element]);
  }
}