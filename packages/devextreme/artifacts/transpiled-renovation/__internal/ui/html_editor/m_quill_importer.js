"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQuill = getQuill;
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.errors"));
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function getQuill() {
  if (!_devextremeQuill.default) {
    throw _ui.default.Error('E1041', 'Quill');
  }
  return _devextremeQuill.default;
}