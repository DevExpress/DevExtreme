"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remove = exports.isLastZIndexInStack = exports.create = exports.clearStack = exports.base = void 0;
var _common = require("../../../core/utils/common");
let baseZIndex = 1500;
let zIndexStack = [];
const base = ZIndex => {
  baseZIndex = (0, _common.ensureDefined)(ZIndex, baseZIndex);
  return baseZIndex;
};
exports.base = base;
const create = function () {
  let baseIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : baseZIndex;
  const {
    length
  } = zIndexStack;
  const index = (length ? zIndexStack[length - 1] : baseIndex) + 1;
  zIndexStack.push(index);
  return index;
};
exports.create = create;
const remove = zIndex => {
  const position = zIndexStack.indexOf(zIndex);
  if (position >= 0) {
    zIndexStack.splice(position, 1);
  }
};
exports.remove = remove;
const isLastZIndexInStack = zIndex => zIndexStack.length && zIndexStack[zIndexStack.length - 1] === zIndex;
exports.isLastZIndexInStack = isLastZIndexInStack;
const clearStack = () => {
  zIndexStack = [];
};
exports.clearStack = clearStack;