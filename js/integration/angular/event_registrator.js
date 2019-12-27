const eventRegistratorCallbacks = require('../../events/core/event_registrator_callbacks');
const eventsEngine = require('../../events/core/events_engine');
const ngModule = require('./module');

eventRegistratorCallbacks.add(function(name) {
    const ngEventName = name.slice(0, 2) + name.charAt(2).toUpperCase() + name.slice(3);
    ngModule.directive(ngEventName, ['$parse', function($parse) {
        return function(scope, element, attr) {
            const attrValue = attr[ngEventName].trim();
            let handler;
            let eventOptions = { };

            if(attrValue.charAt(0) === '{') {
                eventOptions = scope.$eval(attrValue);
                handler = $parse(eventOptions.execute);
            } else {
                handler = $parse(attr[ngEventName]);
            }

            eventsEngine.on(element, name, eventOptions, function(e) {
                scope.$apply(function() {
                    handler(scope, { $event: e });
                });
            });
        };
    }]);
});
