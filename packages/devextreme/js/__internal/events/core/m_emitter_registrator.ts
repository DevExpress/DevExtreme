import registerEvent from '@js/common/core/events/core/event_registrator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { name as wheelEventName } from '@js/common/core/events/core/wheel';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, isMouseEvent } from '@js/common/core/events/utils/index';
import Class from '@js/core/class';
import domAdapter from '@js/core/dom_adapter';
import { data as elementData } from '@js/core/element_data';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import readyCallbacks from '@js/core/utils/ready_callbacks';

const MANAGER_EVENT = 'dxEventManager';
const EMITTER_DATA = 'dxEmitter';

const EventManager = Class.inherit({

  ctor() {
    this._attachHandlers();
    this.reset();

    this._proxiedCancelHandler = this._cancelHandler.bind(this);
    this._proxiedAcceptHandler = this._acceptHandler.bind(this);
  },

  _attachHandlers() {
    readyCallbacks.add(() => {
      const document = domAdapter.getDocument();
      // @ts-expect-error
      eventsEngine.subscribeGlobal(document, addNamespace(pointerEvents.down, MANAGER_EVENT), this._pointerDownHandler.bind(this));
      // @ts-expect-error
      eventsEngine.subscribeGlobal(document, addNamespace(pointerEvents.move, MANAGER_EVENT), this._pointerMoveHandler.bind(this));
      // @ts-expect-error
      eventsEngine.subscribeGlobal(document, addNamespace([pointerEvents.up, pointerEvents.cancel].join(' '), MANAGER_EVENT), this._pointerUpHandler.bind(this));
      // @ts-expect-error
      eventsEngine.subscribeGlobal(document, addNamespace(wheelEventName, MANAGER_EVENT), this._mouseWheelHandler.bind(this));
    });
  },

  _eachEmitter(callback) {
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

  _applyToEmitters(method, arg) {
    this._eachEmitter((emitter) => {
      emitter[method].call(emitter, arg);
    });
  },

  reset() {
    this._eachEmitter(this._proxiedCancelHandler);
    this._activeEmitters = [];
  },

  resetEmitter(emitter) {
    this._proxiedCancelHandler(emitter);
  },

  _pointerDownHandler(e) {
    if (isMouseEvent(e) && e.which > 1) {
      return;
    }

    this._updateEmitters(e);
  },

  _updateEmitters(e) {
    if (!this._isSetChanged(e)) {
      return;
    }

    this._cleanEmitters(e);
    this._fetchEmitters(e);
  },

  _isSetChanged(e) {
    const currentSet = this._closestEmitter(e);
    const previousSet = this._emittersSet || [];

    let setChanged = currentSet.length !== previousSet.length;

    each(currentSet, (index, emitter) => {
      setChanged = setChanged || previousSet[index] !== emitter;
      return !setChanged;
    });

    this._emittersSet = currentSet;

    return setChanged;
  },

  _closestEmitter(e) {
    const that = this;

    const result: any = [];
    let $element = $(e.target);

    function handleEmitter(_, emitter) {
      if (!!emitter && emitter.validatePointers(e) && emitter.validate(e)) {
        emitter.addCancelCallback(that._proxiedCancelHandler);
        emitter.addAcceptCallback(that._proxiedAcceptHandler);
        result.push(emitter);
      }
    }

    while ($element.length) {
      const emitters = elementData($element.get(0), EMITTER_DATA) || [];
      each(emitters, handleEmitter);
      $element = $element.parent();
    }

    return result;
  },

  _acceptHandler(acceptedEmitter, e) {
    this._eachEmitter((emitter) => {
      if (emitter !== acceptedEmitter) {
        this._cancelEmitter(emitter, e);
      }
    });
  },

  _cancelHandler(canceledEmitter, e) {
    this._cancelEmitter(canceledEmitter, e);
  },

  _cancelEmitter(emitter, e) {
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

  _cleanEmitters(e) {
    this._applyToEmitters('end', e);
    this.reset(e);
  },

  _fetchEmitters(e) {
    this._activeEmitters = this._emittersSet.slice();
    this._applyToEmitters('start', e);
  },

  _pointerMoveHandler(e) {
    this._applyToEmitters('move', e);
  },

  _pointerUpHandler(e) {
    this._updateEmitters(e);
  },

  _mouseWheelHandler(e) {
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

  _allowInterruptionByMouseWheel() {
    let allowInterruption = true;
    this._eachEmitter((emitter) => {
      allowInterruption = emitter.allowInterruptionByMouseWheel() && allowInterruption;
      return allowInterruption;
    });
    return allowInterruption;
  },

  _adjustWheelEvent(e) {
    let closestGestureEmitter: any = null;
    // @ts-expect-error
    this._eachEmitter((emitter) => {
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

  isActive(element) {
    let result = false;
    this._eachEmitter((emitter) => {
      result = result || emitter.getElement().is(element);
    });
    return result;
  },
});

const eventManager = new EventManager();

const EMITTER_SUBSCRIPTION_DATA = 'dxEmitterSubscription';

const registerEmitter = function (emitterConfig) {
  const EmitterClass = emitterConfig.emitter;
  const emitterName = emitterConfig.events[0];
  const emitterEvents = emitterConfig.events;

  each(emitterEvents, (_, eventName) => {
    registerEvent(eventName, {

      noBubble: !emitterConfig.bubble,

      setup(element) {
        const subscriptions = elementData(element, EMITTER_SUBSCRIPTION_DATA) || {};

        const emitters = elementData(element, EMITTER_DATA) || {};
        const emitter = emitters[emitterName] || new EmitterClass(element);

        subscriptions[eventName] = true;
        emitters[emitterName] = emitter;

        elementData(element, EMITTER_DATA, emitters);
        elementData(element, EMITTER_SUBSCRIPTION_DATA, subscriptions);
      },

      add(element, handleObj) {
        const emitters = elementData(element, EMITTER_DATA);
        const emitter = emitters[emitterName];

        emitter.configure(extend({
          delegateSelector: handleObj.selector,
        }, handleObj.data), handleObj.type);
      },

      teardown(element) {
        const subscriptions = elementData(element, EMITTER_SUBSCRIPTION_DATA);

        const emitters = elementData(element, EMITTER_DATA);
        const emitter = emitters[emitterName];

        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete subscriptions[eventName];

        let disposeEmitter = true;
        each(emitterEvents, (_, eventName) => {
          disposeEmitter = disposeEmitter && !subscriptions[eventName];
          return disposeEmitter;
        });

        if (disposeEmitter) {
          if (eventManager.isActive(element)) {
            eventManager.resetEmitter(emitter);
          }

          emitter && emitter.dispose();
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete emitters[emitterName];
        }
      },

    });
  });
};

export default registerEmitter;
