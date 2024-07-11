"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FIELD_EMPTY_ITEM_CLASS = void 0;
exports.renderEmptyItem = renderEmptyItem;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FIELD_EMPTY_ITEM_CLASS = exports.FIELD_EMPTY_ITEM_CLASS = 'dx-field-empty-item';
function renderEmptyItem(_ref) {
  let {
    $parent,
    rootElementCssClassList
  } = _ref;
  return (0, _renderer.default)('<div>').addClass(FIELD_EMPTY_ITEM_CLASS).html('&nbsp;').addClass(rootElementCssClassList.join(' ')).appendTo($parent);
}