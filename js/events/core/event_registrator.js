const each = require('../../core/utils/iterator').each;
const callbacks = require('./event_registrator_callbacks');

const registerEvent = function(name, eventObject) {
    const strategy = {};

    if('noBubble' in eventObject) {
        strategy.noBubble = eventObject.noBubble;
    }

    if('bindType' in eventObject) {
        strategy.bindType = eventObject.bindType;
    }

    if('delegateType' in eventObject) {
        strategy.delegateType = eventObject.delegateType;
    }

    each(['setup', 'teardown', 'add', 'remove', 'trigger', 'handle', '_default', 'dispose'], function(_, methodName) {
        if(!eventObject[methodName]) {
            return;
        }

        strategy[methodName] = function() {
            const args = [].slice.call(arguments);
            args.unshift(this);
            return eventObject[methodName].apply(eventObject, args);
        };
    });

    callbacks.fire(name, strategy);
};
registerEvent.callbacks = callbacks;

module.exports = registerEvent;
