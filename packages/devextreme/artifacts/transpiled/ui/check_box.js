"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../core/renderer"));
var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));
var _devices = _interopRequireDefault(require("../core/devices"));
var _extend = require("../core/utils/extend");
var _editor = _interopRequireDefault(require("./editor/editor"));
var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));
var _index = require("../events/utils/index");
var _click = require("../events/click");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// STYLE checkbox

const CHECKBOX_CLASS = 'dx-checkbox';
const CHECKBOX_ICON_CLASS = 'dx-checkbox-icon';
const CHECKBOX_CHECKED_CLASS = 'dx-checkbox-checked';
const CHECKBOX_CONTAINER_CLASS = 'dx-checkbox-container';
const CHECKBOX_TEXT_CLASS = 'dx-checkbox-text';
const CHECKBOX_HAS_TEXT_CLASS = 'dx-checkbox-has-text';
const CHECKBOX_INDETERMINATE_CLASS = 'dx-checkbox-indeterminate';
const CHECKBOX_FEEDBACK_HIDE_TIMEOUT = 100;
const CheckBox = _editor.default.inherit({
  _supportedKeys: function () {
    const click = function (e) {
      e.preventDefault();
      this._clickAction({
        event: e
      });
    };
    return (0, _extend.extend)(this.callBase(), {
      space: click
    });
  },
  _getDefaultOptions: function () {
    return (0, _extend.extend)(this.callBase(), {
      hoverStateEnabled: true,
      activeStateEnabled: true,
      value: false,
      text: ''
    });
  },
  _defaultOptionsRules: function () {
    return this.callBase().concat([{
      device: function () {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }]);
  },
  _canValueBeChangedByClick: function () {
    return true;
  },
  _useTemplates: function () {
    return false;
  },
  _feedbackHideTimeout: CHECKBOX_FEEDBACK_HIDE_TIMEOUT,
  _initMarkup: function () {
    this._renderSubmitElement();
    this._$container = (0, _renderer.default)('<div>').addClass(CHECKBOX_CONTAINER_CLASS);
    this.setAria('role', 'checkbox');
    this.$element().addClass(CHECKBOX_CLASS);
    this._renderValue();
    this._renderIcon();
    this._renderText();
    this.$element().append(this._$container);
    this.callBase();
  },
  _render: function () {
    this._renderClick();
    this.callBase();
  },
  _renderSubmitElement: function () {
    this._$submitElement = (0, _renderer.default)('<input>').attr('type', 'hidden').appendTo(this.$element());
  },
  _getSubmitElement: function () {
    return this._$submitElement;
  },
  _renderIcon: function () {
    this._$icon = (0, _renderer.default)('<span>').addClass(CHECKBOX_ICON_CLASS).prependTo(this._$container);
  },
  _renderText: function () {
    const textValue = this.option('text');
    if (!textValue) {
      if (this._$text) {
        this._$text.remove();
        this.$element().removeClass(CHECKBOX_HAS_TEXT_CLASS);
      }
      return;
    }
    if (!this._$text) {
      this._$text = (0, _renderer.default)('<span>').addClass(CHECKBOX_TEXT_CLASS);
    }
    this._$text.text(textValue);
    this._$container.append(this._$text);
    this.$element().addClass(CHECKBOX_HAS_TEXT_CLASS);
  },
  _renderClick: function () {
    const that = this;
    const eventName = (0, _index.addNamespace)(_click.name, that.NAME);
    that._clickAction = that._createAction(that._clickHandler);
    _events_engine.default.off(that.$element(), eventName);
    _events_engine.default.on(that.$element(), eventName, function (e) {
      that._clickAction({
        event: e
      });
    });
  },
  _clickHandler: function (args) {
    const that = args.component;
    that._saveValueChangeEvent(args.event);
    that.option('value', !that.option('value'));
  },
  _renderValue: function () {
    const $element = this.$element();
    const checked = this.option('value');
    const indeterminate = checked === undefined;
    $element.toggleClass(CHECKBOX_CHECKED_CLASS, Boolean(checked));
    $element.toggleClass(CHECKBOX_INDETERMINATE_CLASS, indeterminate);
    this._getSubmitElement().val(checked);
    this.setAria('checked', indeterminate ? 'mixed' : checked || 'false');
  },
  _optionChanged: function (args) {
    switch (args.name) {
      case 'value':
        this._renderValue();
        this.callBase(args);
        break;
      case 'text':
        this._renderText();
        this._renderDimensions();
        break;
      default:
        this.callBase(args);
    }
  }
});
(0, _component_registrator.default)('dxCheckBox', CheckBox);
var _default = exports.default = CheckBox;
module.exports = exports.default;
module.exports.default = exports.default;