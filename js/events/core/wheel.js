import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import registerEvent from './event_registrator';
import { addNamespace, fireEvent } from '../utils';


const EVENT_NAME = 'dxmousewheel';
const EVENT_NAMESPACE = 'dxWheel';
const NATIVE_EVENT_NAME = 'wheel';

const PIXEL_MODE = 0;
const DELTA_MUTLIPLIER = 30;

const wheel = {
    setup: function(element) {
        const $element = $(element);
        eventsEngine.on($element, addNamespace(NATIVE_EVENT_NAME, EVENT_NAMESPACE), wheel._wheelHandler.bind(wheel));
    },

    teardown: function(element) {
        eventsEngine.off(element, `.${EVENT_NAMESPACE}`);
    },

    _wheelHandler: function(e) {
        const { deltaMode, deltaY, deltaX, deltaZ } = e.originalEvent;

        fireEvent({
            type: EVENT_NAME,
            originalEvent: e,
            delta: this._normalizeDelta(deltaY, deltaMode),
            deltaX,
            deltaY,
            deltaZ,
            deltaMode,
            pointerType: 'mouse'
        });

        e.stopPropagation();
    },

    _normalizeDelta(delta, deltaMode = PIXEL_MODE) {
        if(deltaMode === PIXEL_MODE) {
            return -delta;
        } else {
            // Use multiplier to get rough delta value in px for the LINE or PAGE mode
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1392460
            return -DELTA_MUTLIPLIER * delta;
        }
    }
};

registerEvent(EVENT_NAME, wheel);

exports.name = EVENT_NAME;
