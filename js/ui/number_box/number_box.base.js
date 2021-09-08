import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import { applyServerDecimalSeparator, ensureDefined } from '../../core/utils/common';
import { isDefined } from '../../core/utils/type';
import { fitIntoRange, inRange } from '../../core/utils/math';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import devices from '../../core/devices';
import browser from '../../core/utils/browser';
import TextEditor from '../text_box/ui.text_editor';
import { addNamespace, getChar, isCommandKeyPressed, normalizeKeyName } from '../../events/utils/index';
import SpinButtons from './number_box.spins';
import messageLocalization from '../../localization/message';
import { Deferred } from '../../core/utils/deferred';

const math = Math;

const WIDGET_CLASS = 'dx-numberbox';
const FIREFOX_CONTROL_KEYS = ['tab', 'del', 'backspace', 'leftArrow', 'rightArrow', 'home', 'end', 'enter'];

const FORCE_VALUECHANGE_EVENT_NAMESPACE = 'NumberBoxForceValueChange';

const NumberBoxBase = TextEditor.inherit({

    _supportedKeys: function() {
        return extend(this.callBase(), {
            upArrow: function(e) {
                if(!isCommandKeyPressed(e)) {
                    e.preventDefault();
                    e.stopPropagation();
                    this._spinUpChangeHandler(e);
                }
            },
            downArrow: function(e) {
                if(!isCommandKeyPressed(e)) {
                    e.preventDefault();
                    e.stopPropagation();
                    this._spinDownChangeHandler(e);
                }
            },
            enter: function() {
            }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            value: 0,

            min: undefined,

            max: undefined,

            step: 1,

            showSpinButtons: false,

            useLargeSpinButtons: true,

            mode: 'text',

            invalidValueMessage: messageLocalization.format('dxNumberBox-invalidValueMessage'),

            buttons: void 0,

            /**
             * @name dxNumberBoxOptions.mask
             * @hidden
             */

            /**
             * @name dxNumberBoxOptions.maskChar
             * @hidden
             */

            /**
             * @name dxNumberBoxOptions.maskRules
             * @hidden
             */

            /**
             * @name dxNumberBoxOptions.maskInvalidMessage
             * @hidden
             */

            /**
             * @name dxNumberBoxOptions.useMaskedValue
             * @hidden
             */

            /**
             * @name dxNumberBoxOptions.showMaskMode
             * @hidden
             */

            /**
             * @name dxNumberBoxOptions.spellcheck
             * @hidden
             */
        });
    },

    _useTemplates: function() {
        return false;
    },

    _getDefaultButtons: function() {
        return this.callBase().concat([{ name: 'spins', Ctor: SpinButtons }]);
    },

    _isSupportInputMode: function() {
        const version = parseFloat(browser.version);

        return (
            browser.chrome && version >= 66
            || browser.safari && version >= 12
            || browser.msie && version >= 75
        );
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().generic && !devices.isSimulator();
                },
                options: {
                    useLargeSpinButtons: false
                }
            },
            {
                device: function() {
                    return devices.real().deviceType !== 'desktop' && !this._isSupportInputMode();
                }.bind(this),
                options: {
                    mode: 'number'
                }
            }
        ]);
    },

    _initMarkup: function() {
        this._renderSubmitElement();
        this.$element().addClass(WIDGET_CLASS);

        this.callBase();
    },

    _getDefaultAttributes: function() {
        const attributes = this.callBase();

        attributes['inputmode'] = 'decimal';
        return attributes;
    },

    _renderContentImpl: function() {
        this.option('isValid') && this._validateValue(this.option('value'));
        this.setAria('role', 'spinbutton');
    },

    _renderSubmitElement: function() {
        this._$submitElement = $('<input>')
            .attr('type', 'hidden')
            .appendTo(this.$element());
        this._setSubmitValue(this.option('value'));
    },

    _setSubmitValue: function(value) {
        this._getSubmitElement().val(applyServerDecimalSeparator(value));
    },

    _getSubmitElement: function() {
        return this._$submitElement;
    },

    _keyPressHandler: function(e) {
        this.callBase(e);

        const char = getChar(e);
        const validCharRegExp = /[\d.,eE\-+]|Subtract/; // Workaround for IE (T592690)
        const isInputCharValid = validCharRegExp.test(char);

        if(!isInputCharValid) {
            const keyName = normalizeKeyName(e);
            // NOTE: Additional check for Firefox control keys
            if(isCommandKeyPressed(e) || keyName && (inArray(keyName, FIREFOX_CONTROL_KEYS) >= 0)) {
                return;
            }

            e.preventDefault();
            return false;
        }

        this._keyPressed = true;
    },

    _onMouseWheel: function(dxEvent) {
        dxEvent.delta > 0 ? this._spinValueChange(1, dxEvent) : this._spinValueChange(-1, dxEvent);
    },

    _renderValue: function() {
        const inputValue = this._input().val();
        const value = this.option('value');

        if(!inputValue.length || Number(inputValue) !== value) {
            this._forceValueRender();
            this._toggleEmptinessEventHandler();
        }

        const valueText = isDefined(value) ? null : messageLocalization.format('dxNumberBox-noDataText');

        this.setAria({
            'valuenow': ensureDefined(value, ''),
            'valuetext': valueText
        });

        this.option('text', this._input().val());
        this._updateButtons();

        return new Deferred().resolve();
    },

    _forceValueRender: function() {
        const value = this.option('value');
        const number = Number(value);
        const formattedValue = isNaN(number) ? '' : this._applyDisplayValueFormatter(value);

        this._renderDisplayText(formattedValue);
    },

    _applyDisplayValueFormatter: function(value) {
        return this.option('displayValueFormatter')(value);
    },

    _renderProps: function() {
        this.callBase();

        this._input().prop({
            'min': this.option('min'),
            'max': this.option('max'),
            'step': this.option('step')
        });

        this.setAria({
            'valuemin': ensureDefined(this.option('min'), ''),
            'valuemax': ensureDefined(this.option('max'), '')
        });
    },

    _spinButtonsPointerDownHandler: function() {
        const $input = this._input();
        if(!this.option('useLargeSpinButtons') && domAdapter.getActiveElement() !== $input[0]) {
            eventsEngine.trigger($input, 'focus');
        }
    },

    _spinUpChangeHandler: function(e) {
        if(!this.option('readOnly')) {
            this._spinValueChange(1, e.event || e);
        }
    },

    _spinDownChangeHandler: function(e) {
        if(!this.option('readOnly')) {
            this._spinValueChange(-1, e.event || e);
        }
    },

    _spinValueChange: function(sign, dxEvent) {
        const step = parseFloat(this.option('step'));
        if(step === 0) {
            return;
        }

        let value = parseFloat(this._normalizeInputValue()) || 0;

        value = this._correctRounding(value, step * sign);

        const min = this.option('min');
        const max = this.option('max');

        if(isDefined(min)) {
            value = Math.max(min, value);
        }

        if(isDefined(max)) {
            value = Math.min(max, value);
        }

        this._saveValueChangeEvent(dxEvent);
        this.option('value', value);
    },

    _correctRounding: function(value, step) {
        const regex = /[,.](.*)/;
        const isFloatValue = regex.test(value);
        const isFloatStep = regex.test(step);

        if(isFloatValue || isFloatStep) {
            const valueAccuracy = (isFloatValue) ? regex.exec(value)[0].length : 0;
            const stepAccuracy = (isFloatStep) ? regex.exec(step)[0].length : 0;
            const accuracy = math.max(valueAccuracy, stepAccuracy);

            value = this._round(value + step, accuracy);

            return value;
        }

        return value + step;
    },

    _round: function(value, precision) {
        precision = precision || 0;

        const multiplier = Math.pow(10, precision);

        value *= multiplier;
        value = Math.round(value) / multiplier;

        return value;
    },

    _renderValueChangeEvent: function() {
        this.callBase();

        const forceValueChangeEvent = addNamespace('focusout', FORCE_VALUECHANGE_EVENT_NAMESPACE);
        eventsEngine.off(this.element(), forceValueChangeEvent);
        eventsEngine.on(this.element(), forceValueChangeEvent, this._forceRefreshInputValue.bind(this));
    },

    _forceRefreshInputValue: function() {
        if(this.option('mode') === 'number') {
            return;
        }

        const $input = this._input();
        const formattedValue = this._applyDisplayValueFormatter(this.option('value'));

        $input.val(null);
        $input.val(formattedValue);
    },

    _valueChangeEventHandler: function(e) {
        const $input = this._input();
        const inputValue = this._normalizeText();
        const value = this._parseValue(inputValue);
        const valueHasDigits = inputValue !== '.' && inputValue !== '-';

        if(this._isValueValid() && !this._validateValue(value)) {
            $input.val(this._applyDisplayValueFormatter(value));
            return;
        }

        if(valueHasDigits) {
            this.callBase(e, isNaN(value) ? null : value);
        }

        this._applyValueBoundaries(inputValue, value);

        this.validationRequest.fire({
            value: value,
            editor: this
        });
    },

    _applyValueBoundaries: function(inputValue, parsedValue) {
        const isValueIncomplete = this._isValueIncomplete(inputValue);
        const isValueCorrect = this._isValueInRange(inputValue);

        if(!isValueIncomplete && !isValueCorrect && parsedValue !== null) {
            if(Number(inputValue) !== parsedValue) {
                this._input().val(this._applyDisplayValueFormatter(parsedValue));
            }
        }
    },

    _replaceCommaWithPoint: function(value) {
        return value.replace(',', '.');
    },

    _inputIsInvalid: function() {
        const isNumberMode = this.option('mode') === 'number';
        const validityState = this._input().get(0).validity;

        return isNumberMode && validityState && validityState.badInput;
    },

    _renderDisplayText: function(text) {
        if(this._inputIsInvalid()) {
            return;
        }

        this.callBase(text);
    },

    _isValueIncomplete: function(value) {
        const incompleteRegex = /(^-$)|(^-?\d*\.$)|(\d+e-?$)/i;
        return incompleteRegex.test(value);
    },

    _isValueInRange: function(value) {
        return inRange(value, this.option('min'), this.option('max'));
    },

    _isNumber: function(value) {
        return this._parseValue(value) !== null;
    },

    _validateValue: function(value) {
        const inputValue = this._normalizeText();
        const isValueValid = this._isValueValid();
        let isValid = true;
        const isNumber = this._isNumber(inputValue);

        if(isNaN(Number(value))) {
            isValid = false;
        }

        if(!value && isValueValid) {
            isValid = true;
        } else if(!isNumber && !isValueValid) {
            isValid = false;
        }

        this.option({
            isValid: isValid,
            validationError: isValid ? null : {
                editorSpecific: true,
                message: this.option('invalidValueMessage')
            }
        });

        return isValid;
    },

    _normalizeInputValue: function() {
        return this._parseValue(this._normalizeText());
    },

    _normalizeText: function() {
        const value = this._input().val().trim();

        return this._replaceCommaWithPoint(value);
    },

    _parseValue: function(value) {
        const number = parseFloat(value);

        if(isNaN(number)) {
            return null;
        }

        return fitIntoRange(number, this.option('min'), this.option('max'));
    },

    _clearValue: function() {
        if(this._inputIsInvalid()) {
            this._input().val('');
            this._validateValue();
        }
        this.callBase();
    },

    reset: function() {
        if(this.option('value') === null) {
            this.option('text', '');
            this._renderValue();
        } else {
            this.option('value', null);
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
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

export default NumberBoxBase;
