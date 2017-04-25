"use strict";

var $ = require("jquery"),
    Widget = require("../widget/ui.widget"),
    eventUtils = require("../../events/utils"),
    pointerEvents = require("../../events/pointer"),
    feedbackEvents = require("../../events/core/emitter.feedback"),
    holdEvent = require("../../events/hold");

var SPIN_CLASS = "dx-numberbox-spin",
    SPIN_BUTTON_CLASS = "dx-numberbox-spin-button",

    SPIN_HOLD_DELAY = 100,

    NUMBER_BOX = 'dxNumberBox',
    POINTERUP_EVENT_NAME = eventUtils.addNamespace(pointerEvents.up, NUMBER_BOX),
    POINTERCANCEL_EVENT_NAME = eventUtils.addNamespace(pointerEvents.cancel, NUMBER_BOX);

var SpinButton = Widget.inherit({

    _getDefaultOptions: function() {
        return $.extend(this.callBase(), {
            direction: "up",
            onChange: null,
            activeStateEnabled: true,
            hoverStateEnabled: true
        });
    },

    _render: function() {
        this.callBase();

        var $element = this.element(),
            direction = SPIN_CLASS + "-" + this.option("direction");
        var eventName = eventUtils.addNamespace(pointerEvents.down, this.NAME);

        $element
            .addClass(SPIN_BUTTON_CLASS)
            .addClass(direction)
            .off(eventName)
            .on(eventName, $.proxy(this._spinDownHandler, this));

        this._spinIcon = $("<div>").addClass(direction + "-icon").appendTo(this.element());

        this._spinChangeHandler = this._createActionByOption("onChange");
    },

    _spinDownHandler: function(e) {
        e.preventDefault();

        this._clearTimer();

        this.element().on(holdEvent.name, $.proxy(function() {
            this._feedBackDeferred = $.Deferred();
            feedbackEvents.lock(this._feedBackDeferred);
            this._spinChangeHandler({ jQueryEvent: e });
            this._holdTimer = setInterval(this._spinChangeHandler, SPIN_HOLD_DELAY, { jQueryEvent: e });
        }, this));

        $(document)
            .on(POINTERUP_EVENT_NAME, $.proxy(this._clearTimer, this))
            .on(POINTERCANCEL_EVENT_NAME, $.proxy(this._clearTimer, this));

        this._spinChangeHandler({ jQueryEvent: e });
    },

    _dispose: function() {
        this._clearTimer();
        this.callBase();
    },

    _clearTimer: function() {
        this.element().off(holdEvent.name);

        $(document)
            .off(POINTERUP_EVENT_NAME)
            .off(POINTERCANCEL_EVENT_NAME);

        if(this._feedBackDeferred) {
            this._feedBackDeferred.resolve();
        }
        if(this._holdTimer) {
            clearInterval(this._holdTimer);
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "onChange":
            case "direction":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    }
});

module.exports = SpinButton;
