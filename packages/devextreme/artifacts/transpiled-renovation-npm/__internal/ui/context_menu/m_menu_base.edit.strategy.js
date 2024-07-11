"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _iterator = require("../../../core/utils/iterator");
var _m_collection_widgetEditStrategy = _interopRequireDefault(require("../../ui/collection/m_collection_widget.edit.strategy.plain"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class MenuBaseEditStrategy extends _m_collection_widgetEditStrategy.default {
  _getPlainItems() {
    // @ts-expect-error
    return (0, _iterator.map)(this._collectionWidget.option('items'), function getMenuItems(item) {
      return item.items ? [item].concat((0, _iterator.map)(item.items, getMenuItems)) : item;
    });
  }
  _stringifyItem(item) {
    return JSON.stringify(item, (key, value) => {
      if (key === 'template') {
        return this._getTemplateString(value);
      }
      return value;
    });
  }
  _getTemplateString(template) {
    let result;
    if (typeof template === 'object') {
      result = (0, _renderer.default)(template).text();
    } else {
      result = template.toString();
    }
    return result;
  }
}
var _default = exports.default = MenuBaseEditStrategy;