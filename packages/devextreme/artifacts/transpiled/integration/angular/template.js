"use strict";

exports.NgTemplate = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _template_base = require("../../core/templates/template_base");
var _type = require("../../core/utils/type");
var _dom = require("../../core/utils/dom");
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
const NgTemplate = class extends _template_base.TemplateBase {
  constructor(element, templateCompiler) {
    super();
    this._element = element;
    this._compiledTemplate = templateCompiler((0, _dom.normalizeTemplateElement)(this._element));
  }
  _renderCore(options) {
    const compiledTemplate = this._compiledTemplate;
    return (0, _type.isFunction)(compiledTemplate) ? compiledTemplate(options) : compiledTemplate;
  }
  source() {
    return (0, _renderer.default)(this._element).clone();
  }
};
exports.NgTemplate = NgTemplate;