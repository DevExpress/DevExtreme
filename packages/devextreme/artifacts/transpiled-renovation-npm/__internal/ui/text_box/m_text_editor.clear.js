"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _click = require("../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _pointer = _interopRequireDefault(require("../../../events/pointer"));
var _index = require("../../../events/utils/index");
var _m_button = _interopRequireDefault(require("../../ui/text_box/texteditor_button_collection/m_button"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const pointerDown = _pointer.default.down;
const STATE_INVISIBLE_CLASS = 'dx-state-invisible';
const TEXTEDITOR_CLEAR_BUTTON_CLASS = 'dx-clear-button-area';
const TEXTEDITOR_CLEAR_ICON_CLASS = 'dx-icon-clear';
const TEXTEDITOR_ICON_CLASS = 'dx-icon';
const TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS = 'dx-show-clear-button';
class ClearButton extends _m_button.default {
  _create() {
    const $element = (0, _renderer.default)('<span>').addClass(TEXTEDITOR_CLEAR_BUTTON_CLASS).append((0, _renderer.default)('<span>').addClass(TEXTEDITOR_ICON_CLASS).addClass(TEXTEDITOR_CLEAR_ICON_CLASS));
    this._addToContainer($element);
    this.update(true);
    return {
      instance: $element,
      $element
    };
  }
  _isVisible() {
    const {
      editor
    } = this;
    return editor._isClearButtonVisible();
  }
  _attachEvents(instance, $button) {
    const {
      editor
    } = this;
    const editorName = editor.NAME;
    _events_engine.default.on($button, (0, _index.addNamespace)(pointerDown, editorName), e => {
      e.preventDefault();
      if (e.pointerType !== 'mouse') {
        editor._clearValueHandler(e);
      }
    });
    _events_engine.default.on($button, (0, _index.addNamespace)(_click.name, editorName), e => editor._clearValueHandler(e));
  }
  // TODO: get rid of it
  _legacyRender($editor, isVisible) {
    $editor.toggleClass(TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS, isVisible);
  }
  // @ts-expect-error
  update() {
    let rendered = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    !rendered && super.update();
    const {
      editor,
      instance
    } = this;
    const $editor = editor.$element();
    const isVisible = this._isVisible();
    instance && instance.toggleClass(STATE_INVISIBLE_CLASS, !isVisible);
    this._legacyRender($editor, isVisible);
  }
}
exports.default = ClearButton;