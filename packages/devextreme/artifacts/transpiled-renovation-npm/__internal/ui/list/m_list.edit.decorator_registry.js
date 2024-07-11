"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;
exports.registry = void 0;
var _extend = require("../../../core/utils/extend");
const registry = exports.registry = {};
function register(option, type, decoratorClass) {
  const decoratorsRegistry = registry;
  const decoratorConfig = {};
  decoratorConfig[option] = decoratorsRegistry[option] ? decoratorsRegistry[option] : {};
  decoratorConfig[option][type] = decoratorClass;
  (0, _extend.extend)(decoratorsRegistry, decoratorConfig);
}