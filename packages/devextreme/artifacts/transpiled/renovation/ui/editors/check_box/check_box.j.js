"use strict";

exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../../core/component_registrator"));
var _check_box = _interopRequireDefault(require("../../../component_wrapper/editors/check_box"));
var _check_box2 = require("./check_box");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class CheckBox extends _check_box.default {
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
  _getActionConfigs() {
    return {
      onFocusIn: {},
      onClick: {}
    };
  }
  get _propsInfo() {
    return {
      twoWay: [['value', 'defaultValue', 'valueChange']],
      allowNull: ['defaultValue', 'validationError', 'validationErrors', 'value'],
      elements: [],
      templates: [],
      props: ['text', 'iconSize', 'enableThreeStateBehavior', 'activeStateEnabled', 'hoverStateEnabled', 'focusStateEnabled', 'saveValueChangeEvent', 'defaultValue', 'valueChange', 'readOnly', 'name', 'validationError', 'validationErrors', 'validationMessageMode', 'validationMessagePosition', 'validationStatus', 'isValid', 'isDirty', 'inputAttr', 'onFocusIn', 'className', 'accessKey', 'disabled', 'height', 'hint', 'onClick', 'onKeyDown', 'rtlEnabled', 'tabIndex', 'visible', 'width', 'aria', 'value']
    };
  }
  get _viewComponent() {
    return _check_box2.CheckBox;
  }
}
exports.default = CheckBox;
(0, _component_registrator.default)('dxCheckBox', CheckBox);
CheckBox.defaultOptions = _check_box2.defaultOptions;
module.exports = exports.default;
module.exports.default = exports.default;