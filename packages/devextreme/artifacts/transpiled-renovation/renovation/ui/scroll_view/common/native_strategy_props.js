"use strict";

exports.ScrollableNativeProps = void 0;
var _base_scrollable_props = require("./base_scrollable_props");
var _get_default_option_value = require("../utils/get_default_option_value");
const ScrollableNativeProps = exports.ScrollableNativeProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_base_scrollable_props.BaseScrollableProps), Object.getOwnPropertyDescriptors({
  get useSimulatedScrollbar() {
    return (0, _get_default_option_value.getDefaultUseSimulatedScrollbar)();
  },
  showScrollbar: 'onScroll',
  get refreshStrategy() {
    return (0, _get_default_option_value.getDefaultNativeRefreshStrategy)();
  }
})));