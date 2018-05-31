"use strict";

var registerEventCallbacks = require("./event_registrator_callbacks");
var extend = require("../../core/utils/extend").extend;
var domAdapter = require("../../core/dom_adapter");
var windowUtils = require("../../core/utils/window");
var window = windowUtils.getWindow();
var injector = require("../../core/utils/dependency_injector");
var typeUtils = require("../../core/utils/type");
var Callbacks = require("../../core/utils/callbacks");
var isWindow = typeUtils.isWindow;
var isFunction = typeUtils.isFunction;
var isString = typeUtils.isString;
var errors = require("../../core/errors");
var WeakMap = require("../../core/polyfills/weak_map");
var hookTouchProps = require("../../events/core/hook_touch_props");

var EMPTY_EVENT_NAME = "dxEmptyEventType";
var NATIVE_EVENTS_TO_SUBSCRIBE = {
    "mouseenter": "mouseover",
    "mouseleave": "mouseout",
    "pointerenter": "pointerover",
    "pointerleave": "pointerout"
};
var NATIVE_EVENTS_TO_TRIGGER = {
    "focusin": "focus",
    "focusout": "blur"
};
var NO_BUBBLE_EVENTS = ["blur", "focusout", "focus", "focusin", "load"];

var matchesSafe = function(target, selector) {
    return !isWindow(target) && target.nodeName !== "#document" && domAdapter.elementMatches(target, selector);
};
var elementDataMap = new WeakMap();
var guid = 0;
var skipEvent;

