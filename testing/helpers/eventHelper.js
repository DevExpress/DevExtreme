const registerEventCallbacks = require('events/core/event_registrator_callbacks');

const special = {};

registerEventCallbacks.add(function(name, eventObject) {
    special[name] = eventObject;
});

exports.special = special;
