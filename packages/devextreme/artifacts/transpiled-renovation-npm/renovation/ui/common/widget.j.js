"use strict";

exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _component = _interopRequireDefault(require("../../component_wrapper/common/component"));
var _widget = require("./widget");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Widget extends _component.default {
  getProps() {
    const props = super.getProps();
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  }
  focus() {
    var _this$viewRef;
    return (_this$viewRef = this.viewRef) === null || _this$viewRef === void 0 ? void 0 : _this$viewRef.focus(...arguments);
  }
  blur() {
    var _this$viewRef2;
    return (_this$viewRef2 = this.viewRef) === null || _this$viewRef2 === void 0 ? void 0 : _this$viewRef2.blur(...arguments);
  }
  activate() {
    var _this$viewRef3;
    return (_this$viewRef3 = this.viewRef) === null || _this$viewRef3 === void 0 ? void 0 : _this$viewRef3.activate(...arguments);
  }
  deactivate() {
    var _this$viewRef4;
    return (_this$viewRef4 = this.viewRef) === null || _this$viewRef4 === void 0 ? void 0 : _this$viewRef4.deactivate(...arguments);
  }
  _getActionConfigs() {
    return {
      onActive: {},
      onDimensionChanged: {},
      onInactive: {},
      onVisibilityChange: {},
      onFocusIn: {},
      onFocusOut: {},
      onHoverStart: {},
      onHoverEnd: {},
      onRootElementRendered: {},
      onClick: {}
    };
  }
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: ['_feedbackHideTimeout', '_feedbackShowTimeout', 'activeStateUnit', 'cssText', 'aria', 'classes', 'name', 'addWidgetClass', 'onActive', 'onDimensionChanged', 'onInactive', 'onVisibilityChange', 'onFocusIn', 'onFocusOut', 'onHoverStart', 'onHoverEnd', 'onRootElementRendered', 'className', 'accessKey', 'activeStateEnabled', 'disabled', 'focusStateEnabled', 'height', 'hint', 'hoverStateEnabled', 'onClick', 'onKeyDown', 'rtlEnabled', 'tabIndex', 'visible', 'width']
    };
  }
  get _viewComponent() {
    return _widget.Widget;
  }
}
exports.default = Widget;
(0, _component_registrator.default)('dxWidget', Widget);
module.exports = exports.default;
module.exports.default = exports.default;