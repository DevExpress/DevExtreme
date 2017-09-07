"use strict";

var registerEventCallbacks = require("./event_registrator_callbacks");
var dataUtilsStrategy = require("../../core/element_data").getDataStrategy();
var extend = require("../../core/utils/extend").extend;
var typeUtils = require("../../core/utils/type");
var isWindow = typeUtils.isWindow;
var isFunction = typeUtils.isFunction;
var matches = require("../../core/polyfills/matches");
var WeakMap = require("../../core/polyfills/weak_map");
var hookTouchProps = require("../../events/core/hook_touch_props");

var EMPTY_EVENT_NAME = "dxEmptyEventType";

var matchesSafe = function(target, selector) {
    return !isWindow(target) && target.nodeName !== "#document" && matches(target, selector);
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

var getElementEventData = function(element, eventName) {
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
        elementData[eventName] = [];
    }

    return {
        addHandler: function(handler, selector, data) {
            var callHandler = function(e, extraParameters) {
                var handlerArgs = [e];

                if(extraParameters !== undefined) {
                    handlerArgs.push(extraParameters);
                }

                special.callMethod(eventName, "handle", element, [ e, data ]);

                var result = handler.apply(e.currentTarget, handlerArgs);

                if(result === false) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };

            var wrappedHandler = function(e, extraParameters) {
                if(skipEvent && e.type === skipEvent) {
                    return;
                }

                if(e instanceof Event) {
                    e = eventsEngine.Event(e);
                }
                e.data = data;

                if(selector) {
                    var currentTarget = e.target;

                    while(currentTarget && currentTarget !== element) {
                        if(matchesSafe(currentTarget, selector)) {
                            e.currentTarget = currentTarget;
                            callHandler(e, extraParameters);
                            return;
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

            elementData[eventName].push(handleObject);

            var firstHandlerForTheType = elementData[eventName].length === 1;

            if(firstHandlerForTheType) {
                special.callMethod(eventName, "setup", element, [ data, namespaces, handler ]);
            }
            // TODO: Add single event listener for all namespaces
            // TODO: Add event listeners only if setup returned true (Or not?)

            eventNameIsDefined && element.addEventListener(eventName, wrappedHandler);

            special.callMethod(eventName, "add", element, [ handleObject ]);
        },

        removeHandler: function(handler, selector) {
            var removeByEventName = function(eventName) {
                if(!elementData[eventName].length) {
                    return;
                }
                var removedHandler;

                elementData[eventName] = elementData[eventName].filter(function(eventData) {
                    var skip = namespaces.length && !isSubset(eventData.namespaces, namespaces)
                        || handler && eventData.handler !== handler
                        || selector && eventData.selector !== selector;

                    if(!skip) {
                        var eventNameIsDefined = eventName !== EMPTY_EVENT_NAME;
                        eventNameIsDefined && element.removeEventListener(eventName, eventData.wrappedHandler); // TODO: Fix several subscriptions problem

                        removedHandler = eventData.handler;
                        special.callMethod(eventName, "remove", element, [ eventData ]);
                    }

                    return skip;
                });

                if(!elementData[eventName].length) {
                    special.callMethod(eventName, "teardown", element, [ namespaces, removedHandler ]);
                }
            };

            if(eventNameIsDefined) {
                removeByEventName(eventName);
            } else {
                for(var name in elementData) {
                    removeByEventName(name);
                }
            }
        },

        iterateHandlers: function(callback) {
            var forceStop = false;
            var handleCallback = function(eventData) {
                if(forceStop) {
                    return;
                }

                if(!namespaces.length || isSubset(eventData.namespaces, namespaces)) {
                    forceStop = callback(eventData.wrappedHandler, eventData.handler) === false;
                }
            };

            elementData[eventName].forEach(handleCallback);
            if(namespaces.length && elementData[EMPTY_EVENT_NAME]) {
                elementData[EMPTY_EVENT_NAME].forEach(handleCallback);
            }
        }
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

        if(!handler) {
            handler = arguments[2];
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

var eventsEngine = {
    on: normalizeOnArguments(iterate(function(element, eventName, selector, data, handler) {
        var elementDataByEvent = getElementEventData(element, eventName);
        elementDataByEvent.addHandler(handler, selector, data);
    })),

    one: normalizeOnArguments(function(element, eventName, selector, data, handler) {
        var oneTimeHandler = function() {
            eventsEngine.off(element, eventName, selector, oneTimeHandler);
            handler.apply(this, arguments);
        };

        eventsEngine.on(element, eventName, selector, data, oneTimeHandler);
    }),

    off: normalizeOffArguments(iterate(function(element, eventName, selector, handler) {
        var elementDataByEvent = getElementEventData(element, eventName);
        elementDataByEvent.removeHandler(handler, selector);
    })),

    trigger: normalizeTriggerArguments(function(element, event, extraParameters) {
        var eventName = event.type;

        special.callMethod(eventName, "trigger", element, [ event, extraParameters ]);
        eventsEngine.triggerHandler(element, event, extraParameters);

        var noBubble = special.getField(eventName, "noBubble") || event.isPropagationStopped();

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

            var i = 0;

            while(parents[i] && !event.isPropagationStopped()) {
                eventsEngine.triggerHandler(parents[i], extend(event, { currentTarget: parents[i] }), extraParameters);
                i++;
            }
        }

        // TODO: Consider other native events
        // TODO: native click for checkboxes and links
        if(element.nodeType) {
            special.callMethod(eventName, "_default", element, [ event, extraParameters ]);
            if((eventName === "focus" || eventName === "focusin") && isFunction(element.focus)) {
                skipEvent = eventName;
                element.focus();
                skipEvent = undefined;
            } else if((eventName === "blur" || eventName === "focusout") && isFunction(element.blur)) {
                skipEvent = eventName;
                element.blur && element.blur();
                skipEvent = undefined;
            } else if(isFunction(element[eventName])) {
                skipEvent = eventName;
                element[eventName]();
                skipEvent = undefined;
            }
        }
    }),

    triggerHandler: normalizeTriggerArguments(function(element, event, extraParameters) {
        var elementDataByEvent = getElementEventData(element, event.type);

        elementDataByEvent.iterateHandlers(function(wrappedHandler) {
            wrappedHandler(event, extraParameters);
            return !event.isImmediatePropagationStopped();
        });
    }),

    Event: normalizeEventArguments(function(src, config) {
        var that = this;
        var propagationStopped = false;
        var immediatePropagationStopped = false;
        var defaultPrevented = false;

        extend(that, src);

        if(src instanceof eventsEngine.Event || src instanceof Event) {
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

        extend(that, config);

        that.guid = ++guid;
    }),

    copy: function(event) {
        return eventsEngine.Event(event, event);
    }
};

hookTouchProps(function(propName, hook) {
    Object.defineProperty(eventsEngine.Event.prototype, propName, {
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
});

var cleanData = dataUtilsStrategy.cleanData;
dataUtilsStrategy.cleanData = function(nodes) {
    for(var i = 0; i < nodes.length; i++) {
        eventsEngine.off(nodes[i]);
    }

    return cleanData(nodes);
};

var getHandler = function(methodName) {
    var result = function(element) {
        if(!element) {
            return;
        }

        if(element.nodeType || isWindow(element)) {
            eventsEngine[methodName].apply(eventsEngine, arguments);
        } else if(element.each) {
            var itemArgs = Array.prototype.slice.call(arguments, 0);

            element.each(function() {
                itemArgs[0] = this;
                result.apply(result, itemArgs);
            });
        }
    };

    return result;
};

var result = {
    on: getHandler("on"),
    one: getHandler("one"),
    off: getHandler("off"),
    trigger: getHandler("trigger"),
    triggerHandler: getHandler("triggerHandler"),
    copy: function() {
        return eventsEngine.copy.apply(eventsEngine, arguments);
    },
    Event: function() {
        return eventsEngine.Event.apply(eventsEngine, arguments);
    },
    set: function(engine) {
        eventsEngine = engine;
    }
};

result.Event.prototype = eventsEngine.Event.prototype;

module.exports = result;
