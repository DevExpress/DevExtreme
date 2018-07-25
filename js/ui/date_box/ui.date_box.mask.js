"use strict";

import eventsUtils from "../../events/utils";
import { isFunction } from "../../core/utils/type";
import { extend } from "../../core/utils/extend";
import { fitIntoRange } from "../../core/utils/math";
import { inRange } from "../../core/utils/math";
import eventsEngine from "../../events/core/events_engine";
import wheelEvent from "../../events/core/wheel";
import { getDatePartIndexByPosition, renderDateParts } from "./ui.date_box.mask.parts";
import DateBoxBase from "./ui.date_box.base";

const MASK_EVENT_NAMESPACE = "dateBoxMask",
    FORWARD = 1,
    BACKWARD = -1,
    SEARCH_TIMEOUT = 1500;

let DateBoxMask = DateBoxBase.inherit({

    _supportedKeys() {
        if(!this._useMaskBehavior()) {
            return this.callBase();
        }

        let that = this;

        return extend(this.callBase(), {
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

    _setNewDateIfEmpty() {
        if(!this._maskValue) {
            this._maskValue = new Date();
            this._renderDateParts();
        }
    },

    _startSearchTimeout() {
        clearTimeout(this._searchTimeout);
        this._searchTimeout = setTimeout(this._clearSearchValue.bind(this), SEARCH_TIMEOUT);
    },

    _searchNumber(char) {
        this._searchValue += char;

        var limits = this._getActivePartLimits(),
            setter = this._getActivePartProp("setter"),
            newValue = parseInt(this._searchValue);

        if(setter === "setMonth") {
            newValue--;
        }

        if(!inRange(newValue, limits.min, limits.max)) {
            this._searchValue = char;
            newValue = parseInt(char);
        }

        this._setActivePartValue(newValue);
        this._startSearchTimeout();
    },

    _searchString(char) {
        let limits = this._getActivePartProp("limits")(this._maskValue),
            startString = this._searchValue + char.toLowerCase(),
            endLimit = limits.max - limits.min;

        if(endLimit === Infinity) {
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

    _getDefaultOptions() {
        return extend(this.callBase(), {
            useMaskBehavior: false
        });
    },

    _renderMask() {
        this.callBase();
        this._detachMaskEvents();
        this._clearState();

        if(this._useMaskBehavior()) {
            this._activePartIndex = 0;
            this._attachMaskEvents();

            const value = this.dateOption("value");
            this._maskValue = value && new Date(value);
            this._renderDateParts();
        }
    },

    _renderDateParts() {
        const text = this.option("text") || this._getDisplayedText(this._maskValue);

        if(text) {
            this._dateParts = renderDateParts(text, this.option("displayFormat"));
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
        var index = fitIntoRange(this._activePartIndex + step, 0, this._dateParts.length - 1);
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

    _revertChanges() {
        this._maskValue = this.dateOption("value");
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

        var limits = this._getActivePartLimits(),
            newValue = step + this._getActivePartValue();

        newValue = newValue > limits.max ? limits.min : newValue;
        newValue = newValue < limits.min ? limits.max : newValue;

        this._setActivePartValue(newValue);
        e && e.preventDefault();
    },

    _maskClickHandler() {
        this._setNewDateIfEmpty();
        this._activePartIndex = getDatePartIndexByPosition(this._dateParts, this._caret().start);
        this._caret(this._getActivePartProp("caret"));
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
        this.callBase(e);
        if(this._useMaskBehavior()) {
            this.option("value", this._maskValue);
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
    },

    _clean() {
        this.callBase();
        this._detachMaskEvents();
        this._clearState();
    }
});

module.exports = DateBoxMask;
