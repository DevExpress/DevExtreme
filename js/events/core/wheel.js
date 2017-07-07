"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    registerEvent = require("./event_registrator"),
    eventUtils = require("../utils");

var EVENT_NAME = "dxmousewheel",
    EVENT_NAMESPACE = "dxWheel";

var wheelEvent = document["onwheel"] !== undefined ? "wheel" : "mousewheel";

var wheel = {

    setup: function(element) {
        var $element = $(element);
        eventsEngine.on($element, eventUtils.addNamespace(wheelEvent, EVENT_NAMESPACE), wheel._wheelHandler.bind(wheel));
    },

    teardown: function(element) {
        var $element = $(element);
        $element.off("." + EVENT_NAMESPACE);
    },

    _wheelHandler: function(e) {
        var delta = this._getWheelDelta(e.originalEvent);

        eventUtils.fireEvent({
            type: EVENT_NAME,
            originalEvent: e,
            delta: delta,
            pointerType: "mouse"
        });

        e.stopPropagation();
    },

    _getWheelDelta: function(event) {
        return event.wheelDelta
            ? event.wheelDelta
            : -event.deltaY * 30;
    }

};

registerEvent(EVENT_NAME, wheel);

exports.name = EVENT_NAME;
