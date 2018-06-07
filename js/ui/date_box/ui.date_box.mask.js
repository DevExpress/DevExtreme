"use strict";

var MASK_EVENT_NAMESPACE = "dateBoxMask";

var eventsUtils = require("../../events/utils"),
    extend = require("../../core/utils/extend").extend,
    eventsEngine = require("../../events/core/events_engine"),
    dateParts = require("./ui.date_box.mask.parts"),
    DateBoxBase = require("./ui.date_box.base");

var DateBoxMask = DateBoxBase.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            useMaskBehavior: false
        });
    },

    _render: function() {
        this.callBase();

        if(this.option("useMaskBehavior")) {
            this._detachMaskEvents();
            this._attachMaskEvents();
        }
    },

    _detachMaskEvents: function() {
        eventsEngine.off(this._input(), "." + MASK_EVENT_NAMESPACE);
    },

    _attachMaskEvents: function() {
        eventsEngine.on(this._input(), eventsUtils.addNamespace("click", MASK_EVENT_NAMESPACE), this._maskClickHandler.bind(this));
    },

    _maskClickHandler: function() {
        var selection = dateParts.getSelectionByPosition(this.option("text"), this.option("displayFormat"), this._caret().start);
        this._caret(selection);
    }
});

module.exports = DateBoxMask;
