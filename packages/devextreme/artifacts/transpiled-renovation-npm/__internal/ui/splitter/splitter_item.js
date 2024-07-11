"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _m_item = _interopRequireDefault(require("../../ui/collection/m_item"));
var _resize_handle = _interopRequireDefault(require("./resize_handle"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class SplitterItem extends _m_item.default {
  constructor($element, options, rawData) {
    super($element, options, rawData);
    this._owner = options.owner;
  }
  _renderResizeHandle() {
    var _this$_rawData;
    if (((_this$_rawData = this._rawData) === null || _this$_rawData === void 0 ? void 0 : _this$_rawData.visible) !== false && !this.isLast()) {
      const id = `dx_${new _guid.default()}`;
      this._setIdAttr(id);
      const config = this._owner._getResizeHandleConfig(id);
      this._resizeHandle = this._owner._createComponent((0, _renderer.default)('<div>'), _resize_handle.default, config);
      if (this._resizeHandle && this._$element) {
        (0, _renderer.default)(this._resizeHandle.element()).insertAfter(this._$element);
      }
    }
  }
  _setIdAttr(id) {
    var _this$_$element;
    (_this$_$element = this._$element) === null || _this$_$element === void 0 || _this$_$element.attr('id', id);
  }
  getIndex() {
    return this._owner._getIndexByItemData(this._rawData);
  }
  getResizeHandle() {
    return this._resizeHandle;
  }
  isLast() {
    return this._owner._isLastVisibleItem(this.getIndex());
  }
}
var _default = exports.default = SplitterItem;