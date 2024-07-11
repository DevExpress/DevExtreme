"use strict";

exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _button = _interopRequireDefault(require("../component_wrapper/button"));
var _button2 = require("./button");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Button extends _button.default {
  getProps() {
    const props = super.getProps();
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  }
  focus() {
    var _this$viewRef;
    return (_this$viewRef = this.viewRef) === null || _this$viewRef === void 0 ? void 0 : _this$viewRef.focus(...arguments);
  }
  activate() {
    var _this$viewRef2;
    return (_this$viewRef2 = this.viewRef) === null || _this$viewRef2 === void 0 ? void 0 : _this$viewRef2.activate(...arguments);
  }
  deactivate() {
    var _this$viewRef3;
    return (_this$viewRef3 = this.viewRef) === null || _this$viewRef3 === void 0 ? void 0 : _this$viewRef3.deactivate(...arguments);
  }
  _getActionConfigs() {
    return {
      onClick: {
        excludeValidators: ['readOnly']
      },
      onSubmit: {}
    };
  }
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: ['onSubmit'],
      templates: ['template', 'iconTemplate'],
      props: ['activeStateEnabled', 'hoverStateEnabled', 'icon', 'iconPosition', 'onClick', 'onSubmit', 'pressed', 'stylingMode', 'template', 'iconTemplate', 'text', 'type', 'useInkRipple', 'useSubmitBehavior', 'templateData', 'className', 'accessKey', 'disabled', 'focusStateEnabled', 'height', 'hint', 'onKeyDown', 'rtlEnabled', 'tabIndex', 'visible', 'width']
    };
  }
  get _viewComponent() {
    return _button2.Button;
  }
}
exports.default = Button;
(0, _component_registrator.default)('dxButton', Button);
Button.defaultOptions = _button2.defaultOptions;
module.exports = exports.default;
module.exports.default = exports.default;