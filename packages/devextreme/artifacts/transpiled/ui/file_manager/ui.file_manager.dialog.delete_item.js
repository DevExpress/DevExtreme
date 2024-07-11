"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _message = _interopRequireDefault(require("../../localization/message"));
var _scroll_view = _interopRequireDefault(require("../scroll_view"));
var _uiFile_manager = _interopRequireDefault(require("./ui.file_manager.dialog"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FILE_MANAGER_DIALOG_DELETE_ITEM = 'dx-filemanager-dialog-delete-item';
const FILE_MANAGER_DIALOG_DELETE_ITEM_POPUP = 'dx-filemanager-dialog-delete-item-popup'; // TODO ensure needed

class FileManagerDeleteItemDialog extends _uiFile_manager.default {
  show(_ref) {
    let {
      itemName,
      itemCount
    } = _ref;
    const text = itemCount === 1 ? _message.default.format('dxFileManager-dialogDeleteItemSingleItemConfirmation', itemName) : _message.default.format('dxFileManager-dialogDeleteItemMultipleItemsConfirmation', itemCount);
    if (this._$text) {
      this._$text.text(text);
    } else {
      this._initialText = text;
    }
    super.show();
  }
  _getDialogOptions() {
    return (0, _extend.extend)(super._getDialogOptions(), {
      title: _message.default.format('dxFileManager-dialogDeleteItemTitle'),
      buttonText: _message.default.format('dxFileManager-dialogDeleteItemButtonText'),
      contentCssClass: FILE_MANAGER_DIALOG_DELETE_ITEM,
      popupCssClass: FILE_MANAGER_DIALOG_DELETE_ITEM_POPUP,
      height: 'auto',
      maxHeight: '80vh'
    });
  }
  _createContentTemplate(element) {
    super._createContentTemplate(element);
    this._$text = (0, _renderer.default)('<div>').text(this._initialText).appendTo(this._$contentElement);
    this._createComponent(this._$contentElement, _scroll_view.default, {
      width: '100%',
      height: '100%'
    });
  }
  _getDialogResult() {
    return {};
  }
}
var _default = exports.default = FileManagerDeleteItemDialog;
module.exports = exports.default;
module.exports.default = exports.default;