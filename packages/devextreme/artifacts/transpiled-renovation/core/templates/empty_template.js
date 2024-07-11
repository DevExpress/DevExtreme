"use strict";

exports.EmptyTemplate = void 0;
var _renderer = _interopRequireDefault(require("../renderer"));
var _template_base = require("./template_base");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class EmptyTemplate extends _template_base.TemplateBase {
  _renderCore() {
    return (0, _renderer.default)();
  }
}
exports.EmptyTemplate = EmptyTemplate;