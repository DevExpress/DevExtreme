var eventRegistratorCallbacks = require('../../events/core/event_registrator_callbacks'),
    eventsEngine = require('../../events/core/events_engine'),
    ngModule = require('./module');

eventRegistratorCallbacks.add(function(name) {
    var ngEventName = name.slice(0, 2) + name.charAt(2).toUpperCase() + name.slice(3);
    ngModule.directive(ngEventName, ['$parse', function($parse) {
        return function(scope, element, attr) {
            var attrValue = attr[ngEventName].trim(),
                handler,
                eventOptions = { };

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
