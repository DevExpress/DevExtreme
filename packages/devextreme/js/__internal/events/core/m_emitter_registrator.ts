import registerEvent from '@js/common/core/events/core/event_registrator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { name as wheelEventName } from '@js/common/core/events/core/wheel';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, isMouseEvent } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import { data as elementData } from '@js/core/element_data';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import { getParentNode } from '@ts/core/utils/m_dom';
import type Emitter from '@ts/events/core/m_emitter';
import type { EmitterEvent } from '@ts/events/core/m_emitter';
import type GestureEmitter from '@ts/events/gesture/m_emitter.gesture';

const MANAGER_EVENT = 'dxEventManager';
const EMITTER_DATA = 'dxEmitter';

type EmitterAction = 'start' | 'move' | 'end';

type ManagerEvent = EmitterEvent & {
  delta?: number;
  shiftKey?: boolean;
};

class EventManager {
  _proxiedCancelHandler: (emitter: Emitter, e?: EmitterEvent) => void;

  _proxiedAcceptHandler: (emitter: Emitter, e?: EmitterEvent) => void;

  _activeEmitters?: Emitter[];

  _emittersSet?: Emitter[];

  constructor() {
    this._attachHandlers();
    this.reset();

    this._proxiedCancelHandler = this._cancelHandler.bind(this);
    this._proxiedAcceptHandler = this._acceptHandler.bind(this);
  }

  _attachHandlers(): void {
    readyCallbacks.add(() => {
      const document = domAdapter.getDocument();
      // @ts-expect-error subscribeGlobal is not declared in the public events engine type
      eventsEngine.subscribeGlobal(document, addNamespace(pointerEvents.down, MANAGER_EVENT), this._pointerDownHandler.bind(this));
      // @ts-expect-error subscribeGlobal is not declared in the public events engine type
      eventsEngine.subscribeGlobal(document, addNamespace(pointerEvents.move, MANAGER_EVENT), this._pointerMoveHandler.bind(this));
      // @ts-expect-error subscribeGlobal is not declared in the public events engine type
      eventsEngine.subscribeGlobal(document, addNamespace([pointerEvents.up, pointerEvents.cancel].join(' '), MANAGER_EVENT), this._pointerUpHandler.bind(this));
      // @ts-expect-error subscribeGlobal is not declared in the public events engine type
      eventsEngine.subscribeGlobal(document, addNamespace(wheelEventName, MANAGER_EVENT), this._mouseWheelHandler.bind(this));
    });
  }

  _eachEmitter(callback: (emitter: Emitter) => unknown): void {
    const activeEmitters = this._activeEmitters ?? [];
    let i = 0;

    while (activeEmitters.length > i) {
      const emitter = activeEmitters[i];
      if (callback(emitter) === false) {
        break;
      }

      if (activeEmitters[i] === emitter) {
        i += 1;
      }
    }
  }

  _applyToEmitters(method: EmitterAction, arg: EmitterEvent): void {
    this._eachEmitter((emitter) => {
      emitter[method](arg);
    });
  }

  reset(): void {
    this._eachEmitter(this._proxiedCancelHandler);
    this._activeEmitters = [];
  }

  resetEmitter(emitter: Emitter): void {
    this._proxiedCancelHandler(emitter);
  }

  _pointerDownHandler(e: ManagerEvent): void {
    if (isMouseEvent(e) && (e.which ?? 0) > 1) {
      return;
    }

    this._updateEmitters(e);
  }

  _updateEmitters(e: ManagerEvent): void {
    if (!this._isSetChanged(e)) {
      return;
    }

    this._cleanEmitters(e);
    this._fetchEmitters(e);
  }

  _isSetChanged(e: ManagerEvent): boolean {
    const currentSet = this._closestEmitter(e);
    const previousSet = this._emittersSet ?? [];

    let setChanged = currentSet.length !== previousSet.length;

    each(currentSet, (index, emitter) => {
      setChanged = setChanged || previousSet[index] !== emitter;
      return !setChanged;
    });

    this._emittersSet = currentSet;

    return setChanged;
  }

  _closestEmitter(e: ManagerEvent): Emitter[] {
    const result: Emitter[] = [];

    const handleEmitter = (_: unknown, emitter: Emitter): void => {
      if (!!emitter && emitter.validatePointers(e) && emitter.validate(e)) {
        emitter.addCancelCallback(this._proxiedCancelHandler);
        emitter.addAcceptCallback(this._proxiedAcceptHandler);
        result.push(emitter);
      }
    };

    let node: Node | null = e.target;
    while (node) {
      const emitters: Record<string, Emitter> | undefined = elementData(node, EMITTER_DATA);
      each(emitters ?? {}, handleEmitter);
      node = getParentNode(node);
    }

    return result;
  }

  _acceptHandler(acceptedEmitter: Emitter, e?: EmitterEvent): void {
    this._eachEmitter((emitter) => {
      if (emitter !== acceptedEmitter) {
        this._cancelEmitter(emitter, e);
      }
    });
  }

  _cancelHandler(canceledEmitter: Emitter, e?: EmitterEvent): void {
    this._cancelEmitter(canceledEmitter, e);
  }

