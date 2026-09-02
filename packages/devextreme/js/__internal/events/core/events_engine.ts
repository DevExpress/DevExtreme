import registerEventCallbacks from '@js/common/core/events/core/event_registrator_callbacks';
import domAdapter from '@js/core/dom_adapter';
import errors from '@js/core/errors';
import type { dxElementWrapper } from '@js/core/renderer';
import callOnce from '@js/core/utils/call_once';
import Callbacks from '@js/core/utils/callbacks';
import {
  isFunction, isObject, isString, isWindow,
} from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import type { Injectable, Injection } from '@ts/core/utils/dependency_injector';
import { injector } from '@ts/core/utils/dependency_injector';
import {
  EMPTY_EVENT_NAME,
  EVENT_PROPERTIES,
  forcePassiveFalseEventNames,
  NATIVE_EVENTS_TO_SUBSCRIBE,
  NATIVE_EVENTS_TO_TRIGGER,
  NO_BUBBLE_EVENTS,
} from '@ts/events/core/consts';
import type { RegisteredEventStrategy } from '@ts/events/core/event_registrator';
import hookTouchProps from '@ts/events/core/hook_touch_props';
import { getEventTarget } from '@ts/events/utils/event_target';

/* eslint-disable @typescript-eslint/method-signature-style */

export type EngineTarget = EventTarget & {
  nodeType?: number;
  nodeName?: string;
  localName?: string;
  shadowRoot?: ShadowRoot | null;
  parentNode?: EngineTarget | null;
  host?: EngineTarget | null;
  document?: Document;
  DOCUMENT_POSITION_CONTAINS?: number;
  contains?(other: EngineTarget | null): boolean;
  compareDocumentPosition?(other: EngineTarget): number;
};

export type EventsEngineTarget = EngineTarget
  | ArrayLike<EngineTarget>
  | dxElementWrapper
  | null
  | undefined;

type ProxiedEventProperty = typeof EVENT_PROPERTIES[number];

export type WrappedEvent = Partial<Record<ProxiedEventProperty, unknown>> & {
  type?: string;
  target?: EngineTarget | null;
  relatedTarget?: EngineTarget | null;
  originalEvent?: WrappedEvent;
  which?: number;
  button?: number;
  charCode?: number;
  keyCode?: number;
  pageX?: number;
  pageY?: number;
  screenX?: number;
  screenY?: number;
  clientX?: number;
  clientY?: number;
  touches?: ArrayLike<Touch> | null;
  changedTouches?: ArrayLike<Touch> | null;
  timeStamp?: number;
  isTrusted?: boolean;
  defaultPrevented?: boolean;
  propagationStopped?: boolean;
  preventDefault?(): void;
  stopPropagation?(): void;
  stopImmediatePropagation?(): void;
};

export type EventPropertyBag = WrappedEvent & Record<string, unknown>;

export type EventSource = string | WrappedEvent | EventPropertyBag;

export interface EngineEvent {
  type: string;
  target: EngineTarget;
  currentTarget: EngineTarget;
  delegateTarget: EngineTarget;
  relatedTarget?: EngineTarget | null;
  originalEvent?: WrappedEvent;
  data?: unknown;
  which?: number;
  timeStamp?: number;
  guid?: number;
  isTrusted?: boolean;
  isDefaultPrevented(): boolean;
  isImmediatePropagationStopped(): boolean;
  isPropagationStopped(): boolean;
  preventDefault(): void;
  stopImmediatePropagation(): void;
  stopPropagation(): void;
}

export type EventHandler<TEvent extends EngineEvent = EngineEvent> = (
  this: EngineTarget,
  event: TEvent,
  extraParameters?: unknown,
) => unknown;

export type EventHandlerMap<TEvent extends EngineEvent = EngineEvent> = Record<
  string, EventHandler<TEvent>
>;

export type EventNames<TEvent extends EngineEvent = EngineEvent> = string
  | EventHandlerMap<TEvent>;

export type EventSelectorOrData = string | object | null | undefined;

export interface HandleObject {
  handler: EventHandler;
  wrappedHandler: (event: EngineEvent, extraParameters?: unknown) => void;
  selector: string | undefined;
  type: string;
  data: unknown;
  namespace: string;
  namespaces: string[];
  guid: number;
}

