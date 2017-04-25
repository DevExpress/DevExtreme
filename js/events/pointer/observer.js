"use strict";

var $ = require("jquery");

var addEventsListener = function(events, handler) {
    events = events.split(" ");
    $.each(events, function(_, event) {
        if(document.addEventListener) {
            document.addEventListener(event, handler, true);
        } else {
            document.attachEvent("on" + event, handler);
        }
    });
};

var Observer = function(eventMap, pointerEquals, onPointerAdding) {

    onPointerAdding = onPointerAdding || function() { };

    var pointers = [];

    var getPointerIndex = function(e) {
        var index = -1;

        $.each(pointers, function(i, pointer) {
            if(!pointerEquals(e, pointer)) {
                return true;
            }

            index = i;
            return false;
        });

        return index;
    };

    var addPointer = function(e) {
        if(getPointerIndex(e) === -1) {
            onPointerAdding(e);
            pointers.push(e);
        }
    };

    var removePointer = function(e) {
        var index = getPointerIndex(e);
        if(index > -1) {
            pointers.splice(index, 1);
        }
    };

    var updatePointer = function(e) {
        pointers[getPointerIndex(e)] = e;
    };

    addEventsListener(eventMap["dxpointerdown"], addPointer);
    addEventsListener(eventMap["dxpointermove"], updatePointer);
    addEventsListener(eventMap["dxpointerup"], removePointer);
    addEventsListener(eventMap["dxpointercancel"], removePointer);

    this.pointers = function() {
        return pointers;
    };

    this.reset = function() {
        pointers = [];
    };

};

module.exports = Observer;
