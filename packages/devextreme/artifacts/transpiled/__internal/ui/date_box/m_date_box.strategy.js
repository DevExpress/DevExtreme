"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _class = _interopRequireDefault(require("../../../core/class"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _date = _interopRequireDefault(require("../../../localization/date"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  abstract
} = _class.default;
const DateBoxStrategy = _class.default.inherit({
  ctor(dateBox) {
    this.dateBox = dateBox;
  },
  widgetOption() {
    return this._widget && this._widget.option.apply(this._widget, arguments);
  },
  _renderWidget(element) {
    element = element || (0, _renderer.default)('<div>');
    this._widget = this._createWidget(element);
    this._widget.$element().appendTo(this._getWidgetContainer());
  },
  _createWidget(element) {
    const widgetName = this._getWidgetName();
    const widgetOptions = this._getWidgetOptions();
    return this.dateBox._createComponent(element, widgetName, widgetOptions);
  },
  _getWidgetOptions: abstract,
  _getWidgetName: abstract,
  getDefaultOptions() {
    return {
      mode: 'text'
    };
  },
  getDisplayFormat: abstract,
  supportedKeys: _common.noop,
  getKeyboardListener: _common.noop,
  customizeButtons: _common.noop,
  getParsedText(text, format) {
    // @ts-expect-error
    const value = _date.default.parse(text, format);
    // @ts-expect-error
    return value || _date.default.parse(text);
  },
  renderInputMinMax: _common.noop,
  renderOpenedState() {
    this._updateValue();
  },
  popupConfig: abstract,
  _dimensionChanged() {
    var _this$_getPopup;
    (_this$_getPopup = this._getPopup()) === null || _this$_getPopup === void 0 || _this$_getPopup.repaint();
  },
  renderPopupContent() {
    const popup = this._getPopup();
    this._renderWidget();
    const $popupContent = popup.$content().parent();
    _events_engine.default.off($popupContent, 'mousedown');
    _events_engine.default.on($popupContent, 'mousedown', this._preventFocusOnPopup.bind(this));
  },
  _preventFocusOnPopup(e) {
    e.preventDefault();
  },
  _getWidgetContainer() {
    return this._getPopup().$content();
  },
  _getPopup() {
    return this.dateBox._popup;
  },
  popupShowingHandler: _common.noop,
  popupHiddenHandler: _common.noop,
  _updateValue() {
    this._widget && this._widget.option('value', this.dateBoxValue());
  },
  useCurrentDateByDefault: _common.noop,
  getDefaultDate() {
    return new Date();
  },
  textChangedHandler: _common.noop,
  renderValue() {
    if (this.dateBox.option('opened')) {
      this._updateValue();
    }
  },
  getValue() {
    return this._widget.option('value');
  },
  isAdaptivityChanged() {
    return false;
  },
  dispose() {
    const popup = this._getPopup();
    if (popup) {
      popup.$content().empty();
    }
  },
  dateBoxValue() {
    if (arguments.length) {
      return this.dateBox.dateValue.apply(this.dateBox, arguments);
    }
    return this.dateBox.dateOption.apply(this.dateBox, ['value']);
  }
});
var _default = exports.default = DateBoxStrategy;