interface EventTypeData {
  handleObjects: HandleObject[];
  nativeHandler: ((event: WrappedEvent, extraParameters?: unknown) => void) | null;
  removeListener?: () => void;
}

type ElementEventData = Record<string, EventTypeData>;

export interface EventsEngineCore {
  on<TEvent extends EngineEvent = EngineEvent>(
    target: EventsEngineTarget, handlers: EventHandlerMap<TEvent>): void;
  on<TEvent extends EngineEvent = EngineEvent>(
    target: EventsEngineTarget, eventNames: EventNames<TEvent>,
    handler: EventHandler<TEvent>): void;
  on<TEvent extends EngineEvent = EngineEvent>(
    target: EventsEngineTarget, eventNames: EventNames<TEvent>,
    selectorOrData: EventSelectorOrData, handler: EventHandler<TEvent>): void;
  on<TEvent extends EngineEvent = EngineEvent>(
    target: EventsEngineTarget, eventNames: EventNames<TEvent>,
    selector: string | null | undefined, data: unknown, handler: EventHandler<TEvent>): void;

  one<TEvent extends EngineEvent = EngineEvent>(
    target: EventsEngineTarget, eventNames: EventNames<TEvent>,
    handler: EventHandler<TEvent>): void;
  one<TEvent extends EngineEvent = EngineEvent>(
    target: EventsEngineTarget, eventNames: EventNames<TEvent>,
    selectorOrData: EventSelectorOrData, handler: EventHandler<TEvent>): void;
  one<TEvent extends EngineEvent = EngineEvent>(
    target: EventsEngineTarget, eventNames: EventNames<TEvent>,
    selector: string | null | undefined, data: unknown, handler: EventHandler<TEvent>): void;

  off(target: EventsEngineTarget, eventNames?: EventNames): void;
  off<TEvent extends EngineEvent = EngineEvent>(
    target: EventsEngineTarget, eventNames: EventNames<TEvent>,
    handler: EventHandler<TEvent> | undefined): void;
  off<TEvent extends EngineEvent = EngineEvent>(
    target: EventsEngineTarget, eventNames: EventNames<TEvent>,
    selector: string | null | undefined, handler?: EventHandler<TEvent>): void;

  trigger(target: EventsEngineTarget, event: EventSource, extraParameters?: unknown): void;
  triggerHandler(target: EventsEngineTarget, event: EventSource, extraParameters?: unknown): void;
}

export type EventsEngineInjection = Injection<EventsEngineCore> & {
  Event?: DxEventConstructor;
};

export interface DxEventConstructor {
  prototype: EngineEventPrototype;
  new (src?: EventSource, config?: EventPropertyBag): EngineEvent;
  (src?: EventSource, config?: EventPropertyBag): EngineEvent;
}

export interface EngineEventPrototype {
  _propagationStopped: boolean;
  _immediatePropagationStopped: boolean;
  _defaultPrevented: boolean;
  originalEvent?: WrappedEvent;
  isPropagationStopped(): boolean;
  stopPropagation(): void;
  isImmediatePropagationStopped(): boolean;
  stopImmediatePropagation(): void;
  isDefaultPrevented(): boolean;
  preventDefault(): void;
}

interface EventsEngineExtension {
  Event: DxEventConstructor;
  forcePassiveFalseEventNames: string[];
  elementDataMap?: WeakMap<EngineTarget, ElementEventData>;
  set(engine: EventsEngineInjection): void;
  subscribeGlobal<TEvent extends EngineEvent = EngineEvent>(
    target: EventsEngineTarget, eventNames: EventNames<TEvent>,
    handler: EventHandler<TEvent>): void;
  passiveEventHandlersSupported(): boolean;
  detectPassiveEventHandlersSupport?(): boolean;
}

/* eslint-enable @typescript-eslint/method-signature-style */

export type EventsEngine = Injectable<EventsEngineCore> & EventsEngineExtension;

type PublicDispatch = (target: EventsEngineTarget, ...args: unknown[]) => void;
type EngineDispatch = (target: EngineTarget, ...args: unknown[]) => void;

