"use strict";

var registerEventCallbacks = require("./event_registrator_callbacks");
var isWindow = require("../../core/utils/type").isWindow;
var extend = require("../../core/utils/extend").extend;
var matches = require("../../core/polyfills/matches");
var dataUtilsStrategy = require("../../core/element_data").getDataStrategy();
var eventsEngine;
var setEngine = function(engine) {
    eventsEngine = engine;
};
var special = {};
registerEventCallbacks.add(function(name, eventObject) {
    special[name] = eventObject;
});

var WeakMap = require("../../core/polyfills/weak_map");
var elementDataMap = new WeakMap();

var guid = 0;

var getElementEventData = function(element, eventName) {
    var elementData = elementDataMap.get(element);

    eventName = eventName || "";

    var eventNameParts = eventName.split(".");
    var namespace = eventNameParts[1];
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
                // TODO: refactor
                if(selector) {
                    if(matches(e.target, selector)) {
                        handler(eventsEngine.Event(e, { currentTarget: e.target, data: data }), extraParameters);
                        return;
                    }
                    var target = e.target;
                    while(target !== element) {
                        target = target.parentNode;
                        if(matches(target, selector)) {
                            handler(eventsEngine.Event(e, { currentTarget: target, data: data }), extraParameters);
                            return;
                        }
                    }
                } else {
                    if(!e.isDXEvent) {
                        e = eventsEngine.Event(e);
                    }
                    e.data = data;
                    handler(e, extraParameters);
                }
            };

            var handlerId = ++guid;
            elementData[eventName].push({
                handler: handler,
                wrappedHandler: wrappedHandler,
                selector: selector,
                namespace: namespace,
                guid: handlerId
            });

            // First handler for this event name
            if(elementData[eventName].length === 1) {
                special[eventName] && special[eventName].setup && special[eventName].setup.call(element, data);
            }
            // TODO: Add single event listener for all namespaces
            // TODO: Add event listeners only if setup returned true (Or not?)
            element.addEventListener(eventName, wrappedHandler);
            // TODO: Maybe replace it with eventData object
            var handleObject = {
                selector: selector,
                type: eventName,
                data: data,
                guid: handlerId
            };
            special[eventName] && special[eventName].add && special[eventName].add.call(element, handleObject);
        },
        removeHandler: function(handler, selector) {
            var removeByEventName = function(eventName) {
                if(!elementData[eventName].length) {
                    return;
                }

                elementData[eventName] = elementData[eventName].filter(function(eventData) {
                    var skip = namespace && eventData.namespace !== namespace
                    || handler && eventData.handler !== handler
                    || selector && eventData.selector !== selector;

                    if(!skip) {
                        element.removeEventListener(eventName, eventData.wrappedHandler); // TODO: Fix several subscriptions problem
                        special[eventName] && special[eventName].remove && special[eventName].remove.call(element, {
                            type: eventName,
                            selector: selector,
                            guid: eventData.guid
                        });
                    }

                    return skip;
                });

                if(!elementData[eventName].length) {
                    special[eventName] && special[eventName].teardown && special[eventName].teardown.call(element, [""], handler);
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
            elementData[eventName].forEach(function(eventData) {
                if(forceStop) {
                    return;
                }
                if(!namespace || eventData.namespace === namespace) {
                    var wrappedHandler = eventData.wrappedHandler;
                    forceStop = callback(wrappedHandler, eventData.handler) === false;
                }
            });
            if(namespace && elementData[""]) {
                elementData[""].forEach(function(eventData) {
                    if(forceStop) {
                        return;
                    }
                    if(eventData.namespace === namespace) {
                        var wrappedHandler = eventData.wrappedHandler;
                        forceStop = callback(wrappedHandler, eventData.handler) === false;
                    }
                });
            }
        }
    };
};

