const each = require('../../core/utils/iterator').each;
const readyCallbacks = require('../../core/utils/ready_callbacks');
const domAdapter = require('../../core/dom_adapter');

const addEventsListener = function(events, handler) {
    readyCallbacks.add(function() {
        events
            .split(' ')
            .forEach(function(event) {
                domAdapter.listen(domAdapter.getDocument(), event, handler, true);
            });
    });
};

const Observer = function(eventMap, pointerEquals, onPointerAdding) {

    onPointerAdding = onPointerAdding || function() { };

    let pointers = [];

    const getPointerIndex = function(e) {
        let index = -1;

        each(pointers, function(i, pointer) {
            if(!pointerEquals(e, pointer)) {
                return true;
            }

            index = i;
            return false;
        });

        return index;
    };

    const addPointer = function(e) {
        if(getPointerIndex(e) === -1) {
            onPointerAdding(e);
            pointers.push(e);
        }
    };

    const removePointer = function(e) {
        const index = getPointerIndex(e);
        if(index > -1) {
            pointers.splice(index, 1);
        }
    };

    const updatePointer = function(e) {
        pointers[getPointerIndex(e)] = e;
    };

    addEventsListener(eventMap['dxpointerdown'], addPointer);
    addEventsListener(eventMap['dxpointermove'], updatePointer);
    addEventsListener(eventMap['dxpointerup'], removePointer);
    addEventsListener(eventMap['dxpointercancel'], removePointer);

    this.pointers = function() {
        return pointers;
    };

    this.reset = function() {
        pointers = [];
    };

};

module.exports = Observer;
