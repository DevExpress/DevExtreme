var jQuery = require("jquery");
var eventsEngine = require("../../events/core/events_engine");
var useJQuery = require("./use_jquery")();
var registerEventCallbacks = require("../../events/core/event_registrator_callbacks");

if(useJQuery) {
    registerEventCallbacks.add(function(name, eventObject) {
        jQuery.event.special[name] = eventObject;
    });

    eventsEngine.set({
        on: function(element) {
            jQuery(element).on.apply(jQuery(element), Array.prototype.slice.call(arguments, 1));
        },
        one: function(element) {
            jQuery(element).one.apply(jQuery(element), Array.prototype.slice.call(arguments, 1));
        },
        off: function(element) {
            jQuery(element).off.apply(jQuery(element), Array.prototype.slice.call(arguments, 1));
        },
        trigger: function(element) {
            jQuery(element).trigger.apply(jQuery(element), Array.prototype.slice.call(arguments, 1));
        },
        triggerHandler: function(element) {
            jQuery(element).triggerHandler.apply(jQuery(element), Array.prototype.slice.call(arguments, 1));
        },
        Event: jQuery.Event
    });
}