interface HandlersController {
  addHandler: (handler: EventHandler, selector: string | undefined, data: unknown) => void;
  removeHandler: (handler: EventHandler | undefined, selector: string | undefined) => void;
  callHandlers: (event: EngineEvent, extraParameters: unknown) => void;
}

const window = getWindow();

const elementDataMap = new WeakMap<EngineTarget, ElementEventData>();
let guid = 0;
let skipEvent = '';

// eslint-disable-next-line @typescript-eslint/init-declarations
let engine: EventsEngine;

const specialData: Record<string, RegisteredEventStrategy> = {};

registerEventCallbacks.add((eventName: string, strategy: RegisteredEventStrategy): void => {
  specialData[eventName] = strategy;
});

const getEventStrategy = (eventName: string): RegisteredEventStrategy | undefined => (
  specialData[eventName]
);

const isEventHandler = (value: unknown): value is EventHandler => typeof value === 'function';

const isTargetCollection = (value: unknown): value is ArrayLike<unknown> => (
  (typeof value === 'object' || typeof value === 'function')
  && value !== null
  && 'length' in value
);

function matchesSafe(target: EngineTarget, selector: string): boolean {
  return !isWindow(target) && target.nodeName !== '#document'
    && domAdapter.elementMatches(target, selector);
}

function contains(container: EngineTarget, element: EngineTarget): boolean {
  if (isWindow(container)) {
    return contains(container.document, element);
  }

  if (container.contains) {
    return container.contains(element);
  }

  const position = element.compareDocumentPosition?.(container) ?? 0;

  // eslint-disable-next-line no-bitwise
  return !!(position & (element.DOCUMENT_POSITION_CONTAINS ?? 0));
}

function getParent(node: EngineTarget): EngineTarget | null {
  return node.parentNode ?? (isObject(node.host) ? node.host : null);
}

function isSubset(original: string[], checked: string[]): boolean {
  return checked.every((namespace) => original.includes(namespace));
}

function detectPassiveEventHandlersSupport(): boolean {
  let isSupported = false;

  try {
    const options = Object.defineProperty({}, 'passive', {
      get() {
        isSupported = true;
        return true;
      },
    });

    const target: EventTarget = window;
    target.addEventListener('test', null, options);
    // eslint-disable-next-line no-empty
  } catch (e) { }

  return isSupported;
}

const passiveEventHandlersSupported = callOnce(detectPassiveEventHandlersSupport);

function calculateWhich(event: WrappedEvent): unknown {
  const isMouseEvent = (): boolean => {
    const mouseEventRegex = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
    return !event.which && event.button !== undefined && mouseEventRegex.test(event.type ?? '');
  };

  const isKeyEvent = (): boolean => event.which == null && !!event.type?.startsWith('key');

  if (isKeyEvent()) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return event.charCode != null ? event.charCode : event.keyCode;
  }

  if (isMouseEvent()) {
    const whichByButton: Record<number, number> = {
      1: 1, 2: 3, 3: 1, 4: 2,
    };
    return whichByButton[event.button ?? 0];
  }

  return event.which;
}

function callNativeMethod(eventName: string, element: EngineTarget): void {
  const nativeMethodName = NATIVE_EVENTS_TO_TRIGGER[eventName] || eventName;

  const isLinkClickEvent = eventName === 'click' && element.localName === 'a';

  if (isLinkClickEvent) {
    return;
  }

  const nativeMethod: unknown = Reflect.get(element, nativeMethodName);

  if (isFunction(nativeMethod)) {
    skipEvent = eventName;
    Reflect.apply(nativeMethod, element, []);
    skipEvent = '';
  }
}

function applyForEach(target: unknown, args: unknown[], method: EngineDispatch): void {
  if (!target) {
    return;
  }

  if (domAdapter.isNode(target) || isWindow(target)) {
    method(target, ...args);
  } else if (!isString(target) && isTargetCollection(target)) {
    const { length } = target;

    for (let index = 0; index < length; index += 1) {
      applyForEach(target[index], args, method);
    }
  } else {
    throw errors.Error('E0025');
  }
}

function getHandler(method: EngineDispatch): PublicDispatch {
  return function handleTargets(target, ...args): void {
    applyForEach(target, args, method);
  };
}

