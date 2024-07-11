"use strict";

exports.FunctionTemplate = void 0;
var _template_base = require("./template_base");
var _dom = require("../utils/dom");
class FunctionTemplate extends _template_base.TemplateBase {
  constructor(render) {
    super();
    this._render = render;
  }
  _renderCore(options) {
    return (0, _dom.normalizeTemplateElement)(this._render(options));
  }
}
exports.FunctionTemplate = FunctionTemplate;