"use strict";

exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../../core/component_registrator"));
var _editor = _interopRequireDefault(require("../../../component_wrapper/editors/editor"));
var _editor2 = require("./editor");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Editor extends _editor.default {
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
      allowNull: ['validationError', 'validationErrors'],
      elements: [],
      templates: [],
      props: ['readOnly', 'name', 'validationError', 'validationErrors', 'validationMessageMode', 'validationMessagePosition', 'validationStatus', 'isValid', 'isDirty', 'inputAttr', 'onFocusIn', 'defaultValue', 'valueChange', 'className', 'accessKey', 'activeStateEnabled', 'disabled', 'focusStateEnabled', 'height', 'hint', 'hoverStateEnabled', 'onClick', 'onKeyDown', 'rtlEnabled', 'tabIndex', 'visible', 'width', 'aria', 'classes', 'value']
    };
  }
  get _viewComponent() {
    return _editor2.Editor;
  }
}
exports.default = Editor;
(0, _component_registrator.default)('dxEditor', Editor);
Editor.defaultOptions = _editor2.defaultOptions;
module.exports = exports.default;
module.exports.default = exports.default;