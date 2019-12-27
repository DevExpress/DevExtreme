const registerEventCallbacks = require('./event_registrator_callbacks');
const extend = require('../../core/utils/extend').extend;
const domAdapter = require('../../core/dom_adapter');
const windowUtils = require('../../core/utils/window');
const window = windowUtils.getWindow();
const injector = require('../../core/utils/dependency_injector');
const typeUtils = require('../../core/utils/type');
const Callbacks = require('../../core/utils/callbacks');
const isWindow = typeUtils.isWindow;
const isFunction = typeUtils.isFunction;
const isString = typeUtils.isString;
const errors = require('../../core/errors');
const WeakMap = require('../../core/polyfills/weak_map');
const hookTouchProps = require('../../events/core/hook_touch_props');
const callOnce = require('../../core/utils/call_once');

const EMPTY_EVENT_NAME = 'dxEmptyEventType';
const NATIVE_EVENTS_TO_SUBSCRIBE = {
    'mouseenter': 'mouseover',
    'mouseleave': 'mouseout',
    'pointerenter': 'pointerover',
    'pointerleave': 'pointerout'
};
const NATIVE_EVENTS_TO_TRIGGER = {
    'focusin': 'focus',
    'focusout': 'blur'
};
const NO_BUBBLE_EVENTS = ['blur', 'focus', 'load'];

const forcePassiveFalseEventNames = ['touchmove', 'wheel', 'mousewheel', 'touchstart'];

const matchesSafe = function(target, selector) {
    return !isWindow(target) && target.nodeName !== '#document' && domAdapter.elementMatches(target, selector);
};
const elementDataMap = new WeakMap();
let guid = 0;
let skipEvent;

const special = (function() {
    const specialData = {};

    registerEventCallbacks.add(function(eventName, eventObject) {
        specialData[eventName] = eventObject;
    });

    return {
        getField: function(eventName, field) {
            return specialData[eventName] && specialData[eventName][field];
        },
        callMethod: function(eventName, methodName, context, args) {
            return specialData[eventName] && specialData[eventName][methodName] && specialData[eventName][methodName].apply(context, args);
        }
    };
}());

var applyForEach = function(args, method) {
    const element = args[0];

    if(!element) {
        return;
    }

    if(domAdapter.isNode(element) || isWindow(element)) {
        method.apply(eventsEngine, args);
    } else if(!isString(element) && 'length' in element) {
        const itemArgs = Array.prototype.slice.call(args, 0);

        Array.prototype.forEach.call(element, function(itemElement) {
            itemArgs[0] = itemElement;
            applyForEach(itemArgs, method);
        });
    } else {
        throw errors.Error('E0025');
    }
};

const getHandler = function(method) {
    return function() {
        applyForEach(arguments, method);
    };
};

const detectPassiveEventHandlersSupport = function() {
    let isSupported = false;

    try {
        const options = Object.defineProperty({ }, 'passive', {
            get: function() {
                isSupported = true;
                return true;
            }
        });

        window.addEventListener('test', null, options);
    } catch(e) { }

    return isSupported;
};

const passiveEventHandlersSupported = callOnce(detectPassiveEventHandlersSupport);

