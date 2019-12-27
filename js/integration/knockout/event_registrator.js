const $ = require('../../core/renderer');
const eventsEngine = require('../../events/core/events_engine');
const ko = require('knockout');
const isPlainObject = require('../../core/utils/type').isPlainObject;
const eventRegistratorCallbacks = require('../../events/core/event_registrator_callbacks');
const eventUtils = require('../../events/utils');

eventRegistratorCallbacks.add(function(name) {
    const koBindingEventName = eventUtils.addNamespace(name, name + 'Binding');

    ko.bindingHandlers[name] = {
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            const $element = $(element);
            const unwrappedValue = ko.utils.unwrapObservable(valueAccessor());
            const eventSource = unwrappedValue.execute ? unwrappedValue.execute : unwrappedValue;

            eventsEngine.off($element, koBindingEventName);
            eventsEngine.on($element, koBindingEventName, isPlainObject(unwrappedValue) ? unwrappedValue : {}, function(e) {
                eventSource.call(viewModel, viewModel, e);
            });
        }
    };
});
