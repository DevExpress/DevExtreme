"use strict";

exports.default = void 0;
var _renovationPagerHelper = require("/packages/devextreme/testing/helpers/renovationPagerHelper.js");
var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));
var _wrapRenovatedWidget = require("/packages/devextreme/testing/helpers/wrapRenovatedWidget.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const wrappedComponent = (0, _wrapRenovatedWidget.wrapRenovatedWidget)(_renovationPagerHelper.WrappedWidget);
(0, _component_registrator.default)('dxPager', wrappedComponent);
var _default = exports.default = wrappedComponent;
module.exports = exports.default;
module.exports.default = exports.default;