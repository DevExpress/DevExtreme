"use strict";

var MASK_EVENT_NAMESPACE = "dateBoxMask",
    FORWARD = 1,
    BACKWARD = -1;

var eventsUtils = require("../../events/utils"),
    isFunction = require("../../core/utils/type").isFunction,
    extend = require("../../core/utils/extend").extend,
    fitIntoRange = require("../../core/utils/math").fitIntoRange,
    eventsEngine = require("../../events/core/events_engine"),
    wheelEvent = require("../../events/core/wheel"),
    dateParts = require("./ui.date_box.mask.parts"),
    DateBoxBase = require("./ui.date_box.base");

var DateBoxMask = DateBoxBase.inherit({

    _supportedKeys: function() {
        if(!this._useMaskBehavior()) {
            return this.callBase();
        }

        var that = this;

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

    _useMaskBehavior: function() {
        return this.option("useMaskBehavior") && this.option("mode") === "text" && this.option("displayFormat");
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            useMaskBehavior: false
        });
    },

    _renderMask: function() {
        this.callBase();
        this._clearState();

        if(this._useMaskBehavior()) {
            this._activePartIndex = 0;
            this._attachMaskEvents();
            this._renderDateParts();
            this._maskValue = new Date(this.dateOption("value"));
        }
    },

    _renderDateParts: function() {
        this._dateParts = dateParts.renderDateParts(this.option("text"), this.option("displayFormat"));
        this._selectNextPart(0);
    },

    _detachMaskEvents: function() {
        eventsEngine.off(this._input(), "." + MASK_EVENT_NAMESPACE);
    },

    _attachMaskEvents: function() {
        eventsEngine.on(this._input(), eventsUtils.addNamespace("dxclick", MASK_EVENT_NAMESPACE), this._maskClickHandler.bind(this));
        eventsEngine.on(this._input(), eventsUtils.addNamespace(wheelEvent.name, MASK_EVENT_NAMESPACE), this._mouseWheelHandler.bind(this));
    },

    _selectLastPart: function(e) {
        this._activePartIndex = this._dateParts.length;
        this._selectNextPart(BACKWARD, e);
    },

    _selectFirstPart: function(e) {
        this._activePartIndex = -1;
        this._selectNextPart(FORWARD, e);
    },

    _mouseWheelHandler: function(e) {
        var direction = e.delta > 0 ? FORWARD : BACKWARD;
        this._partIncrease(direction, e);
    },

    _selectNextPart: function(step, e) {
        var index = fitIntoRange(this._activePartIndex + step, 0, this._dateParts.length - 1);
        if(this._dateParts[index].isStub) {
            this._selectNextPart(step >= 0 ? step + 1 : step - 1, e);
            return;
        }

        this._activePartIndex = index;
        this._caret(this._getActivePartProp("caret"));
        e && e.preventDefault();
    },

    _getActivePartProp: function(property) {
        if(!this._dateParts || !this._dateParts[this._activePartIndex]) {
            return undefined;
        }

        return this._dateParts[this._activePartIndex][property];
    },

    _revertChanges: function() {
        this._maskValue = this.dateOption("value");
        this._renderDisplayText(this._getDisplayedText(this._maskValue));
        this._renderDateParts();
    },

    _renderDisplayText: function(text) {
        this.callBase(text);
        if(this._useMaskBehavior()) {
            this.option("text", text);
        }
    },

    _partIncrease: function(step, e) {
        var getter = this._getActivePartProp("getter"),
            setter = this._getActivePartProp("setter"),
            newValue = step + (isFunction(getter) ? getter(this._maskValue) : this._maskValue[getter]()),
            limits = this._getActivePartProp("limits")(this._maskValue);

        newValue = newValue > limits.max ? limits.min : newValue;
        newValue = newValue < limits.min ? limits.max : newValue;

        isFunction(setter) ? setter(this._maskValue, newValue) : this._maskValue[setter](newValue);
        this._renderDisplayText(this._getDisplayedText(this._maskValue));

        this._renderDateParts();
        e && e.preventDefault();
    },

    _maskClickHandler: function() {
        this._activePartIndex = dateParts.getDatePartIndexByPosition(this._dateParts, this._caret().start);
        this._caret(this._getActivePartProp("caret"));
    },

    _isValueDirty: function() {
        var value = this.dateOption("value");
        return this._maskValue.getTime() !== value.getTime();
    },

    _fireChangeEvent: function() {
        if(this._isValueDirty()) {
            eventsEngine.trigger(this._input(), "change");
        }
    },

    _focusInHandler: function(e) {
        this.callBase(e);
        if(this._useMaskBehavior()) {
            var caret = this._getActivePartProp("caret");
            caret && this._caret(caret);
        }
    },

    _focusOutHandler: function(e) {
        this.callBase(e);
        if(this._useMaskBehavior()) {
            this._fireChangeEvent();
        }
    },

    _valueChangeEventHandler: function(e) {
        this.callBase(e);
        if(this._useMaskBehavior()) {
            this.option("value", this._maskValue);
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "useMaskBehavior":
                this._clearState();
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

    _clearState: function() {
        this._detachMaskEvents();
        delete this._dateParts;
        delete this._activePartIndex;
        delete this._maskValue;
    },

    _clean: function() {
        this.callBase();
        this._clearState();
    }
});

module.exports = DateBoxMask;