function getHandlersController(
  element: EngineTarget,
  eventNameWithNamespaces: string,
): HandlersController {
  let storedData = elementDataMap.get(element);

  const eventNameParts = (eventNameWithNamespaces || '').split('.');
  const namespaces = eventNameParts.slice(1);
  const eventNameIsDefined = !!eventNameParts[0];
  const eventName = eventNameParts[0] || EMPTY_EVENT_NAME;

  if (!storedData) {
    storedData = {};
    elementDataMap.set(element, storedData);
  }

  const elementData = storedData;

  if (!elementData[eventName]) {
    elementData[eventName] = {
      handleObjects: [],
      nativeHandler: null,
    };
  }

  const eventData = elementData[eventName];

  return {
    addHandler(handler, selector, data): void {
      const callHandler = (e: EngineEvent, extraParameters: unknown): void => {
        const handlerArgs: [EngineEvent, unknown?] = [e];
        const target = e.currentTarget;
        const { relatedTarget } = e;

        const secondaryTargetIsInside = eventName in NATIVE_EVENTS_TO_SUBSCRIBE
          && !!relatedTarget && !!target
          && (relatedTarget === target || contains(target, relatedTarget));

        if (extraParameters !== undefined) {
          handlerArgs.push(extraParameters);
        }

        getEventStrategy(eventName)?.handle?.call(element, e, data);

        const result = secondaryTargetIsInside
          ? undefined
          : handler.apply(target, handlerArgs);

        if (result === false) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      const wrappedHandler = (e: EngineEvent, extraParameters?: unknown): void => {
        if (skipEvent && e.type === skipEvent) {
          return;
        }

        e.data = data;
        e.delegateTarget = element;

        if (selector) {
          let currentTarget: EngineTarget | null | undefined = e.target;

          while (currentTarget && currentTarget !== element) {
            if (matchesSafe(currentTarget, selector)) {
              e.currentTarget = currentTarget;
              callHandler(e, extraParameters);
            }
            currentTarget = currentTarget.parentNode;
          }
        } else {
          e.currentTarget = e.delegateTarget || e.target;

          const isTargetInShadowDOM = Boolean(e.target?.shadowRoot);
          if (isTargetInShadowDOM) {
            const target = getEventTarget(e);
            if (target) {
              e.target = target;
            }
          }

          callHandler(e, extraParameters);
        }
      };

      guid += 1;

      const handleObject: HandleObject = {
        handler,
        wrappedHandler,
        selector,
        type: eventName,
        data,
        namespace: namespaces.join('.'),
        namespaces,
        guid,
      };

      eventData.handleObjects.push(handleObject);

      const firstHandlerForTheType = eventData.handleObjects.length === 1;
      let shouldAddNativeListener = firstHandlerForTheType && eventNameIsDefined;

      if (shouldAddNativeListener) {
        shouldAddNativeListener = !getEventStrategy(eventName)
          ?.setup?.call(element, data, namespaces, handler);
      }

      if (shouldAddNativeListener) {
        eventData.nativeHandler = (nativeEvent, nativeExtraParameters): void => {
          getHandlersController(element, eventName)
            .callHandlers(engine.Event(nativeEvent), nativeExtraParameters);
        };

        const nativeListenerOptions = passiveEventHandlersSupported()
          && forcePassiveFalseEventNames.includes(eventName)
          ? { passive: false }
          : undefined;

        eventData.removeListener = domAdapter.listen(
          element,
          NATIVE_EVENTS_TO_SUBSCRIBE[eventName] || eventName,
          eventData.nativeHandler,
          nativeListenerOptions,
        );
      }

      getEventStrategy(eventName)?.add?.call(element, handleObject);
    },

    removeHandler(handler, selector): void {
      const removeByEventName = (currentEventName: string): void => {
        const currentEventData = elementData[currentEventName];

        if (!currentEventData) {
          return;
        }

        if (!currentEventData.handleObjects.length) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete elementData[currentEventName];
          return;
        }

        // eslint-disable-next-line @typescript-eslint/init-declarations
        let removedHandler: EventHandler | undefined;

        currentEventData.handleObjects = currentEventData.handleObjects.filter((handleObject) => {
          const skip = (namespaces.length && !isSubset(handleObject.namespaces, namespaces))
            || (handler && handleObject.handler !== handler)
            || (selector && handleObject.selector !== selector);

          if (!skip) {
            removedHandler = handleObject.handler;
            getEventStrategy(currentEventName)?.remove?.call(element, handleObject);
          }

          return skip;
        });

        const lastHandlerForTheType = !currentEventData.handleObjects.length;
        const shouldRemoveNativeListener = lastHandlerForTheType
          && currentEventName !== EMPTY_EVENT_NAME;

        if (shouldRemoveNativeListener) {
          getEventStrategy(currentEventName)?.teardown?.call(element, namespaces, removedHandler);
          if (currentEventData.nativeHandler) {
            currentEventData.removeListener?.();
          }
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete elementData[currentEventName];
        }
      };

      if (eventNameIsDefined) {
        removeByEventName(eventName);
      } else {
        Object.keys(elementData).forEach(removeByEventName);
      }

      const elementDataIsEmpty = Object.keys(elementData).length === 0;

      if (elementDataIsEmpty) {
        elementDataMap.delete(element);
      }
    },

    callHandlers(event, extraParameters): void {
      let forceStop = false;

      const handleCallback = (handleObject: HandleObject): void => {
        if (forceStop) {
          return;
        }

        if (!namespaces.length || isSubset(handleObject.namespaces, namespaces)) {
          handleObject.wrappedHandler(event, extraParameters);
          forceStop = event.isImmediatePropagationStopped();
        }
      };

      eventData.handleObjects.forEach(handleCallback);
      if (namespaces.length && elementData[EMPTY_EVENT_NAME]) {
        elementData[EMPTY_EVENT_NAME].handleObjects.forEach(handleCallback);
      }
    },
  };
}

