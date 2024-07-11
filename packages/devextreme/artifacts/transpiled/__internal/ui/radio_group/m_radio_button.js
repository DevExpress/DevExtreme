"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _extend = require("../../../core/utils/extend");
var _click = require("../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _index = require("../../../events/utils/index");
var _editor = _interopRequireDefault(require("../../../ui/editor/editor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const RADIO_BUTTON_CLASS = 'dx-radiobutton';
const RADIO_BUTTON_ICON_CLASS = 'dx-radiobutton-icon';
const RADIO_BUTTON_ICON_DOT_CLASS = 'dx-radiobutton-icon-dot';
const RADIO_BUTTON_CHECKED_CLASS = 'dx-radiobutton-checked';
const RADIO_BUTTON_ICON_CHECKED_CLASS = 'dx-radiobutton-icon-checked';
// @ts-expect-error
const RadioButton = _editor.default.inherit({
  _supportedKeys() {
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
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      hoverStateEnabled: true,
      activeStateEnabled: true,
      value: false
    });
  },
  _canValueBeChangedByClick() {
    return true;
  },
  _defaultOptionsRules() {
    return this.callBase().concat([{
      device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }]);
  },
  _init() {
    this.callBase();
    this.$element().addClass(RADIO_BUTTON_CLASS);
  },
  _initMarkup() {
    this.callBase();
    this._renderIcon();
    this._renderCheckedState(this.option('value'));
    this._renderClick();
    this.setAria('role', 'radio');
  },
  _renderIcon() {
    this._$icon = (0, _renderer.default)('<div>').addClass(RADIO_BUTTON_ICON_CLASS);
    (0, _renderer.default)('<div>').addClass(RADIO_BUTTON_ICON_DOT_CLASS).appendTo(this._$icon);
    this.$element().append(this._$icon);
  },
  _renderCheckedState(checked) {
    this.$element().toggleClass(RADIO_BUTTON_CHECKED_CLASS, checked).find(`.${RADIO_BUTTON_ICON_CLASS}`).toggleClass(RADIO_BUTTON_ICON_CHECKED_CLASS, checked);
    this.setAria('checked', checked);
  },
  _renderClick() {
    const eventName = (0, _index.addNamespace)(_click.name, this.NAME);
    this._clickAction = this._createAction(args => {
      this._clickHandler(args.event);
    });
    _events_engine.default.off(this.$element(), eventName);
    _events_engine.default.on(this.$element(), eventName, e => {
      this._clickAction({
        event: e
      });
    });
  },
  _clickHandler(e) {
    this._saveValueChangeEvent(e);
    this.option('value', true);
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'value':
        this._renderCheckedState(args.value);
        this.callBase(args);
        break;
      default:
        this.callBase(args);
    }
  }
});
(0, _component_registrator.default)('dxRadioButton', RadioButton);
var _default = exports.default = RadioButton;