const getHandlersController = function(element, eventName) {
    let elementData = elementDataMap.get(element);

    eventName = eventName || '';

    const eventNameParts = eventName.split('.');
    const namespaces = eventNameParts.slice(1);
    const eventNameIsDefined = !!eventNameParts[0];

    eventName = eventNameParts[0] || EMPTY_EVENT_NAME;

    if(!elementData) {
        elementData = {};
        elementDataMap.set(element, elementData);
    }

    if(!elementData[eventName]) {
        elementData[eventName] = {
            handleObjects: [],
            nativeHandler: null
        };
    }

    const eventData = elementData[eventName];

    return {
        addHandler: function(handler, selector, data) {
            const callHandler = function(e, extraParameters) {
                const handlerArgs = [e];
                const target = e.currentTarget;
                const relatedTarget = e.relatedTarget;
                let secondaryTargetIsInside;
                let result;

                if(eventName in NATIVE_EVENTS_TO_SUBSCRIBE) {
                    secondaryTargetIsInside = relatedTarget && target && (relatedTarget === target || target.contains(relatedTarget));
                }

                if(extraParameters !== undefined) {
                    handlerArgs.push(extraParameters);
                }

                special.callMethod(eventName, 'handle', element, [ e, data ]);

                if(!secondaryTargetIsInside) {
                    result = handler.apply(target, handlerArgs);
                }

                if(result === false) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };

            const wrappedHandler = function(e, extraParameters) {
                if(skipEvent && e.type === skipEvent) {
                    return;
                }

                e.data = data;
                e.delegateTarget = element;

                if(selector) {
                    let currentTarget = e.target;

                    while(currentTarget && currentTarget !== element) {
                        if(matchesSafe(currentTarget, selector)) {
                            e.currentTarget = currentTarget;
                            callHandler(e, extraParameters);
                        }
                        currentTarget = currentTarget.parentNode;
                    }
                } else {
                    e.currentTarget = e.delegateTarget || e.target;
                    callHandler(e, extraParameters);
                }
            };

            const handleObject = {
                handler: handler,
                wrappedHandler: wrappedHandler,
                selector: selector,
                type: eventName,
                data: data,
                namespace: namespaces.join('.'),
                namespaces: namespaces,
                guid: ++guid
            };

            eventData.handleObjects.push(handleObject);

            const firstHandlerForTheType = eventData.handleObjects.length === 1;
            let shouldAddNativeListener = firstHandlerForTheType && eventNameIsDefined;
            let nativeListenerOptions;

            if(shouldAddNativeListener) {
                shouldAddNativeListener = !special.callMethod(eventName, 'setup', element, [ data, namespaces, handler ]);
            }

            if(shouldAddNativeListener) {
                eventData.nativeHandler = getNativeHandler(eventName);

                if(passiveEventHandlersSupported() && forcePassiveFalseEventNames.indexOf(eventName) > -1) {
                    nativeListenerOptions = {
                        passive: false
                    };
                }

                eventData.removeListener = domAdapter.listen(element, NATIVE_EVENTS_TO_SUBSCRIBE[eventName] || eventName, eventData.nativeHandler, nativeListenerOptions);
            }

            special.callMethod(eventName, 'add', element, [ handleObject ]);
        },

        removeHandler: function(handler, selector) {
            const removeByEventName = function(eventName) {
                const eventData = elementData[eventName];

                if(!eventData.handleObjects.length) {
                    delete elementData[eventName];
                    return;
                }
                let removedHandler;

                eventData.handleObjects = eventData.handleObjects.filter(function(handleObject) {
                    const skip = namespaces.length && !isSubset(handleObject.namespaces, namespaces)
                        || handler && handleObject.handler !== handler
                        || selector && handleObject.selector !== selector;

                    if(!skip) {
                        removedHandler = handleObject.handler;
                        special.callMethod(eventName, 'remove', element, [ handleObject ]);
                    }

                    return skip;
                });

                const lastHandlerForTheType = !eventData.handleObjects.length;
                const shouldRemoveNativeListener = lastHandlerForTheType && eventName !== EMPTY_EVENT_NAME;

                if(shouldRemoveNativeListener) {
                    special.callMethod(eventName, 'teardown', element, [ namespaces, removedHandler ]);
                    if(eventData.nativeHandler) {
                        eventData.removeListener();
                    }
                    delete elementData[eventName];
                }
            };

            if(eventNameIsDefined) {
                removeByEventName(eventName);
            } else {
                for(const name in elementData) {
                    removeByEventName(name);
                }
            }

            const elementDataIsEmpty = Object.keys(elementData).length === 0;

            if(elementDataIsEmpty) {
                elementDataMap.delete(element);
            }
        },

        callHandlers: function(event, extraParameters) {
            let forceStop = false;

            const handleCallback = function(handleObject) {
                if(forceStop) {
                    return;
                }

                if(!namespaces.length || isSubset(handleObject.namespaces, namespaces)) {
                    handleObject.wrappedHandler(event, extraParameters);
                    forceStop = event.isImmediatePropagationStopped();
                }
            };

            eventData.handleObjects.forEach(handleCallback);
            if(namespaces.length && elementData[EMPTY_EVENT_NAME]) {
                elementData[EMPTY_EVENT_NAME].handleObjects.forEach(handleCallback);
            }
        }
    };
};

var getNativeHandler = function(subscribeName) {
    return function(event, extraParameters) {
        const handlersController = getHandlersController(this, subscribeName);
        event = eventsEngine.Event(event);
        handlersController.callHandlers(event, extraParameters);
    };
};

var isSubset = function(original, checked) {
    for(let i = 0; i < checked.length; i++) {
        if(original.indexOf(checked[i]) < 0) return false;
    }
    return true;
};

