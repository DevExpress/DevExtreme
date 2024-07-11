"use strict";

exports.ScrollViewProps = void 0;
var _scrollable_props = require("./scrollable_props");
const ScrollViewProps = exports.ScrollViewProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_scrollable_props.ScrollableProps), Object.getOwnPropertyDescriptors({
  pullDownEnabled: false,
  reachBottomEnabled: false
})));