type OnCallback = (
  element: EngineTarget,
  eventName: string,
  selector: string | undefined,
  data: unknown,
  handler: EventHandler,
) => void;

type OnDispatch = (
  element: EngineTarget,
  eventNames: EventNames,
  selector: string | undefined,
  data: unknown,
  handler: EventHandler,
) => void;

type OffCallback = (
  element: EngineTarget,
  eventName: string,
  selector: string | undefined,
  handler: EventHandler | undefined,
) => void;

type OffDispatch = (
  element: EngineTarget,
  eventNames: EventNames,
  selector: string | undefined,
  handler: EventHandler | undefined,
) => void;

type TriggerCallback = (
  element: EngineTarget,
  event: EngineEvent,
  extraParameters: unknown,
) => void;

const asEventNames = (value: unknown): EventNames => {
  if (isString(value)) {
    return value;
  }

  // Covers null too, so `off(element, null)` keeps iterating nothing instead of every event.
  if (typeof value === 'object') {
    return (value ?? {}) as EventHandlerMap;
  }

  return '';
};

function normalizeOnArguments(callback: OnDispatch): EngineDispatch {
  return function normalizeOn(element, ...args): void {
    const [eventNames] = args;
    let [, selector, data, handler] = args;

    if (!handler) {
      handler = data;
      data = undefined;
    }
    if (!isString(selector)) {
      data = selector;
      selector = undefined;
    }

    if (!handler && isString(eventNames)) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      handler = data || selector;
      selector = undefined;
      data = undefined;
    }

    callback(
      element,
      asEventNames(eventNames),
      isString(selector) ? selector : undefined,
      data,
      handler as EventHandler,
    );
  };
}

function normalizeOffArguments(callback: OffDispatch): EngineDispatch {
  return function normalizeOff(element, ...args): void {
    const [eventNames] = args;
    let [, selector, handler] = args;

    if (isEventHandler(selector)) {
      handler = selector;
      selector = undefined;
    }

    callback(
      element,
      asEventNames(eventNames),
      isString(selector) ? selector : undefined,
      handler as EventHandler | undefined,
    );
  };
}

function normalizeTriggerArguments(callback: TriggerCallback): EngineDispatch {
  return function normalizeTrigger(element, ...args): void {
    const [source, extraParameters] = args;
    const src: EventPropertyBag = isString(source)
      ? { type: source }
      : source as EventPropertyBag;

    if (!src.target) {
      src.target = element;
    }

    src.currentTarget = element;

    if (!src.delegateTarget) {
      src.delegateTarget = element;
    }

    if (!src.type && src.originalEvent) {
      src.type = src.originalEvent.type;
    }

    const event = src instanceof engine.Event
      ? src as unknown as EngineEvent
      : engine.Event(src);

    callback(element, event, extraParameters);
  };
}

