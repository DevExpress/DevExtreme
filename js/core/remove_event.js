import $ from './renderer';
import { beforeCleanData } from './element_data';
import eventsEngine from '../events/core/events_engine';
import registerEvent from '../events/core/event_registrator';

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

export default eventName;
