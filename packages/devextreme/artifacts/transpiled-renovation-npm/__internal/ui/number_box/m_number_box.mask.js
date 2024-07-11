"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _math = require("../../../core/utils/math");
var _type = require("../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _double_click = require("../../../events/double_click");
var _index = require("../../../events/utils/index");
var _number = require("../../../localization/ldml/number");
var _number2 = _interopRequireDefault(require("../../../localization/number"));
var _m_number_box = _interopRequireDefault(require("./m_number_box.base"));
var _m_number_box2 = require("./m_number_box.caret");
var _m_utils = require("./m_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const NUMBER_FORMATTER_NAMESPACE = 'dxNumberFormatter';
const MOVE_FORWARD = 1;
const MOVE_BACKWARD = -1;
const MINUS = '-';
const MINUS_KEY = 'minus';
const INPUT_EVENT = 'input';
const NUMPAD_DOT_KEY_CODE = 110;
const CARET_TIMEOUT_DURATION = 0;
const NumberBoxMask = _m_number_box.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      useMaskBehavior: true,
      format: null
    });
  },
  _isDeleteKey(key) {
    return key === 'del';
  },
  _supportedKeys() {
    if (!this._useMaskBehavior()) {
      return this.callBase();
    }
    const that = this;
    return (0, _extend.extend)(this.callBase(), {
      minus: that._revertSign.bind(that),
      del: that._removeHandler.bind(that),
      backspace: that._removeHandler.bind(that),
      leftArrow: that._arrowHandler.bind(that, MOVE_BACKWARD),
      rightArrow: that._arrowHandler.bind(that, MOVE_FORWARD),
      home: that._moveCaretToBoundaryEventHandler.bind(that, MOVE_FORWARD),
      enter: that._updateFormattedValue.bind(that),
      end: that._moveCaretToBoundaryEventHandler.bind(that, MOVE_BACKWARD)
    });
  },
  _getTextSeparatorIndex(text) {
    const decimalSeparator = _number2.default.getDecimalSeparator();
    const realSeparatorOccurrenceIndex = (0, _m_utils.getRealSeparatorIndex)(this.option('format')).occurrence;
    return (0, _m_utils.getNthOccurrence)(text, decimalSeparator, realSeparatorOccurrenceIndex);
  },
  _focusInHandler(e) {
    if (!this._preventNestedFocusEvent(e)) {
      this.clearCaretTimeout();
      this._caretTimeout = setTimeout(() => {
        this._caretTimeout = undefined;
        const caret = this._caret();
        if (caret.start === caret.end && this._useMaskBehavior()) {
          const text = this._getInputVal();
          const decimalSeparatorIndex = this._getTextSeparatorIndex(text);
          if (decimalSeparatorIndex >= 0) {
            this._caret({
              start: decimalSeparatorIndex,
              end: decimalSeparatorIndex
            });
          } else {
            this._moveCaretToBoundaryEventHandler(MOVE_BACKWARD, e);
          }
        }
      }, CARET_TIMEOUT_DURATION);
    }
    this.callBase(e);
  },
  _focusOutHandler(e) {
    const shouldHandleEvent = !this._preventNestedFocusEvent(e);
    if (shouldHandleEvent) {
      this._focusOutOccurs = true;
      if (this._useMaskBehavior()) {
        this._updateFormattedValue();
      }
    }
    this.callBase(e);
    if (shouldHandleEvent) {
      this._focusOutOccurs = false;
    }
  },
  _hasValueBeenChanged(inputValue) {
    const format = this._getFormatPattern();
    const value = this.option('value');
    const formatted = this._format(value, format) || '';
    return formatted !== inputValue;
  },
  _updateFormattedValue() {
    const inputValue = this._getInputVal();
    if (this._hasValueBeenChanged(inputValue)) {
      this._updateParsedValue();
      this._adjustParsedValue();
      this._setTextByParsedValue();
      if (this._parsedValue !== this.option('value')) {
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15181565/
        // https://bugreport.apple.com/web/?problemID=38133794 but this bug tracker is private
        // @ts-expect-error
        _events_engine.default.trigger(this._input(), 'change');
      }
    }
  },
  _arrowHandler(step, e) {
    if (!this._useMaskBehavior()) {
      return;
    }
    const text = this._getInputVal();
    const format = this._getFormatPattern();
    let nextCaret = (0, _m_number_box2.getCaretWithOffset)(this._caret(), step);
    if (!(0, _m_number_box2.isCaretInBoundaries)(nextCaret, text, format)) {
      nextCaret = step === MOVE_FORWARD ? nextCaret.end : nextCaret.start;
      e.preventDefault();
      this._caret((0, _m_number_box2.getCaretInBoundaries)(nextCaret, text, format));
    }
  },
  _moveCaretToBoundary(direction) {
    const boundaries = (0, _m_number_box2.getCaretBoundaries)(this._getInputVal(), this._getFormatPattern());
    const newCaret = (0, _m_number_box2.getCaretWithOffset)(direction === MOVE_FORWARD ? boundaries.start : boundaries.end, 0);
    this._caret(newCaret);
  },
  _moveCaretToBoundaryEventHandler(direction, e) {
    if (!this._useMaskBehavior() || e && e.shiftKey) {
      return;
    }
    this._moveCaretToBoundary(direction);
    e && e.preventDefault();
  },
  _shouldMoveCaret(text, caret) {
    const decimalSeparator = _number2.default.getDecimalSeparator();
    const isDecimalSeparatorNext = text.charAt(caret.end) === decimalSeparator;
    const moveToFloat = (this._lastKey === decimalSeparator || this._lastKey === '.' || this._lastKey === ',') && isDecimalSeparatorNext;
    return moveToFloat;
  },
  _getInputVal() {
    return _number2.default.convertDigits(this._input().val(), true);
  },
  _keyboardHandler(e) {
    this.clearCaretTimeout();
    this._lastKey = _number2.default.convertDigits((0, _index.getChar)(e), true);
    this._lastKeyName = (0, _index.normalizeKeyName)(e);
    if (!this._shouldHandleKey(e.originalEvent)) {
      return this.callBase(e);
    }
    const normalizedText = this._getInputVal();
    const caret = this._caret();
    let enteredChar;
    if (this._lastKeyName === MINUS_KEY) {
      enteredChar = '';
    } else {
      enteredChar = e.which === NUMPAD_DOT_KEY_CODE ? _number2.default.getDecimalSeparator() : this._lastKey;
    }
    const newValue = this._tryParse(normalizedText, caret, enteredChar);
    if (this._shouldMoveCaret(normalizedText, caret)) {
      this._moveCaret(1);
      e.originalEvent.preventDefault();
    }
    if (newValue === undefined) {
      if (this._lastKeyName !== MINUS_KEY) {
        e.originalEvent.preventDefault();
      }
    } else {
      this._parsedValue = newValue;
    }
    return this.callBase(e);
  },
  _keyPressHandler(e) {
    if (!this._useMaskBehavior()) {
      this.callBase(e);
    }
  },
  _removeHandler(e) {
    const caret = this._caret();
    const text = this._getInputVal();
    let {
      start
    } = caret;
    let {
      end
    } = caret;
    this._lastKey = (0, _index.getChar)(e);
    this._lastKeyName = (0, _index.normalizeKeyName)(e);
    const isDeleteKey = this._isDeleteKey(this._lastKeyName);
    const isBackspaceKey = !isDeleteKey;
    if (start === end) {
      const caretPosition = start;
      const canDelete = isBackspaceKey && caretPosition > 0 || isDeleteKey && caretPosition < text.length;
      if (canDelete) {
        isDeleteKey && end++;
        isBackspaceKey && start--;
      } else {
        e.preventDefault();
        return;
      }
    }
    const char = text.slice(start, end);
    if (this._isStub(char)) {
      this._moveCaret(isDeleteKey ? 1 : -1);
      if (this._parsedValue < 0 || 1 / this._parsedValue === -Infinity) {
        this._revertSign(e);
        this._setTextByParsedValue();
        const shouldTriggerInputEvent = this.option('valueChangeEvent').split(' ').includes('input');
        if (shouldTriggerInputEvent) {
          // @ts-expect-error
          _events_engine.default.trigger(this._input(), 'input');
        }
      }
      e.preventDefault();
      return;
    }
    const decimalSeparator = _number2.default.getDecimalSeparator();
    if (char === decimalSeparator) {
      const decimalSeparatorIndex = text.indexOf(decimalSeparator);
      if (this._isNonStubAfter(decimalSeparatorIndex + 1)) {
        this._moveCaret(isDeleteKey ? 1 : -1);
        e.preventDefault();
      }
      return;
    }
    if (end - start < text.length) {
      const editedText = this._replaceSelectedText(text, {
        start,
        end
      }, '');
      const noDigits = editedText.search(/[0-9]/) < 0;
      if (noDigits && this._isValueInRange(0)) {
        this._parsedValue = this._parsedValue < 0 || 1 / this._parsedValue === -Infinity ? -0 : 0;
        return;
      }
    }
    const valueAfterRemoving = this._tryParse(text, {
      start,
      end
    }, '');
    if (valueAfterRemoving === undefined) {
      e.preventDefault();
    } else {
      this._parsedValue = valueAfterRemoving;
    }
  },
  _isPercentFormat() {
    const format = this._getFormatPattern();
    const noEscapedFormat = format.replace(/'[^']+'/g, '');
    return noEscapedFormat.indexOf('%') !== -1;
  },
  _parse(text, format) {
    const formatOption = this.option('format');
    const isCustomParser = (0, _type.isFunction)(formatOption.parser);
    const parser = isCustomParser ? formatOption.parser : _number2.default.parse;
    let integerPartStartIndex = 0;
    if (!isCustomParser) {
      const formatPointIndex = (0, _m_utils.getRealSeparatorIndex)(format).index;
      const textPointIndex = this._getTextSeparatorIndex(text);
      const formatIntegerPartLength = formatPointIndex !== -1 ? formatPointIndex : format.length;
      const textIntegerPartLength = textPointIndex !== -1 ? textPointIndex : text.length;
      if (textIntegerPartLength > formatIntegerPartLength && format.indexOf('#') === -1) {
        integerPartStartIndex = textIntegerPartLength - formatIntegerPartLength;
      }
    }
    text = text.substr(integerPartStartIndex);
    return parser(text, format);
  },
  _format(value, format) {
    const formatOption = this.option('format');
    const customFormatter = (formatOption === null || formatOption === void 0 ? void 0 : formatOption.formatter) || formatOption;
    const formatter = (0, _type.isFunction)(customFormatter) ? customFormatter : _number2.default.format;
    const formattedValue = value === null ? '' : formatter(value, format);
    return formattedValue;
  },
  _getFormatPattern() {
    if (!this._currentFormat) {
      this._updateFormat();
    }
    return this._currentFormat;
  },
  _updateFormat() {
    const format = this.option('format');
    const isCustomParser = (0, _type.isFunction)(format === null || format === void 0 ? void 0 : format.parser);
    const isLDMLPattern = (0, _type.isString)(format) && (format.includes('0') || format.includes('#'));
    const isExponentialFormat = format === 'exponential' || (format === null || format === void 0 ? void 0 : format.type) === 'exponential';
    const shouldUseFormatAsIs = isCustomParser || isLDMLPattern || isExponentialFormat;
    this._currentFormat = shouldUseFormatAsIs ? format : (0, _number.getFormat)(value => {
      const text = this._format(value, format);
      return _number2.default.convertDigits(text, true);
    });
  },
  _getFormatForSign(text) {
    const format = this._getFormatPattern();
    if ((0, _type.isString)(format)) {
      const signParts = format.split(';');
      const sign = _number2.default.getSign(text, format);
      signParts[1] = signParts[1] || `-${signParts[0]}`;
      return sign < 0 ? signParts[1] : signParts[0];
    }
    const sign = _number2.default.getSign(text);
    return sign < 0 ? '-' : '';
  },
  _removeStubs(text, excludeComma) {
    const format = this._getFormatForSign(text);
    const thousandsSeparator = _number2.default.getThousandsSeparator();
    const stubs = this._getStubs(format);
    let result = text;
    if (stubs.length) {
      const prefixStubs = stubs[0];
      const postfixRegex = new RegExp(`(${(0, _common.escapeRegExp)(stubs[1] || '')})$`, 'g');
      const decoratorsRegex = new RegExp(`[-${(0, _common.escapeRegExp)(excludeComma ? '' : thousandsSeparator)}]`, 'g');
      result = result.replace(prefixStubs, '').replace(postfixRegex, '').replace(decoratorsRegex, '');
    }
    return result;
  },
  _getStubs(format) {
    const regExpResult = /[^']([#0.,]+)/g.exec(format);
    const pattern = regExpResult && regExpResult[0].trim();
    return format.split(pattern).map(stub => stub.replace(/'/g, ''));
  },
  _truncateToPrecision(value, maxPrecision) {
    if ((0, _type.isDefined)(value)) {
      const strValue = value.toString();
      const decimalSeparatorIndex = strValue.indexOf('.');
      if (strValue && decimalSeparatorIndex > -1) {
        const parsedValue = parseFloat(strValue.substr(0, decimalSeparatorIndex + maxPrecision + 1));
        return isNaN(parsedValue) ? value : parsedValue;
      }
    }
    return value;
  },
  _tryParse(text, selection, char) {
    const isTextSelected = selection.start !== selection.end;
    const isWholeTextSelected = isTextSelected && selection.start === 0 && selection.end === text.length;
    const decimalSeparator = _number2.default.getDecimalSeparator();
    if (isWholeTextSelected && char === decimalSeparator) {
      return 0;
    }
    const editedText = this._replaceSelectedText(text, selection, char);
    const format = this._getFormatPattern();
    let parsedValue = this._getParsedValue(editedText, format);
    const maxPrecision = !format.parser && this._getPrecisionLimits(editedText).max;
    const isValueChanged = parsedValue !== this._parsedValue;
    const isDecimalPointRestricted = char === decimalSeparator && maxPrecision === 0;
    const isUselessCharRestricted = !isTextSelected && !isValueChanged && char !== MINUS && this._isStub(char);
    if (isDecimalPointRestricted || isUselessCharRestricted) {
      return undefined;
    }
    if (this._removeStubs(editedText) === '') {
      parsedValue = Math.abs(this._parsedValue * 0);
    }
    if (isNaN(parsedValue)) {
      return undefined;
    }
    const value = parsedValue === null ? this._parsedValue : parsedValue;
    parsedValue = maxPrecision ? this._truncateToPrecision(value, maxPrecision) : parsedValue;
    return !format.parser && this._isPercentFormat() ? (0, _m_utils.adjustPercentValue)(parsedValue, maxPrecision) : parsedValue;
  },
  _getParsedValue(text, format) {
    const sign = _number2.default.getSign(text, (format === null || format === void 0 ? void 0 : format.formatter) || format);
    const textWithoutStubs = this._removeStubs(text, true);
    const parsedValue = this._parse(textWithoutStubs, format);
    const parsedValueSign = parsedValue < 0 ? -1 : 1;
    const parsedValueWithSign = (0, _type.isNumeric)(parsedValue) && sign !== parsedValueSign ? sign * parsedValue : parsedValue;
    return parsedValueWithSign;
  },
  _isValueIncomplete(text) {
    if (!this._useMaskBehavior()) {
      return this.callBase(text);
    }
    const caret = this._caret();
    const point = _number2.default.getDecimalSeparator();
    const pointIndex = this._getTextSeparatorIndex(text);
    const isCaretOnFloat = pointIndex >= 0 && pointIndex < caret.start;
    const textParts = this._removeStubs(text, true).split(point);
    if (!isCaretOnFloat || textParts.length !== 2) {
      return false;
    }
    const floatLength = textParts[1].length;
    const format = this._getFormatPattern();
    const isCustomParser = !!format.parser;
    const precision = !isCustomParser && this._getPrecisionLimits(this._getFormatPattern(), text);
    const isPrecisionInRange = isCustomParser ? true : (0, _math.inRange)(floatLength, precision.min, precision.max);
    const endsWithZero = textParts[1].charAt(floatLength - 1) === '0';
    return isPrecisionInRange && (endsWithZero || !floatLength);
  },
  _isValueInRange(value) {
    const min = (0, _common.ensureDefined)(this.option('min'), -Infinity);
    const max = (0, _common.ensureDefined)(this.option('max'), Infinity);
    return (0, _math.inRange)(value, min, max);
  },
  _setInputText(text) {
    const normalizedText = _number2.default.convertDigits(text, true);
    const newCaret = (0, _m_number_box2.getCaretAfterFormat)(this._getInputVal(), normalizedText, this._caret(), this._getFormatPattern());
    this._input().val(text);
    this._toggleEmptinessEventHandler();
    this._formattedValue = text;
    if (!this._focusOutOccurs) {
      this._caret(newCaret);
    }
  },
  _useMaskBehavior() {
    return !!this.option('format') && this.option('useMaskBehavior');
  },
  _renderInputType() {
    const isNumberType = this.option('mode') === 'number';
    const isDesktop = _devices.default.real().deviceType === 'desktop';
    if (this._useMaskBehavior() && isNumberType) {
      this._setInputType(isDesktop || this._isSupportInputMode() ? 'text' : 'tel');
    } else {
      this.callBase();
    }
  },
  _isChar(str) {
    return (0, _type.isString)(str) && str.length === 1;
  },
  _moveCaret(offset) {
    if (!offset) {
      return;
    }
    const newCaret = (0, _m_number_box2.getCaretWithOffset)(this._caret(), offset);
    const adjustedCaret = (0, _m_number_box2.getCaretInBoundaries)(newCaret, this._getInputVal(), this._getFormatPattern());
    this._caret(adjustedCaret);
  },
  _shouldHandleKey(e) {
    const keyName = (0, _index.normalizeKeyName)(e);
    const isSpecialChar = (0, _index.isCommandKeyPressed)(e) || e.altKey || e.shiftKey || !this._isChar(keyName);
    const isMinusKey = keyName === MINUS_KEY;
    const useMaskBehavior = this._useMaskBehavior();
    return useMaskBehavior && !isSpecialChar && !isMinusKey;
  },
  _renderInput() {
    this.callBase();
    this._renderFormatter();
  },
  _renderFormatter() {
    this._clearCache();
    this._detachFormatterEvents();
    if (this._useMaskBehavior()) {
      this._attachFormatterEvents();
    }
  },
  _detachFormatterEvents() {
    _events_engine.default.off(this._input(), `.${NUMBER_FORMATTER_NAMESPACE}`);
  },
  _isInputFromPaste(e) {
    const inputType = e.originalEvent && e.originalEvent.inputType;
    if ((0, _type.isDefined)(inputType)) {
      return inputType === 'insertFromPaste';
    }
    return this._isValuePasted;
  },
  _attachFormatterEvents() {
    const $input = this._input();
    _events_engine.default.on($input, (0, _index.addNamespace)(INPUT_EVENT, NUMBER_FORMATTER_NAMESPACE), e => {
      this._formatValue(e);
      this._isValuePasted = false;
    });
    _events_engine.default.on($input, (0, _index.addNamespace)('dxclick', NUMBER_FORMATTER_NAMESPACE), () => {
      if (!this._caretTimeout) {
        this._caretTimeout = setTimeout(() => {
          this._caretTimeout = undefined;
          this._caret((0, _m_number_box2.getCaretInBoundaries)(this._caret(), this._getInputVal(), this._getFormatPattern()));
        }, CARET_TIMEOUT_DURATION);
      }
    });
    _events_engine.default.on($input, _double_click.name, () => {
      this.clearCaretTimeout();
    });
  },
  clearCaretTimeout() {
    clearTimeout(this._caretTimeout);
    this._caretTimeout = undefined;
  },
  _forceRefreshInputValue() {
    if (!this._useMaskBehavior()) {
      return this.callBase();
    }
  },
  _isNonStubAfter(index) {
    const text = this._getInputVal().slice(index);
    return text && !this._isStub(text, true);
  },
  _isStub(str, isString) {
    const escapedDecimalSeparator = (0, _common.escapeRegExp)(_number2.default.getDecimalSeparator());
    const regExpString = `^[^0-9${escapedDecimalSeparator}]+$`;
    const stubRegExp = new RegExp(regExpString, 'g');
    return stubRegExp.test(str) && (isString || this._isChar(str));
  },
  _parseValue(text) {
    if (!this._useMaskBehavior()) {
      return this.callBase(text);
    }
    return this._parsedValue;
  },
  _getPrecisionLimits(text) {
    const currentFormat = this._getFormatForSign(text);
    const realSeparatorIndex = (0, _m_utils.getRealSeparatorIndex)(currentFormat).index;
    const floatPart = ((0, _m_utils.splitByIndex)(currentFormat, realSeparatorIndex)[1] || '').replace(/[^#0]/g, '');
    const minPrecision = floatPart.replace(/^(0*)#*/, '$1').length;
    const maxPrecision = floatPart.length;
    return {
      min: minPrecision,
      max: maxPrecision
    };
  },
  _revertSign(e) {
    if (!this._useMaskBehavior()) {
      return;
    }
    const caret = this._caret();
    if (caret.start !== caret.end) {
      if ((0, _index.normalizeKeyName)(e) === MINUS_KEY) {
        this._applyRevertedSign(e, caret, true);
        return;
      }
      this._caret((0, _m_number_box2.getCaretInBoundaries)(0, this._getInputVal(), this._getFormatPattern()));
    }
    this._applyRevertedSign(e, caret);
  },
  _applyRevertedSign(e, caret, preserveSelectedText) {
    const newValue = -1 * (0, _common.ensureDefined)(this._parsedValue, null);
    if (this._isValueInRange(newValue) || newValue === 0) {
      this._parsedValue = newValue;
      if (preserveSelectedText) {
        const format = this._getFormatPattern();
        const previousText = this._getInputVal();
        this._setTextByParsedValue();
        e.preventDefault();
        const currentText = this._getInputVal();
        const offset = (0, _m_number_box2.getCaretOffset)(previousText, currentText, format);
        caret = (0, _m_number_box2.getCaretWithOffset)(caret, offset);
        const caretInBoundaries = (0, _m_number_box2.getCaretInBoundaries)(caret, currentText, format);
        this._caret(caretInBoundaries);
      }
    }
  },
  _removeMinusFromText(text, caret) {
    const isMinusPressed = this._lastKeyName === MINUS_KEY && text.charAt(caret.start - 1) === MINUS;
    return isMinusPressed ? this._replaceSelectedText(text, {
      start: caret.start - 1,
      end: caret.start
    }, '') : text;
  },
  _setTextByParsedValue() {
    const format = this._getFormatPattern();
    const parsed = this._parseValue();
    const formatted = this._format(parsed, format) || '';
    this._setInputText(formatted);
  },
  _formatValue(e) {
    let normalizedText = this._getInputVal();
    const caret = this._caret();
    const textWithoutMinus = this._removeMinusFromText(normalizedText, caret);
    const wasMinusRemoved = textWithoutMinus !== normalizedText;
    normalizedText = textWithoutMinus;
    if (!this._isInputFromPaste(e) && this._isValueIncomplete(textWithoutMinus)) {
      this._formattedValue = normalizedText;
      if (wasMinusRemoved) {
        this._setTextByParsedValue();
      }
      return;
    }
    const textWasChanged = _number2.default.convertDigits(this._formattedValue, true) !== normalizedText;
    if (textWasChanged) {
      const value = this._tryParse(normalizedText, caret, '');
      if ((0, _type.isDefined)(value)) {
        this._parsedValue = value;
      }
    }
    this._setTextByParsedValue();
  },
  _renderDisplayText() {
    if (this._useMaskBehavior()) {
      this._toggleEmptinessEventHandler();
    } else {
      this.callBase.apply(this, arguments);
    }
  },
  _renderValue() {
    if (this._useMaskBehavior()) {
      this._parsedValue = this.option('value');
      this._setTextByParsedValue();
    }
    return this.callBase();
  },
  _updateParsedValue() {
    const inputValue = this._getInputVal();
    this._parsedValue = this._tryParse(inputValue, this._caret());
  },
  _adjustParsedValue() {
    if (!this._useMaskBehavior()) {
      return;
    }
    const clearedText = this._removeStubs(this._getInputVal());
    const parsedValue = clearedText ? this._parseValue() : null;
    if (!(0, _type.isNumeric)(parsedValue)) {
      this._parsedValue = parsedValue;
      return;
    }
    this._parsedValue = (0, _math.fitIntoRange)(parsedValue, this.option('min'), this.option('max'));
  },
  _valueChangeEventHandler(e) {
    if (!this._useMaskBehavior()) {
      return this.callBase(e);
    }
    const caret = this._caret();
    this._saveValueChangeEvent(e);
    this._lastKey = null;
    this._lastKeyName = null;
    this._updateParsedValue();
    this._adjustParsedValue();
    this.option('value', this._parsedValue);
    if (caret) {
      this._caret(caret);
    }
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'format':
      case 'useMaskBehavior':
        this._renderInputType();
        this._updateFormat();
        this._renderFormatter();
        this._renderValue();
        this._refreshValueChangeEvent();
        this._refreshEvents();
        break;
      case 'min':
      case 'max':
        this._adjustParsedValue();
        this.callBase(args);
        break;
      default:
        this.callBase(args);
    }
  },
  _clearCache() {
    delete this._formattedValue;
    delete this._lastKey;
    delete this._lastKeyName;
    delete this._parsedValue;
    delete this._focusOutOccurs;
    clearTimeout(this._caretTimeout);
    delete this._caretTimeout;
  },
  _clean() {
    this._clearCache();
    this.callBase();
  }
});
var _default = exports.default = NumberBoxMask;