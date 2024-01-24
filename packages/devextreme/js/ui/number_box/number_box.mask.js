import eventsEngine from '../../events/core/events_engine';
import { extend } from '../../core/utils/extend';
import { isNumeric, isDefined, isFunction, isString } from '../../core/utils/type';
import devices from '../../core/devices';
import { fitIntoRange, inRange } from '../../core/utils/math';

import number from '../../localization/number';
import {
    getCaretWithOffset, isCaretInBoundaries, getCaretInBoundaries,
    getCaretBoundaries, getCaretAfterFormat, getCaretOffset,
} from './number_box.caret';
import { getFormat as getLDMLFormat } from '../../localization/ldml/number';
import NumberBoxBase from './number_box.base';
import { addNamespace, getChar, normalizeKeyName, isCommandKeyPressed } from '../../events/utils/index';
import { ensureDefined, escapeRegExp } from '../../core/utils/common';
import { getRealSeparatorIndex, getNthOccurrence, splitByIndex, adjustPercentValue } from './utils';

const NUMBER_FORMATTER_NAMESPACE = 'dxNumberFormatter';
const MOVE_FORWARD = 1;
const MOVE_BACKWARD = -1;
const MINUS = '-';
const MINUS_KEY = 'minus';
const INPUT_EVENT = 'input';

const CARET_TIMEOUT_DURATION = 0;

