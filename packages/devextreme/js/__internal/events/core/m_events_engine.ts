import registerEventCallbacks from '@js/common/core/events/core/event_registrator_callbacks';
import hookTouchProps from '@js/common/core/events/core/hook_touch_props';
import { getEventTarget } from '@js/common/core/events/utils/event_target';
import domAdapter from '@js/core/dom_adapter';
import errors from '@js/core/errors';
import callOnce from '@js/core/utils/call_once';
import Callbacks from '@js/core/utils/callbacks';
import injector from '@js/core/utils/dependency_injector';
import { extend } from '@js/core/utils/extend';
import {
  isFunction, isObject, isString, isWindow,
} from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';

const window = getWindow();

/* eslint-disable spellcheck/spell-checker */
const EMPTY_EVENT_NAME = 'dxEmptyEventType';
const NATIVE_EVENTS_TO_SUBSCRIBE = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout',
  pointerenter: 'pointerover',
  pointerleave: 'pointerout',
};
const NATIVE_EVENTS_TO_TRIGGER = {
  focusin: 'focus',
  focusout: 'blur',
};
const NO_BUBBLE_EVENTS = ['blur', 'focus', 'load'];

const forcePassiveFalseEventNames = ['touchmove', 'wheel', 'mousewheel', 'touchstart'];

const EVENT_PROPERTIES = [
  'target',
  'relatedTarget',
  'delegateTarget',
  'altKey',
  'bubbles',
  'cancelable',
  'changedTouches',
  'ctrlKey',
  'detail',
  'eventPhase',
  'metaKey',
  'shiftKey',
  'view',
  'char',
  'code',
  'charCode',
  'key',
  'keyCode',
  'button',
  'buttons',
  'offsetX',
  'offsetY',
  'pointerId',
  'pointerType',
  'targetTouches',
  'toElement',
  'touches',
];

function matchesSafe(target, selector) {
  return !isWindow(target) && target.nodeName !== '#document' && domAdapter.elementMatches(target, selector);
}
const elementDataMap = new WeakMap();
let guid = 0;
let skipEvent;

const special = (function () {
  const specialData = {};

  registerEventCallbacks.add((eventName, eventObject) => {
    specialData[eventName] = eventObject;
  });

  return {
    getField(eventName, field) {
      return specialData[eventName] && specialData[eventName][field];
    },
    callMethod(eventName, methodName, context, args) {
      return specialData[eventName] && specialData[eventName][methodName] && specialData[eventName][methodName].apply(context, args);
    },
  };
}());

const eventsEngine = injector({
  on: getHandler(normalizeOnArguments(iterate((element, eventName, selector, data, handler) => {
    const handlersController = getHandlersController(element, eventName);
    handlersController.addHandler(handler, selector, data);
  }))),

  one: getHandler(normalizeOnArguments((element, eventName, selector, data, handler) => {
    const oneTimeHandler = function () {
      eventsEngine.off(element, eventName, selector, oneTimeHandler);
      handler.apply(this, arguments);
    };

    eventsEngine.on(element, eventName, selector, data, oneTimeHandler);
  })),

  off: getHandler(normalizeOffArguments(iterate((element, eventName, selector, handler) => {
    const handlersController = getHandlersController(element, eventName);
    handlersController.removeHandler(handler, selector);
  }))),

  trigger: getHandler(normalizeTriggerArguments((element, event, extraParameters) => {
    const eventName = event.type;
    const handlersController = getHandlersController(element, event.type);

    special.callMethod(eventName, 'trigger', element, [event, extraParameters]);
    handlersController.callHandlers(event, extraParameters);

    const noBubble = special.getField(eventName, 'noBubble')
      || event.isPropagationStopped()
      || NO_BUBBLE_EVENTS.includes(eventName);

    if (!noBubble) {
      const parents: any = [];
      const getParents = function (element) {
        const parent = element.parentNode
          ?? (isObject(element.host) ? element.host : null);
        if (parent) {
          parents.push(parent);
          getParents(parent);
        }
      };
      getParents(element);
      parents.push(window);

      let i = 0;

      while (parents[i] && !event.isPropagationStopped()) {
        const parentDataByEvent = getHandlersController(parents[i], event.type);
        parentDataByEvent.callHandlers(extend(event, { currentTarget: parents[i] }), extraParameters);
        i++;
      }
    }

    if (element.nodeType || isWindow(element)) {
      special.callMethod(eventName, '_default', element, [event, extraParameters]);
      callNativeMethod(eventName, element);
    }
  })),

  triggerHandler: getHandler(normalizeTriggerArguments((element, event, extraParameters) => {
    const handlersController = getHandlersController(element, event.type);
    handlersController.callHandlers(event, extraParameters);
  })),
});

