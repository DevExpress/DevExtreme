"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _ready_callbacks = _interopRequireDefault(require("../../core/utils/ready_callbacks"));
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _element_data = require("../../core/element_data");
var _class = _interopRequireDefault(require("../../core/class"));
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _event_registrator = _interopRequireDefault(require("./event_registrator"));
var _index = require("../utils/index");
var _pointer = _interopRequireDefault(require("../pointer"));
var _wheel = require("./wheel");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MANAGER_EVENT = 'dxEventManager';
const EMITTER_DATA = 'dxEmitter';
const EventManager = _class.default.inherit({
  ctor: function () {
    this._attachHandlers();
    this.reset();
    this._proxiedCancelHandler = this._cancelHandler.bind(this);
    this._proxiedAcceptHandler = this._acceptHandler.bind(this);
  },
  _attachHandlers: function () {
    _ready_callbacks.default.add(function () {
      const document = _dom_adapter.default.getDocument();
      _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)(_pointer.default.down, MANAGER_EVENT), this._pointerDownHandler.bind(this));
      _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)(_pointer.default.move, MANAGER_EVENT), this._pointerMoveHandler.bind(this));
      _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)([_pointer.default.up, _pointer.default.cancel].join(' '), MANAGER_EVENT), this._pointerUpHandler.bind(this));
      _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)(_wheel.name, MANAGER_EVENT), this._mouseWheelHandler.bind(this));
    }.bind(this));
  },
  _eachEmitter: function (callback) {
    const activeEmitters = this._activeEmitters || [];
    let i = 0;
    while (activeEmitters.length > i) {
      const emitter = activeEmitters[i];
      if (callback(emitter) === false) {
        break;
      }
      if (activeEmitters[i] === emitter) {
        i++;
      }
    }
  },
  _applyToEmitters: function (method, arg) {
    this._eachEmitter(function (emitter) {
      emitter[method].call(emitter, arg);
    });
  },
  reset: function () {
    this._eachEmitter(this._proxiedCancelHandler);
    this._activeEmitters = [];
  },
  resetEmitter: function (emitter) {
    this._proxiedCancelHandler(emitter);
  },
  _pointerDownHandler: function (e) {
    if ((0, _index.isMouseEvent)(e) && e.which > 1) {
      return;
    }
    this._updateEmitters(e);
  },
  _updateEmitters: function (e) {
    if (!this._isSetChanged(e)) {
      return;
    }
    this._cleanEmitters(e);
    this._fetchEmitters(e);
  },
  _isSetChanged: function (e) {
    const currentSet = this._closestEmitter(e);
    const previousSet = this._emittersSet || [];
    let setChanged = currentSet.length !== previousSet.length;
    (0, _iterator.each)(currentSet, function (index, emitter) {
      setChanged = setChanged || previousSet[index] !== emitter;
      return !setChanged;
    });
    this._emittersSet = currentSet;
    return setChanged;
  },
  _closestEmitter: function (e) {
    const that = this;
    const result = [];
    let $element = (0, _renderer.default)(e.target);
    function handleEmitter(_, emitter) {
      if (!!emitter && emitter.validatePointers(e) && emitter.validate(e)) {
        emitter.addCancelCallback(that._proxiedCancelHandler);
        emitter.addAcceptCallback(that._proxiedAcceptHandler);
        result.push(emitter);
      }
    }
    while ($element.length) {
      const emitters = (0, _element_data.data)($element.get(0), EMITTER_DATA) || [];
      (0, _iterator.each)(emitters, handleEmitter);
      $element = $element.parent();
    }
    return result;
  },
  _acceptHandler: function (acceptedEmitter, e) {
    const that = this;
    this._eachEmitter(function (emitter) {
      if (emitter !== acceptedEmitter) {
        that._cancelEmitter(emitter, e);
      }
    });
  },
  _cancelHandler: function (canceledEmitter, e) {
    this._cancelEmitter(canceledEmitter, e);
  },
  _cancelEmitter: function (emitter, e) {
    const activeEmitters = this._activeEmitters;
    if (e) {
      emitter.cancel(e);
    } else {
      emitter.reset();
    }
    emitter.removeCancelCallback();
    emitter.removeAcceptCallback();
    const emitterIndex = activeEmitters.indexOf(emitter);
    if (emitterIndex > -1) {
      activeEmitters.splice(emitterIndex, 1);
    }
  },
  _cleanEmitters: function (e) {
    this._applyToEmitters('end', e);
    this.reset(e);
  },
  _fetchEmitters: function (e) {
    this._activeEmitters = this._emittersSet.slice();
    this._applyToEmitters('start', e);
  },
  _pointerMoveHandler: function (e) {
    this._applyToEmitters('move', e);
  },
  _pointerUpHandler: function (e) {
    this._updateEmitters(e);
  },
  _mouseWheelHandler: function (e) {
    if (!this._allowInterruptionByMouseWheel()) {
      return;
    }
    e.pointers = [null];
    this._pointerDownHandler(e);
    this._adjustWheelEvent(e);
    this._pointerMoveHandler(e);
    e.pointers = [];
    this._pointerUpHandler(e);
  },
  _allowInterruptionByMouseWheel: function () {
    let allowInterruption = true;
    this._eachEmitter(function (emitter) {
      allowInterruption = emitter.allowInterruptionByMouseWheel() && allowInterruption;
      return allowInterruption;
    });
    return allowInterruption;
  },
  _adjustWheelEvent: function (e) {
    let closestGestureEmitter = null;
    this._eachEmitter(function (emitter) {
      if (!emitter.gesture) {
        return;
      }
      const direction = emitter.getDirection(e);
      if (direction !== 'horizontal' && !e.shiftKey || direction !== 'vertical' && e.shiftKey) {
        closestGestureEmitter = emitter;
        return false;
      }
    });
    if (!closestGestureEmitter) {
      return;
    }
    const direction = closestGestureEmitter.getDirection(e);
    const verticalGestureDirection = direction === 'both' && !e.shiftKey || direction === 'vertical';
    const prop = verticalGestureDirection ? 'pageY' : 'pageX';
    e[prop] += e.delta;
  },
  isActive: function (element) {
    let result = false;
    this._eachEmitter(function (emitter) {
      result = result || emitter.getElement().is(element);
    });
    return result;
  }
});
const eventManager = new EventManager();
const EMITTER_SUBSCRIPTION_DATA = 'dxEmitterSubscription';
const registerEmitter = function (emitterConfig) {
  const emitterClass = emitterConfig.emitter;
  const emitterName = emitterConfig.events[0];
  const emitterEvents = emitterConfig.events;
  (0, _iterator.each)(emitterEvents, function (_, eventName) {
    (0, _event_registrator.default)(eventName, {
      noBubble: !emitterConfig.bubble,
      setup: function (element) {
        const subscriptions = (0, _element_data.data)(element, EMITTER_SUBSCRIPTION_DATA) || {};
        const emitters = (0, _element_data.data)(element, EMITTER_DATA) || {};
        const emitter = emitters[emitterName] || new emitterClass(element);
        subscriptions[eventName] = true;
        emitters[emitterName] = emitter;
        (0, _element_data.data)(element, EMITTER_DATA, emitters);
        (0, _element_data.data)(element, EMITTER_SUBSCRIPTION_DATA, subscriptions);
      },
      add: function (element, handleObj) {
        const emitters = (0, _element_data.data)(element, EMITTER_DATA);
        const emitter = emitters[emitterName];
        emitter.configure((0, _extend.extend)({
          delegateSelector: handleObj.selector
        }, handleObj.data), handleObj.type);
      },
      teardown: function (element) {
        const subscriptions = (0, _element_data.data)(element, EMITTER_SUBSCRIPTION_DATA);
        const emitters = (0, _element_data.data)(element, EMITTER_DATA);
        const emitter = emitters[emitterName];
        delete subscriptions[eventName];
        let disposeEmitter = true;
        (0, _iterator.each)(emitterEvents, function (_, eventName) {
          disposeEmitter = disposeEmitter && !subscriptions[eventName];
          return disposeEmitter;
        });
        if (disposeEmitter) {
          if (eventManager.isActive(element)) {
            eventManager.resetEmitter(emitter);
          }
          emitter && emitter.dispose();
          delete emitters[emitterName];
        }
      }
    });
  });
};
var _default = exports.default = registerEmitter;
module.exports = exports.default;
module.exports.default = exports.default;