function forEachEventName(eventNames: string, action: (eventName: string) => void): void {
  if (eventNames.includes(' ')) {
    eventNames.split(' ').forEach(action);
  } else {
    action(eventNames);
  }
}

function iterateOnArguments(callback: OnCallback): OnDispatch {
  return (element, eventNames, selector, data, handler): void => {
    if (isString(eventNames)) {
      forEachEventName(eventNames, (eventName) => {
        callback(element, eventName, selector, data, handler);
      });
      return;
    }

    Object.keys(eventNames).forEach((name) => {
      forEachEventName(name, (eventName) => {
        callback(element, eventName, selector, data, eventNames[name]);
      });
    });
  };
}

function iterateOffArguments(callback: OffCallback): OffDispatch {
  return (element, eventNames, selector, handler): void => {
    if (isString(eventNames)) {
      forEachEventName(eventNames, (eventName) => {
        callback(element, eventName, selector, handler);
      });
      return;
    }

    Object.keys(eventNames).forEach((name) => {
      forEachEventName(name, (eventName) => {
        callback(element, eventName, selector, eventNames[name]);
      });
    });
  };
}

function addProperty(
  propName: string,
  hook: (event: WrappedEvent) => unknown,
  eventInstance?: EngineEvent,
): void {
  Object.defineProperty(eventInstance ?? engine.Event.prototype, propName, {
    enumerable: true,
    configurable: true,

    get(this: EngineEventPrototype) {
      return this.originalEvent && hook(this.originalEvent);
    },

    set(this: EngineEventPrototype, value: unknown) {
      Object.defineProperty(this, propName, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      });
    },
  });
}

type EventInitializer = (
  this: EngineEvent,
  src: EventPropertyBag,
  config: EventPropertyBag,
) => void;

function normalizeEventArguments(initialize: EventInitializer): DxEventConstructor {
  const EventConstructor = function EventConstructor(
    this: EngineEvent,
    src?: EventSource,
    config?: EventPropertyBag,
  ): EngineEvent | undefined {
    if (!(this instanceof engine.Event)) {
      return new engine.Event(src, config);
    }

    const source: EventPropertyBag = isString(src)
      ? { type: src }
      : (src ?? {}) as EventPropertyBag;

    initialize.call(this, source, config ?? {});

    return undefined;
  } as DxEventConstructor;

  const eventPrototype: EngineEventPrototype = {
    _propagationStopped: false,
    _immediatePropagationStopped: false,
    _defaultPrevented: false,
    isPropagationStopped(this: EngineEventPrototype): boolean {
      return !!(this._propagationStopped || this.originalEvent?.propagationStopped);
    },
    stopPropagation(this: EngineEventPrototype): void {
      this._propagationStopped = true;
      this.originalEvent?.stopPropagation?.();
    },
    isImmediatePropagationStopped(this: EngineEventPrototype): boolean {
      return this._immediatePropagationStopped;
    },
    stopImmediatePropagation(this: EngineEventPrototype): void {
      this.stopPropagation();
      this._immediatePropagationStopped = true;
      this.originalEvent?.stopImmediatePropagation?.();
    },
    isDefaultPrevented(this: EngineEventPrototype): boolean {
      return !!(this._defaultPrevented || this.originalEvent?.defaultPrevented);
    },
    preventDefault(this: EngineEventPrototype): void {
      this._defaultPrevented = true;
      this.originalEvent?.preventDefault?.();
    },
  };

  Object.assign(EventConstructor.prototype, eventPrototype);

  return EventConstructor;
}

function initEvent(EventClass: DxEventConstructor | undefined): void {
  if (EventClass) {
    engine.Event = EventClass;
    engine.Event.prototype = EventClass.prototype;
  }
}

const beforeSetStrategy = Callbacks();
const afterSetStrategy = Callbacks();

const setStrategy = (injection: EventsEngineInjection): void => {
  beforeSetStrategy.fire();
  engine.inject(injection);
  initEvent(injection.Event);
  afterSetStrategy.fire();
};