class NumberBoxMask extends NumberBoxBase {

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {

            useMaskBehavior: true,

            format: null
        });
    }

    _isDeleteKey(key) {
        return key === 'del';
    }

    _supportedKeys() {
        if(!this._useMaskBehavior()) {
            return super._supportedKeys();
        }

        const that = this;

        return extend(super._supportedKeys(), {
            minus: that._revertSign.bind(that),
            del: that._removeHandler.bind(that),
            backspace: that._removeHandler.bind(that),
            leftArrow: that._arrowHandler.bind(that, MOVE_BACKWARD),
            rightArrow: that._arrowHandler.bind(that, MOVE_FORWARD),
            home: that._moveCaretToBoundaryEventHandler.bind(that, MOVE_FORWARD),
            enter: that._updateFormattedValue.bind(that),
            end: that._moveCaretToBoundaryEventHandler.bind(that, MOVE_BACKWARD)
        });
    }

    _getTextSeparatorIndex(text) {
        const decimalSeparator = number.getDecimalSeparator();
        const realSeparatorOccurrenceIndex = getRealSeparatorIndex(this.option('format')).occurrence;
        return getNthOccurrence(text, decimalSeparator, realSeparatorOccurrenceIndex);
    }

    _focusInHandler(e) {
        if(!this._preventNestedFocusEvent(e)) {
            this.clearCaretTimeout();
            this._caretTimeout = setTimeout(function() {
                this._caretTimeout = undefined;
                const caret = this._caret();

                if(caret.start === caret.end && this._useMaskBehavior()) {
                    const text = this._getInputVal();
                    const decimalSeparatorIndex = this._getTextSeparatorIndex(text);

                    if(decimalSeparatorIndex >= 0) {
                        this._caret({ start: decimalSeparatorIndex, end: decimalSeparatorIndex });
                    } else {
                        this._moveCaretToBoundaryEventHandler(MOVE_BACKWARD, e);
                    }
                }
            }.bind(this), CARET_TIMEOUT_DURATION);
        }

        super._focusInHandler(e);
    }

    _focusOutHandler(e) {
        const shouldHandleEvent = !this._preventNestedFocusEvent(e);

        if(shouldHandleEvent) {
            this._focusOutOccurs = true;
            if(this._useMaskBehavior()) {
                this._updateFormattedValue();
            }
        }

        super._focusOutHandler(e);

        if(shouldHandleEvent) {
            this._focusOutOccurs = false;
        }
    }

    _hasValueBeenChanged(inputValue) {
        const format = this._getFormatPattern();
        const value = this.option('value');
        const formatted = this._format(value, format) || '';

        return formatted !== inputValue;
    }

    _updateFormattedValue() {
        const inputValue = this._getInputVal();

        if(this._hasValueBeenChanged(inputValue)) {
            this._updateParsedValue();

            this._adjustParsedValue();
            this._setTextByParsedValue();

            if(this._parsedValue !== this.option('value')) {
                // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15181565/
                // https://bugreport.apple.com/web/?problemID=38133794 but this bug tracker is private
                eventsEngine.trigger(this._input(), 'change');
            }
        }
    }

    _arrowHandler(step, e) {
        if(!this._useMaskBehavior()) {
            return;
        }

        const text = this._getInputVal();
        const format = this._getFormatPattern();
        let nextCaret = getCaretWithOffset(this._caret(), step);

        if(!isCaretInBoundaries(nextCaret, text, format)) {
            nextCaret = step === MOVE_FORWARD ? nextCaret.end : nextCaret.start;
            e.preventDefault();
            this._caret(getCaretInBoundaries(nextCaret, text, format));
        }
    }

    _moveCaretToBoundary(direction) {
        const boundaries = getCaretBoundaries(this._getInputVal(), this._getFormatPattern());
        const newCaret = getCaretWithOffset(direction === MOVE_FORWARD ? boundaries.start : boundaries.end, 0);

        this._caret(newCaret);
    }

    _moveCaretToBoundaryEventHandler(direction, e) {
        if(!this._useMaskBehavior() || e && e.shiftKey) {
            return;
        }

        this._moveCaretToBoundary(direction);
        e && e.preventDefault();
    }

    _shouldMoveCaret(text, caret) {
        const decimalSeparator = number.getDecimalSeparator();
        const isDecimalSeparatorNext = text.charAt(caret.end) === decimalSeparator;
        const moveToFloat = (this._lastKey === decimalSeparator || this._lastKey === '.' || this._lastKey === ',') && isDecimalSeparatorNext;

        return moveToFloat;
    }

    _getInputVal() {
        return number.convertDigits(this._input().val(), true);
    }

    _keyboardHandler(e) {
        this.clearCaretTimeout();

        this._lastKey = number.convertDigits(getChar(e), true);
        this._lastKeyName = normalizeKeyName(e);

        if(!this._shouldHandleKey(e.originalEvent)) {
            return super._keyboardHandler(e);
        }

        const normalizedText = this._getInputVal();
        const caret = this._caret();

        const enteredChar = this._lastKeyName === MINUS_KEY ? '' : this._lastKey;
        const newValue = this._tryParse(normalizedText, caret, enteredChar);

        if(this._shouldMoveCaret(normalizedText, caret)) {
            this._moveCaret(1);
            e.originalEvent.preventDefault();
        }

        if(newValue === undefined) {
            if(this._lastKeyName !== MINUS_KEY) {
                e.originalEvent.preventDefault();
            }
        } else {
            this._parsedValue = newValue;
        }

        return super._keyboardHandler(e);
    }

    _keyPressHandler(e) {
        if(!this._useMaskBehavior()) {
            super._keyPressHandler(e);
        }
    }

    _removeHandler(e) {
        const caret = this._caret();
        const text = this._getInputVal();
        let start = caret.start;
        let end = caret.end;

        this._lastKey = getChar(e);
        this._lastKeyName = normalizeKeyName(e);

        const isDeleteKey = this._isDeleteKey(this._lastKeyName);
        const isBackspaceKey = !isDeleteKey;

        if(start === end) {
            const caretPosition = start;
            const canDelete = isBackspaceKey && caretPosition > 0 || isDeleteKey && caretPosition < text.length;

            if(canDelete) {
                isDeleteKey && end++;
                isBackspaceKey && start--;
            } else {
                e.preventDefault();
                return;
            }
        }

        const char = text.slice(start, end);

        if(this._isStub(char)) {
            this._moveCaret(isDeleteKey ? 1 : -1);
            if(this._parsedValue < 0 || 1 / this._parsedValue === -Infinity) {
                this._revertSign(e);
                this._setTextByParsedValue();

                const shouldTriggerInputEvent = this.option('valueChangeEvent').split(' ').includes('input');
                if(shouldTriggerInputEvent) {
                    eventsEngine.trigger(this._input(), 'input');
                }
            }
            e.preventDefault();
            return;
        }

        const decimalSeparator = number.getDecimalSeparator();
        if(char === decimalSeparator) {
            const decimalSeparatorIndex = text.indexOf(decimalSeparator);
            if(this._isNonStubAfter(decimalSeparatorIndex + 1)) {
                this._moveCaret(isDeleteKey ? 1 : -1);
                e.preventDefault();
            }
            return;
        }


        if(end - start < text.length) {
            const editedText = this._replaceSelectedText(text, { start: start, end: end }, '');
            const noDigits = editedText.search(/[0-9]/) < 0;

            if(noDigits && this._isValueInRange(0)) {
                this._parsedValue = this._parsedValue < 0 || 1 / this._parsedValue === -Infinity ? -0 : 0;
                return;
            }
        }

        const valueAfterRemoving = this._tryParse(text, { start: start, end: end }, '');
        if(valueAfterRemoving === undefined) {
            e.preventDefault();
        } else {
            this._parsedValue = valueAfterRemoving;
        }
    }

    _isPercentFormat() {
        const format = this._getFormatPattern();
        const noEscapedFormat = format.replace(/'[^']+'/g, '');

        return noEscapedFormat.indexOf('%') !== -1;
    }

    _parse(text, format) {
        const formatOption = this.option('format');
        const isCustomParser = isFunction(formatOption.parser);
        const parser = isCustomParser ? formatOption.parser : number.parse;
        let integerPartStartIndex = 0;

        if(!isCustomParser) {
            const formatPointIndex = getRealSeparatorIndex(format).index;
            const textPointIndex = this._getTextSeparatorIndex(text);

            const formatIntegerPartLength = formatPointIndex !== -1 ? formatPointIndex : format.length;
            const textIntegerPartLength = textPointIndex !== -1 ? textPointIndex : text.length;

            if(textIntegerPartLength > formatIntegerPartLength && format.indexOf('#') === -1) {
                integerPartStartIndex = textIntegerPartLength - formatIntegerPartLength;
            }
        }

        text = text.substr(integerPartStartIndex);

        return parser(text, format);
    }

    _format(value, format) {
        const formatOption = this.option('format');
        const customFormatter = formatOption?.formatter || formatOption;
        const formatter = isFunction(customFormatter) ? customFormatter : number.format;

        const formattedValue = value === null ? '' : formatter(value, format);

        return formattedValue;
    }

    _getFormatPattern() {
        if(!this._currentFormat) {
            this._updateFormat();
        }

        return this._currentFormat;
    }

    _updateFormat() {
        const format = this.option('format');
        const isCustomParser = isFunction(format?.parser);
        const isLDMLPattern = isString(format) && (format.indexOf('0') >= 0 || format.indexOf('#') >= 0);
        const isExponentialFormat = format === 'exponential' || format?.type === 'exponential';
        const shouldUseFormatAsIs = isCustomParser || isLDMLPattern || isExponentialFormat;

        this._currentFormat = shouldUseFormatAsIs
            ? format
            : getLDMLFormat((value) => {
                const text = this._format(value, format);
                return number.convertDigits(text, true);
            });
    }

    _getFormatForSign(text) {
        const format = this._getFormatPattern();
        if(isString(format)) {
            const signParts = format.split(';');
            const sign = number.getSign(text, format);

            signParts[1] = signParts[1] || '-' + signParts[0];
            return sign < 0 ? signParts[1] : signParts[0];
        } else {
            const sign = number.getSign(text);
            return sign < 0 ? '-' : '';
        }
    }

    _removeStubs(text, excludeComma) {
        const format = this._getFormatForSign(text);
        const thousandsSeparator = number.getThousandsSeparator();
        const stubs = this._getStubs(format);
        let result = text;

        if(stubs.length) {
            const prefixStubs = stubs[0];
            const postfixRegex = new RegExp('(' + escapeRegExp(stubs[1] || '') + ')$', 'g');
            const decoratorsRegex = new RegExp('[-' + escapeRegExp((excludeComma ? '' : thousandsSeparator)) + ']', 'g');

            result = result
                .replace(prefixStubs, '')
                .replace(postfixRegex, '')
                .replace(decoratorsRegex, '');
        }

        return result;
    }

    _getStubs(format) {
        const regExpResult = /[^']([#0.,]+)/g.exec(format);
        const pattern = regExpResult && regExpResult[0].trim();

        return format
            .split(pattern)
            .map(function(stub) {
                return stub.replace(/'/g, '');
            });
    }

    _truncateToPrecision(value, maxPrecision) {
        if(isDefined(value)) {
            const strValue = value.toString();
            const decimalSeparatorIndex = strValue.indexOf('.');

            if(strValue && decimalSeparatorIndex > -1) {
                const parsedValue = parseFloat(strValue.substr(0, decimalSeparatorIndex + maxPrecision + 1));
                return isNaN(parsedValue) ? value : parsedValue;
            }
        }
        return value;
    }

    _tryParse(text, selection, char) {
        const isTextSelected = selection.start !== selection.end;
        const isWholeTextSelected = isTextSelected && selection.start === 0 && selection.end === text.length;
        const decimalSeparator = number.getDecimalSeparator();

        if(isWholeTextSelected && char === decimalSeparator) {
            return 0;
        }

        const editedText = this._replaceSelectedText(text, selection, char);
        const format = this._getFormatPattern();

        let parsedValue = this._getParsedValue(editedText, format);
        const maxPrecision = !format.parser && this._getPrecisionLimits(editedText).max;
        const isValueChanged = parsedValue !== this._parsedValue;

        const isDecimalPointRestricted = char === decimalSeparator && maxPrecision === 0;
        const isUselessCharRestricted = !isTextSelected && !isValueChanged && char !== MINUS && !this._isValueIncomplete(editedText) && this._isStub(char);

        if(isDecimalPointRestricted || isUselessCharRestricted) {
            return undefined;
        }

        if(this._removeStubs(editedText) === '') {
            parsedValue = Math.abs(this._parsedValue * 0);
        }

        if(isNaN(parsedValue)) {
            return undefined;
        }

        const value = parsedValue === null ? this._parsedValue : parsedValue;
        parsedValue = maxPrecision ? this._truncateToPrecision(value, maxPrecision) : parsedValue;

        return !format.parser && this._isPercentFormat() ? adjustPercentValue(parsedValue, maxPrecision) : parsedValue;
    }

    _getParsedValue(text, format) {
        const sign = number.getSign(text, format?.formatter || format);
        const textWithoutStubs = this._removeStubs(text, true);
        const parsedValue = this._parse(textWithoutStubs, format);
        const parsedValueSign = parsedValue < 0 ? -1 : 1;
        const parsedValueWithSign = isNumeric(parsedValue) && sign !== parsedValueSign ? sign * parsedValue : parsedValue;

        return parsedValueWithSign;
    }

    _isValueIncomplete(text) {
        if(!this._useMaskBehavior()) {
            return super._isValueIncomplete(text);
        }

        const caret = this._caret();
        const point = number.getDecimalSeparator();
        const pointIndex = this._getTextSeparatorIndex(text);
        const isCaretOnFloat = pointIndex >= 0 && pointIndex < caret.start;
        const textParts = this._removeStubs(text, true).split(point);

        if(!isCaretOnFloat || textParts.length !== 2) {
            return false;
        }

        const floatLength = textParts[1].length;
        const format = this._getFormatPattern();
        const isCustomParser = !!format.parser;
        const precision = !isCustomParser && this._getPrecisionLimits(this._getFormatPattern(), text);
        const isPrecisionInRange = isCustomParser ? true : inRange(floatLength, precision.min, precision.max);
        const endsWithZero = textParts[1].charAt(floatLength - 1) === '0';

        return isPrecisionInRange && (endsWithZero || !floatLength);
    }

    _isValueInRange(value) {
        const min = ensureDefined(this.option('min'), -Infinity);
        const max = ensureDefined(this.option('max'), Infinity);

        return inRange(value, min, max);
    }

    _setInputText(text) {
        const normalizedText = number.convertDigits(text, true);
        const newCaret = getCaretAfterFormat(this._getInputVal(), normalizedText, this._caret(), this._getFormatPattern());

        this._input().val(text);
        this._toggleEmptinessEventHandler();
        this._formattedValue = text;

        if(!this._focusOutOccurs) {
            this._caret(newCaret);
        }
    }

    _useMaskBehavior() {
        return !!this.option('format') && this.option('useMaskBehavior');
    }

    _renderInputType() {
        const isNumberType = this.option('mode') === 'number';
        const isDesktop = devices.real().deviceType === 'desktop';

        if(this._useMaskBehavior() && isNumberType) {
            this._setInputType(isDesktop || this._isSupportInputMode() ? 'text' : 'tel');
        } else {
            super._renderInputType();
        }
    }

    _isChar(str) {
        return isString(str) && str.length === 1;
    }

    _moveCaret(offset) {
        if(!offset) {
            return;
        }

        const newCaret = getCaretWithOffset(this._caret(), offset);
        const adjustedCaret = getCaretInBoundaries(newCaret, this._getInputVal(), this._getFormatPattern());

        this._caret(adjustedCaret);
    }

    _shouldHandleKey(e) {
        const keyName = normalizeKeyName(e);
        const isSpecialChar = isCommandKeyPressed(e) || e.altKey || e.shiftKey || !this._isChar(keyName);
        const isMinusKey = keyName === MINUS_KEY;
        const useMaskBehavior = this._useMaskBehavior();

        return useMaskBehavior && !isSpecialChar && !isMinusKey;
    }

    _renderInput() {
        super._renderInput();
        this._renderFormatter();
    }

    _renderFormatter() {
        this._clearCache();
        this._detachFormatterEvents();

        if(this._useMaskBehavior()) {
            this._attachFormatterEvents();
        }
    }

    _detachFormatterEvents() {
        eventsEngine.off(this._input(), '.' + NUMBER_FORMATTER_NAMESPACE);
    }

    _isInputFromPaste(e) {
        const inputType = e.originalEvent && e.originalEvent.inputType;

        if(isDefined(inputType)) {
            return inputType === 'insertFromPaste';
        } else {
            return this._isValuePasted;
        }
    }

    _attachFormatterEvents() {
        const $input = this._input();

        eventsEngine.on($input, addNamespace(INPUT_EVENT, NUMBER_FORMATTER_NAMESPACE), function(e) {
            this._formatValue(e);
            this._isValuePasted = false;
        }.bind(this));

        eventsEngine.on($input, addNamespace('dxclick', NUMBER_FORMATTER_NAMESPACE), function() {
            if(!this._caretTimeout) {
                this._caretTimeout = setTimeout(function() {
                    this._caretTimeout = undefined;
                    this._caret(getCaretInBoundaries(this._caret(), this._getInputVal(), this._getFormatPattern()));
                }.bind(this), CARET_TIMEOUT_DURATION);
            }
        }.bind(this));

        eventsEngine.on($input, 'dxdblclick', function() {
            this.clearCaretTimeout();
        }.bind(this));
    }

    clearCaretTimeout() {
        clearTimeout(this._caretTimeout);
        this._caretTimeout = undefined;
    }

    _forceRefreshInputValue() {
        if(!this._useMaskBehavior()) {
            return super._forceRefreshInputValue();
        }
    }

    _isNonStubAfter(index) {
        const text = this._getInputVal().slice(index);
        return text && !this._isStub(text, true);
    }

    _isStub(str, isString) {
        const escapedDecimalSeparator = escapeRegExp(number.getDecimalSeparator());
        const regExpString = '^[^0-9' + escapedDecimalSeparator + ']+$';
        const stubRegExp = new RegExp(regExpString, 'g');

        return stubRegExp.test(str) && (isString || this._isChar(str));
    }

    _parseValue(text) {
        if(!this._useMaskBehavior()) {
            return super._parseValue(text);
        }

        return this._parsedValue;
    }

    _getPrecisionLimits(text) {
        const currentFormat = this._getFormatForSign(text);
        const realSeparatorIndex = getRealSeparatorIndex(currentFormat).index;
        const floatPart = (splitByIndex(currentFormat, realSeparatorIndex)[1] || '').replace(/[^#0]/g, '');
        const minPrecision = floatPart.replace(/^(0*)#*/, '$1').length;
        const maxPrecision = floatPart.length;

        return { min: minPrecision, max: maxPrecision };
    }

    _revertSign(e) {
        if(!this._useMaskBehavior()) {
            return;
        }

        const caret = this._caret();
        if(caret.start !== caret.end) {
            if(normalizeKeyName(e) === MINUS_KEY) {
                this._applyRevertedSign(e, caret, true);
                return;
            } else {
                this._caret(getCaretInBoundaries(0, this._getInputVal(), this._getFormatPattern()));
            }

        }

        this._applyRevertedSign(e, caret);
    }

    _applyRevertedSign(e, caret, preserveSelectedText) {
        const newValue = -1 * ensureDefined(this._parsedValue, null);

        if(this._isValueInRange(newValue) || newValue === 0) {
            this._parsedValue = newValue;

            if(preserveSelectedText) {
                const format = this._getFormatPattern();
                const previousText = this._getInputVal();

                this._setTextByParsedValue();
                e.preventDefault();

                const currentText = this._getInputVal();
                const offset = getCaretOffset(previousText, currentText, format);

                caret = getCaretWithOffset(caret, offset);

                const caretInBoundaries = getCaretInBoundaries(caret, currentText, format);

                this._caret(caretInBoundaries);
            }
        }
    }

    _removeMinusFromText(text, caret) {
        const isMinusPressed = this._lastKeyName === MINUS_KEY && text.charAt(caret.start - 1) === MINUS;

        return isMinusPressed ? this._replaceSelectedText(text, {
            start: caret.start - 1,
            end: caret.start
        }, '') : text;
    }

    _setTextByParsedValue() {
        const format = this._getFormatPattern();
        const parsed = this._parseValue();
        const formatted = this._format(parsed, format) || '';

        this._setInputText(formatted);
    }

    _formatValue(e) {
        let normalizedText = this._getInputVal();
        const caret = this._caret();
        const textWithoutMinus = this._removeMinusFromText(normalizedText, caret);
        const wasMinusRemoved = textWithoutMinus !== normalizedText;

        normalizedText = textWithoutMinus;

        if(!this._isInputFromPaste(e) && this._isValueIncomplete(textWithoutMinus)) {
            this._formattedValue = normalizedText;
            if(wasMinusRemoved) {
                this._setTextByParsedValue();
            }
            return;
        }

        const textWasChanged = number.convertDigits(this._formattedValue, true) !== normalizedText;
        if(textWasChanged) {
            const value = this._tryParse(normalizedText, caret, '');
            if(isDefined(value)) {
                this._parsedValue = value;
            }
        }

        this._setTextByParsedValue();
    }

    _renderDisplayText() {
        if(this._useMaskBehavior()) {
            this._toggleEmptinessEventHandler();
        } else {
            super._renderDisplayText.apply(this, arguments);
        }
    }

    _renderValue() {
        if(this._useMaskBehavior()) {
            this._parsedValue = this.option('value');
            this._setTextByParsedValue();
        }

        return super._renderValue();
    }

    _updateParsedValue() {
        const inputValue = this._getInputVal();
        this._parsedValue = this._tryParse(inputValue, this._caret());
    }

    _adjustParsedValue() {
        if(!this._useMaskBehavior()) {
            return;
        }

        const clearedText = this._removeStubs(this._getInputVal());
        const parsedValue = clearedText ? this._parseValue() : null;

        if(!isNumeric(parsedValue)) {
            this._parsedValue = parsedValue;
            return;
        }

        this._parsedValue = fitIntoRange(parsedValue, this.option('min'), this.option('max'));
    }

    _valueChangeEventHandler(e) {
        if(!this._useMaskBehavior()) {
            return super._valueChangeEventHandler(e);
        }

        const caret = this._caret();

        this._saveValueChangeEvent(e);
        this._lastKey = null;
        this._lastKeyName = null;

        this._updateParsedValue();
        this._adjustParsedValue();
        this.option('value', this._parsedValue);

        if(caret) {
            this._caret(caret);
        }
    }

    _optionChanged(args) {
        switch(args.name) {
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
                super._optionChanged(args);
                break;
            default:
                super._optionChanged(args);
        }
    }

    _clearCache() {
        delete this._formattedValue;
        delete this._lastKey;
        delete this._lastKeyName;
        delete this._parsedValue;
        delete this._focusOutOccurs;
        clearTimeout(this._caretTimeout);
        delete this._caretTimeout;
    }

    _clean() {
        this._clearCache();
        super._clean();
    }
}

export default NumberBoxMask;
