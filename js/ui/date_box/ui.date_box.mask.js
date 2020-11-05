import { addNamespace, normalizeKeyName } from '../../events/utils/index';
import { isFunction, isString, isDate, isDefined } from '../../core/utils/type';
import { clipboardText } from '../../core/utils/dom';
import { extend } from '../../core/utils/extend';
import { fitIntoRange, inRange, sign } from '../../core/utils/math';
import eventsEngine from '../../events/core/events_engine';
import { getDatePartIndexByPosition, renderDateParts } from './ui.date_box.mask.parts';
import dateLocalization from '../../localization/date';
import { getRegExpInfo } from '../../localization/ldml/date.parser';
import { getFormat } from '../../localization/ldml/date.format';
import DateBoxBase from './ui.date_box.base';
import numberLocalization from '../../localization/number';
import devices from '../../core/devices';
import browser from '../../core/utils/browser';

const MASK_EVENT_NAMESPACE = 'dateBoxMask';
const FORWARD = 1;
const BACKWARD = -1;

const DateBoxMask = DateBoxBase.inherit({

    _supportedKeys(e) {
        const originalHandlers = this.callBase(e);
        const callOriginalHandler = (e) => {
            const originalHandler = originalHandlers[normalizeKeyName(e)];
            return originalHandler && originalHandler.apply(this, [e]);
        };
        const applyHandler = (e, maskHandler) => {
            if(this._shouldUseOriginalHandler(e)) {
                return callOriginalHandler.apply(this, [e]);
            } else {
                return maskHandler.apply(this, [e]);
            }
        };

        return extend({}, originalHandlers, {
            del: (e) => {
                return applyHandler(e, (event) => {
                    this._revertPart(FORWARD);
                    this._isAllSelected() || event.preventDefault();
                });
            },
            backspace: (e) => {
                return applyHandler(e, (event) => {
                    this._revertPart(BACKWARD);
                    this._isAllSelected() || event.preventDefault();
                });
            },
            home: (e) => {
                return applyHandler(e, (event) => {
                    this._selectFirstPart();
                    event.preventDefault();
                });
            },
            end: (e) => {
                return applyHandler(e, (event) => {
                    this._selectLastPart();
                    event.preventDefault();
                });
            },
            escape: (e) => {
                return applyHandler(e, (event) => {
                    this._revertChanges(event);
                });
            },
            enter: (e) => {
                return applyHandler(e, (event) => {
                    this._enterHandler(event);
                });
            },
            leftArrow: (e) => {
                return applyHandler(e, (event) => {
                    this._selectNextPart(BACKWARD);
                    event.preventDefault();
                });
            },
            rightArrow: (e) => {
                return applyHandler(e, (event) => {
                    this._selectNextPart(FORWARD);
                    event.preventDefault();
                });
            },
            upArrow: (e) => {
                return applyHandler(e, (event) => {
                    this._upDownArrowHandler(FORWARD);
                    event.preventDefault();
                });
            },
            downArrow: (e) => {
                return applyHandler(e, (event) => {
                    this._upDownArrowHandler(BACKWARD);
                    event.preventDefault();
                });
            }
        });
    },

    _shouldUseOriginalHandler(e) {
        const keysToHandleByMask = ['backspace', 'del'];
        const isNotDeletingInCalendar = this.option('opened') && e && keysToHandleByMask.indexOf(normalizeKeyName(e)) === -1;

        return !this._useMaskBehavior() || isNotDeletingInCalendar || (e && e.altKey);
    },

    _upDownArrowHandler(step) {
        this._setNewDateIfEmpty();

        const originalValue = this._getActivePartValue(this._initialMaskValue);
        const currentValue = this._getActivePartValue();
        const delta = currentValue - originalValue;

        this._loadMaskValue(this._initialMaskValue);
        this._partIncrease(delta + step, true);
    },

    _getDefaultOptions() {
        return extend(this.callBase(), {

            useMaskBehavior: false,

            emptyDateValue: new Date(2000, 0, 1, 0, 0, 0)
        });
    },

    _isSingleCharKey(e) {
        const key = e.originalEvent.data || e.originalEvent.key;
        return typeof key === 'string' && key.length === 1 && !e.ctrl && !e.alt;
    },

    _isSingleDigitKey(e) {
        const data = e.originalEvent?.data;
        return data?.length === 1 && parseInt(data, 10);
    },

    _useBeforeInputEvent: function() {
        const device = devices.real();
        return device.android && device.version[0] > 4;
    },

    _keyboardHandler(e) {
        let key = e.originalEvent.key;

        const result = this.callBase(e);

        if(!this._useMaskBehavior() || this._useBeforeInputEvent()) {
            return result;
        }

        if((browser.chrome) && e.key === 'Process' && e.code.indexOf('Digit') === 0) {
            key = e.code.replace('Digit', '');
            this._processInputKey(key);
            this._maskInputHandler = () => {
                this._renderSelectedPart();
            };
        } else if(this._isSingleCharKey(e)) {
            this._processInputKey(key);
            e.originalEvent.preventDefault();
        }

        return result;
    },

    _maskBeforeInputHandler(e) {
        this._maskInputHandler = null;

        const { inputType } = e.originalEvent;

        if(inputType === 'insertCompositionText') {
            this._maskInputHandler = () => {
                this._renderSelectedPart();
            };
        }

        const isBackwardDeletion = inputType === 'deleteContentBackward';
        const isForwardDeletion = inputType === 'deleteContentForward';
        if(isBackwardDeletion || isForwardDeletion) {
            const direction = isBackwardDeletion ? BACKWARD : FORWARD;
            this._maskInputHandler = () => {
                this._revertPart();
                this._selectNextPart(direction);
            };
        }

        if(!this._useMaskBehavior() || !this._isSingleCharKey(e)) {
            return;
        }

        const key = e.originalEvent.data;
        this._processInputKey(key);
        e.preventDefault();
        return true;
    },

    _keyPressHandler(e) {
        const { originalEvent: event } = e;
        if(event?.inputType === 'insertCompositionText' && this._isSingleDigitKey(e)) {
            this._processInputKey(event.data);
            this._renderDisplayText(this._getDisplayedText(this._maskValue));
            this._selectNextPart();
        }
        this.callBase(e);

        if(this._maskInputHandler) {
            this._maskInputHandler();
            this._maskInputHandler = null;
        }
    },

    _processInputKey(key) {
        if(this._isAllSelected()) {
            this._activePartIndex = 0;
        }
        this._setNewDateIfEmpty();
        if(isNaN(parseInt(key))) {
            this._searchString(key);
        } else {
            this._searchNumber(key);
        }
    },

    _isAllSelected() {
        const caret = this._caret();

        return caret.end - caret.start === this.option('text').length;
    },

    _getFormatPattern() {
        if(this._formatPattern) {
            return this._formatPattern;
        }

        const format = this._strategy.getDisplayFormat(this.option('displayFormat'));
        const isLDMLPattern = isString(format) && !dateLocalization._getPatternByFormat(format);

        if(isLDMLPattern) {
            this._formatPattern = format;
        } else {
            this._formatPattern = getFormat(function(value) {
                return dateLocalization.format(value, format);
            });
        }

        return this._formatPattern;
    },

    _setNewDateIfEmpty() {
        if(!this._maskValue) {
            const value = this.option('type') === 'time' ? new Date(null) : new Date();
            this._maskValue = value;
            this._initialMaskValue = value;
            this._renderDateParts();
        }
    },

    _partLimitsReached(max) {
        const maxLimitLength = String(max).length;
        const formatLength = this._getActivePartProp('pattern').length;
        const isShortFormat = formatLength === 1;
        const maxSearchLength = isShortFormat ? maxLimitLength : Math.min(formatLength, maxLimitLength);
        const isLengthExceeded = this._searchValue.length === maxSearchLength;
        const isValueOverflowed = parseInt(this._searchValue + '0') > max;

        return isLengthExceeded || isValueOverflowed;
    },

    _searchNumber(char) {
        const { max } = this._getActivePartLimits();
        const maxLimitLength = String(max).length;

        this._searchValue = (this._searchValue + char).substr(-maxLimitLength);
        if(isNaN(this._searchValue)) {
            this._searchValue = char;
        }

        this._setActivePartValue(this._searchValue);

        if(this._partLimitsReached(max)) {
            this._selectNextPart(FORWARD);
        }
    },

    _searchString(char) {
        if(!isNaN(parseInt(this._getActivePartProp('text')))) {
            return;
        }

        const limits = this._getActivePartProp('limits')(this._maskValue);
        const startString = this._searchValue + char.toLowerCase();
        const endLimit = limits.max - limits.min;

        for(let i = 0; i <= endLimit; i++) {
            this._loadMaskValue(this._initialMaskValue);
            this._partIncrease(i + 1);
            if(this._getActivePartProp('text').toLowerCase().indexOf(startString) === 0) {
                this._searchValue = startString;
                return;
            }
        }

        this._setNewDateIfEmpty();

        if(this._searchValue) {
            this._clearSearchValue();
            this._searchString(char);
        }
    },

    _clearSearchValue() {
        this._searchValue = '';
    },

    _revertPart: function(direction) {
        if(!this._isAllSelected()) {
            const actual = this._getActivePartValue(this.option('emptyDateValue'));
            this._setActivePartValue(actual);

            this._selectNextPart(direction);
        }
        this._clearSearchValue();
    },

    _useMaskBehavior() {
        return this.option('useMaskBehavior') && this.option('mode') === 'text';
    },

    _prepareRegExpInfo() {
        this._regExpInfo = getRegExpInfo(this._getFormatPattern(), dateLocalization);
        const regExp = this._regExpInfo.regexp;
        const flags = regExp.flags;
        const convertedRegExp = numberLocalization.convertDigits(this._regExpInfo.regexp.source, false);
        this._regExpInfo.regexp = RegExp(convertedRegExp, flags);
    },

    _initMaskState() {
        this._activePartIndex = 0;
        this._formatPattern = null;
        this._prepareRegExpInfo();
        this._loadMaskValue();
    },

    _renderMask() {
        this.callBase();
        this._detachMaskEvents();
        this._clearMaskState();

        if(this._useMaskBehavior()) {
            this._attachMaskEvents();
            this._initMaskState();
            this._renderDateParts();
        }
    },

    _renderDateParts() {
        if(!this._useMaskBehavior()) {
            return;
        }

        const text = this.option('text') || this._getDisplayedText(this._maskValue);

        if(text) {
            this._dateParts = renderDateParts(text, this._regExpInfo);
            this._isFocused() && this._selectNextPart();
        }
    },

    _detachMaskEvents() {
        eventsEngine.off(this._input(), '.' + MASK_EVENT_NAMESPACE);
    },

    _attachMaskEvents() {
        eventsEngine.on(this._input(), addNamespace('dxclick', MASK_EVENT_NAMESPACE), this._maskClickHandler.bind(this));
        eventsEngine.on(this._input(), addNamespace('paste', MASK_EVENT_NAMESPACE), this._maskPasteHandler.bind(this));
        eventsEngine.on(this._input(), addNamespace('drop', MASK_EVENT_NAMESPACE), () => {
            this._renderSelectedPart();
        });

        eventsEngine.on(this._input(), addNamespace('compositionend', MASK_EVENT_NAMESPACE), this._maskCompositionEndHandler.bind(this));

        if(this._useBeforeInputEvent()) {
            eventsEngine.on(this._input(), addNamespace('beforeinput', MASK_EVENT_NAMESPACE), this._maskBeforeInputHandler.bind(this));
        }
    },

    _renderSelectedPart() {
        this._renderDisplayText(this._getDisplayedText(this._maskValue));
        this._selectNextPart();
    },

    _selectLastPart() {
        if(this.option('text')) {
            this._activePartIndex = this._dateParts.length;
            this._selectNextPart(BACKWARD);
        }
    },

    _selectFirstPart() {
        if(this.option('text')) {
            this._activePartIndex = -1;
            this._selectNextPart(FORWARD);
        }
    },

    _onMouseWheel(e) {
        if(this._useMaskBehavior()) {
            this._partIncrease(e.delta > 0 ? FORWARD : BACKWARD, e);
        }
    },

    _selectNextPart(step = 0) {
        if(!this.option('text') || this._disposed) {
            return;
        }

        if(step) {
            this._initialMaskValue = new Date(this._maskValue);
        }

        let index = fitIntoRange(this._activePartIndex + step, 0, this._dateParts.length - 1);
        if(this._dateParts[index].isStub) {
            const isBoundaryIndex = index === 0 && step < 0 || index === this._dateParts.length - 1 && step > 0;
            if(!isBoundaryIndex) {
                this._selectNextPart(step >= 0 ? step + 1 : step - 1);
                return;
            } else {
                index = this._activePartIndex;
            }
        }

        if(this._activePartIndex !== index) {
            this._clearSearchValue();
        }

        this._activePartIndex = index;
        this._caret(this._getActivePartProp('caret'));
    },

    _getRealLimitsPattern() {
        if(this._getActivePartProp('pattern')[0] === 'd') {
            return 'dM';
        }
    },

    _getActivePartLimits(lockOtherParts) {
        const limitFunction = this._getActivePartProp('limits');
        return limitFunction(this._maskValue, lockOtherParts && this._getRealLimitsPattern());
    },

    _getActivePartValue(dateValue) {
        dateValue = dateValue || this._maskValue;
        const getter = this._getActivePartProp('getter');
        return isFunction(getter) ? getter(dateValue) : dateValue[getter]();
    },

    _addLeadingZeroes(value) {
        const zeroes = this._searchValue.match(/^0+/);
        const limits = this._getActivePartLimits();
        const maxLimitLength = String(limits.max).length;

        return ((zeroes && zeroes[0] || '') + String(value)).substr(-maxLimitLength);
    },

    _setActivePartValue(value, dateValue) {
        dateValue = dateValue || this._maskValue;
        const setter = this._getActivePartProp('setter');
        const limits = this._getActivePartLimits();

        value = inRange(value, limits.min, limits.max) ? value : value % 10;
        value = this._addLeadingZeroes(fitIntoRange(value, limits.min, limits.max));

        isFunction(setter) ? setter(dateValue, value) : dateValue[setter](value);
        this._renderDisplayText(this._getDisplayedText(dateValue));

        this._renderDateParts();
    },

    _getActivePartProp(property) {
        if(!this._dateParts || !this._dateParts[this._activePartIndex]) {
            return undefined;
        }

        return this._dateParts[this._activePartIndex][property];
    },

    _loadMaskValue(value = this.dateOption('value')) {
        this._maskValue = value && new Date(value);
        this._initialMaskValue = value && new Date(value);
    },

    _saveMaskValue() {
        const value = this._maskValue && new Date(this._maskValue);
        if(value && this.option('type') === 'date') {
            value.setHours(0, 0, 0, 0);
        }

        this._initialMaskValue = new Date(value);
        this.dateOption('value', value);
    },

    _revertChanges() {
        this._loadMaskValue();
        this._renderDisplayText(this._getDisplayedText(this._maskValue));
        this._renderDateParts();
    },

    _renderDisplayText(text) {
        this.callBase(text);
        if(this._useMaskBehavior()) {
            this.option('text', text);
        }
    },

    _partIncrease(step, lockOtherParts) {
        this._setNewDateIfEmpty();

        const { max, min } = this._getActivePartLimits(lockOtherParts);

        let limitDelta = max - min;

        // take AM\PM into account
        if(limitDelta === 1) {
            limitDelta++;
        }

        let newValue = step + this._getActivePartValue();

        if(newValue > max) {
            newValue = this._applyLimits(newValue, { limitBase: min, limitClosest: max, limitDelta });
        } else if(newValue < min) {
            newValue = this._applyLimits(newValue, { limitBase: max, limitClosest: min, limitDelta });
        }

        this._setActivePartValue(newValue);
    },

    _applyLimits(newValue, { limitBase, limitClosest, limitDelta }) {
        const delta = (newValue - limitClosest) % limitDelta;
        return delta ? limitBase + delta - 1 * sign(delta) : limitClosest;
    },

    _maskClickHandler() {
        if(this.option('text')) {
            this._activePartIndex = getDatePartIndexByPosition(this._dateParts, this._caret().start);

            if(isDefined(this._activePartIndex)) {
                this._caret(this._getActivePartProp('caret'));
            } else {
                this._selectLastPart();
            }
        }
    },

    _maskCompositionEndHandler(e) {
        if(browser.msie && this._isSingleDigitKey(e)) {
            const key = e.originalEvent.data;
            this._processInputKey(key);

        } else {
            this._input().val(this._getDisplayedText(this._maskValue));
            this._selectNextPart();

            this._maskInputHandler = () => {
                this._renderSelectedPart();
            };
        }
    },

    _maskPasteHandler(e) {
        const newText = this._replaceSelectedText(this.option('text'), this._caret(), clipboardText(e));
        const date = dateLocalization.parse(newText, this._getFormatPattern());

        if(date && this._isDateValid(date)) {
            this._maskValue = date;
            this._renderDisplayText(this._getDisplayedText(this._maskValue));
            this._renderDateParts();
            this._selectNextPart();
        }

        e.preventDefault();
    },

    _isDateValid(date) {
        return isDate(date) && !isNaN(date);
    },

    _isValueDirty() {
        const value = this.dateOption('value');
        return (this._maskValue && this._maskValue.getTime()) !== (value && value.getTime());
    },

    _fireChangeEvent() {
        this._clearSearchValue();

        if(this._isValueDirty()) {
            eventsEngine.trigger(this._input(), 'change');
        }
    },

    _enterHandler(e) {
        this._fireChangeEvent();
        this._selectNextPart(FORWARD);
        e.preventDefault();
    },

    _focusOutHandler(e) {
        this.callBase(e);
        if(this._useMaskBehavior() && !e.isDefaultPrevented()) {
            this._fireChangeEvent();
            this._selectFirstPart(e);
        }
    },

    _valueChangeEventHandler(e) {
        const text = this.option('text');

        if(this._useMaskBehavior()) {
            this._saveValueChangeEvent(e);
            if(!text) {
                this._maskValue = null;
            } else if(this._maskValue === null) {
                this._loadMaskValue(text);
            }
            this._saveMaskValue();
        } else {
            this.callBase(e);
        }
    },

    _optionChanged(args) {
        switch(args.name) {
            case 'useMaskBehavior':
                this._renderMask();
                break;
            case 'displayFormat':
            case 'mode':
                this.callBase(args);
                this._renderMask();
                break;
            case 'value':
                this._loadMaskValue();
                this.callBase(args);
                this._renderDateParts();
                break;
            case 'emptyDateValue':
                break;
            default:
                this.callBase(args);
        }
    },

    _clearMaskState() {
        this._clearSearchValue();
        delete this._dateParts;
        delete this._activePartIndex;
        delete this._maskValue;
    },

    reset() {
        this.callBase();
        this._clearMaskState();
        this._activePartIndex = 0;
    },

    _clean() {
        this.callBase();
        this._detachMaskEvents();
        this._clearMaskState();
    }
});

export default DateBoxMask;
