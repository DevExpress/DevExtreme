"use strict";

var $ = require("jquery"),
    cleanData = $.cleanData,
    specialEvents = $.event.special;

var eventName = "dxremove",
    eventPropName = "dxRemoveEvent";

$.cleanData = function(elements) {
    elements = [].slice.call(elements);
    for(var i = 0; i < elements.length; i++) {
        var $element = $(elements[i]);
        if($element.prop(eventPropName)) {
            $element.removeProp(eventPropName);
            $element.triggerHandler(eventName);
        }
    }

    return cleanData(elements);
};

specialEvents[eventName] = {
    noBubble: true,
    setup: function() {
        $(this).prop(eventPropName, true);
    }
};

module.exports = eventName;
