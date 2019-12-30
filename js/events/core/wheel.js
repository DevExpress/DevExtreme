const $ = require('../../core/renderer');
const eventsEngine = require('../../events/core/events_engine');
const domAdapter = require('../../core/dom_adapter');
const callOnce = require('../../core/utils/call_once');
const registerEvent = require('./event_registrator');
const eventUtils = require('../utils');

const EVENT_NAME = 'dxmousewheel';
const EVENT_NAMESPACE = 'dxWheel';

const getWheelEventName = callOnce(function() {
    return domAdapter.hasDocumentProperty('onwheel') ? 'wheel' : 'mousewheel';
});

var wheel = {

    setup: function(element) {
        const $element = $(element);
        eventsEngine.on($element, eventUtils.addNamespace(getWheelEventName(), EVENT_NAMESPACE), wheel._wheelHandler.bind(wheel));
    },

    teardown: function(element) {
        eventsEngine.off(element, '.' + EVENT_NAMESPACE);
    },

    _wheelHandler: function(e) {
        const delta = this._getWheelDelta(e.originalEvent);

        eventUtils.fireEvent({
            type: EVENT_NAME,
            originalEvent: e,
            delta: delta,
            pointerType: 'mouse'
        });

        e.stopPropagation();
    },

    _getWheelDelta: function(event) {
        return event.wheelDelta
            ? event.wheelDelta
            : -event.deltaY * 30;
    }

};

registerEvent(EVENT_NAME, wheel);

exports.name = EVENT_NAME;
