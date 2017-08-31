"use strict";

var registerEventCallbacks = require("./event_registrator_callbacks");
var typeUtils = require("../../core/utils/type");
var isWindow = typeUtils.isWindow;
var isFunction = typeUtils.isFunction;
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
var skipEvent;
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
                if(e.type === skipEvent) {
                    return;
                }
                // TODO: refactor
                var result; // TODO: get rid of checking if result equals false
                var callHandler = function(e) {
                    var handlerArgs = [e];
                    if(extraParameters !== undefined) {
                        handlerArgs.push(extraParameters);
                    }
                    return handler.apply(handlerArgs[0].currentTarget, handlerArgs);
                };

                if(e instanceof Event) {
                    e = eventsEngine.Event(e);
                }
                if(selector) {
                    if(!isWindow(e.target) && e.target.nodeName !== "#document" && matches(e.target, selector)) {
                        result = callHandler(extend(e, { currentTarget: e.target, data: data }));
                        if(result === false) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        return;
                    }
                    var target = e.target;
                    var newEvent;
                    while(target.parentNode && target !== element) {
                        target = target.parentNode;
                        if(target.nodeName !== "#document" && matches(target, selector)) {
                            newEvent = eventsEngine.Event(e, { currentTarget: target, data: data }); // TODO: Should we create new event here?
                            result = callHandler(newEvent);
                            if(result === false) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            return;
                        }
                    }
                } else {
                    if(!e.isDXEvent) {
                        e = eventsEngine.Event(e);
                    }
                    e.data = data;
                    result = callHandler(e);
                    if(result === false) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
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

setEngine({
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

    trigger: function(element, src, extraParameters, noBubble) {
        if(typeof src === "string") {
            src = {
                type: src
            };
        }

        var type = src.type || src.originalEvent && src.originalEvent.type;

        // TODO: Change grid editing tests and get rid of this
        if(element.nodeType && (src.type === "focus" || src.type === "focusin") && isFunction(element.focus) && element === document.activeElement) {
            skipEvent = "blur";
            element.blur && element.blur();
            skipEvent = undefined;
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

        noBubble = noBubble || special[type] && special[type].noBubble || event.isPropagationStopped();
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
                eventsEngine.trigger(parents[i], extend(event, { currentTarget: parents[i] }), extraParameters, true);
                i++;
            }
        }

        // TODO: Consider other native events
        // TODO: native click for checkboxes and links
        if(element.nodeType) {
            if((src.type === "focus" || src.type === "focusin") && isFunction(element.focus)) {
                skipEvent = src.type;
                element.focus();
                skipEvent = undefined;
            } else if((src.type === "blur" || src.type === "focusout") && isFunction(element.blur)) {
                skipEvent = src.type;
                element.blur && element.blur();
                skipEvent = undefined;
            } else if(isFunction(element[src.type])) {
                skipEvent = src.type;
                element[src.type]();
                skipEvent = undefined;
            }
        }
    },

    triggerHandler: function(element, src, extraParameters) {
        eventsEngine.trigger(element, src, extraParameters, true);// TODO: refacotr
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

        var propagationStopped = false;
        var immediatePropagationStopped = false;
        var defaultPrevented = false;

        var result = extend(this, src);

        if(src.isDXEvent || src instanceof Event) {
            result.originalEvent = src;
            result.currentTarget = undefined;
        }
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

        extend(result, config || {});

        result.guid = ++guid;
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
result.Event.prototype = eventsEngine.Event.prototype;
module.exports = result;
