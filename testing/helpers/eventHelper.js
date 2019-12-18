var registerEventCallbacks = require('events/core/event_registrator_callbacks');

var special = {};

registerEventCallbacks.add(function(name, eventObject) {
    special[name] = eventObject;
});

exports.special = special;