const subscribeGlobal: PublicDispatch = (target, ...args): void => {
  const subscribe = normalizeOnArguments((element, eventNames, selector, data, handler) => {
    engine.on(element, eventNames, selector, data, handler);

    beforeSetStrategy.add(() => {
      engine.off(element, eventNames, selector, handler);
    });

    afterSetStrategy.add(() => {
      engine.on(element, eventNames, selector, data, handler);
    });
  });

  applyForEach(target, args, subscribe);
};

const isEventOfView = (src: unknown, view: unknown): boolean => {
  const eventConstructor: unknown = isObject(view) ? Reflect.get(view, 'Event') : undefined;

  return isFunction(eventConstructor) && src instanceof eventConstructor;
};

const dxEvent = normalizeEventArguments(function initializeEvent(src, config): void {
  const srcIsEvent = src instanceof engine.Event
    || isEventOfView(src, hasWindow() ? window : undefined)
    || isEventOfView(src, src.view);

  if (srcIsEvent) {
    this.originalEvent = src;
    this.type = src.type ?? '';
    this.currentTarget = undefined as unknown as EngineTarget;
    if (Object.prototype.hasOwnProperty.call(src, 'isTrusted')) {
      this.isTrusted = src.isTrusted;
    }
    this.timeStamp = src.timeStamp || Date.now();
  } else {
    Object.assign(this, src);
  }

  addProperty('which', calculateWhich, this);

  if (src.type?.startsWith('touch')) {
    delete config.pageX;
    delete config.pageY;
  }

  Object.assign(this, config);

  guid += 1;
  this.guid = guid;
});

engine = Object.assign(
  injector<EventsEngineCore>({
    on: getHandler(normalizeOnArguments(iterateOnArguments(
      (element, eventName, selector, data, handler) => {
        getHandlersController(element, eventName).addHandler(handler, selector, data);
      },
    ))),

    one: getHandler(normalizeOnArguments((element, eventNames, selector, data, handler) => {
      const oneTimeHandler: EventHandler = function oneTimeHandler(this: EngineTarget, ...args) {
        engine.off(element, eventNames, selector, oneTimeHandler);
        handler.apply(this, args);
      };

      engine.on(element, eventNames, selector, data, oneTimeHandler);
    })),

    off: getHandler(normalizeOffArguments(iterateOffArguments(
      (element, eventName, selector, handler) => {
        getHandlersController(element, eventName).removeHandler(handler, selector);
      },
    ))),

    trigger: getHandler(normalizeTriggerArguments((element, event, extraParameters) => {
      const eventName = event.type;
      const handlersController = getHandlersController(element, eventName);

      getEventStrategy(eventName)?.trigger?.call(element, event, extraParameters);
      handlersController.callHandlers(event, extraParameters);

      const noBubble = getEventStrategy(eventName)?.noBubble
        || event.isPropagationStopped()
        || NO_BUBBLE_EVENTS.includes(eventName);

      if (!noBubble) {
        const parents: EngineTarget[] = [];

        for (let parent = getParent(element); parent; parent = getParent(parent)) {
          parents.push(parent);
        }
        parents.push(window);

        let i = 0;

        while (parents[i] && !event.isPropagationStopped()) {
          event.currentTarget = parents[i];
          getHandlersController(parents[i], eventName).callHandlers(event, extraParameters);
          i += 1;
        }
      }

      if (element.nodeType || isWindow(element)) {
        getEventStrategy(eventName)?._default?.call(element, event, extraParameters);
        callNativeMethod(eventName, element);
      }
    })),

    triggerHandler: getHandler(normalizeTriggerArguments((element, event, extraParameters) => {
      getHandlersController(element, event.type).callHandlers(event, extraParameters);
    })),
  }),
  {
    Event: dxEvent,
    forcePassiveFalseEventNames,
    set: setStrategy,
    subscribeGlobal,
    passiveEventHandlersSupported,
  },
);

EVENT_PROPERTIES.forEach((prop) => addProperty(prop, (event) => event[prop]));
hookTouchProps(addProperty);

const eventsEngine = engine;

/// #DEBUG
eventsEngine.elementDataMap = elementDataMap;
eventsEngine.detectPassiveEventHandlersSupport = detectPassiveEventHandlersSupport;

/// #ENDDEBUG

export default eventsEngine;
