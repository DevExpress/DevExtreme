const $ = require('./renderer');
const beforeCleanData = require('./element_data').beforeCleanData;
const eventsEngine = require('../events/core/events_engine');
const registerEvent = require('../events/core/event_registrator');

const eventName = 'dxremove';
const eventPropName = 'dxRemoveEvent';

/**
  * @name UI Events.dxremove
  * @type eventType
  * @type_function_param1 event:event
  * @module events/remove
*/

beforeCleanData(function(elements) {
    elements = [].slice.call(elements);
    for(let i = 0; i < elements.length; i++) {
        const $element = $(elements[i]);
        if($element.prop(eventPropName)) {
            $element[0][eventPropName] = null;
            eventsEngine.triggerHandler($element, eventName);
        }
    }
});

registerEvent(eventName, {
    noBubble: true,
    setup: function(element) {
        $(element).prop(eventPropName, true);
    }
});

module.exports = eventName;
