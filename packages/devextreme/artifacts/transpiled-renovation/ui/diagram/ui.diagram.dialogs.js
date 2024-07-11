"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _message = _interopRequireDefault(require("../../localization/message"));
var _ui2 = _interopRequireDefault(require("../popup/ui.popup"));
var _extend = require("../../core/utils/extend");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class DiagramDialog extends _ui.default {
  _init() {
    super._init();
    this._command = undefined;
    this._isShown = false;
    this._createOnGetContentOption();
    this._createOnHiddenOption();
  }
  _initMarkup() {
    super._initMarkup();
    this._command = this.option('command');
    this._$popupElement = (0, _renderer.default)('<div>').appendTo(this.$element());
    this._popup = this._createComponent(this._$popupElement, _ui2.default, {
      title: this.option('title'),
      maxWidth: this.option('maxWidth'),
      height: this.option('height'),
      toolbarItems: this.option('toolbarItems'),
      onHidden: this._onHiddenAction
    });
  }
  _clean() {
    delete this._popup;
    this._$popupElement && this._$popupElement.remove();
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      title: '',
      maxWidth: 500,
      height: 'auto',
      toolbarItems: this._getToolbarItems()
    });
  }
  _getToolbarItems() {
    return [this._getOkToolbarItem(), this._getCancelToolbarItem()];
  }
  _getOkToolbarItem() {
    return {
      widget: 'dxButton',
      location: 'after',
      toolbar: 'bottom',
      options: {
        text: _message.default.format('dxDiagram-dialogButtonOK'),
        onClick: function () {
          this._command.execute(this._commandParameter);
          this._hide();
        }.bind(this)
      }
    };
  }
  _getCancelToolbarItem() {
    return {
      widget: 'dxButton',
      location: 'after',
      toolbar: 'bottom',
      options: {
        text: _message.default.format('dxDiagram-dialogButtonCancel'),
        onClick: this._hide.bind(this)
      }
    };
  }
  _optionChanged(args) {
    switch (args.name) {
      case 'title':
      case 'maxWidth':
      case 'height':
      case 'toolbarItems':
        this._popup.option(args.name, args.value);
        break;
      case 'command':
        this._command = args.value;
        break;
      case 'onGetContent':
        this._createOnGetContentOption();
        break;
      case 'onHidden':
        this._createOnHiddenOption();
        break;
      default:
        super._optionChanged(args);
    }
  }
  _createOnGetContentOption() {
    this._onGetContentAction = this._createActionByOption('onGetContent');
  }
  _createOnHiddenOption() {
    this._onHiddenAction = this._createActionByOption('onHidden');
  }
  _hide() {
    this._popup.hide();
    this._isShown = false;
  }
  _show() {
    this._popup.$content().empty().append(this._onGetContentAction());
    this._popup.show();
    this._isShown = true;
  }
  isVisible() {
    return this._isShown;
  }
}
var _default = exports.default = DiagramDialog;
module.exports = exports.default;
module.exports.default = exports.default;