var normalizeArguments = function(callback) {
    return function(element, eventName, selector, data, handler) {
        if(!handler) {
            handler = data;
            data = undefined;

            if(typeof selector !== "string") {
                data = selector;
                selector = undefined;
            }
        }

        if(!handler) {
            handler = arguments[2];
            selector = undefined;
            data = undefined;
        }

        if(eventName && eventName.indexOf(" ") > -1) {
            eventName.split(" ").forEach(function(eventName) {
                callback(element, eventName, selector, data, handler);
            });
            return;
        }

        callback(element, eventName, selector, data, handler);
    };
};

setEngine({
    on: normalizeArguments(function(element, eventName, selector, data, handler) {
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

    trigger: function(element, src, noBubble, extraParameters) {
        if(typeof src === "string") {
            src = {
                type: src
            };
        }

        var type = src.type || src.originalEvent && src.originalEvent.type;

        // TODO: Consider other native events
        if(type === "focus") {
            element.focus();
            return;
        }

        var elementDataByEvent = getElementEventData(element, type);

        if(!src.target) {
            src.target = element;
        }
        src.currentTarget = element;

        if(!src.delegateTarget) {
            src.delegateTarget = element;
        }

        var event = src.isDXEvent ? src : eventsEngine.Event(src);

        elementDataByEvent.iterateHandlers(function(wrappedHandler) {
            wrappedHandler(event, extraParameters);
            return !event.isImmediatePropagationStopped();
        });

        if(noBubble || special[type] && special[type].noBubble || event.isPropagationStopped()) {
            return;
        }

        var parent = element.parentNode;

        if(parent) {
            eventsEngine.trigger(parent, extend({}, event, { currentTarget: parent }));
        }
    },

    triggerHandler: function(element, src, extraParameters) {
        eventsEngine.trigger(element, src, true, extraParameters);// TODO: refacotr
    },

    copy: function(event) {
        // TODO: Extract module form jquery/hooks
        var touchPropsToHook = ["pageX", "pageY", "screenX", "screenY", "clientX", "clientY"];
        var touchPropHook = function(name, event) {
            if(event[name] || !event.touches) {
                return event[name];
            }

            var touches = event.touches.length ? event.touches : event.changedTouches;
            if(!touches.length) {
                return;
            }

            return touches[0][name];
        };
        var result = eventsEngine.Event(event, event);

        // TODO: optimize by Object.defineProperty
        touchPropsToHook.forEach(function(name) {
            result[name] = touchPropHook(name, result);
        });

        return result;
    },
    Event: function(src, config) {
        if(typeof src === "string") {
            src = {
                type: src
            };
        }

        var propagationStopped = false;
        var immediatePropagationStopped = false;
        var defaultPrevented = false;

        var result = extend({}, src);

        if(src.isDXEvent || src instanceof Event) {
            result.originalEvent = src;
            result.currentTarget = undefined;
        }
        extend(result, config || {});

        if(!src.isDXEvent) {
            // TODO: Refactor
            extend(result, {
                isDXEvent: true,
                isPropagationStopped: function() {
                    return !!(propagationStopped || result.originalEvent && (result.originalEvent.isPropagationStopped && result.originalEvent.isPropagationStopped() || result.originalEvent.propagationStopped));
                },
                stopPropagation: function() {
                    propagationStopped = true;
                    result.originalEvent && result.originalEvent.stopPropagation();
                },
                isImmediatePropagationStopped: function() {
                    return !!(immediatePropagationStopped || result.originalEvent && (result.originalEvent.isImmediatePropagationStopped && result.originalEvent.isImmediatePropagationStopped()));
                },
                stopImmediatePropagation: function() {
                    this.stopPropagation();
                    immediatePropagationStopped = true;
                    result.originalEvent && result.originalEvent.stopImmediatePropagation();
                },
                isDefaultPrevented: function() {
                    return !!(defaultPrevented || result.originalEvent && (result.originalEvent.isDefaultPrevented && result.originalEvent.isDefaultPrevented() || result.originalEvent.defaultPrevented));
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
        result.guid = ++guid;

        return result;
    }
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
    set: setEngine,
    Event: function() {
        return eventsEngine.Event.apply(eventsEngine, arguments);
    },
};
module.exports = result;