const normalizeOnArguments = function(callback) {
    return function(element, eventName, selector, data, handler) {
        if(!handler) {
            handler = data;
            data = undefined;
        }
        if(typeof selector !== 'string') {
            data = selector;
            selector = undefined;
        }

        if(!handler && typeof eventName === 'string') {
            handler = data || selector;
            selector = undefined;
            data = undefined;
        }

        callback(element, eventName, selector, data, handler);
    };
};

const normalizeOffArguments = function(callback) {
    return function(element, eventName, selector, handler) {
        if(typeof selector === 'function') {
            handler = selector;
            selector = undefined;
        }

        callback(element, eventName, selector, handler);
    };
};

const normalizeTriggerArguments = function(callback) {
    return function(element, src, extraParameters) {
        if(typeof src === 'string') {
            src = {
                type: src
            };
        }

        if(!src.target) {
            src.target = element;
        }

        src.currentTarget = element;

        if(!src.delegateTarget) {
            src.delegateTarget = element;
        }

        if(!src.type && src.originalEvent) {
            src.type = src.originalEvent.type;
        }

        callback(element, (src instanceof eventsEngine.Event) ? src : eventsEngine.Event(src), extraParameters);
    };
};

const normalizeEventArguments = function(callback) {
    return function(src, config) {
        if(!(this instanceof eventsEngine.Event)) {
            return new eventsEngine.Event(src, config);
        }

        if(!src) {
            src = {};
        }

        if(typeof src === 'string') {
            src = {
                type: src
            };
        }

        if(!config) {
            config = {};
        }

        callback.call(this, src, config);
    };
};

const iterate = function(callback) {
    const iterateEventNames = function(element, eventName) {
        if(eventName && eventName.indexOf(' ') > -1) {
            const args = Array.prototype.slice.call(arguments, 0);
            eventName.split(' ').forEach(function(eventName) {
                args[1] = eventName;
                callback.apply(this, args);
            });
        } else {
            callback.apply(this, arguments);
        }
    };

    return function(element, eventName) {
        if(typeof eventName === 'object') {
            const args = Array.prototype.slice.call(arguments, 0);

            for(const name in eventName) {
                args[1] = name;
                args[args.length - 1] = eventName[name];
                iterateEventNames.apply(this, args);
            }
        } else {
            iterateEventNames.apply(this, arguments);
        }
    };
};

const callNativeMethod = function(eventName, element) {
    const nativeMethodName = NATIVE_EVENTS_TO_TRIGGER[eventName] || eventName;

    const isLinkClickEvent = function(eventName, element) {
        return eventName === 'click' && element.localName === 'a';
    };

    if(isLinkClickEvent(eventName, element)) return;

    if(isFunction(element[nativeMethodName])) {
        skipEvent = eventName;
        element[nativeMethodName]();
        skipEvent = undefined;
    }
};

const calculateWhich = function(event) {
    const setForMouseEvent = function(event) {
        const mouseEventRegex = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
        return !event.which && event.button !== undefined && mouseEventRegex.test(event.type);
    };

    const setForKeyEvent = function(event) {
        return event.which == null && event.type.indexOf('key') === 0;
    };

    if(setForKeyEvent(event)) {
        return event.charCode != null ? event.charCode : event.keyCode;
    }

    if(setForMouseEvent(event)) {
        const whichByButton = { 1: 1, 2: 3, 3: 1, 4: 2 };
        return whichByButton[event.button];
    }

    return event.which;
};

