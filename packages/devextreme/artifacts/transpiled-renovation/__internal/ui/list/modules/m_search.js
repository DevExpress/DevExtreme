"use strict";

var _text_box = _interopRequireDefault(require("../../../../ui/text_box"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.search_box_mixin"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error
_ui.default.setEditorClass(_text_box.default);