function applyForEach(args, method) {
  const element = args[0];

  if (!element) {
    return;
  }

  if (domAdapter.isNode(element) || isWindow(element)) {
    method.apply(eventsEngine, args);
  } else if (!isString(element) && 'length' in element) {
    const itemArgs = Array.prototype.slice.call(args, 0);

    Array.prototype.forEach.call(element, (itemElement) => {
      itemArgs[0] = itemElement;
      applyForEach(itemArgs, method);
    });
  } else {
    throw errors.Error('E0025');
  }
}

function getHandler(method) {
  return function () {
    applyForEach(arguments, method);
  };
}

function detectPassiveEventHandlersSupport() {
  let isSupported = false;

  try {
    const options = Object.defineProperty({}, 'passive', {
      get() {
        isSupported = true;
        return true;
      },
    });

    // @ts-expect-error
    window.addEventListener('test', null, options);
    // eslint-disable-next-line no-empty
  } catch (e) { }

  return isSupported;
}

const passiveEventHandlersSupported = callOnce(detectPassiveEventHandlersSupport);

const contains = (container, element) => {
  if (isWindow(container)) {
    return contains(container.document, element);
  }

  return container.contains
    ? container.contains(element)
    : !!(element.compareDocumentPosition(container) & element.DOCUMENT_POSITION_CONTAINS);
};

