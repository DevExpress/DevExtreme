import eventsEngine from '../../common/core/events/core/events_engine';
import pointerEvents from '../../common/core/events/pointer';
import { getWindow } from '../../core/utils/window';
import domAdapter from '../../core/dom_adapter';
import { each } from '../../core/utils/iterator';
import { pointerEvents as msPointerEnabled } from '../../core/utils/support';

const MIN_MANUAL_SELECTING_WIDTH = 10;
const window = getWindow();

function isLeftButtonPressed(event) {
    const e = event || window.event;
    const originalEvent = e.originalEvent;
    const touches = e.touches;
    const pointerType = (originalEvent ? originalEvent.pointerType : false);
    const eventTouches = (originalEvent ? originalEvent.touches : false);
    const isMSPointerLeftClick = originalEvent && pointerType !== undefined && (pointerType === (originalEvent.MSPOINTER_TYPE_TOUCH || 'touch') || (pointerType === (originalEvent.MSPOINTER_TYPE_MOUSE || 'mouse') && originalEvent.buttons === 1));
    const isTouches = (touches && touches.length > 0) || (eventTouches && eventTouches.length > 0);

    return (e.which === 1) || isMSPointerLeftClick || isTouches;
}

function isMultiTouches(event) {
    const originalEvent = event.originalEvent;
    const touches = event.touches;
    const eventTouches = originalEvent && originalEvent.touches;

    return (touches && touches.length > 1) || (eventTouches && eventTouches.length > 1) || null;
}

function preventDefault(e) {
    if(!isMultiTouches(e)) {
        e.preventDefault();
    }
}

function stopPropagationAndPreventDefault(e) {
    if(!isMultiTouches(e)) {
        e.stopPropagation();
        e.preventDefault();
    }
}

// Q375042
function isTouchEventArgs(e) {
    return e && e.type && e.type.indexOf('touch') === 0;
}

function getEventPageX(event) {
    const originalEvent = event.originalEvent;
    let result = 0;
    if(event.pageX) {
        result = event.pageX;
    } else if(originalEvent && originalEvent.pageX) {
        result = originalEvent.pageX;
    }
    if(originalEvent && originalEvent.touches) {
        if(originalEvent.touches.length > 0) {
            result = originalEvent.touches[0].pageX;
        } else if(originalEvent.changedTouches.length > 0) {
            result = originalEvent.changedTouches[0].pageX;
        }
    }
    return result;
}

function initializeAreaEvents(controller, area, state, getRootOffsetLeft) {
    let isTouchEvent;
    let isActive = false;
    let initialPosition;
    let movingHandler = null;
    const docEvents = {
        [pointerEvents.move](e) {
            let position;
            let offset;
            if(isTouchEvent !== isTouchEventArgs(e)) return;

            if(!isLeftButtonPressed(e)) {
                cancel(e);
            }
            if(isActive) {
                position = getEventPageX(e);
                offset = getRootOffsetLeft();
                if(movingHandler) {
                    movingHandler(position - offset, e);
                } else {
                    if(state.manualRangeSelectionEnabled && Math.abs(initialPosition - position) >= MIN_MANUAL_SELECTING_WIDTH) {
                        movingHandler = controller.placeSliderAndBeginMoving(initialPosition - offset, position - offset, e);
                    }
                }
            }
        },
        [pointerEvents.up](e) {
            let position;
            if(isActive) {
                position = getEventPageX(e);
                if(!movingHandler && state.moveSelectedRangeByClick && Math.abs(initialPosition - position) < MIN_MANUAL_SELECTING_WIDTH) {
                    controller.moveSelectedArea(position - getRootOffsetLeft(), e);
                }
                cancel(e);
            }
        }
    };

    function cancel(e) {
        if(isActive) {
            isActive = false;
            if(movingHandler) {
                movingHandler.complete(e);
                movingHandler = null;
            }
        }
    }

    area.on(pointerEvents.down, function(e) {
        if(!state.enabled || !isLeftButtonPressed(e) || isActive) return;

        isActive = true;
        isTouchEvent = isTouchEventArgs(e);
        initialPosition = getEventPageX(e);
    });
    return docEvents;
}

