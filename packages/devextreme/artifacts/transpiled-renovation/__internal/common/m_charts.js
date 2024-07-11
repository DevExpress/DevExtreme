"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPattern = exports.registerGradient = exports.default = void 0;
var _utils = require("../../viz/core/utils");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const graphicObjects = {};
const registerPattern = options => {
  const id = (0, _utils.getNextDefsSvgId)();
  graphicObjects[id] = _extends({
    type: 'pattern'
  }, options);
  return id;
};
exports.registerPattern = registerPattern;
const registerGradient = (type, options) => {
  const id = (0, _utils.getNextDefsSvgId)();
  graphicObjects[id] = _extends({
    type
  }, options);
  return id;
};
exports.registerGradient = registerGradient;
const getGraphicObjects = () => graphicObjects;
var _default = exports.default = {
  getGraphicObjects
};