"use strict";

exports.ScrollableProps = void 0;
var _simulated_strategy_props = require("./simulated_strategy_props");
var _get_default_option_value = require("../utils/get_default_option_value");
const ScrollableProps = exports.ScrollableProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_simulated_strategy_props.ScrollableSimulatedProps), Object.getOwnPropertyDescriptors({
  get useNative() {
    return (0, _get_default_option_value.getDefaultUseNative)();
  },
  get useSimulatedScrollbar() {
    return (0, _get_default_option_value.getDefaultUseSimulatedScrollbar)();
  },
  get refreshStrategy() {
    return (0, _get_default_option_value.getDefaultNativeRefreshStrategy)();
  }
})));