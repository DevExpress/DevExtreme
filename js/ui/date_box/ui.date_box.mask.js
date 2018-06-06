"use strict";

var eventsUtils = require("../../events/utils"),
    extend = require("../../core/utils/extend").extend,
    eventsEngine = require("../../events/core/events_engine"),
    // formatter = require("../../core/utils/date_serialization").serializeDate,
    DateBoxBase = require("./ui.date_box.base");

var DateBoxMask = DateBoxBase.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            useMaskBehavior: true
        });
    },

    _render: function() {
        this.callBase();

        if(this.option("useMaskBehavior")) {
            this._attachMaskEvents();
        }
    },

    _attachMaskEvents: function() {
        eventsEngine.on(this.element(), eventsUtils.addNamespace("click", this.NAME), this._maskClickHandler.bind(this));
    },

    _maskClickHandler: function(e) {

    }
});

module.exports = DateBoxMask;
