"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _button = _interopRequireDefault(require("../button"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FILE_MANAGER_FILE_ACTIONS_BUTTON = 'dx-filemanager-file-actions-button';
const FILE_MANAGER_FILE_ACTIONS_BUTTON_ACTIVATED = 'dx-filemanager-file-actions-button-activated';
const ACTIVE_STATE_CLASS = 'dx-state-active';
class FileManagerFileActionsButton extends _ui.default {
  _initMarkup() {
    this._createClickAction();
    const $button = (0, _renderer.default)('<div>');
    this.$element().append($button).addClass(FILE_MANAGER_FILE_ACTIONS_BUTTON);
    this._button = this._createComponent($button, _button.default, {
      icon: 'overflow',
      stylingMode: 'text',
      onClick: e => this._raiseClick(e)
    });
    super._initMarkup();
  }
  _createClickAction() {
    this._clickAction = this._createActionByOption('onClick');
  }
  _raiseClick(e) {
    this._clickAction(e);
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      cssClass: '',
      onClick: null
    });
  }
  _optionChanged(args) {
    const name = args.name;
    switch (name) {
      case 'cssClass':
        this.repaint();
        break;
      case 'onClick':
        this._createClickAction();
        break;
      default:
        super._optionChanged(args);
    }
  }
  setActive(active) {
    this.$element().toggleClass(FILE_MANAGER_FILE_ACTIONS_BUTTON_ACTIVATED, active);
    setTimeout(() => this._button.$element().toggleClass(ACTIVE_STATE_CLASS, active));
  }
}
var _default = exports.default = FileManagerFileActionsButton;
module.exports = exports.default;
module.exports.default = exports.default;