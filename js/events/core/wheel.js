import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import registerEvent from './event_registrator';
import { addNamespace, fireEvent } from '../utils';


const EVENT_NAME = 'dxmousewheel';
const EVENT_NAMESPACE = 'dxWheel';
const NATIVE_EVENT_NAME = 'wheel';

const wheel = {

    setup: function(element) {
        const $element = $(element);
        eventsEngine.on($element, addNamespace(NATIVE_EVENT_NAME, EVENT_NAMESPACE), wheel._wheelHandler.bind(wheel));
    },

    teardown: function(element) {
        eventsEngine.off(element, `.${EVENT_NAMESPACE}`);
    },

    _wheelHandler: function({ originalEvent }) {
        const { deltaY, deltaMode } = originalEvent;

        fireEvent({
            type: EVENT_NAME,
            originalEvent,
            deltaY: -deltaY,
            deltaMode,
            pointerType: 'mouse'
        });

        originalEvent.stopPropagation();
    }
};

registerEvent(EVENT_NAME, wheel);

exports.name = EVENT_NAME;
