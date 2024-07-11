"use strict";

exports.start = exports.move = exports.leave = exports.enter = exports.end = exports.drop = void 0;
var _renderer = _interopRequireDefault(require("../core/renderer"));
var _element_data = require("../core/element_data");
var _array = require("../core/utils/array");
var iteratorUtils = _interopRequireWildcard(require("../core/utils/iterator"));
var _dom = require("../core/utils/dom");
var _event_registrator = _interopRequireDefault(require("./core/event_registrator"));
var _index = require("./utils/index");
var _emitter = _interopRequireDefault(require("./gesture/emitter.gesture"));
var _emitter_registrator = _interopRequireDefault(require("./core/emitter_registrator"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DRAG_START_EVENT = exports.start = 'dxdragstart';
const DRAG_EVENT = exports.move = 'dxdrag';
const DRAG_END_EVENT = exports.end = 'dxdragend';
const DRAG_ENTER_EVENT = exports.enter = 'dxdragenter';
const DRAG_LEAVE_EVENT = exports.leave = 'dxdragleave';
const DROP_EVENT = exports.drop = 'dxdrop';
const DX_DRAG_EVENTS_COUNT_KEY = 'dxDragEventsCount';
const knownDropTargets = [];
const knownDropTargetSelectors = [];
const knownDropTargetConfigs = [];
const dropTargetRegistration = {
  setup: function (element, data) {
    const knownDropTarget = knownDropTargets.includes(element);
    if (!knownDropTarget) {
      knownDropTargets.push(element);
      knownDropTargetSelectors.push([]);
      knownDropTargetConfigs.push(data || {});
    }
  },
  add: function (element, handleObj) {
    const index = knownDropTargets.indexOf(element);
    this.updateEventsCounter(element, handleObj.type, 1);
    const selector = handleObj.selector;
    if (!knownDropTargetSelectors[index].includes(selector)) {
      knownDropTargetSelectors[index].push(selector);
    }
  },
  updateEventsCounter: function (element, event, value) {
    if ([DRAG_ENTER_EVENT, DRAG_LEAVE_EVENT, DROP_EVENT].indexOf(event) > -1) {
      const eventsCount = (0, _element_data.data)(element, DX_DRAG_EVENTS_COUNT_KEY) || 0;
      (0, _element_data.data)(element, DX_DRAG_EVENTS_COUNT_KEY, Math.max(0, eventsCount + value));
    }
  },
  remove: function (element, handleObj) {
    this.updateEventsCounter(element, handleObj.type, -1);
  },
  teardown: function (element) {
    const handlersCount = (0, _element_data.data)(element, DX_DRAG_EVENTS_COUNT_KEY);
    if (!handlersCount) {
      const index = knownDropTargets.indexOf(element);
      knownDropTargets.splice(index, 1);
      knownDropTargetSelectors.splice(index, 1);
      knownDropTargetConfigs.splice(index, 1);
      (0, _element_data.removeData)(element, DX_DRAG_EVENTS_COUNT_KEY);
    }
  }
};

/**
* @name UI Events.dxdragenter
* @type eventType
* @type_function_param1 event:event
* @type_function_param1_field1 draggingElement:Element
* @module events/drag
*/
/**
* @name UI Events.dxdrop
* @type eventType
* @type_function_param1 event:event
* @type_function_param1_field1 draggingElement:Element
* @module events/drag
*/
/**
* @name UI Events.dxdragleave
* @type eventType
* @type_function_param1 event:event
* @type_function_param1_field1 draggingElement:Element
* @module events/drag
*/

(0, _event_registrator.default)(DRAG_ENTER_EVENT, dropTargetRegistration);
(0, _event_registrator.default)(DRAG_LEAVE_EVENT, dropTargetRegistration);
(0, _event_registrator.default)(DROP_EVENT, dropTargetRegistration);
const getItemDelegatedTargets = function ($element) {
  const dropTargetIndex = knownDropTargets.indexOf($element.get(0));
  const dropTargetSelectors = knownDropTargetSelectors[dropTargetIndex].filter(selector => selector);
  let $delegatedTargets = $element.find(dropTargetSelectors.join(', '));
  if (knownDropTargetSelectors[dropTargetIndex].includes(undefined)) {
    $delegatedTargets = $delegatedTargets.add($element);
  }
  return $delegatedTargets;
};
const getItemConfig = function ($element) {
  const dropTargetIndex = knownDropTargets.indexOf($element.get(0));
  return knownDropTargetConfigs[dropTargetIndex];
};
const getItemPosition = function (dropTargetConfig, $element) {
  if (dropTargetConfig.itemPositionFunc) {
    return dropTargetConfig.itemPositionFunc($element);
  } else {
    return $element.offset();
  }
};
const getItemSize = function (dropTargetConfig, $element) {
  if (dropTargetConfig.itemSizeFunc) {
    return dropTargetConfig.itemSizeFunc($element);
  }
  return {
    width: $element.get(0).getBoundingClientRect().width,
    height: $element.get(0).getBoundingClientRect().height
  };
};
const DragEmitter = _emitter.default.inherit({
  ctor: function (element) {
    this.callBase(element);
    this.direction = 'both';
  },
  _init: function (e) {
    this._initEvent = e;
  },
  _start: function (e) {
    e = this._fireEvent(DRAG_START_EVENT, this._initEvent);
    this._maxLeftOffset = e.maxLeftOffset;
    this._maxRightOffset = e.maxRightOffset;
    this._maxTopOffset = e.maxTopOffset;
    this._maxBottomOffset = e.maxBottomOffset;
    if (e.targetElements || e.targetElements === null) {
      const dropTargets = (0, _array.wrapToArray)(e.targetElements || []);
      this._dropTargets = iteratorUtils.map(dropTargets, function (element) {
        return (0, _renderer.default)(element).get(0);
      });
    } else {
      this._dropTargets = knownDropTargets;
    }
  },
  _move: function (e) {
    const eventData = (0, _index.eventData)(e);
    const dragOffset = this._calculateOffset(eventData);
    e = this._fireEvent(DRAG_EVENT, e, {
      offset: dragOffset
    });
    this._processDropTargets(e);
    if (!e._cancelPreventDefault) {
      e.preventDefault();
    }
  },
  _calculateOffset: function (eventData) {
    return {
      x: this._calculateXOffset(eventData),
      y: this._calculateYOffset(eventData)
    };
  },
  _calculateXOffset: function (eventData) {
    if (this.direction !== 'vertical') {
      const offset = eventData.x - this._startEventData.x;
      return this._fitOffset(offset, this._maxLeftOffset, this._maxRightOffset);
    }
    return 0;
  },
  _calculateYOffset: function (eventData) {
    if (this.direction !== 'horizontal') {
      const offset = eventData.y - this._startEventData.y;
      return this._fitOffset(offset, this._maxTopOffset, this._maxBottomOffset);
    }
    return 0;
  },
  _fitOffset: function (offset, minOffset, maxOffset) {
    if (minOffset != null) {
      offset = Math.max(offset, -minOffset);
    }
    if (maxOffset != null) {
      offset = Math.min(offset, maxOffset);
    }
    return offset;
  },
  _processDropTargets: function (e) {
    const target = this._findDropTarget(e);
    const sameTarget = target === this._currentDropTarget;
    if (!sameTarget) {
      this._fireDropTargetEvent(e, DRAG_LEAVE_EVENT);
      this._currentDropTarget = target;
      this._fireDropTargetEvent(e, DRAG_ENTER_EVENT);
    }
  },
  _fireDropTargetEvent: function (event, eventName) {
    if (!this._currentDropTarget) {
      return;
    }
    const eventData = {
      type: eventName,
      originalEvent: event,
      draggingElement: this._$element.get(0),
      target: this._currentDropTarget
    };
    (0, _index.fireEvent)(eventData);
  },
  _findDropTarget: function (e) {
    const that = this;
    let result;
    iteratorUtils.each(knownDropTargets, function (_, target) {
      if (!that._checkDropTargetActive(target)) {
        return;
      }
      const $target = (0, _renderer.default)(target);
      iteratorUtils.each(getItemDelegatedTargets($target), function (_, delegatedTarget) {
        const $delegatedTarget = (0, _renderer.default)(delegatedTarget);
        if (that._checkDropTarget(getItemConfig($target), $delegatedTarget, (0, _renderer.default)(result), e)) {
          result = delegatedTarget;
        }
      });
    });
    return result;
  },
  _checkDropTargetActive: function (target) {
    let active = false;
    iteratorUtils.each(this._dropTargets, function (_, activeTarget) {
      active = active || activeTarget === target || (0, _dom.contains)(activeTarget, target);
      return !active;
    });
    return active;
  },
  _checkDropTarget: function (config, $target, $prevTarget, e) {
    const isDraggingElement = $target.get(0) === (0, _renderer.default)(e.target).get(0);
    if (isDraggingElement) {
      return false;
    }
    const targetPosition = getItemPosition(config, $target);
    if (e.pageX < targetPosition.left) {
      return false;
    }
    if (e.pageY < targetPosition.top) {
      return false;
    }
    const targetSize = getItemSize(config, $target);
    if (e.pageX > targetPosition.left + targetSize.width) {
      return false;
    }
    if (e.pageY > targetPosition.top + targetSize.height) {
      return false;
    }
    if ($prevTarget.length && $prevTarget.closest($target).length) {
      return false;
    }
    if (config.checkDropTarget && !config.checkDropTarget($target, e)) {
      return false;
    }
    return $target;
  },
  _end: function (e) {
    const eventData = (0, _index.eventData)(e);
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

(0, _emitter_registrator.default)({
  emitter: DragEmitter,
  events: [DRAG_START_EVENT, DRAG_EVENT, DRAG_END_EVENT]
});