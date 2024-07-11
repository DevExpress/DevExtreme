"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line import/no-mutable-exports
let FontStyle = {};
if (_devextremeQuill.default) {
  FontStyle = _devextremeQuill.default.import('attributors/style/font');
  // @ts-expect-error
  FontStyle.whitelist = null;
}
var _default = exports.default = FontStyle;