function initializeSelectedAreaEvents(controller, area, state, getRootOffsetLeft) {
    let isTouchEvent;
    let isActive = false;
    let movingHandler = null;
    const docEvents = {
        [pointerEvents.move](e) {
            if(isTouchEvent !== isTouchEventArgs(e)) return;

            if(!isLeftButtonPressed(e)) {
                cancel(e);
            }
            if(isActive) {
                preventDefault(e);
                movingHandler(getEventPageX(e) - getRootOffsetLeft(), e);
            }
        },
        [pointerEvents.up]: cancel
    };

    function cancel(e) {
        if(isActive) {
            isActive = false;
            movingHandler.complete(e);
            movingHandler = null;
        }
    }

    area.on(pointerEvents.down, function(e) {
        if(!state.enabled || !isLeftButtonPressed(e) || isActive) return;

        isActive = true;
        isTouchEvent = isTouchEventArgs(e);
        movingHandler = controller.beginSelectedAreaMoving(getEventPageX(e) - getRootOffsetLeft());
        stopPropagationAndPreventDefault(e);
    });
    return docEvents;
}

function initializeSliderEvents(controller, sliders, state, getRootOffsetLeft) {
    let isTouchEvent;
    let isActive = false;
    let movingHandler = null;
    const docEvents = {
        [pointerEvents.move](e) {
            if(isTouchEvent !== isTouchEventArgs(e)) return;

            if(!isLeftButtonPressed(e)) {
                cancel(e);
            }
            if(isActive) {
                preventDefault(e);
                movingHandler(getEventPageX(e) - getRootOffsetLeft(), e);
            }
        },
        [pointerEvents.up]: cancel
    };

    each(sliders, function(i, slider) {
        slider.on({
            [pointerEvents.down](e) {
                if(!state.enabled || !isLeftButtonPressed(e) || isActive) return;

                isActive = true;
                isTouchEvent = isTouchEventArgs(e);
                movingHandler = controller.beginSliderMoving(i, getEventPageX(e) - getRootOffsetLeft());
                stopPropagationAndPreventDefault(e);
            },
            [pointerEvents.move]() {
                if(!movingHandler) {
                    controller.foregroundSlider(i);
                }
            }
        });
    });

    function cancel(e) {
        if(isActive) {
            isActive = false;
            movingHandler.complete(e);
            movingHandler = null;
        }
    }

    return docEvents;
}

export function Tracker(params) {
    const state = this._state = {};
    const targets = params.controller.getTrackerTargets();
    if(msPointerEnabled) {
        params.renderer.root.css({ 'msTouchAction': 'pinch-zoom' });
    }
    this._docEvents = [
        initializeSelectedAreaEvents(params.controller, targets.selectedArea, state, getRootOffsetLeft),
        initializeAreaEvents(params.controller, targets.area, state, getRootOffsetLeft),
        initializeSliderEvents(params.controller, targets.sliders, state, getRootOffsetLeft)
    ];
    // TODO: 3 "move" and 3 "end" events - do we really need that much?
    each(this._docEvents, function(_, events) {
        eventsEngine.on(domAdapter.getDocument(), events);
    });

    function getRootOffsetLeft() {
        return params.renderer.getRootOffset().left;
    }
}

Tracker.prototype = {
    constructor: Tracker,

    dispose: function() {
        each(this._docEvents, function(_, events) {
            eventsEngine.off(domAdapter.getDocument(), events);
        });
    },

    update: function(enabled, behavior) {
        const state = this._state;
        state.enabled = enabled;
        state.moveSelectedRangeByClick = behavior.moveSelectedRangeByClick;
        state.manualRangeSelectionEnabled = behavior.manualRangeSelectionEnabled;
    }
};
