import registerEventCallbacks from 'events/core/event_registrator_callbacks';

export const special = {};

registerEventCallbacks.add(function(name, eventObject) {
    special[name] = eventObject;
});

export default { special };
