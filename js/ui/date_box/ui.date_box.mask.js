import eventsUtils from "../../events/utils";
import { isFunction } from "../../core/utils/type";
import { clipboardText } from "../../core/utils/dom";
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
        if(!this._useMaskBehavior() || this.option("opened") || (e && e.altKey)) {
            return this.callBase(e);
        }

        let that = this;

        return extend(this.callBase(e), {
            del: that._revertPart.bind(that, FORWARD),
            backspace: that._revertPart.bind(that, BACKWARD),
            home: that._selectFirstPart.bind(that),
            end: that._selectLastPart.bind(that),
            escape: that._revertChanges.bind(that),
            enter: that._enterHandler.bind(that),
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

            /**
             * @name dxDateBoxOptions.dateComponentAccessors
             * @type object
             * @default null
             */
            dateComponentAccessors: null,

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

        this._setNewDateIfEmpty();

        isNaN(parseInt(key)) ? this._searchString(key, e.originalEvent) : this._searchNumber(key, e.originalEvent);

        e.originalEvent.preventDefault();

        return result;
    },

    _getFormatPattern() {
        var format = this._strategy.getDisplayFormat(this.option("displayFormat")),
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

    _searchNumber(char, e) {
        this._searchValue += char;

        let limits = this._getActivePartLimits(),
            getter = this._getActivePartProp("getter"),
            newValue = parseInt(this._searchValue);

        if(getter === "getMonth") {
            newValue--;
        }

        if(!inRange(newValue, limits.min, limits.max)) {
            this._searchValue = char;
            newValue = parseInt(char);
        }

        this._setActivePartValue(newValue, e);

        if(this.option("advanceCaret")) {
            if(parseInt(this._searchValue + "0") > limits.max) {
                this._selectNextPart(FORWARD);
            }
        }
    },

    _searchString(char, e) {
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

        this._revertPart(0, e);

        if(this._searchValue) {
            this._clearSearchValue();
            this._searchString(char, e);
        }
    },

    _clearSearchValue() {
        this._searchValue = "";
    },

    _revertPart: function(direction, e) {
        const value = this.dateOption("value");
        const caret = this._caret();
        const isAllSelected = caret.end - caret.start === this.option("text").length;

        if(!isAllSelected) {
            if(value) {
                const actual = this._getActivePartValue(value);
                this._setActivePartValue(actual, e);
            }

            this._selectNextPart(direction, e);
        }
    },

    _useMaskBehavior() {
        return this.option("useMaskBehavior") && this.option("mode") === "text";
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
            this._dateParts = renderDateParts(text, this._getFormatPattern(), this.option("dateComponentAccessors"));
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
        eventsEngine.on(this._input(), eventsUtils.addNamespace(wheelEvent.name, MASK_EVENT_NAMESPACE), this._mouseWheelHandler.bind(this));
    },

    _selectLastPart(e) {
        if(this.option("text")) {
            this._activePartIndex = this._dateParts.length;
            this._selectNextPart(BACKWARD, e);
        }
    },

    _selectFirstPart(e) {
        if(this.option("text")) {
            this._activePartIndex = -1;
            this._selectNextPart(FORWARD, e);
        }
    },

    _mouseWheelHandler(e) {
        this._partIncrease(e.delta > 0 ? FORWARD : BACKWARD, e);
    },

    _selectNextPart(step, e) {
        if(!this.option("text")) {
            return;
        }

        let index = fitIntoRange(this._activePartIndex + step, 0, this._dateParts.length - 1);
        if(this._dateParts[index].isStub) {
            let isBoundaryIndex = index === 0 && step < 0 || index === this._dateParts.length - 1 && step > 0;
            if(!isBoundaryIndex) {
                this._selectNextPart(step >= 0 ? step + 1 : step - 1, e);
                return;
            } else {
                index = this._activePartIndex;
            }
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

    _getActivePartValue(dateValue) {
        dateValue = dateValue || this._maskValue;
        const getter = this._getActivePartProp("getter");
        return isFunction(getter) ? getter(dateValue) : dateValue[getter]();
    },

    _setActivePartValue(value, e) {
        const dateValue = this._maskValue;
        const setter = this._getActivePartProp("setter"),
            limits = this._getActivePartLimits();

        value = fitIntoRange(value, limits.min, limits.max);

        isFunction(setter) ? setter(dateValue, value, e) : dateValue[setter](value);
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

    _partIncrease(step, e) {
        this._setNewDateIfEmpty();

        let limits = this._getActivePartLimits(),
            newValue = step + this._getActivePartValue();

        newValue = newValue > limits.max ? limits.min : newValue;
        newValue = newValue < limits.min ? limits.max : newValue;

        this._setActivePartValue(newValue, e);
        e && e.preventDefault();
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
            this._selectNextPart(0, e);
        } else {
            e.preventDefault();
        }
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
            case "dateComponentGetters":
            case "dateComponentAccessors":
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
