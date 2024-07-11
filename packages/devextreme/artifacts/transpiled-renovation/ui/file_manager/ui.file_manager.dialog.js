"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _message = _interopRequireDefault(require("../../localization/message"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _ui2 = _interopRequireDefault(require("../popup/ui.popup"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FILE_MANAGER_DIALOG_CONTENT = 'dx-filemanager-dialog';
const FILE_MANAGER_DIALOG_POPUP = 'dx-filemanager-dialog-popup';
class FileManagerDialogBase extends _ui.default {
  _initMarkup() {
    super._initMarkup();
    this._createOnClosedAction();
    const options = this._getDialogOptions();
    const $popup = (0, _renderer.default)('<div>').appendTo(this.$element());
    const popupOptions = {
      showTitle: true,
      title: options.title,
      visible: false,
      hideOnOutsideClick: true,
      contentTemplate: this._createContentTemplate.bind(this),
      toolbarItems: [{
        widget: 'dxButton',
        toolbar: 'bottom',
        location: 'after',
        options: {
          text: options.buttonText,
          onClick: this._applyDialogChanges.bind(this)
        }
      }, {
        widget: 'dxButton',
        toolbar: 'bottom',
        location: 'after',
        options: {
          text: _message.default.format('dxFileManager-dialogButtonCancel'),
          onClick: this._closeDialog.bind(this)
        }
      }],
      onInitialized: _ref => {
        let {
          component
        } = _ref;
        component.registerKeyHandler('enter', this._applyDialogChanges.bind(this));
      },
      onHiding: this._onPopupHiding.bind(this),
      onShown: this._onPopupShown.bind(this),
      _wrapperClassExternal: `${FILE_MANAGER_DIALOG_POPUP} ${options.popupCssClass ?? ''}`
    };
    if ((0, _type.isDefined)(options.height)) {
      popupOptions.height = options.height;
    }
    if ((0, _type.isDefined)(options.maxHeight)) {
      popupOptions.maxHeight = options.maxHeight;
    }
    this._popup = this._createComponent($popup, _ui2.default, popupOptions);
  }
  show() {
    this._dialogResult = null;
    this._popup.show();
  }
  _getDialogOptions() {
    return {
      title: 'Title',
      buttonText: 'ButtonText',
      contentCssClass: '',
      popupCssClass: ''
    };
  }
  _createContentTemplate(element) {
    this._$contentElement = (0, _renderer.default)('<div>').appendTo(element).addClass(FILE_MANAGER_DIALOG_CONTENT);
    const cssClass = this._getDialogOptions().contentCssClass;
    if (cssClass) {
      this._$contentElement.addClass(cssClass);
    }
  }
  _getDialogResult() {
    return null;
  }
  _applyDialogChanges() {
    const result = this._getDialogResult();
    if (result) {
      this._dialogResult = result;
      this._closeDialog();
    }
  }
  _closeDialog() {
    this._popup.hide();
  }
  _onPopupHiding() {
    this._onClosedAction({
      dialogResult: this._dialogResult
    });
  }
  _onPopupShown() {}
  _createOnClosedAction() {
    this._onClosedAction = this._createActionByOption('onClosed');
  }
  _setTitle(newTitle) {
    this._popup.option('title', newTitle);
  }
  _setApplyButtonOptions(options) {
    this._popup.option('toolbarItems[0].options', options);
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      onClosed: null
    });
  }
  _optionChanged(args) {
    const name = args.name;
    switch (name) {
      case 'onClosed':
        this._createOnPathChangedAction();
        break;
      default:
        super._optionChanged(args);
    }
  }
}
var _default = exports.default = FileManagerDialogBase;
module.exports = exports.default;
module.exports.default = exports.default;