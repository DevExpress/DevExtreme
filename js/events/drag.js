const $ = require('../core/renderer');
const dataUtils = require('../core/element_data');
const wrapToArray = require('../core/utils/array').wrapToArray;
const inArray = require('../core/utils/array').inArray;
const iteratorUtils = require('../core/utils/iterator');
const contains = require('../core/utils/dom').contains;
const registerEvent = require('./core/event_registrator');
const eventUtils = require('./utils');
const GestureEmitter = require('./gesture/emitter.gesture');
const registerEmitter = require('./core/emitter_registrator');


const DRAG_START_EVENT = 'dxdragstart';
const DRAG_EVENT = 'dxdrag';
const DRAG_END_EVENT = 'dxdragend';

const DRAG_ENTER_EVENT = 'dxdragenter';
const DRAG_LEAVE_EVENT = 'dxdragleave';
const DROP_EVENT = 'dxdrop';

const DX_DRAG_EVENTS_COUNT_KEY = 'dxDragEventsCount';


const knownDropTargets = [];
const knownDropTargetSelectors = [];
const knownDropTargetConfigs = [];

const dropTargetRegistration = {

    setup: function(element, data) {
        const knownDropTarget = inArray(element, knownDropTargets) !== -1;
        if(!knownDropTarget) {
            knownDropTargets.push(element);
            knownDropTargetSelectors.push([]);
            knownDropTargetConfigs.push(data || {});
        }
    },

    add: function(element, handleObj) {
        const index = inArray(element, knownDropTargets);
        this.updateEventsCounter(element, handleObj.type, 1);

        const selector = handleObj.selector;
        if(inArray(selector, knownDropTargetSelectors[index]) === -1) {
            knownDropTargetSelectors[index].push(selector);
        }
    },

    updateEventsCounter: function(element, event, value) {
        if([DRAG_ENTER_EVENT, DRAG_LEAVE_EVENT, DROP_EVENT].indexOf(event) > -1) {
            const eventsCount = dataUtils.data(element, DX_DRAG_EVENTS_COUNT_KEY) || 0;
            dataUtils.data(element, DX_DRAG_EVENTS_COUNT_KEY, Math.max(0, eventsCount + value));
        }
    },

    remove: function(element, handleObj) {
        this.updateEventsCounter(element, handleObj.type, -1);
    },

    teardown: function(element) {
        const handlersCount = dataUtils.data(element, DX_DRAG_EVENTS_COUNT_KEY);
        if(!handlersCount) {
            const index = inArray(element, knownDropTargets);
            knownDropTargets.splice(index, 1);
            knownDropTargetSelectors.splice(index, 1);
            knownDropTargetConfigs.splice(index, 1);
            dataUtils.removeData(element, DX_DRAG_EVENTS_COUNT_KEY);
        }
    }

};

/**
* @name UI Events.dxdragenter
* @type eventType
* @type_function_param1 event:event
* @type_function_param1_field1 draggingElement:Node
* @module events/drag
*/
/**
* @name UI Events.dxdrop
* @type eventType
* @type_function_param1 event:event
* @type_function_param1_field1 draggingElement:Node
* @module events/drag
*/
/**
* @name UI Events.dxdragleave
* @type eventType
* @type_function_param1 event:event
* @type_function_param1_field1 draggingElement:Node
* @module events/drag
*/

registerEvent(DRAG_ENTER_EVENT, dropTargetRegistration);
registerEvent(DRAG_LEAVE_EVENT, dropTargetRegistration);
registerEvent(DROP_EVENT, dropTargetRegistration);

const getItemDelegatedTargets = function($element) {
    const dropTargetIndex = inArray($element.get(0), knownDropTargets);
    const dropTargetSelectors = knownDropTargetSelectors[dropTargetIndex].filter((selector) => selector);

    let $delegatedTargets = $element.find(dropTargetSelectors.join(', '));
    if(inArray(undefined, knownDropTargetSelectors[dropTargetIndex]) !== -1) {
        $delegatedTargets = $delegatedTargets.add($element);
    }
    return $delegatedTargets;
};

const getItemConfig = function($element) {
    const dropTargetIndex = inArray($element.get(0), knownDropTargets);
    return knownDropTargetConfigs[dropTargetIndex];
};

const getItemPosition = function(dropTargetConfig, $element) {
    if(dropTargetConfig.itemPositionFunc) {
        return dropTargetConfig.itemPositionFunc($element);
    } else {
        return $element.offset();
    }
};

const getItemSize = function(dropTargetConfig, $element) {
    if(dropTargetConfig.itemSizeFunc) {
        return dropTargetConfig.itemSizeFunc($element);
    }

    return {
        width: $element.get(0).getBoundingClientRect().width,
        height: $element.get(0).getBoundingClientRect().height
    };
};

