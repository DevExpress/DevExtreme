"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextEditorLabel = void 0;
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _size = require("../../../core/utils/size");
var _window = require("../../../core/utils/window");
var _click = require("../../../events/click");
var _emitter = require("../../../events/core/emitter.feedback");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _hover = require("../../../events/hover");
var _index = require("../../../events/utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TEXTEDITOR_LABEL_CLASS = 'dx-texteditor-label';
const TEXTEDITOR_WITH_LABEL_CLASS = 'dx-texteditor-with-label';
const TEXTEDITOR_LABEL_OUTSIDE_CLASS = 'dx-texteditor-label-outside';
const TEXTEDITOR_WITH_FLOATING_LABEL_CLASS = 'dx-texteditor-with-floating-label';
const TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS = 'dx-texteditor-with-before-buttons';
const LABEL_BEFORE_CLASS = 'dx-label-before';
const LABEL_CLASS = 'dx-label';
const LABEL_AFTER_CLASS = 'dx-label-after';
class TextEditorLabel {
  constructor(props) {
    this.NAME = 'dxLabel';
    this._props = props;
    this._id = `${TEXTEDITOR_LABEL_CLASS}-${new _guid.default()}`;
    this._render();
    this._toggleMarkupVisibility();
  }
  _isVisible() {
    return !!this._props.text && this._props.mode !== 'hidden';
  }
  _render() {
    this._$before = (0, _renderer.default)('<div>').addClass(LABEL_BEFORE_CLASS);
    this._$labelSpan = (0, _renderer.default)('<span>');
    this._$label = (0, _renderer.default)('<div>').addClass(LABEL_CLASS).append(this._$labelSpan);
    this._$after = (0, _renderer.default)('<div>').addClass(LABEL_AFTER_CLASS);
    this._$root = (0, _renderer.default)('<div>').addClass(TEXTEDITOR_LABEL_CLASS).attr('id', this._id).append(this._$before).append(this._$label).append(this._$after);
    this._updateMark();
    this._updateText();
    this._updateBeforeWidth();
    this._updateMaxWidth();
  }
  _toggleMarkupVisibility() {
    const visible = this._isVisible();
    this._updateEditorBeforeButtonsClass(visible);
    this._updateEditorLabelClass(visible);
    visible ? this._$root.appendTo(this._props.$editor) : this._$root.detach();
    this._attachEvents();
  }
  _attachEvents() {
    const clickEventName = (0, _index.addNamespace)(_click.name, this.NAME);
    const hoverStartEventName = (0, _index.addNamespace)(_hover.start, this.NAME);
    const activeEventName = (0, _index.addNamespace)(_emitter.active, this.NAME);
    _events_engine.default.off(this._$labelSpan, clickEventName);
    _events_engine.default.off(this._$labelSpan, hoverStartEventName);
    _events_engine.default.off(this._$labelSpan, activeEventName);
    if (this._isVisible() && this._isOutsideMode()) {
      _events_engine.default.on(this._$labelSpan, clickEventName, e => {
        // @ts-expect-error
        const selectedText = (0, _window.getWindow)().getSelection().toString();
        if (selectedText === '') {
          this._props.onClickHandler();
          e.preventDefault();
        }
      });
      _events_engine.default.on(this._$labelSpan, hoverStartEventName, e => {
        this._props.onHoverHandler(e);
      });
      _events_engine.default.on(this._$labelSpan, activeEventName, e => {
        this._props.onActiveHandler(e);
      });
    }
  }
  _updateEditorLabelClass(visible) {
    this._props.$editor.removeClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS).removeClass(TEXTEDITOR_LABEL_OUTSIDE_CLASS).removeClass(TEXTEDITOR_WITH_LABEL_CLASS);
    if (visible) {
      const labelClass = this._props.mode === 'floating' ? TEXTEDITOR_WITH_FLOATING_LABEL_CLASS : TEXTEDITOR_WITH_LABEL_CLASS;
      this._props.$editor.addClass(labelClass);
      if (this._isOutsideMode()) {
        this._props.$editor.addClass(TEXTEDITOR_LABEL_OUTSIDE_CLASS);
      }
    }
  }
  _isOutsideMode() {
    return this._props.mode === 'outside';
  }
  _updateEditorBeforeButtonsClass() {
    let visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._isVisible();
    this._props.$editor.removeClass(TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS);
    if (visible) {
      const beforeButtonsClass = this._props.containsButtonsBefore ? TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS : '';
      this._props.$editor.addClass(beforeButtonsClass);
    }
  }
  _updateMark() {
    this._$labelSpan.attr('data-mark', this._props.mark);
  }
  _updateText() {
    this._$labelSpan.text(this._props.text);
  }
  _updateBeforeWidth() {
    if (this._isVisible()) {
      const width = this._props.beforeWidth ?? this._props.getBeforeWidth();
      // @ts-expect-error
      this._$before.css({
        width
      });
      this._updateLabelTransform();
    }
  }
  _updateLabelTransform() {
    let offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    this._$labelSpan.css('transform', '');
    if (this._isVisible() && this._isOutsideMode()) {
      const sign = this._props.rtlEnabled ? 1 : -1;
      const labelTranslateX = sign * ((0, _size.getWidth)(this._$before) + offset);
      this._$labelSpan.css('transform', `translateX(${labelTranslateX}px)`);
    }
  }
  _updateMaxWidth() {
    if (this._isVisible() && !this._isOutsideMode()) {
      const maxWidth = this._props.containerWidth ?? this._props.getContainerWidth();
      // @ts-expect-error
      this._$label.css({
        maxWidth
      });
    }
  }
  $element() {
    return this._$root;
  }
  isVisible() {
    return this._isVisible();
  }
  // @ts-expect-error
  getId() {
    if (this._isVisible()) return this._id;
  }
  updateMode(mode) {
    this._props.mode = mode;
    this._toggleMarkupVisibility();
    this._updateBeforeWidth();
    this._updateMaxWidth();
  }
  updateText(text) {
    this._props.text = text;
    this._updateText();
    this._toggleMarkupVisibility();
    this._updateBeforeWidth();
    this._updateMaxWidth();
  }
  updateMark(mark) {
    this._props.mark = mark;
    this._updateMark();
  }
  updateContainsButtonsBefore(containsButtonsBefore) {
    this._props.containsButtonsBefore = containsButtonsBefore;
    this._updateEditorBeforeButtonsClass();
  }
  updateBeforeWidth(beforeWidth) {
    this._props.beforeWidth = beforeWidth;
    this._updateBeforeWidth();
  }
  updateMaxWidth(containerWidth) {
    this._props.containerWidth = containerWidth;
    this._updateMaxWidth();
  }
}
exports.TextEditorLabel = TextEditorLabel;