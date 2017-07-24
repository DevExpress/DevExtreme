"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    ko = require("knockout"),
    isPlainObject = require("../../core/utils/type").isPlainObject,
    eventRegistrator = require("../../events/core/event_registrator"),
    eventUtils = require("../../events/utils");

eventRegistrator.callbacks.add(function(name) {
    var koBindingEventName = eventUtils.addNamespace(name, name + "Binding");

    ko.bindingHandlers[name] = {
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var $element = $(element),
                unwrappedValue = ko.utils.unwrapObservable(valueAccessor()),
                eventSource = unwrappedValue.execute ? unwrappedValue.execute : unwrappedValue;

            eventsEngine.off($element, koBindingEventName);
            eventsEngine.on($element, koBindingEventName, isPlainObject(unwrappedValue) ? unwrappedValue : {}, function(e) {
                eventSource.call(viewModel, viewModel, e);
            });
        }
    };
});
