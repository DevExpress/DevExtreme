"use strict";

var $ = require("../core/renderer"),
    jQuery = require("jquery"),
    cleanData = jQuery.cleanData,
    specialEvents = $.event.special;

var eventName = "dxremove",
    eventPropName = "dxRemoveEvent";

jQuery.cleanData = function(elements) {
    elements = [].slice.call(elements);
    for(var i = 0; i < elements.length; i++) {
        var $element = $(elements[i]);
        if($element.prop(eventPropName)) {
            $element[0][eventPropName] = null;
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
