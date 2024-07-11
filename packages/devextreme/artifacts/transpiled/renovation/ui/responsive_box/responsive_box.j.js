"use strict";

exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _component = _interopRequireDefault(require("../../component_wrapper/common/component"));
var _responsive_box = require("./responsive_box");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class ResponsiveBox extends _component.default {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: ['screenByWidth']
    };
  }
  get _viewComponent() {
    return _responsive_box.ResponsiveBox;
  }
}
exports.default = ResponsiveBox;
(0, _component_registrator.default)('dxResponsiveBox', ResponsiveBox);
module.exports = exports.default;
module.exports.default = exports.default;