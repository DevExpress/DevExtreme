"use strict";

var $ = require("./renderer");
var dataUtilsStrategy = require("./element_data").getDataStrategy();
var eventsEngine = require("../events/core/events_engine");
var registerEvent = require("../events/core/event_registrator");
var cleanData = dataUtilsStrategy.cleanData;

var eventName = "dxremove";
var eventPropName = "dxRemoveEvent";

dataUtilsStrategy.cleanData = function(elements) {
    elements = [].slice.call(elements);
    for(var i = 0; i < elements.length; i++) {
        var $element = $(elements[i]);
        if($element.prop(eventPropName)) {
            $element[0][eventPropName] = null;
            eventsEngine.triggerHandler($element, eventName);
        }
        eventsEngine.off($element);
    }

    return cleanData(elements);
};

registerEvent(eventName, {
    noBubble: true,
    setup: function(element) {
        $(element).prop(eventPropName, true);
    }
});

module.exports = eventName;
