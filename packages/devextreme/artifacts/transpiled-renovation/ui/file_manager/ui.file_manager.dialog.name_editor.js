"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _text_box = _interopRequireDefault(require("../text_box"));
var _uiFile_manager = _interopRequireDefault(require("./ui.file_manager.dialog"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FILE_MANAGER_DIALOG_NAME_EDITOR = 'dx-filemanager-dialog-name-editor';
const FILE_MANAGER_DIALOG_NAME_EDITOR_POPUP = 'dx-filemanager-dialog-name-editor-popup';
class FileManagerNameEditorDialog extends _uiFile_manager.default {
  show(name) {
    name = name || '';
    if (this._nameTextBox) {
      this._nameTextBox.option('value', name);
    } else {
      this._initialNameValue = name;
    }
    super.show();
  }
  _onPopupShown() {
    if (!this._nameTextBox) {
      return;
    }
    const $textBoxInput = this._nameTextBox._input();
    $textBoxInput.length && $textBoxInput[0].select();
    this._nameTextBox.focus();
  }
  _getDialogOptions() {
    return (0, _extend.extend)(super._getDialogOptions(), {
      title: this.option('title'),
      buttonText: this.option('buttonText'),
      contentCssClass: FILE_MANAGER_DIALOG_NAME_EDITOR,
      popupCssClass: FILE_MANAGER_DIALOG_NAME_EDITOR_POPUP
    });
  }
  _createContentTemplate(element) {
    super._createContentTemplate(element);
    this._nameTextBox = this._createComponent((0, _renderer.default)('<div>'), _text_box.default, {
      value: this._initialNameValue,
      onEnterKey: () => this._hasCompositionJustEnded && this._applyDialogChanges(),
      onKeyDown: e => this._checkCompositionEnded(e)
    });
    this._$contentElement.append(this._nameTextBox.$element());
  }
  _checkCompositionEnded(_ref) {
    let {
      event
    } = _ref;
    this._hasCompositionJustEnded = event.which !== 229;
  }
  _getDialogResult() {
    const nameValue = this._nameTextBox.option('value');
    return nameValue ? {
      name: nameValue
    } : null;
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      title: '',
      buttonText: ''
    });
  }
}
var _default = exports.default = FileManagerNameEditorDialog;
module.exports = exports.default;
module.exports.default = exports.default;