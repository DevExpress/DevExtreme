"use strict";

exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../../core/component_registrator"));
var _component = _interopRequireDefault(require("../../../component_wrapper/common/component"));
var _form = require("./form");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Form extends _component.default {
  getProps() {
    const props = super.getProps();
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  }
  _getActionConfigs() {
    return {
      onClick: {}
    };
  }
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: ['showValidationSummary', 'scrollingEnabled', 'showColonAfterLabel', 'labelLocation', 'colCountByScreen', 'colCount', 'items', 'formData', 'className', 'accessKey', 'activeStateEnabled', 'disabled', 'focusStateEnabled', 'height', 'hint', 'hoverStateEnabled', 'onClick', 'onKeyDown', 'rtlEnabled', 'tabIndex', 'visible', 'width']
    };
  }
  get _viewComponent() {
    return _form.Form;
  }
}
exports.default = Form;
(0, _component_registrator.default)('dxForm', Form);
module.exports = exports.default;
module.exports.default = exports.default;