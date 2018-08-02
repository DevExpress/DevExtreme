import eventsUtils from "../../events/utils";
import { isFunction } from "../../core/utils/type";
import { extend } from "../../core/utils/extend";
import { fitIntoRange } from "../../core/utils/math";
import { inRange } from "../../core/utils/math";
import eventsEngine from "../../events/core/events_engine";
import wheelEvent from "../../events/core/wheel";
import { getDatePartIndexByPosition, renderDateParts } from "./ui.date_box.mask.parts";
import dateLocalization from "../../localization/date";
import { getFormat } from "../../localization/ldml/date.format";
import DateBoxBase from "./ui.date_box.base";

const MASK_EVENT_NAMESPACE = "dateBoxMask",
    FORWARD = 1,
    BACKWARD = -1;

let DateBoxMask = DateBoxBase.inherit({

    _supportedKeys(e) {
        if(!this._useMaskBehavior() || this.option("opened") || e.altKey) {
            return this.callBase(e);
        }

        let that = this;

        return extend(this.callBase(e), {
            home: this._selectFirstPart.bind(that),
            end: this._selectLastPart.bind(that),
            escape: that._revertChanges.bind(that),
            enter: that._fireChangeEvent.bind(that),
            leftArrow: that._selectNextPart.bind(that, BACKWARD),
            rightArrow: that._selectNextPart.bind(that, FORWARD),
            upArrow: that._partIncrease.bind(that, FORWARD),
            downArrow: that._partIncrease.bind(that, BACKWARD)
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

            searchTimeout: null,
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

        if(!this._useMaskBehavior() || this.option("opened") || !this._isSingleCharKey(e)) {
            return result;
        }

        this._setNewDateIfEmpty();

        isNaN(parseInt(key)) ? this._searchString(key) : this._searchNumber(key);

        e.originalEvent.preventDefault();

        return result;
    },

    _getFormatPattern() {
        var format = this.option("displayFormat"),
            isLDMLPattern = typeof format === "string" && (format.indexOf("0") >= 0 || format.indexOf("#") >= 0);

        if(isLDMLPattern) {
            return format;
        } else {
            return getFormat(function(value) {
                return dateLocalization.format(value, format);
            });
        }
    },

    _setNewDateIfEmpty() {
        if(!this._maskValue) {
            this._maskValue = new Date();
            this._renderDateParts();
        }
    },

    _startSearchTimeout() {
        clearTimeout(this._searchTimeout);

        if(this.option("searchTimeout")) {
            this._searchTimeout = setTimeout(this._clearSearchValue.bind(this), this.option("searchTimeout"));
        }
    },

    _searchNumber(char) {
        this._searchValue += char;

        let limits = this._getActivePartLimits(),
            setter = this._getActivePartProp("setter"),
            newValue = parseInt(this._searchValue);

        if(setter === "setMonth") {
            newValue--;
        }

        if(!inRange(newValue, limits.min, limits.max)) {
            this._searchValue = char;
            newValue = parseInt(char);
            if(this.option("advanceCaret")) {
                clearTimeout(this._searchTimeout);
            }
        }

        this._setActivePartValue(newValue);
        this._startSearchTimeout();

        if(this.option("advanceCaret")) {
            if(parseInt(this._searchValue + "0") > limits.max) {
                this._selectNextPart(FORWARD);
                clearTimeout(this._searchTimeout);
            }
        }
    },

    _searchString(char) {
        let limits = this._getActivePartProp("limits")(this._maskValue),
            startString = this._searchValue + char.toLowerCase(),
            endLimit = limits.max - limits.min;

        if(endLimit > 11) {
            return;
        }

        for(let i = 0; i <= endLimit; i++) {
            this._partIncrease(1);
            if(this._getActivePartProp("text").toLowerCase().indexOf(startString) === 0) {
                this._searchValue = startString;
                this._startSearchTimeout();
                return;
            }
        }

        this._revertChanges();
    },

    _clearSearchValue() {
        clearTimeout(this._searchTimeout);
        this._searchValue = "";
    },

    _useMaskBehavior() {
        return this.option("useMaskBehavior") && this.option("mode") === "text" && this.option("displayFormat");
    },

    _renderMask() {
        this.callBase();
        this._detachMaskEvents();
        this._clearState();

        if(this._useMaskBehavior()) {
            this._activePartIndex = 0;
            this._attachMaskEvents();

            this._loadMaskValue();
            this._renderDateParts();
        }
    },

    _renderDateParts() {
        if(!this._useMaskBehavior()) {
            return;
        }

        const text = this.option("text") || this._getDisplayedText(this._maskValue);

        if(text) {
            this._dateParts = renderDateParts(text, this._getFormatPattern());
            this._selectNextPart(0);
        }
    },

    _detachMaskEvents() {
        eventsEngine.off(this._input(), "." + MASK_EVENT_NAMESPACE);
    },

    _attachMaskEvents() {
        eventsEngine.on(this._input(), eventsUtils.addNamespace("dxclick", MASK_EVENT_NAMESPACE), this._maskClickHandler.bind(this));
        eventsEngine.on(this._input(), eventsUtils.addNamespace(wheelEvent.name, MASK_EVENT_NAMESPACE), this._mouseWheelHandler.bind(this));
    },

    _selectLastPart(e) {
        this._activePartIndex = this._dateParts.length;
        this._selectNextPart(BACKWARD, e);
    },

    _selectFirstPart(e) {
        this._activePartIndex = -1;
        this._selectNextPart(FORWARD, e);
    },

    _mouseWheelHandler(e) {
        this._partIncrease(e.delta > 0 ? FORWARD : BACKWARD, e);
    },

    _selectNextPart(step, e) {
        let index = fitIntoRange(this._activePartIndex + step, 0, this._dateParts.length - 1);
        if(this._dateParts[index].isStub) {
            this._selectNextPart(step >= 0 ? step + 1 : step - 1, e);
            return;
        }

        this._activePartIndex = index;
        this._caret(this._getActivePartProp("caret"));
        if(step !== 0) {
            this._clearSearchValue();
        }
        e && e.preventDefault();
    },

    _getActivePartLimits() {
        const limitFunction = this._getActivePartProp("limits");
        return limitFunction(this._maskValue);
    },

    _getActivePartValue() {
        const getter = this._getActivePartProp("getter");
        return isFunction(getter) ? getter(this._maskValue) : this._maskValue[getter]();
    },

    _setActivePartValue(value) {
        const setter = this._getActivePartProp("setter"),
            limits = this._getActivePartLimits();

        value = fitIntoRange(value, limits.min, limits.max);

        isFunction(setter) ? setter(this._maskValue, value) : this._maskValue[setter](value);
        this._renderDisplayText(this._getDisplayedText(this._maskValue));

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

    _partIncrease(step, e) {
        this._setNewDateIfEmpty();

        let limits = this._getActivePartLimits(),
            newValue = step + this._getActivePartValue();

        newValue = newValue > limits.max ? limits.min : newValue;
        newValue = newValue < limits.min ? limits.max : newValue;

        this._setActivePartValue(newValue);
        e && e.preventDefault();
    },

    _maskClickHandler() {
        if(this.option("text")) {
            this._activePartIndex = getDatePartIndexByPosition(this._dateParts, this._caret().start);
            this._caret(this._getActivePartProp("caret"));
        }
    },

    _isValueDirty() {
        const value = this.dateOption("value");
        return (this._maskValue && this._maskValue.getTime()) !== (value && value.getTime());
    },

    _fireChangeEvent() {
        if(this._isValueDirty()) {
            eventsEngine.trigger(this._input(), "change");
        }
    },

    _focusInHandler(e) {
        this.callBase(e);

        if(this._useMaskBehavior()) {
            const caret = this._getActivePartProp("caret");
            caret && this._caret(caret);
        }
    },

    _focusOutHandler(e) {
        this.callBase(e);
        if(this._useMaskBehavior()) {
            this._fireChangeEvent();
        }
    },

    _valueChangeEventHandler(e) {
        if(this._useMaskBehavior()) {
            this._saveValueChangeEvent(e);
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
            case "searchTimeout":
                clearTimeout(this._searchTimeout);
                break;
            case "advanceCaret":
                break;
            default:
                this.callBase(args);
        }
    },

    _clearState() {
        this._clearSearchValue();
        delete this._dateParts;
        delete this._activePartIndex;
        delete this._maskValue;
    },

    reset() {
        this.callBase();
        this._clearState();
        this._activePartIndex = 0;
    },

    _clean() {
        this.callBase();
        this._detachMaskEvents();
        this._clearState();
    }
});

module.exports = DateBoxMask;
