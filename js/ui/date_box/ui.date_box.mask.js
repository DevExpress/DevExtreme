"use strict";

var MASK_EVENT_NAMESPACE = "dateBoxMask";

var eventsUtils = require("../../events/utils"),
    extend = require("../../core/utils/extend").extend,
    fitIntoRange = require("../../core/utils/math").fitIntoRange,
    eventsEngine = require("../../events/core/events_engine"),
    dateParts = require("./ui.date_box.mask.parts"),
    DateBoxBase = require("./ui.date_box.base");

var DateBoxMask = DateBoxBase.inherit({

    _supportedKeys: function() {
        if(!this.option("useMaskBehavior")) {
            return this.callBase();
        }

        var that = this;

        return extend(this.callBase(), {
            leftArrow: that._prevPart.bind(that),
            rightArrow: that._nextPart.bind(that),
            upArrow: that._incrementPart.bind(that),
            downArrow: that._decrementPart.bind(that)
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            useMaskBehavior: false
        });
    },

    _renderMask: function() {
        this.callBase();
        this._detachMaskEvents();

        if(this.option("useMaskBehavior")) {
            this._attachMaskEvents();
            this._renderDateParts();
            this._activePartIndex = 0;
            this._maskValue = this.dateOption("value");
        }
    },

    _renderDateParts: function() {
        this._dateParts = dateParts.renderDateParts(this.option("text"), this.option("displayFormat"));
        var caret = this._getActivePartProp("caret");
        caret && this._caret(caret);
    },

    _detachMaskEvents: function() {
        eventsEngine.off(this._input(), "." + MASK_EVENT_NAMESPACE);
    },

    _attachMaskEvents: function() {
        eventsEngine.on(this._input(), eventsUtils.addNamespace("click", MASK_EVENT_NAMESPACE), this._maskClickHandler.bind(this));
    },

    _toggleActivePart: function(step) {
        var index = fitIntoRange(this._activePartIndex + step, 0, this._dateParts.length - 1);
        if(this._dateParts[index].isStub) {
            this._toggleActivePart(step < 0 ? step - 1 : step + 1);
            return;
        }

        this._activePartIndex = index;
        this._caret(this._getActivePartProp("caret"));
    },

    _getActivePartProp: function(property) {
        if(!this._dateParts || !this._dateParts[this._activePartIndex]) {
            return undefined;
        }

        return this._dateParts[this._activePartIndex][property];
    },

    _partIncrease: function(step) {
        var getter = this._getActivePartProp("getter"),
            setter = this._getActivePartProp("setter"),
            newValue = this._maskValue[getter]() + step;

        this._maskValue[setter](newValue);

        // console.log(this._maskValue);
        // console.log(this.option("value"));
        // todo: update text in the input and rerender date parts here
    },

    _maskClickHandler: function() {
        this._activePartIndex = dateParts.getDatePartIndexByPosition(this._dateParts, this._caret().start);
        this._caret(this._getActivePartProp("caret"));
    },

    _nextPart: function(e) {
        this._toggleActivePart(1);
        e && e.preventDefault();
    },

    _prevPart: function(e) {
        this._toggleActivePart(-1);
        e && e.preventDefault();
    },

    _incrementPart: function(e) {
        this._partIncrease(1);
        e && e.preventDefault();
    },

    _decrementPart: function(e) {
        this._partIncrease(-1);
        e && e.preventDefault();
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "useMaskBehavior":
                this._renderMask();
                break;
            default:
                this.callBase(args);
        }
    },

    _clean: function() {
        this.callBase();
        delete this._dateParts;
        delete this._activePartIndex;
        delete this._maskValue;
    }
});

module.exports = DateBoxMask;