const DragEmitter = GestureEmitter.inherit({

    ctor: function(element) {
        this.callBase(element);

        this.direction = 'both';
    },

    _init: function(e) {
        this._initEvent = e;
    },

    _start: function(e) {
        e = this._fireEvent(DRAG_START_EVENT, this._initEvent);

        this._maxLeftOffset = e.maxLeftOffset;
        this._maxRightOffset = e.maxRightOffset;
        this._maxTopOffset = e.maxTopOffset;
        this._maxBottomOffset = e.maxBottomOffset;

        const dropTargets = wrapToArray(e.targetElements || (e.targetElements === null ? [] : knownDropTargets));
        this._dropTargets = iteratorUtils.map(dropTargets, function(element) { return $(element).get(0); });
    },

    _move: function(e) {
        const eventData = eventUtils.eventData(e);
        const dragOffset = this._calculateOffset(eventData);

        e = this._fireEvent(DRAG_EVENT, e, {
            offset: dragOffset
        });

        this._processDropTargets(e);

        if(!e._cancelPreventDefault) {
            e.preventDefault();
        }
    },

    _calculateOffset: function(eventData) {
        return {
            x: this._calculateXOffset(eventData),
            y: this._calculateYOffset(eventData)
        };
    },

    _calculateXOffset: function(eventData) {
        if(this.direction !== 'vertical') {
            const offset = eventData.x - this._startEventData.x;

            return this._fitOffset(offset, this._maxLeftOffset, this._maxRightOffset);
        }
        return 0;
    },

    _calculateYOffset: function(eventData) {
        if(this.direction !== 'horizontal') {
            const offset = eventData.y - this._startEventData.y;

            return this._fitOffset(offset, this._maxTopOffset, this._maxBottomOffset);
        }
        return 0;
    },

    _fitOffset: function(offset, minOffset, maxOffset) {
        if(minOffset != null) {
            offset = Math.max(offset, -minOffset);
        }
        if(maxOffset != null) {
            offset = Math.min(offset, maxOffset);
        }

        return offset;
    },

    _processDropTargets: function(e) {
        const target = this._findDropTarget(e);
        const sameTarget = target === this._currentDropTarget;

        if(!sameTarget) {
            this._fireDropTargetEvent(e, DRAG_LEAVE_EVENT);
            this._currentDropTarget = target;
            this._fireDropTargetEvent(e, DRAG_ENTER_EVENT);
        }
    },

    _fireDropTargetEvent: function(event, eventName) {
        if(!this._currentDropTarget) {
            return;
        }

        const eventData = {
            type: eventName,
            originalEvent: event,
            draggingElement: this._$element.get(0),
            target: this._currentDropTarget
        };

        eventUtils.fireEvent(eventData);
    },

    _findDropTarget: function(e) {
        const that = this;
        let result;

        iteratorUtils.each(knownDropTargets, function(_, target) {
            if(!that._checkDropTargetActive(target)) {
                return;
            }

            const $target = $(target);
            iteratorUtils.each(getItemDelegatedTargets($target), function(_, delegatedTarget) {
                const $delegatedTarget = $(delegatedTarget);
                if(that._checkDropTarget(getItemConfig($target), $delegatedTarget, e)) {
                    result = delegatedTarget;
                }
            });
        });

        return result;
    },

    _checkDropTargetActive: function(target) {
        let active = false;

        iteratorUtils.each(this._dropTargets, function(_, activeTarget) {
            active = active || activeTarget === target || contains(activeTarget, target);
            return !active;
        });

        return active;
    },

    _checkDropTarget: function(config, $target, e) {
        const isDraggingElement = $target.get(0) === $(e.target).get(0);
        if(isDraggingElement) {
            return false;
        }

        const targetPosition = getItemPosition(config, $target);
        if(e.pageX < targetPosition.left) {
            return false;
        }
        if(e.pageY < targetPosition.top) {
            return false;
        }

        const targetSize = getItemSize(config, $target);
        if(e.pageX > targetPosition.left + targetSize.width) {
            return false;
        }
        if(e.pageY > targetPosition.top + targetSize.height) {
            return false;
        }

        if(config.checkDropTarget && !config.checkDropTarget($target, e)) {
            return false;
        }

        return $target;
    },

    _end: function(e) {
        const eventData = eventUtils.eventData(e);

        this._fireEvent(DRAG_END_EVENT, e, {
            offset: this._calculateOffset(eventData)
        });

        this._fireDropTargetEvent(e, DROP_EVENT);
        delete this._currentDropTarget;
    }

});

/**
 * @name UI Events.dxdragstart
 * @type eventType
 * @type_function_param1 event:event
 * @type_function_param1_field1 cancel:boolean
 * @module events/drag
*/
/**
  * @name UI Events.dxdrag
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 offset:number
  * @type_function_param1_field2 cancel:boolean
  * @module events/drag
*/
/**
  * @name UI Events.dxdragend
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 offset:number
  * @type_function_param1_field2 cancel:boolean
  * @module events/drag
*/

registerEmitter({
    emitter: DragEmitter,
    events: [
        DRAG_START_EVENT,
        DRAG_EVENT,
        DRAG_END_EVENT
    ]
});


///#DEBUG
exports.dropTargets = knownDropTargets;
///#ENDDEBUG

exports.move = DRAG_EVENT;
exports.start = DRAG_START_EVENT;
exports.end = DRAG_END_EVENT;
exports.enter = DRAG_ENTER_EVENT;
exports.leave = DRAG_LEAVE_EVENT;
exports.drop = DROP_EVENT;
