"use strict";

var registerEventCallbacks = require("./event_registrator_callbacks");
var dataUtilsStrategy = require("../../core/element_data").getDataStrategy();
var extend = require("../../core/utils/extend").extend;
var typeUtils = require("../../core/utils/type");
var isWindow = typeUtils.isWindow;
var isFunction = typeUtils.isFunction;
var matches = require("../../core/polyfills/matches");
var WeakMap = require("../../core/polyfills/weak_map");
var touchProps = require("../../integration/jquery/touch_props");

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
    eventName = eventNameParts[0];

    if(!elementData) {
        elementData = {};
        elementDataMap.set(element, elementData);
    }

    // TODO: handle empty event name correctly
    if(!elementData[eventName]) {
        elementData[eventName] = [];
    }

    return {
        addHandler: function(handler, selector, data) {
            var wrappedHandler = function(e, extraParameters) {
                if(skipEvent && e.type === skipEvent) {
                    return;
                }

                var callHandler = function(e) {
                    var handlerArgs = [e];

                    if(extraParameters !== undefined) {
                        handlerArgs.push(extraParameters);
                    }

                    special.callMethod(eventName, "handle", element, [ e, data ]);

                    var result = handler.apply(handlerArgs[0].currentTarget, handlerArgs);

                    // TODO: get rid of checking if result equals false
                    if(result === false) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                };

                if(e instanceof Event) {
                    e = eventsEngine.Event(e);
                }
                e.data = data;

                if(selector) {
                    var currentTarget = e.target;

                    while(currentTarget && currentTarget !== element) {
                        if(matchesSafe(currentTarget, selector)) {
                            e.currentTarget = currentTarget;
                            callHandler(e);
                            return;
                        }
                        currentTarget = currentTarget.parentNode;
                    }
                } else {
                    callHandler(e);
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

            // First handler for this event name
            if(elementData[eventName].length === 1) {
                special.callMethod(eventName, "setup", element, [ data, namespaces, handler ]);
            }
            // TODO: Add single event listener for all namespaces
            // TODO: Add event listeners only if setup returned true (Or not?)
            element.addEventListener(eventName, wrappedHandler);

            special.callMethod(eventName, "add", element, [ handleObject ]);
        },

        removeHandler: function(handler, selector) {
            var removeByEventName = function(eventName) {
                if(!elementData[eventName].length) {
                    return;
                }
                var removedHandler;

                elementData[eventName] = elementData[eventName].filter(function(eventData) {
                    var skip = namespaces.length && eventData.namespaces.indexOf(namespaces[0]) < 0// TODO: improve
                    || handler && eventData.handler !== handler
                    || selector && eventData.selector !== selector;

                    if(!skip) {
                        element.removeEventListener(eventName, eventData.wrappedHandler); // TODO: Fix several subscriptions problem
                        removedHandler = eventData.handler;
                        special.callMethod(eventName, "remove", element, [ eventData ]);
                    }

                    return skip;
                });

                if(!elementData[eventName].length) {
                    special.callMethod(eventName, "teardown", element, [ namespaces, removedHandler ]);
                }
            };

            if(eventName) {
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

                if(!namespaces.length || eventData.namespaces.indexOf(namespaces[0]) > -1) { // TODO: improve
                    forceStop = callback(eventData.wrappedHandler, eventData.handler) === false;
                }
            };

            elementData[eventName].forEach(handleCallback);
            if(namespaces.length && elementData[""]) {
                elementData[""].forEach(handleCallback);
            }
        }
    };
};

var normalizeArguments = function(callback) {
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

        if(typeof eventName === "string" && eventName.indexOf(" ") > -1) {
            eventName.split(" ").forEach(function(eventName) {
                callback(element, eventName, selector, data, handler);
            });
            return;
        }

        callback(element, eventName, selector, data, handler);
    };
};

var normalizeEventSource = function(src, element) {
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

    return src.isDXEvent ? src : eventsEngine.Event(src);
};

