"use strict";

exports.attachInstanceToElement = attachInstanceToElement;
exports.getInstanceByElement = getInstanceByElement;
exports.name = void 0;
var _element_data = require("../../core/element_data");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _type = require("./type");
var _remove = require("../../events/remove");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const COMPONENT_NAMES_DATA_KEY = 'dxComponents';
const ANONYMOUS_COMPONENT_DATA_KEY = 'dxPrivateComponent';
const componentNames = new WeakMap();
let nextAnonymousComponent = 0;
const getName = function (componentClass, newName) {
  if ((0, _type.isDefined)(newName)) {
    componentNames.set(componentClass, newName);
    return;
  }
  if (!componentNames.has(componentClass)) {
    const generatedName = ANONYMOUS_COMPONENT_DATA_KEY + nextAnonymousComponent++;
    componentNames.set(componentClass, generatedName);
    return generatedName;
  }
  return componentNames.get(componentClass);
};
exports.name = getName;
function attachInstanceToElement($element, componentInstance, disposeFn) {
  const data = (0, _element_data.data)($element.get(0));
  const name = getName(componentInstance.constructor);
  data[name] = componentInstance;
  if (disposeFn) {
    _events_engine.default.one($element, _remove.removeEvent, function () {
      disposeFn.call(componentInstance);
    });
  }
  if (!data[COMPONENT_NAMES_DATA_KEY]) {
    data[COMPONENT_NAMES_DATA_KEY] = [];
  }
  data[COMPONENT_NAMES_DATA_KEY].push(name);
}
function getInstanceByElement($element, componentClass) {
  const name = getName(componentClass);
  return (0, _element_data.data)($element.get(0), name);
}