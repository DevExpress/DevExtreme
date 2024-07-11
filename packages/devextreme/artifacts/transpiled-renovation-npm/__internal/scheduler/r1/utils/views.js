"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentView = void 0;
var _type = require("../../../../core/utils/type");
var _const = require("../const");
const getCurrentView = (currentView,
// https://github.com/DevExpress/devextreme-renovation/issues/754
views) => {
  let currentViewProps = views.find(view => {
    const names = (0, _type.isObject)(view)
    // @ts-expect-error this type was related to R1 TSX
    ? [view.name, view.type] : [view];
    if (names.includes(currentView)) {
      return true;
    }
    return false;
  });
  if (currentViewProps === undefined) {
    if (_const.VIEW_TYPES.includes(currentView)) {
      currentViewProps = currentView;
    } else {
      [currentViewProps] = views;
    }
  }
  return currentViewProps;
};
exports.getCurrentView = getCurrentView;