var eventsEngine = {
    on: normalizeArguments(function(element, eventName, selector, data, handler) {
        // TODO: get rid of this
        if(typeof eventName === "object") {
            for(var name in eventName) {
                eventsEngine.on.call(this, element, name, selector, data, eventName[name]);
            }
            return;
        }

        var elementDataByEvent = getElementEventData(element, eventName);
        elementDataByEvent.addHandler(handler, selector, data);
    }),

    one: normalizeArguments(function(element, eventName, selector, data, handler) {
        var oneTimeHandler = function() {
            eventsEngine.off(element, eventName, selector, oneTimeHandler);
            handler.apply(this, arguments);
        };

        eventsEngine.on(element, eventName, selector, data, oneTimeHandler);
    }),

    off: function(element, eventName, selector, handler) {
        // TODO: get rid of this
        if(typeof eventName === "object") {
            for(var name in eventName) {
                eventsEngine.off.call(this, element, name, selector, eventName[name]);
            }
            return;
        }

        if(typeof selector === "function") {
            handler = selector;
            selector = undefined;
        }

        if(eventName && eventName.indexOf(" ") > -1) {
            eventName.split(" ").forEach(function(eventName) {
                eventsEngine.off(element, eventName, selector, handler);
            });
            return;
        }

        var elementDataByEvent = getElementEventData(element, eventName);

        elementDataByEvent.removeHandler(handler, selector);
    },

    trigger: function(element, src, extraParameters) {
        var event = normalizeEventSource(src, element);
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
    },

    triggerHandler: function(element, src, extraParameters) {
        var event = normalizeEventSource(src, element);
        var elementDataByEvent = getElementEventData(element, event.type);

        elementDataByEvent.iterateHandlers(function(wrappedHandler) {
            wrappedHandler(event, extraParameters);
            return !event.isImmediatePropagationStopped();
        });


    },

    copy: function(event) {

        var touchPropsToHook = touchProps.touchPropsToHook,
            touchPropHook = touchProps.touchPropHook,
            result = eventsEngine.Event(event, event);

        // TODO: optimize by Object.defineProperty
        touchPropsToHook.forEach(function(name) {
            result[name] = touchPropHook(name, result);
        });

        return result;
    },
    Event: function(src, config) {
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

        var result = extend(this, src);

        var propagationStopped = false;
        var immediatePropagationStopped = false;
        var defaultPrevented = false;

        if(src.isDXEvent || src instanceof Event) {
            result.originalEvent = src;
            result.currentTarget = undefined;
        }

        if(!src.isDXEvent) {
            extend(result, {
                isDXEvent: true,
                isPropagationStopped: function() {
                    return !!(propagationStopped || result.originalEvent && result.originalEvent.propagationStopped);
                },
                stopPropagation: function() {
                    propagationStopped = true;
                    result.originalEvent && result.originalEvent.stopPropagation();
                },
                isImmediatePropagationStopped: function() {
                    return immediatePropagationStopped;
                },
                stopImmediatePropagation: function() {
                    this.stopPropagation();
                    immediatePropagationStopped = true;
                    result.originalEvent && result.originalEvent.stopImmediatePropagation();
                },
                isDefaultPrevented: function() {
                    return !!(defaultPrevented || result.originalEvent && result.originalEvent.defaultPrevented);
                },
                preventDefault: function() {
                    defaultPrevented = true;
                    result.originalEvent && result.originalEvent.preventDefault();
                }
            });

            // TODO: refactor
            var getOriginal = function(event) {
                return event.originalEvent && getOriginal(event.originalEvent) || event;
            };

            ["pageX", "pageY"].forEach(function(propName) {
                if(!(propName in result)) {
                    Object.defineProperty(result, propName, {
                        enumerable: true,
                        configurable: true,

                        get: function() {
                            return this.originalEvent && getOriginal(this.originalEvent)[propName];
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
                }
            });

        }

        extend(result, config || {});

        result.guid = ++guid;
    }
};

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