  _cancelEmitter(emitter: Emitter, e?: EmitterEvent): void {
    const activeEmitters = this._activeEmitters;

    if (e) {
      emitter.cancel(e);
    } else {
      emitter.reset();
    }

    emitter.removeCancelCallback();
    emitter.removeAcceptCallback();

    const emitterIndex = activeEmitters ? activeEmitters.indexOf(emitter) : -1;
    if (activeEmitters && emitterIndex > -1) {
      activeEmitters.splice(emitterIndex, 1);
    }
  }

  _cleanEmitters(e: ManagerEvent): void {
    this._applyToEmitters('end', e);
    this.reset();
  }

  _fetchEmitters(e: ManagerEvent): void {
    this._activeEmitters = (this._emittersSet ?? []).slice();
    this._applyToEmitters('start', e);
  }

  _pointerMoveHandler(e: ManagerEvent): void {
    this._applyToEmitters('move', e);
  }

  _pointerUpHandler(e: ManagerEvent): void {
    this._updateEmitters(e);
  }

  _mouseWheelHandler(e: ManagerEvent): void {
    if (!this._allowInterruptionByMouseWheel()) {
      return;
    }

    e.pointers = [null];
    this._pointerDownHandler(e);

    this._adjustWheelEvent(e);

    this._pointerMoveHandler(e);
    e.pointers = [];
    this._pointerUpHandler(e);
  }

  _allowInterruptionByMouseWheel(): boolean {
    let allowInterruption = true;
    this._eachEmitter((emitter) => {
      allowInterruption = emitter.allowInterruptionByMouseWheel() && allowInterruption;
      return allowInterruption;
    });
    return allowInterruption;
  }

  _adjustWheelEvent(e: ManagerEvent): void {
    let closestGestureEmitter: GestureEmitter | null = null;

    this._eachEmitter((emitter) => {
      const gestureEmitter = emitter as GestureEmitter;
      if (!gestureEmitter.gesture) {
        return undefined;
      }

      const direction = gestureEmitter.getDirection(e);
      if ((direction !== 'horizontal' && !e.shiftKey) || (direction !== 'vertical' && e.shiftKey)) {
        closestGestureEmitter = gestureEmitter;
        return false;
      }

      return undefined;
    });

    if (!closestGestureEmitter) {
      return;
    }

    const direction = (closestGestureEmitter as GestureEmitter).getDirection(e);
    const verticalGestureDirection = (direction === 'both' && !e.shiftKey) || direction === 'vertical';
    const prop = verticalGestureDirection ? 'pageY' : 'pageX';

    e[prop] = (e[prop] ?? 0) + (e.delta ?? 0);
  }

  isActive(element: Element): boolean {
    let result = false;
    this._eachEmitter((emitter) => {
      result = result || emitter.getElement().is(element);
    });
    return result;
  }
}

const eventManager = new EventManager();

const EMITTER_SUBSCRIPTION_DATA = 'dxEmitterSubscription';

export interface EmitterRegistrationConfig {
  emitter: new (element: Element) => Emitter;
  events: string[];
  bubble?: boolean;
}

interface EmitterHandleObj {
  selector?: string;
  type?: string;
  data?: Record<string, unknown>;
}

const registerEmitter = function (emitterConfig: EmitterRegistrationConfig): void {
  const EmitterClass = emitterConfig.emitter;
  const emitterName = emitterConfig.events[0];
  const emitterEvents = emitterConfig.events;

  each(emitterEvents, (_, eventName) => {
    registerEvent(eventName, {

      noBubble: !emitterConfig.bubble,

      setup(element: Element) {
        const subscriptions: Record<string, boolean> = elementData(element, EMITTER_SUBSCRIPTION_DATA) ?? {};

        const emitters: Record<string, Emitter> = elementData(element, EMITTER_DATA) ?? {};
        const emitter = emitters[emitterName] ?? new EmitterClass(element);

        subscriptions[eventName] = true;
        emitters[emitterName] = emitter;

        elementData(element, EMITTER_DATA, emitters);
        elementData(element, EMITTER_SUBSCRIPTION_DATA, subscriptions);
      },

      add(element: Element, handleObj: EmitterHandleObj) {
        const emitters: Record<string, Emitter> = elementData(element, EMITTER_DATA);
        const emitter = emitters[emitterName];

        emitter.configure(extend({
          delegateSelector: handleObj.selector,
        }, handleObj.data), handleObj.type);
      },

      teardown(element: Element) {
        const subscriptions: Record<string, boolean> = elementData(element, EMITTER_SUBSCRIPTION_DATA);

        const emitters: Record<string, Emitter> = elementData(element, EMITTER_DATA);
        const emitter = emitters[emitterName];

        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete subscriptions[eventName];

        let disposeEmitter = true;
        each(emitterEvents, (_i, name) => {
          disposeEmitter = disposeEmitter && !subscriptions[name];
          return disposeEmitter;
        });

        if (disposeEmitter) {
          if (eventManager.isActive(element)) {
            eventManager.resetEmitter(emitter);
          }

          emitter?.dispose();
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete emitters[emitterName];
        }
      },

    });
  });
};

export default registerEmitter;
