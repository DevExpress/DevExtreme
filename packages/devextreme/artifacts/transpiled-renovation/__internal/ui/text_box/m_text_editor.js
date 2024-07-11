"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _m_text_editor = _interopRequireDefault(require("./m_text_editor.mask"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
(0, _component_registrator.default)('dxTextEditor', _m_text_editor.default);
var _default = exports.default = _m_text_editor.default;