var eventsEngine = injector({
    on: getHandler(normalizeOnArguments(iterate(function(element, eventName, selector, data, handler) {
        const handlersController = getHandlersController(element, eventName);
        handlersController.addHandler(handler, selector, data);
    }))),

    one: getHandler(normalizeOnArguments(function(element, eventName, selector, data, handler) {
        var oneTimeHandler = function() {
            eventsEngine.off(element, eventName, selector, oneTimeHandler);
            handler.apply(this, arguments);
        };

        eventsEngine.on(element, eventName, selector, data, oneTimeHandler);
    })),

    off: getHandler(normalizeOffArguments(iterate(function(element, eventName, selector, handler) {
        const handlersController = getHandlersController(element, eventName);
        handlersController.removeHandler(handler, selector);
    }))),

    trigger: getHandler(normalizeTriggerArguments(function(element, event, extraParameters) {
        const eventName = event.type;
        const handlersController = getHandlersController(element, event.type);

        special.callMethod(eventName, 'trigger', element, [ event, extraParameters ]);
        handlersController.callHandlers(event, extraParameters);

        const noBubble = special.getField(eventName, 'noBubble')
            || event.isPropagationStopped()
            || NO_BUBBLE_EVENTS.indexOf(eventName) !== -1;

        if(!noBubble) {
            const parents = [];
            var getParents = function(element) {
                const parent = element.parentNode;
                if(parent) {
                    parents.push(parent);
                    getParents(parent);
                }
            };
            getParents(element);
            parents.push(window);

            let i = 0;

            while(parents[i] && !event.isPropagationStopped()) {
                const parentDataByEvent = getHandlersController(parents[i], event.type);
                parentDataByEvent.callHandlers(extend(event, { currentTarget: parents[i] }), extraParameters);
                i++;
            }
        }

        if(element.nodeType || isWindow(element)) {
            special.callMethod(eventName, '_default', element, [ event, extraParameters ]);
            callNativeMethod(eventName, element);
        }
    })),

    triggerHandler: getHandler(normalizeTriggerArguments(function(element, event, extraParameters) {
        const handlersController = getHandlersController(element, event.type);
        handlersController.callHandlers(event, extraParameters);
    }))
});

const initEvent = function(EventClass) {
    if(EventClass) {
        eventsEngine.Event = EventClass;
        eventsEngine.Event.prototype = EventClass.prototype;
    }
};

initEvent(normalizeEventArguments(function(src, config) {
    const that = this;
    let propagationStopped = false;
    let immediatePropagationStopped = false;
    let defaultPrevented = false;

    extend(that, src);

    if(src instanceof eventsEngine.Event || (windowUtils.hasWindow() && src instanceof window.Event)) {
        that.originalEvent = src;
        that.currentTarget = undefined;
    }

    if(!(src instanceof eventsEngine.Event)) {
        extend(that, {
            isPropagationStopped: function() {
                return !!(propagationStopped || that.originalEvent && that.originalEvent.propagationStopped);
            },
            stopPropagation: function() {
                propagationStopped = true;
                that.originalEvent && that.originalEvent.stopPropagation();
            },
            isImmediatePropagationStopped: function() {
                return immediatePropagationStopped;
            },
            stopImmediatePropagation: function() {
                this.stopPropagation();
                immediatePropagationStopped = true;
                that.originalEvent && that.originalEvent.stopImmediatePropagation();
            },
            isDefaultPrevented: function() {
                return !!(defaultPrevented || that.originalEvent && that.originalEvent.defaultPrevented);
            },
            preventDefault: function() {
                defaultPrevented = true;
                that.originalEvent && that.originalEvent.preventDefault();
            }
        });
    }

    addProperty('which', calculateWhich, that);

    if(src.type.indexOf('touch') === 0) {
        delete config.pageX;
        delete config.pageY;
    }

    extend(that, config);

    that.guid = ++guid;
}));

var addProperty = function(propName, hook, eventInstance) {
    Object.defineProperty(eventInstance || eventsEngine.Event.prototype, propName, {
        enumerable: true,
        configurable: true,

        get: function() {
            return this.originalEvent && hook(this.originalEvent);
        },

        set: function(value) {
            Object.defineProperty(this, propName, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: value
            });
        }
    });
};

hookTouchProps(addProperty);

const beforeSetStrategy = Callbacks();
const afterSetStrategy = Callbacks();

eventsEngine.set = function(engine) {
    beforeSetStrategy.fire();
    eventsEngine.inject(engine);
    initEvent(engine.Event);
    afterSetStrategy.fire();
};

eventsEngine.subscribeGlobal = function() {
    applyForEach(arguments, normalizeOnArguments(function() {
        const args = arguments;

        eventsEngine.on.apply(this, args);

        beforeSetStrategy.add(function() {
            const offArgs = Array.prototype.slice.call(args, 0);
            offArgs.splice(3, 1);
            eventsEngine.off.apply(this, offArgs);
        });

        afterSetStrategy.add(function() {
            eventsEngine.on.apply(this, args);
        });
    }));
};

eventsEngine.forcePassiveFalseEventNames = forcePassiveFalseEventNames;
eventsEngine.passiveEventHandlersSupported = passiveEventHandlersSupported;

///#DEBUG
eventsEngine.elementDataMap = elementDataMap;
eventsEngine.detectPassiveEventHandlersSupport = detectPassiveEventHandlersSupport;
///#ENDDEBUG

module.exports = eventsEngine;
