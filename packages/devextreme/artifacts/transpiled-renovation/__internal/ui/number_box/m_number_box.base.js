"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _browser = _interopRequireDefault(require("../../../core/utils/browser"));
var _common = require("../../../core/utils/common");
var _deferred = require("../../../core/utils/deferred");
var _extend = require("../../../core/utils/extend");
var _math = require("../../../core/utils/math");
var _type = require("../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _index = require("../../../events/utils/index");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _ui = _interopRequireDefault(require("../../../ui/text_box/ui.text_editor"));
var _m_number_box = _interopRequireDefault(require("./m_number_box.spins"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const math = Math;
const WIDGET_CLASS = 'dx-numberbox';
const FIREFOX_CONTROL_KEYS = ['tab', 'del', 'backspace', 'leftArrow', 'rightArrow', 'home', 'end', 'enter'];
const FORCE_VALUECHANGE_EVENT_NAMESPACE = 'NumberBoxForceValueChange';
const NumberBoxBase = _ui.default.inherit({
  _supportedKeys() {
    return (0, _extend.extend)(this.callBase(), {
      upArrow(e) {
        if (!(0, _index.isCommandKeyPressed)(e)) {
          e.preventDefault();
          e.stopPropagation();
          this._spinUpChangeHandler(e);
        }
      },
      downArrow(e) {
        if (!(0, _index.isCommandKeyPressed)(e)) {
          e.preventDefault();
          e.stopPropagation();
          this._spinDownChangeHandler(e);
        }
      },
      enter() {}
    });
  },
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      value: 0,
      min: undefined,
      max: undefined,
      step: 1,
      showSpinButtons: false,
      useLargeSpinButtons: true,
      mode: 'text',
      invalidValueMessage: _message.default.format('dxNumberBox-invalidValueMessage'),
      // eslint-disable-next-line no-void
      buttons: void 0
    });
  },
  _useTemplates() {
    return false;
  },
  _getDefaultButtons() {
    return this.callBase().concat([{
      name: 'spins',
      Ctor: _m_number_box.default
    }]);
  },
  _isSupportInputMode() {
    // @ts-expect-error
    const version = parseFloat(_browser.default.version);
    return _browser.default.chrome && version >= 66 || _browser.default.safari && version >= 12;
  },
  _defaultOptionsRules() {
    return this.callBase().concat([{
      device() {
        return _devices.default.real().generic && !_devices.default.isSimulator();
      },
      options: {
        useLargeSpinButtons: false
      }
    }, {
      device: function () {
        return _devices.default.real().deviceType !== 'desktop' && !this._isSupportInputMode();
      }.bind(this),
      options: {
        mode: 'number'
      }
    }]);
  },
  _initMarkup() {
    this._renderSubmitElement();
    this.$element().addClass(WIDGET_CLASS);
    this.callBase();
  },
  _getDefaultAttributes() {
    const attributes = this.callBase();
    // eslint-disable-next-line spellcheck/spell-checker
    attributes.inputmode = 'decimal';
    return attributes;
  },
  _renderContentImpl() {
    this.option('isValid') && this._validateValue(this.option('value'));
    this.setAria('role', 'spinbutton');
  },
  _renderSubmitElement() {
    this._$submitElement = (0, _renderer.default)('<input>').attr('type', 'hidden').appendTo(this.$element());
    this._setSubmitValue(this.option('value'));
  },
  _setSubmitValue(value) {
    this._getSubmitElement().val((0, _common.applyServerDecimalSeparator)(value));
  },
  _getSubmitElement() {
    return this._$submitElement;
  },
  // @ts-expect-error
  _keyPressHandler(e) {
    this.callBase(e);
    const char = (0, _index.getChar)(e);
    const validCharRegExp = /[\d.,eE\-+]/;
    const isInputCharValid = validCharRegExp.test(char);
    if (!isInputCharValid) {
      const keyName = (0, _index.normalizeKeyName)(e);
      // NOTE: Additional check for Firefox control keys
      if ((0, _index.isCommandKeyPressed)(e) || keyName && FIREFOX_CONTROL_KEYS.includes(keyName)) {
        return;
      }
      e.preventDefault();
      return false;
    }
    this._keyPressed = true;
  },
  _onMouseWheel(dxEvent) {
    dxEvent.delta > 0 ? this._spinValueChange(1, dxEvent) : this._spinValueChange(-1, dxEvent);
  },
  _renderValue() {
    const inputValue = this._input().val();
    const value = this.option('value');
    if (!inputValue.length || Number(inputValue) !== value) {
      this._forceValueRender();
      this._toggleEmptinessEventHandler();
    }
    const valueText = (0, _type.isDefined)(value) ? null : _message.default.format('dxNumberBox-noDataText');
    this.setAria({
      // eslint-disable-next-line spellcheck/spell-checker
      valuenow: (0, _common.ensureDefined)(value, ''),
      // eslint-disable-next-line spellcheck/spell-checker
      valuetext: valueText
    });
    this.option('text', this._input().val());
    this._updateButtons();
    return (0, _deferred.Deferred)().resolve();
  },
  _forceValueRender() {
    const value = this.option('value');
    const number = Number(value);
    const formattedValue = isNaN(number) ? '' : this._applyDisplayValueFormatter(value);
    this._renderDisplayText(formattedValue);
  },
  _applyDisplayValueFormatter(value) {
    return this.option('displayValueFormatter')(value);
  },
  _renderProps() {
    this._input().prop({
      min: this.option('min'),
      max: this.option('max'),
      step: this.option('step')
    });
    this.setAria({
      // eslint-disable-next-line spellcheck/spell-checker
      valuemin: (0, _common.ensureDefined)(this.option('min'), ''),
      // eslint-disable-next-line spellcheck/spell-checker
      valuemax: (0, _common.ensureDefined)(this.option('max'), '')
    });
  },
  _spinButtonsPointerDownHandler() {
    const $input = this._input();
    if (!this.option('useLargeSpinButtons') && _dom_adapter.default.getActiveElement() !== $input[0]) {
      // @ts-expect-error
      _events_engine.default.trigger($input, 'focus');
    }
  },
  _spinUpChangeHandler(e) {
    if (!this.option('readOnly')) {
      this._spinValueChange(1, e.event || e);
    }
  },
  _spinDownChangeHandler(e) {
    if (!this.option('readOnly')) {
      this._spinValueChange(-1, e.event || e);
    }
  },
  _spinValueChange(sign, dxEvent) {
    const step = parseFloat(this.option('step'));
    if (step === 0) {
      return;
    }
    let value = parseFloat(this._normalizeInputValue()) || 0;
    value = this._correctRounding(value, step * sign);
    const min = this.option('min');
    const max = this.option('max');
    if ((0, _type.isDefined)(min)) {
      value = Math.max(min, value);
    }
    if ((0, _type.isDefined)(max)) {
      value = Math.min(max, value);
    }
    this._saveValueChangeEvent(dxEvent);
    this.option('value', value);
  },
  _correctRounding(value, step) {
    const regex = /[,.](.*)/;
    const isFloatValue = regex.test(value);
    const isFloatStep = regex.test(step);
    if (isFloatValue || isFloatStep) {
      // @ts-expect-error
      const valueAccuracy = isFloatValue ? regex.exec(value)[0].length : 0;
      // @ts-expect-error
      const stepAccuracy = isFloatStep ? regex.exec(step)[0].length : 0;
      const accuracy = math.max(valueAccuracy, stepAccuracy);
      value = this._round(value + step, accuracy);
      return value;
    }
    return value + step;
  },
  _round(value, precision) {
    precision = precision || 0;
    const multiplier = 10 ** precision;
    value *= multiplier;
    value = Math.round(value) / multiplier;
    return value;
  },
  _renderValueChangeEvent() {
    this.callBase();
    const forceValueChangeEvent = (0, _index.addNamespace)('focusout', FORCE_VALUECHANGE_EVENT_NAMESPACE);
    _events_engine.default.off(this.element(), forceValueChangeEvent);
    _events_engine.default.on(this.element(), forceValueChangeEvent, this._forceRefreshInputValue.bind(this));
  },
  _forceRefreshInputValue() {
    if (this.option('mode') === 'number') {
      return;
    }
    const $input = this._input();
    const formattedValue = this._applyDisplayValueFormatter(this.option('value'));
    $input.val(null);
    $input.val(formattedValue);
  },
  _valueChangeEventHandler(e) {
    const $input = this._input();
    const inputValue = this._normalizeText();
    const value = this._parseValue(inputValue);
    const valueHasDigits = inputValue !== '.' && inputValue !== '-';
    if (this._isValueValid() && !this._validateValue(value)) {
      $input.val(this._applyDisplayValueFormatter(value));
      return;
    }
    if (valueHasDigits) {
      this.callBase(e, isNaN(value) ? null : value);
    }
    this._applyValueBoundaries(inputValue, value);
    this.validationRequest.fire({
      value,
      editor: this
    });
  },
  _applyValueBoundaries(inputValue, parsedValue) {
    const isValueIncomplete = this._isValueIncomplete(inputValue);
    const isValueCorrect = this._isValueInRange(inputValue);
    if (!isValueIncomplete && !isValueCorrect && parsedValue !== null) {
      if (Number(inputValue) !== parsedValue) {
        this._input().val(this._applyDisplayValueFormatter(parsedValue));
      }
    }
  },
  _replaceCommaWithPoint(value) {
    return value.replace(',', '.');
  },
  _inputIsInvalid() {
    const isNumberMode = this.option('mode') === 'number';
    const validityState = this._input().get(0).validity;
    return isNumberMode && validityState && validityState.badInput;
  },
  _renderDisplayText(text) {
    if (this._inputIsInvalid()) {
      return;
    }
    this.callBase(text);
  },
  _isValueIncomplete(value) {
    const incompleteRegex = /(^-$)|(^-?\d*\.$)|(\d+e-?$)/i;
    return incompleteRegex.test(value);
  },
  _isValueInRange(value) {
    return (0, _math.inRange)(value, this.option('min'), this.option('max'));
  },
  _isNumber(value) {
    return this._parseValue(value) !== null;
  },
  _validateValue(value) {
    const inputValue = this._normalizeText();
    const isValueValid = this._isValueValid();
    let isValid = true;
    const isNumber = this._isNumber(inputValue);
    if (isNaN(Number(value))) {
      isValid = false;
    }
    if (!value && isValueValid) {
      isValid = true;
    } else if (!isNumber && !isValueValid) {
      isValid = false;
    }
    this.option({
      isValid,
      validationError: isValid ? null : {
        editorSpecific: true,
        message: this.option('invalidValueMessage')
      }
    });
    return isValid;
  },
  _normalizeInputValue() {
    return this._parseValue(this._normalizeText());
  },
  _normalizeText() {
    const value = this._input().val().trim();
    return this._replaceCommaWithPoint(value);
  },
  _parseValue(value) {
    const number = parseFloat(value);
    if (isNaN(number)) {
      return null;
    }
    return (0, _math.fitIntoRange)(number, this.option('min'), this.option('max'));
  },
  _clearValue() {
    if (this._inputIsInvalid()) {
      this._input().val('');
      this._validateValue();
    }
    this.callBase();
  },
  clear() {
    if (this.option('value') === null) {
      this.option('text', '');
      if (this._input().length) {
        this._renderValue();
      }
    } else {
      this.option('value', null);
    }
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'value':
        this._validateValue(args.value);
        this._setSubmitValue(args.value);
        this.callBase(args);
        this._resumeValueChangeAction();
        break;
      case 'step':
        this._renderProps();
        break;
      case 'min':
      case 'max':
        this._renderProps();
        this.option('value', this._parseValue(this.option('value')));
        break;
      case 'showSpinButtons':
      case 'useLargeSpinButtons':
        this._updateButtons(['spins']);
        break;
      case 'invalidValueMessage':
        break;
      default:
        this.callBase(args);
    }
  }
});
var _default = exports.default = NumberBoxBase;