function getHandlersController(element, eventName) {
  let elementData = elementDataMap.get(element);

  eventName = eventName || '';

  const eventNameParts = eventName.split('.');
  const namespaces = eventNameParts.slice(1);
  const eventNameIsDefined = !!eventNameParts[0];

  eventName = eventNameParts[0] || EMPTY_EVENT_NAME;

  if (!elementData) {
    elementData = {};
    elementDataMap.set(element, elementData);
  }

  if (!elementData[eventName]) {
    elementData[eventName] = {
      handleObjects: [],
      nativeHandler: null,
    };
  }

  const eventData = elementData[eventName];

  return {
    addHandler(handler, selector, data) {
      const callHandler = function (e, extraParameters) {
        const handlerArgs = [e];
        const target = e.currentTarget;
        const { relatedTarget } = e;
        let secondaryTargetIsInside;
        let result;

        if (eventName in NATIVE_EVENTS_TO_SUBSCRIBE) {
          secondaryTargetIsInside = relatedTarget && target && (relatedTarget === target || contains(target, relatedTarget));
        }

        if (extraParameters !== undefined) {
          handlerArgs.push(extraParameters);
        }

        special.callMethod(eventName, 'handle', element, [e, data]);

        if (!secondaryTargetIsInside) {
          result = handler.apply(target, handlerArgs);
        }

        if (result === false) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      const wrappedHandler = function (e, extraParameters) {
        if (skipEvent && e.type === skipEvent) {
          return;
        }

        e.data = data;
        e.delegateTarget = element;

        if (selector) {
          let currentTarget = e.target;

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
            e.target = target;
          }

          callHandler(e, extraParameters);
        }
      };

      const handleObject = {
        handler,
        wrappedHandler,
        selector,
        type: eventName,
        data,
        namespace: namespaces.join('.'),
        namespaces,
        guid: ++guid,
      };

      eventData.handleObjects.push(handleObject);

      const firstHandlerForTheType = eventData.handleObjects.length === 1;
      let shouldAddNativeListener = firstHandlerForTheType && eventNameIsDefined;
      let nativeListenerOptions;

      if (shouldAddNativeListener) {
        shouldAddNativeListener = !special.callMethod(eventName, 'setup', element, [data, namespaces, handler]);
      }

      if (shouldAddNativeListener) {
        eventData.nativeHandler = getNativeHandler(eventName);

        if (passiveEventHandlersSupported() && forcePassiveFalseEventNames.includes(eventName)) {
          nativeListenerOptions = {
            passive: false,
          };
        }
        eventData.removeListener = domAdapter.listen(element, NATIVE_EVENTS_TO_SUBSCRIBE[eventName] || eventName, eventData.nativeHandler, nativeListenerOptions);
      }

      special.callMethod(eventName, 'add', element, [handleObject]);
    },

    removeHandler(handler, selector) {
      const removeByEventName = function (eventName) {
        const eventData = elementData[eventName];

        if (!eventData.handleObjects.length) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete elementData[eventName];
          return;
        }
        let removedHandler;

        eventData.handleObjects = eventData.handleObjects.filter((handleObject) => {
          const skip = namespaces.length && !isSubset(handleObject.namespaces, namespaces)
            || handler && handleObject.handler !== handler
            || selector && handleObject.selector !== selector;

          if (!skip) {
            removedHandler = handleObject.handler;
            special.callMethod(eventName, 'remove', element, [handleObject]);
          }

          return skip;
        });

        const lastHandlerForTheType = !eventData.handleObjects.length;
        const shouldRemoveNativeListener = lastHandlerForTheType && eventName !== EMPTY_EVENT_NAME;

        if (shouldRemoveNativeListener) {
          special.callMethod(eventName, 'teardown', element, [namespaces, removedHandler]);
          if (eventData.nativeHandler) {
            eventData.removeListener();
          }
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete elementData[eventName];
        }
      };

      if (eventNameIsDefined) {
        removeByEventName(eventName);
      } else {
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const name in elementData) {
          removeByEventName(name);
        }
      }

      const elementDataIsEmpty = Object.keys(elementData).length === 0;

      if (elementDataIsEmpty) {
        elementDataMap.delete(element);
      }
    },

    callHandlers(event, extraParameters) {
      let forceStop = false;

      const handleCallback = function (handleObject) {
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

function getNativeHandler(subscribeName) {
  return function (event, extraParameters) {
    const handlersController = getHandlersController(this, subscribeName);
    event = eventsEngine.Event(event);
    handlersController.callHandlers(event, extraParameters);
  };
}

function isSubset(original, checked) {
  for (let i = 0; i < checked.length; i++) {
    if (original.indexOf(checked[i]) < 0) return false;
  }
  return true;
}

function normalizeOnArguments(callback) {
  return function (element, eventName, selector, data, handler) {
    if (!handler) {
      handler = data;
      data = undefined;
    }
    if (typeof selector !== 'string') {
      data = selector;
      selector = undefined;
    }

    if (!handler && typeof eventName === 'string') {
      handler = data || selector;
      selector = undefined;
      data = undefined;
    }

    callback(element, eventName, selector, data, handler);
  };
}

function normalizeOffArguments(callback) {
  return function (element, eventName, selector, handler) {
    if (typeof selector === 'function') {
      handler = selector;
      selector = undefined;
    }

    callback(element, eventName, selector, handler);
  };
}

function normalizeTriggerArguments(callback) {
  return function (element, src, extraParameters) {
    if (typeof src === 'string') {
      src = {
        type: src,
      };
    }

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

    callback(element, src instanceof eventsEngine.Event ? src : eventsEngine.Event(src), extraParameters);
  };
}

function normalizeEventArguments(callback) {
  eventsEngine.Event = function (src, config) {
    if (!(this instanceof eventsEngine.Event)) {
      return new eventsEngine.Event(src, config);
    }

    if (!src) {
      src = {};
    }

    if (typeof src === 'string') {
      src = {
        type: src,
      };
    }

    if (!config) {
      config = {};
    }

    callback.call(this, src, config);
  };
  Object.assign(eventsEngine.Event.prototype, {
    _propagationStopped: false,
    _immediatePropagationStopped: false,
    _defaultPrevented: false,
    isPropagationStopped() {
      return !!(this._propagationStopped || this.originalEvent && this.originalEvent.propagationStopped);
    },
    stopPropagation() {
      this._propagationStopped = true;
      this.originalEvent && this.originalEvent.stopPropagation();
    },
    isImmediatePropagationStopped() {
      return this._immediatePropagationStopped;
    },
    stopImmediatePropagation() {
      this.stopPropagation();
      this._immediatePropagationStopped = true;
      this.originalEvent && this.originalEvent.stopImmediatePropagation();
    },
    isDefaultPrevented() {
      return !!(this._defaultPrevented || this.originalEvent && this.originalEvent.defaultPrevented);
    },
    preventDefault() {
      this._defaultPrevented = true;
      this.originalEvent && this.originalEvent.preventDefault();
    },

  });
  return eventsEngine.Event;
}

function iterate(callback) {
  const iterateEventNames = function (element, eventName) {
    if (eventName && eventName.indexOf(' ') > -1) {
      const args = Array.prototype.slice.call(arguments, 0);
      eventName.split(' ').forEach(function (eventName) {
        args[1] = eventName;
        callback.apply(this, args);
      });
    } else {
      callback.apply(this, arguments);
    }
  };

  return function (element, eventName) {
    if (typeof eventName === 'object') {
      const args: any = Array.prototype.slice.call(arguments, 0);

      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const name in eventName) {
        args[1] = name;
        args[args.length - 1] = eventName[name];
        iterateEventNames.apply(this, args);
      }
    } else {
      // @ts-expect-error
      iterateEventNames.apply(this, arguments);
    }
  };
}

function callNativeMethod(eventName, element) {
  const nativeMethodName = NATIVE_EVENTS_TO_TRIGGER[eventName] || eventName;

  const isLinkClickEvent = function (eventName, element) {
    return eventName === 'click' && element.localName === 'a';
  };

  if (isLinkClickEvent(eventName, element)) return;

  if (isFunction(element[nativeMethodName])) {
    skipEvent = eventName;
    element[nativeMethodName]();
    skipEvent = undefined;
  }
}

function calculateWhich(event) {
  const setForMouseEvent = function (event) {
    const mouseEventRegex = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
    return !event.which && event.button !== undefined && mouseEventRegex.test(event.type);
  };

  const setForKeyEvent = function (event) {
    return event.which == null && event.type.indexOf('key') === 0;
  };

  if (setForKeyEvent(event)) {
    return event.charCode != null ? event.charCode : event.keyCode;
  }

  if (setForMouseEvent(event)) {
    const whichByButton = {
      1: 1, 2: 3, 3: 1, 4: 2,
    };
    return whichByButton[event.button];
  }

  return event.which;
}

function initEvent(EventClass) {
  if (EventClass) {
    eventsEngine.Event = EventClass;
    eventsEngine.Event.prototype = EventClass.prototype;
  }
}

initEvent(normalizeEventArguments(function (src, config) {
  const srcIsEvent = src instanceof eventsEngine.Event
    // @ts-expect-error
    || (hasWindow() && src instanceof window.Event)
    || (src.view?.Event && src instanceof src.view.Event);

  if (srcIsEvent) {
    this.originalEvent = src;
    this.type = src.type;
    this.currentTarget = undefined;
    if (Object.prototype.hasOwnProperty.call(src, 'isTrusted')) {
      this.isTrusted = src.isTrusted;
    }
    this.timeStamp = src.timeStamp || Date.now();
  } else {
    Object.assign(this, src);
  }

  addProperty('which', calculateWhich, this);

  if (src.type.indexOf('touch') === 0) {
    delete config.pageX;
    delete config.pageY;
  }

  Object.assign(this, config);

  this.guid = ++guid;
}));

function addProperty(propName, hook, eventInstance) {
  Object.defineProperty(eventInstance || eventsEngine.Event.prototype, propName, {
    enumerable: true,
    configurable: true,

    get() {
      return this.originalEvent && hook(this.originalEvent);
    },

    set(value) {
      Object.defineProperty(this, propName, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      });
    },
  });
}
// @ts-expect-error
EVENT_PROPERTIES.forEach((prop) => addProperty(prop, (event) => event[prop]));
hookTouchProps(addProperty);

const beforeSetStrategy = Callbacks();
const afterSetStrategy = Callbacks();

eventsEngine.set = function (engine) {
  beforeSetStrategy.fire();
  eventsEngine.inject(engine);
  initEvent(engine.Event);
  afterSetStrategy.fire();
};

eventsEngine.subscribeGlobal = function () {
  applyForEach(arguments, normalizeOnArguments(function () {
    const args = arguments;

    eventsEngine.on.apply(this, args);

    beforeSetStrategy.add(function () {
      const offArgs = Array.prototype.slice.call(args, 0);
      offArgs.splice(3, 1);
      eventsEngine.off.apply(this, offArgs);
    });

    afterSetStrategy.add(function () {
      eventsEngine.on.apply(this, args);
    });
  }));
};

eventsEngine.forcePassiveFalseEventNames = forcePassiveFalseEventNames;
eventsEngine.passiveEventHandlersSupported = passiveEventHandlersSupported;

/// #DEBUG
eventsEngine.elementDataMap = elementDataMap;
eventsEngine.detectPassiveEventHandlersSupport = detectPassiveEventHandlersSupport;

/// #ENDDEBUG

export default eventsEngine;