var special = (function() {
    var specialData = {};

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
    var element = args[0];

    if(!element) {
        return;
    }

    if(domAdapter.isNode(element) || isWindow(element)) {
        method.apply(eventsEngine, args);
    } else if(!isString(element) && "length" in element) {
        var itemArgs = Array.prototype.slice.call(args, 0);

        Array.prototype.forEach.call(element, function(itemElement) {
            itemArgs[0] = itemElement;
            applyForEach(itemArgs, method);
        });
    } else {
        throw errors.Error("E0025");
    }
};

var getHandler = function(method) {
    return function() {
        applyForEach(arguments, method);
    };
};

var getHandlersController = function(element, eventName) {
    var elementData = elementDataMap.get(element);

    eventName = eventName || "";

    var eventNameParts = eventName.split(".");
    var namespaces = eventNameParts.slice(1);
    var eventNameIsDefined = !!eventNameParts[0];

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

    var eventData = elementData[eventName];

    return {
        addHandler: function(handler, selector, data) {
            var callHandler = function(e, extraParameters) {
                var handlerArgs = [e],
                    target = e.currentTarget,
                    relatedTarget = e.relatedTarget,
                    secondaryTargetIsInside,
                    result;

                if(eventName in NATIVE_EVENTS_TO_SUBSCRIBE) {
                    secondaryTargetIsInside = relatedTarget && target && (relatedTarget === target || target.contains(relatedTarget));
                }

                if(extraParameters !== undefined) {
                    handlerArgs.push(extraParameters);
                }

                special.callMethod(eventName, "handle", element, [ e, data ]);

                if(!secondaryTargetIsInside) {
                    result = handler.apply(target, handlerArgs);
                }

                if(result === false) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };

            var wrappedHandler = function(e, extraParameters) {
                if(skipEvent && e.type === skipEvent) {
                    return;
                }

                e.data = data;
                e.delegateTarget = element;

                if(selector) {
                    var currentTarget = e.target;

                    while(currentTarget && currentTarget !== element) {
                        if(matchesSafe(currentTarget, selector)) {
                            e.currentTarget = currentTarget;
                            callHandler(e, extraParameters);
                        }
                        currentTarget = currentTarget.parentNode;
                    }
                } else {
                    callHandler(e, extraParameters);
                }
            };

            var handleObject = {
                handler: handler,
                wrappedHandler: wrappedHandler,
                selector: selector,
                type: eventName,
                data: data,
                namespace: namespaces.join("."),
                namespaces: namespaces,
                guid: ++guid
            };

            eventData.handleObjects.push(handleObject);

            var firstHandlerForTheType = eventData.handleObjects.length === 1;
            var shouldAddNativeListener = firstHandlerForTheType && eventNameIsDefined;

            if(shouldAddNativeListener) {
                shouldAddNativeListener = !special.callMethod(eventName, "setup", element, [ data, namespaces, handler ]);
            }

            if(shouldAddNativeListener) {
                eventData.nativeHandler = getNativeHandler(eventName);
                eventData.removeListener = domAdapter.listen(element, NATIVE_EVENTS_TO_SUBSCRIBE[eventName] || eventName, eventData.nativeHandler);
            }

            special.callMethod(eventName, "add", element, [ handleObject ]);
        },

        removeHandler: function(handler, selector) {
            var removeByEventName = function(eventName) {
                var eventData = elementData[eventName];

                if(!eventData.handleObjects.length) {
                    delete elementData[eventName];
                    return;
                }
                var removedHandler;

                eventData.handleObjects = eventData.handleObjects.filter(function(handleObject) {
                    var skip = namespaces.length && !isSubset(handleObject.namespaces, namespaces)
                        || handler && handleObject.handler !== handler
                        || selector && handleObject.selector !== selector;

                    if(!skip) {
                        removedHandler = handleObject.handler;
                        special.callMethod(eventName, "remove", element, [ handleObject ]);
                    }

                    return skip;
                });

                var lastHandlerForTheType = !eventData.handleObjects.length;
                var shouldRemoveNativeListener = lastHandlerForTheType && eventName !== EMPTY_EVENT_NAME;

                if(shouldRemoveNativeListener) {
                    special.callMethod(eventName, "teardown", element, [ namespaces, removedHandler ]);
                    if(eventData.nativeHandler) {
                        eventData.removeListener();
                    }
                    delete elementData[eventName];
                }
            };

            if(eventNameIsDefined) {
                removeByEventName(eventName);
            } else {
                for(var name in elementData) {
                    removeByEventName(name);
                }
            }

            var elementDataIsEmpty = Object.keys(elementData).length === 0;

            if(elementDataIsEmpty) {
                elementDataMap.delete(element);
            }
        },

        callHandlers: function(event, extraParameters) {
            var forceStop = false;

            var handleCallback = function(handleObject) {
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
        var handlersController = getHandlersController(this, subscribeName);
        event = eventsEngine.Event(event);
        handlersController.callHandlers(event, extraParameters);
    };
};

var isSubset = function(original, checked) {
    for(var i = 0; i < checked.length; i++) {
        if(original.indexOf(checked[i]) < 0) return false;
    }
    return true;
};

var normalizeOnArguments = function(callback) {
    return function(element, eventName, selector, data, handler) {
        if(!handler) {
            handler = data;
            data = undefined;
        }
        if(typeof selector !== "string") {
            data = selector;
            selector = undefined;
        }

        if(!handler && typeof eventName === "string") {
            handler = data || selector;
            selector = undefined;
            data = undefined;
        }

        callback(element, eventName, selector, data, handler);
    };
};

var normalizeOffArguments = function(callback) {
    return function(element, eventName, selector, handler) {
        if(typeof selector === "function") {
            handler = selector;
            selector = undefined;
        }

        callback(element, eventName, selector, handler);
    };
};

var normalizeTriggerArguments = function(callback) {
    return function(element, src, extraParameters) {
        if(typeof src === "string") {
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

var normalizeEventArguments = function(callback) {
    return function(src, config) {
        if(!(this instanceof eventsEngine.Event)) {
            return new eventsEngine.Event(src, config);
        }

        if(!src) {
            src = {};
        }

        if(typeof src === "string") {
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

var iterate = function(callback) {
    var iterateEventNames = function(element, eventName) {
        if(eventName && eventName.indexOf(" ") > -1) {
            var args = Array.prototype.slice.call(arguments, 0);
            eventName.split(" ").forEach(function(eventName) {
                args[1] = eventName;
                callback.apply(this, args);
            });
        } else {
            callback.apply(this, arguments);
        }
    };

    return function(element, eventName) {
        if(typeof eventName === "object") {
            var args = Array.prototype.slice.call(arguments, 0);

            for(var name in eventName) {
                args[1] = name;
                args[args.length - 1] = eventName[name];
                iterateEventNames.apply(this, args);
            }
        } else {
            iterateEventNames.apply(this, arguments);
        }
    };
};

var callNativeMethod = function(eventName, element) {
    var nativeMethodName = NATIVE_EVENTS_TO_TRIGGER[eventName] || eventName;

    var isLinkClickEvent = function(eventName, element) {
        return eventName === "click" && element.localName === "a";
    };

    if(isLinkClickEvent(eventName, element)) return;

    if(isFunction(element[nativeMethodName])) {
        skipEvent = eventName;
        element[nativeMethodName]();
        skipEvent = undefined;
    }
};

var calculateWhich = function(event) {
    var setForMouseEvent = function(event) {
        var mouseEventRegex = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
        return !event.which && event.button !== undefined && mouseEventRegex.test(event.type);
    };

    var setForKeyEvent = function(event) {
        return event.which == null && event.type.indexOf("key") === 0;
    };

    if(setForKeyEvent(event)) {
        return event.charCode != null ? event.charCode : event.keyCode;
    }

    if(setForMouseEvent(event)) {
        var whichByButton = { 1: 1, 2: 3, 3: 1, 4: 2 };
        return whichByButton[event.button];
    }

    return event.which;
};

var eventsEngine = injector({
    on: getHandler(normalizeOnArguments(iterate(function(element, eventName, selector, data, handler) {
        var handlersController = getHandlersController(element, eventName);
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
        var handlersController = getHandlersController(element, eventName);
        handlersController.removeHandler(handler, selector);
    }))),

    trigger: getHandler(normalizeTriggerArguments(function(element, event, extraParameters) {
        var eventName = event.type;
        var handlersController = getHandlersController(element, event.type);

        special.callMethod(eventName, "trigger", element, [ event, extraParameters ]);
        handlersController.callHandlers(event, extraParameters);

        var noBubble = special.getField(eventName, "noBubble")
            || event.isPropagationStopped()
            || NO_BUBBLE_EVENTS.indexOf(eventName) !== -1;

        if(!noBubble) {
            var parents = [];
            var getParents = function(element) {
                var parent = element.parentNode;
                if(parent) {
                    parents.push(parent);
                    getParents(parent);
                }
            };
            getParents(element);
            parents.push(window);

            var i = 0;

            while(parents[i] && !event.isPropagationStopped()) {
                var parentDataByEvent = getHandlersController(parents[i], event.type);
                parentDataByEvent.callHandlers(extend(event, { currentTarget: parents[i] }), extraParameters);
                i++;
            }
        }

        if(element.nodeType || isWindow(element)) {
            special.callMethod(eventName, "_default", element, [ event, extraParameters ]);
            callNativeMethod(eventName, element);
        }
    })),

    triggerHandler: getHandler(normalizeTriggerArguments(function(element, event, extraParameters) {
        var handlersController = getHandlersController(element, event.type);
        handlersController.callHandlers(event, extraParameters);
    }))
});

var initEvent = function(EventClass) {
    if(EventClass) {
        eventsEngine.Event = EventClass;
        eventsEngine.Event.prototype = EventClass.prototype;
    }
};

initEvent(normalizeEventArguments(function(src, config) {
    var that = this;
    var propagationStopped = false;
    var immediatePropagationStopped = false;
    var defaultPrevented = false;

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

    addProperty("which", calculateWhich, that);

    if(src.type.indexOf("touch") === 0) {
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

var beforeSetStrategy = Callbacks();
var afterSetStrategy = Callbacks();

eventsEngine.set = function(engine) {
    beforeSetStrategy.fire();
    eventsEngine.inject(engine);
    initEvent(engine.Event);
    afterSetStrategy.fire();
};

eventsEngine.subscribeGlobal = function() {
    applyForEach(arguments, normalizeOnArguments(function() {
        var args = arguments;

        eventsEngine.on.apply(this, args);

        beforeSetStrategy.add(function() {
            var offArgs = Array.prototype.slice.call(args, 0);
            offArgs.splice(3, 1);
            eventsEngine.off.apply(this, offArgs);
        });

        afterSetStrategy.add(function() {
            eventsEngine.on.apply(this, args);
        });
    }));
};

///#DEBUG
eventsEngine.elementDataMap = elementDataMap;
///#ENDDEBUG

module.exports = eventsEngine;
