"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _common = require("../../core/utils/common");
var _extend = require("../../core/utils/extend");
var _size = require("../../core/utils/size");
var _type = require("../../core/utils/type");
var _window = require("../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _emitterGesture = _interopRequireDefault(require("../../events/gesture/emitter.gesture.scroll"));
var _pointer = _interopRequireDefault(require("../../events/pointer"));
var _index = require("../../events/utils/index");
var _text_box = _interopRequireDefault(require("../../ui/text_box"));
var _m_utils = require("../ui/text_box/m_utils.scroll");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TEXTAREA_CLASS = 'dx-textarea';
const TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE = 'dx-texteditor-input-auto-resize';
// @ts-expect-error
const TextArea = _text_box.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      spellcheck: true,
      minHeight: undefined,
      maxHeight: undefined,
      autoResizeEnabled: false
    });
  },
  _initMarkup() {
    this.$element().addClass(TEXTAREA_CLASS);
    this.callBase();
    this.setAria('multiline', 'true');
  },
  _renderContentImpl() {
    this._updateInputHeight();
    this.callBase();
  },
  _renderInput() {
    this.callBase();
    this._renderScrollHandler();
  },
  _createInput() {
    const $input = (0, _renderer.default)('<textarea>');
    this._applyInputAttributes($input, this.option('inputAttr'));
    this._updateInputAutoResizeAppearance($input);
    return $input;
  },
  _setInputMinHeight: _common.noop,
  _renderScrollHandler() {
    this._eventY = 0;
    const $input = this._input();
    const initScrollData = (0, _m_utils.prepareScrollData)($input, true);
    _events_engine.default.on($input, (0, _index.addNamespace)(_emitterGesture.default.init, this.NAME), initScrollData, _common.noop);
    _events_engine.default.on($input, (0, _index.addNamespace)(_pointer.default.down, this.NAME), this._pointerDownHandler.bind(this));
    _events_engine.default.on($input, (0, _index.addNamespace)(_pointer.default.move, this.NAME), this._pointerMoveHandler.bind(this));
  },
  _pointerDownHandler(e) {
    this._eventY = (0, _index.eventData)(e).y;
  },
  _pointerMoveHandler(e) {
    const currentEventY = (0, _index.eventData)(e).y;
    const delta = this._eventY - currentEventY;
    if ((0, _m_utils.allowScroll)(this._input(), delta)) {
      e.isScrollingEvent = true;
      e.stopPropagation();
    }
    this._eventY = currentEventY;
  },
  _renderDimensions() {
    const $element = this.$element();
    const element = $element.get(0);
    const width = this._getOptionValue('width', element);
    const height = this._getOptionValue('height', element);
    const minHeight = this.option('minHeight');
    const maxHeight = this.option('maxHeight');
    $element.css({
      minHeight: minHeight !== undefined ? minHeight : '',
      maxHeight: maxHeight !== undefined ? maxHeight : '',
      width,
      height
    });
  },
  _resetDimensions() {
    this.$element().css({
      height: '',
      minHeight: '',
      maxHeight: ''
    });
  },
  _renderEvents() {
    if (this.option('autoResizeEnabled')) {
      _events_engine.default.on(this._input(), (0, _index.addNamespace)('input paste', this.NAME), this._updateInputHeight.bind(this));
    }
    this.callBase();
  },
  _refreshEvents() {
    _events_engine.default.off(this._input(), (0, _index.addNamespace)('input paste', this.NAME));
    this.callBase();
  },
  _getHeightDifference($input) {
    return (0, _size.getVerticalOffsets)(this._$element.get(0), false) + (0, _size.getVerticalOffsets)(this._$textEditorContainer.get(0), false) + (0, _size.getVerticalOffsets)(this._$textEditorInputContainer.get(0), true) + (0, _size.getElementBoxParams)('height', (0, _window.getWindow)().getComputedStyle($input.get(0))).margin;
  },
  _updateInputHeight() {
    if (!(0, _window.hasWindow)()) {
      return;
    }
    const $input = this._input();
    const height = this.option('height');
    const autoHeightResizing = height === undefined && this.option('autoResizeEnabled');
    const shouldCalculateInputHeight = autoHeightResizing || height === undefined && this.option('minHeight');
    if (!shouldCalculateInputHeight) {
      $input.css('height', '');
      return;
    }
    this._resetDimensions();
    this._$element.css('height', (0, _size.getOuterHeight)(this._$element));
    $input.css('height', 0);
    const heightDifference = this._getHeightDifference($input);
    this._renderDimensions();
    const minHeight = this._getBoundaryHeight('minHeight');
    const maxHeight = this._getBoundaryHeight('maxHeight');
    let inputHeight = $input[0].scrollHeight;
    if (minHeight !== undefined) {
      inputHeight = Math.max(inputHeight, minHeight - heightDifference);
    }
    if (maxHeight !== undefined) {
      const adjustedMaxHeight = maxHeight - heightDifference;
      const needScroll = inputHeight > adjustedMaxHeight;
      inputHeight = Math.min(inputHeight, adjustedMaxHeight);
      this._updateInputAutoResizeAppearance($input, !needScroll);
    }
    $input.css('height', inputHeight);
    if (autoHeightResizing) {
      this._$element.css('height', 'auto');
    }
  },
  _getBoundaryHeight(optionName) {
    const boundaryValue = this.option(optionName);
    if ((0, _type.isDefined)(boundaryValue)) {
      return typeof boundaryValue === 'number' ? boundaryValue : (0, _size.parseHeight)(boundaryValue, this.$element().get(0).parentElement, this._$element.get(0));
    }
  },
  _renderInputType: _common.noop,
  _visibilityChanged(visible) {
    if (visible) {
      this._updateInputHeight();
    }
  },
  _updateInputAutoResizeAppearance($input, isAutoResizeEnabled) {
    if ($input) {
      const autoResizeEnabled = (0, _common.ensureDefined)(isAutoResizeEnabled, this.option('autoResizeEnabled'));
      $input.toggleClass(TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE, autoResizeEnabled);
    }
  },
  _dimensionChanged() {
    if (this.option('visible')) {
      this._updateInputHeight();
    }
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'autoResizeEnabled':
        this._updateInputAutoResizeAppearance(this._input(), args.value);
        this._refreshEvents();
        this._updateInputHeight();
        break;
      case 'value':
      case 'height':
        this.callBase(args);
        this._updateInputHeight();
        break;
      case 'minHeight':
      case 'maxHeight':
        this._renderDimensions();
        this._updateInputHeight();
        break;
      case 'visible':
        this.callBase(args);
        args.value && this._updateInputHeight();
        break;
      default:
        this.callBase(args);
    }
  }
});
(0, _component_registrator.default)('dxTextArea', TextArea);
var _default = exports.default = TextArea;