import callbacks from '@js/common/core/events/core/event_registrator_callbacks';
import type { EngineEvent, EventHandler, HandleObject } from '@ts/events/core/events_engine';

/* eslint-disable @typescript-eslint/method-signature-style */

export interface EventRegistration {
  noBubble?: boolean;
  bindType?: string;
  delegateType?: string;
  setup?(
    element: EventTarget,
    data: unknown,
    namespaces: string[],
    handler: EventHandler,
  ): unknown;
  teardown?(
    element: EventTarget,
    namespaces: string[],
    removedHandler: EventHandler | undefined,
  ): unknown;
  add?(element: EventTarget, handleObject: HandleObject): unknown;
  remove?(element: EventTarget, handleObject: HandleObject): unknown;
  trigger?(element: EventTarget, event: EngineEvent, extraParameters: unknown): unknown;
  handle?(element: EventTarget, event: EngineEvent, data: unknown): unknown;
  _default?(element: EventTarget, event: EngineEvent, extraParameters: unknown): unknown;
  dispose?(element?: EventTarget): unknown;
}

export interface RegisteredEventStrategy {
  noBubble?: boolean;
  bindType?: string;
  delegateType?: string;
  setup?(
    this: EventTarget,
    data: unknown,
    namespaces: string[],
    handler: EventHandler,
  ): unknown;
  teardown?(
    this: EventTarget,
    namespaces: string[],
    removedHandler: EventHandler | undefined,
  ): unknown;
  add?(this: EventTarget, handleObject: HandleObject): unknown;
  remove?(this: EventTarget, handleObject: HandleObject): unknown;
  trigger?(this: EventTarget, event: EngineEvent, extraParameters: unknown): unknown;
  handle?(this: EventTarget, event: EngineEvent, data: unknown): unknown;
  _default?(this: EventTarget, event: EngineEvent, extraParameters: unknown): unknown;
  dispose?(this: EventTarget): unknown;
}

/* eslint-enable @typescript-eslint/method-signature-style */

const registerEvent = function (name: string, eventObject: EventRegistration): void {
  const strategy: RegisteredEventStrategy = {};

  if ('noBubble' in eventObject) {
    strategy.noBubble = eventObject.noBubble;
  }

  if ('bindType' in eventObject) {
    strategy.bindType = eventObject.bindType;
  }

  if ('delegateType' in eventObject) {
    strategy.delegateType = eventObject.delegateType;
  }

  const {
    setup, teardown, add, remove, trigger, handle, _default: defaultAction, dispose,
  } = eventObject;

  if (setup) {
    strategy.setup = function setupEvent(data, namespaces, handler): unknown {
      return setup.call(eventObject, this, data, namespaces, handler);
    };
  }

  if (teardown) {
    strategy.teardown = function teardownEvent(namespaces, removedHandler): unknown {
      return teardown.call(eventObject, this, namespaces, removedHandler);
    };
  }

  if (add) {
    strategy.add = function addHandler(handleObject): unknown {
      return add.call(eventObject, this, handleObject);
    };
  }

  if (remove) {
    strategy.remove = function removeHandler(handleObject): unknown {
      return remove.call(eventObject, this, handleObject);
    };
  }

  if (trigger) {
    strategy.trigger = function triggerEvent(event, extraParameters): unknown {
      return trigger.call(eventObject, this, event, extraParameters);
    };
  }

  if (handle) {
    strategy.handle = function handleEvent(event, data): unknown {
      return handle.call(eventObject, this, event, data);
    };
  }

  if (defaultAction) {
    strategy._default = function defaultEventAction(event, extraParameters): unknown {
      return defaultAction.call(eventObject, this, event, extraParameters);
    };
  }

  if (dispose) {
    strategy.dispose = function disposeEvent(): unknown {
      return dispose.call(eventObject, this);
    };
  }

  callbacks.fire(name, strategy);
};

registerEvent.callbacks = callbacks;

export default registerEvent;
