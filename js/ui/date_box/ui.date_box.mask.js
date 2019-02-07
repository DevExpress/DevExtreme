import eventsUtils from "../../events/utils";
import { isFunction } from "../../core/utils/type";
import { clipboardText } from "../../core/utils/dom";
import { extend } from "../../core/utils/extend";
import { fitIntoRange } from "../../core/utils/math";
import { inRange } from "../../core/utils/math";
import eventsEngine from "../../events/core/events_engine";
import { getDatePartIndexByPosition, renderDateParts } from "./ui.date_box.mask.parts";
import dateLocalization from "../../localization/date";
import { getRegExpInfo } from "../../localization/ldml/date.parser";
import { getFormat } from "../../localization/ldml/date.format";
import DateBoxBase from "./ui.date_box.base";

const MASK_EVENT_NAMESPACE = "dateBoxMask",
    FORWARD = 1,
    BACKWARD = -1;

let DateBoxMask = DateBoxBase.inherit({

    _supportedKeys(e) {
        if(!this._useMaskBehavior() || this.option("opened") || (e && e.altKey)) {
            return this.callBase(e);
        }

        return extend(this.callBase(e), {
            del: (e) => {
                this._revertPart(FORWARD);
                this._isAllSelected() || e.preventDefault();
            },
            backspace: (e) => {
                this._revertPart(BACKWARD);
                this._isAllSelected() || e.preventDefault();
            },
            home: (e) => {
                this._selectFirstPart();
                e.preventDefault();
            },
            end: (e) => {
                this._selectLastPart();
                e.preventDefault();
            },
            escape: (e) => {
                this._revertChanges();
                e.preventDefault();
            },
            enter: this._enterHandler,
            leftArrow: (e) => {
                this._selectNextPart(BACKWARD);
                e.preventDefault();
            },
            rightArrow: (e) => {
                this._selectNextPart(FORWARD);
                e.preventDefault();
            },
            upArrow: (e) => {
                this._partIncrease(FORWARD);
                e.preventDefault();
            },
            downArrow: (e) => {
                this._partIncrease(BACKWARD);
                e.preventDefault();
            },
        });
    },

    _getDefaultOptions() {
        return extend(this.callBase(), {

            /**
             * @name dxDateBoxOptions.useMaskBehavior
             * @type boolean
             * @default false
             */
            useMaskBehavior: false,

            emptyDateValue: new Date(2000, 0, 1, 0, 0, 0),
            advanceCaret: true
        });
    },

    _isSingleCharKey(e) {
        const key = e.originalEvent.key;
        return typeof key === "string" && key.length === 1 && !e.ctrl && !e.alt;
    },

    _keyboardHandler(e) {
        const key = e.originalEvent.key;

        let result = this.callBase(e);

        if(!this._useMaskBehavior() || !this._isSingleCharKey(e)) {
            return result;
        }

        if(this._isAllSelected()) {
            this._activePartIndex = 0;
        }

        this._setNewDateIfEmpty();

        isNaN(parseInt(key)) ? this._searchString(key) : this._searchNumber(key);

        e.originalEvent.preventDefault();

        return result;
    },

    _isAllSelected() {
        const caret = this._caret();

        return caret.end - caret.start === this.option("text").length;
    },

    _getFormatPattern() {
        if(this._formatPattern) {
            return this._formatPattern;
        }

        var format = this._strategy.getDisplayFormat(this.option("displayFormat")),
            isLDMLPattern = typeof format === "string" && (format.indexOf("0") >= 0 || format.indexOf("#") >= 0);

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
            this._maskValue = new Date();
            this._renderDateParts();
        }
    },

    _searchNumber(char) {
        let limits = this._getActivePartLimits(),
            maxSearchLength = String(limits.max).length;

        this._searchValue = (this._searchValue + char).substr(-maxSearchLength);

        this._setActivePartValue(this._searchValue);

        if(this.option("advanceCaret")) {
            const isLengthExceeded = this._searchValue.length === maxSearchLength;
            const isValueOverflowed = parseInt(this._searchValue + "0") > limits.max;

            if(isLengthExceeded || isValueOverflowed) {
                this._selectNextPart(FORWARD);
            }
        }
    },

    _searchString(char) {
        if(!isNaN(parseInt(this._getActivePartProp("text")))) {
            return;
        }

        let limits = this._getActivePartProp("limits")(this._maskValue),
            startString = this._searchValue + char.toLowerCase(),
            endLimit = limits.max - limits.min;

        for(let i = 0; i <= endLimit; i++) {
            this._partIncrease(1);
            if(this._getActivePartProp("text").toLowerCase().indexOf(startString) === 0) {
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
        this._searchValue = "";
    },

    _revertPart: function(direction) {
        if(!this._isAllSelected()) {
            const actual = this._getActivePartValue(this.option("emptyDateValue"));
            this._setActivePartValue(actual);

            this._selectNextPart(direction);
        }
        this._clearSearchValue();
    },

    _useMaskBehavior() {
        return this.option("useMaskBehavior") && this.option("mode") === "text";
    },

    _initMaskState() {
        this._activePartIndex = 0;
        this._formatPattern = null;
        this._regExpInfo = getRegExpInfo(this._getFormatPattern(), dateLocalization);
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

        const text = this.option("text") || this._getDisplayedText(this._maskValue);

        if(text) {
            this._dateParts = renderDateParts(text, this._regExpInfo);
            this._selectNextPart(0);
        }
    },

    _detachMaskEvents() {
        eventsEngine.off(this._input(), "." + MASK_EVENT_NAMESPACE);
    },

    _attachMaskEvents() {
        eventsEngine.on(this._input(), eventsUtils.addNamespace("dxclick", MASK_EVENT_NAMESPACE), this._maskClickHandler.bind(this));
        eventsEngine.on(this._input(), eventsUtils.addNamespace("paste", MASK_EVENT_NAMESPACE), this._maskPasteHandler.bind(this));
        eventsEngine.on(this._input(), eventsUtils.addNamespace("drop", MASK_EVENT_NAMESPACE), (e) => {
            this._renderDisplayText(this._getDisplayedText(this._maskValue));
            this._selectNextPart(0, e);
        });
    },

    _selectLastPart() {
        if(this.option("text")) {
            this._activePartIndex = this._dateParts.length;
            this._selectNextPart(BACKWARD);
        }
    },

    _selectFirstPart() {
        if(this.option("text")) {
            this._activePartIndex = -1;
            this._selectNextPart(FORWARD);
        }
    },

    _onMouseWheel(e) {
        if(this._useMaskBehavior()) {
            this._partIncrease(e.delta > 0 ? FORWARD : BACKWARD, e);
        }
    },

    _selectNextPart(step) {
        if(!this.option("text")) {
            return;
        }

        let index = fitIntoRange(this._activePartIndex + step, 0, this._dateParts.length - 1);
        if(this._dateParts[index].isStub) {
            let isBoundaryIndex = index === 0 && step < 0 || index === this._dateParts.length - 1 && step > 0;
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
        this._caret(this._getActivePartProp("caret"));
    },

    _getActivePartLimits() {
        const limitFunction = this._getActivePartProp("limits");
        return limitFunction(this._maskValue);
    },

    _getActivePartValue(dateValue) {
        dateValue = dateValue || this._maskValue;
        const getter = this._getActivePartProp("getter");
        return isFunction(getter) ? getter(dateValue) : dateValue[getter]();
    },

    _addLeadingZeroes(value) {
        const zeroes = this._searchValue.match(/^0+/),
            limits = this._getActivePartLimits(),
            maxLimitLength = String(limits.max).length;

        return ((zeroes && zeroes[0] || "") + String(value)).substr(-maxLimitLength);
    },

    _setActivePartValue(value, dateValue) {
        dateValue = dateValue || this._maskValue;
        const setter = this._getActivePartProp("setter"),
            limits = this._getActivePartLimits();

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

    _loadMaskValue() {
        const value = this.dateOption("value");
        this._maskValue = value && new Date(value);
    },

    _saveMaskValue() {
        const value = this._maskValue && new Date(this._maskValue);
        this.dateOption("value", value);
    },

    _revertChanges() {
        this._loadMaskValue();
        this._renderDisplayText(this._getDisplayedText(this._maskValue));
        this._renderDateParts();
    },

    _renderDisplayText(text) {
        this.callBase(text);
        if(this._useMaskBehavior()) {
            this.option("text", text);
        }
    },

    _partIncrease(step) {
        this._setNewDateIfEmpty();

        let limits = this._getActivePartLimits(),
            newValue = step + this._getActivePartValue();

        newValue = newValue > limits.max ? limits.min : newValue;
        newValue = newValue < limits.min ? limits.max : newValue;

        this._setActivePartValue(newValue);
    },

    _maskClickHandler() {
        if(this.option("text")) {
            this._activePartIndex = getDatePartIndexByPosition(this._dateParts, this._caret().start);
            this._caret(this._getActivePartProp("caret"));
        }
    },

    _maskPasteHandler(e) {
        let newText = this._replaceSelectedText(this.option("text"), this._caret(), clipboardText(e));
        let date = dateLocalization.parse(newText, this._getFormatPattern());

        if(date) {
            this._renderDateParts();
            this._maskValue = date;
            this._renderDisplayText(this._getDisplayedText(this._maskValue));
            this._selectNextPart(0);
        }

        e.preventDefault();
    },

    _isValueDirty() {
        const value = this.dateOption("value");
        return (this._maskValue && this._maskValue.getTime()) !== (value && value.getTime());
    },

    _fireChangeEvent() {
        this._clearSearchValue();

        if(this._isValueDirty()) {
            eventsEngine.trigger(this._input(), "change");
        }
    },

    _enterHandler(e) {
        this._fireChangeEvent();
        this._selectNextPart(FORWARD, e);
        e.preventDefault();
    },

    _focusOutHandler(e) {
        this.callBase(e);
        if(this._useMaskBehavior()) {
            this._fireChangeEvent();
            this._selectFirstPart(e);
        }
    },

    _valueChangeEventHandler(e) {
        if(this._useMaskBehavior()) {
            this._saveValueChangeEvent(e);
            if(!this.option("text")) {
                this._maskValue = null;
            }
            this._saveMaskValue();
        } else {
            this.callBase(e);
        }
    },

    _optionChanged(args) {
        switch(args.name) {
            case "useMaskBehavior":
                this._renderMask();
                break;
            case "displayFormat":
            case "mode":
                this.callBase(args);
                this._renderMask();
                break;
            case "value":
                this._loadMaskValue();
                this.callBase(args);
                this._renderDateParts();
                break;
            case "advanceCaret":
            case "emptyDateValue":
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

module.exports = DateBoxMask;
