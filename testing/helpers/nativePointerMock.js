(function(root, factory) {
    /* global jQuery */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            root.nativePointerMock = module.exports = factory(require("jquery"));
        });
    } else {
        root.nativePointerMock = factory(jQuery);
    }
}(window, function($) {
    var UA = (function() {
        var ua = window.navigator.userAgent,
            matches,
            version,
            result = { userAgent: ua };

        if(/i(pod|pad|phone)/ig.test(ua)) {
            matches = ua.match(/os (\d+)_(\d+)_?(\d+)?/i);
            version = matches ? [parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3] || 0, 10)] : [];
            result.ios = version[0];
        }

        if(/android|htc_|silk/ig.test(ua)) {
            matches = ua.match(/android (\d+)\.(\d+)\.?(\d+)?/i);
            version = matches ? [parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3] || 0, 10)] : [];
            result.android = version[0];
        }

        if(/Chrome/ig.test(ua)) {
            matches = ua.match(/Chrome\/(\d+)\.(\d+)\.?(\d+)?/i);
            version = [parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3] || 0, 10)];
            result.chrome = version[0];
        }

        if(/edge|trident/ig.test(ua)) {
            result.msie = true;
        }

        return result;
    })();

    var simulateEvent = (function() {

        var isString = function(val) { return typeof val === "string"; },
            isBoolean = function(val) { return typeof val === "boolean"; },
            isObject = function(val) { return typeof val === "object"; },

            MOUSE_EVENTS = {
                "click": 1,
                "dblclick": 1,
                "mouseover": 1,
                "mouseout": 1,
                "mousedown": 1,
                "mouseup": 1,
                "mousemove": 1,
                "contextmenu": 1
            },

            POINTER_EVENTS = {
                "pointerover": 1,
                "pointerout": 1,
                "pointerdown": 1,
                "pointerup": 1,
                "pointermove": 1
            },

            KEY_EVENTS = {
                "keydown": 1,
                "keyup": 1,
                "keypress": 1
            },

            UI_EVENTS = {
                submit: 1,
                blur: 1,
                change: 1,
                focus: 1,
                resize: 1,
                scroll: 1,
                select: 1
            },

            TOUCH_EVENTS = {
                "touchstart": 1,
                "touchmove": 1,
                "touchend": 1,
                "touchcancel": 1
            },

            GESTURE_EVENTS = {
                "gesturestart": 1,
                "gesturechange": 1,
                "gestureend": 1
            },

            BUBBLE_EVENTS = $.extend({
                scroll: 1,
                resize: 1,
                reset: 1,
                submit: 1,
                change: 1,
                select: 1,
                error: 1,
                abort: 1
            }, MOUSE_EVENTS, KEY_EVENTS, TOUCH_EVENTS);


        var simulateKeyEvent = function(target, type, bubbles, cancelable, view, ctrlKey, altKey, shiftKey, metaKey, keyCode, charCode) {
            if(!target) {
                throw Error("Invalid target");
            }

            if(isString(type)) {
                type = type.toLowerCase();
                switch(type) {
                    case "textevent":
                        type = "keypress";
                        break;
                    case "keyup":
                    case "keydown":
                    case "keypress":
                        break;
                    default:
                        throw Error("Event type '" + type + "' not supported.");
                }
            } else {
                throw Error("Event type must be a string.");
            }

            if(!isBoolean(bubbles)) {
                bubbles = true;
            }

            if(!isBoolean(cancelable)) {
                cancelable = true;
            }

            if(!isObject(view)) {
                view = window;
            }

            if(!isBoolean(ctrlKey)) {
                ctrlKey = false;
            }

            if(!isBoolean(altKey)) {
                altKey = false;
            }

            if(!isBoolean(shiftKey)) {
                shiftKey = false;
            }

            if(!isBoolean(metaKey)) {
                metaKey = false;
            }

            if(!$.isNumeric(keyCode)) {
                keyCode = 0;
            }

            if(!$.isNumeric(charCode)) {
                charCode = 0;
            }

            var customEvent = null;

            try {
                customEvent = document.createEvent("KeyEvents");

                customEvent.initKeyEvent(type, bubbles, cancelable, view, ctrlKey,
                    altKey, shiftKey, metaKey, keyCode, charCode);

            } catch(ex) {

                try {

                    customEvent = document.createEvent("Events");

                } catch(uiError) {

                    customEvent = document.createEvent("UIEvents");

                } finally {

                    customEvent.initEvent(type, bubbles, cancelable);

                    customEvent.view = view;
                    customEvent.altKey = altKey;
                    customEvent.ctrlKey = ctrlKey;
                    customEvent.shiftKey = shiftKey;
                    customEvent.metaKey = metaKey;
                    customEvent.keyCode = keyCode;
                    customEvent.charCode = charCode;
                }

            }

            target.dispatchEvent(customEvent);
        };

        var simulateMouseEvent = function(target, type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget) {
            if(!target) {
                throw Error("Invalid target.");
            }


            if(isString(type)) {
                if(!MOUSE_EVENTS[type.toLowerCase()] && !POINTER_EVENTS[type]) {
                    throw Error("Event type '" + type + "' not supported.");
                }
            } else {
                throw Error("Event type must be a string.");
            }

            if(!isBoolean(bubbles)) {
                bubbles = true;
            }

            if(!isBoolean(cancelable)) {
                cancelable = (type !== "mousemove");
            }

            if(!isObject(view)) {
                view = window;
            }

            if(!$.isNumeric(detail)) {
                detail = 1;
            }

            if(!$.isNumeric(screenX)) {
                screenX = 0;
            }

            if(!$.isNumeric(screenY)) {
                screenY = 0;
            }

            if(!$.isNumeric(clientX)) {
                clientX = 0;
            }

            if(!$.isNumeric(clientY)) {
                clientY = 0;
            }

            if(!isBoolean(ctrlKey)) {
                ctrlKey = false;
            }

            if(!isBoolean(altKey)) {
                altKey = false;
            }

            if(!isBoolean(shiftKey)) {
                shiftKey = false;
            }

            if(!isBoolean(metaKey)) {
                metaKey = false;
            }

            if(!$.isNumeric(button)) {
                button = 0;
            }

            relatedTarget = relatedTarget || null;

            var customEvent = document.createEvent("MouseEvents");

            if(customEvent.initMouseEvent) {
                customEvent.initMouseEvent(type, bubbles, cancelable, view, detail,
                    screenX, screenY, clientX, clientY,
                    ctrlKey, altKey, shiftKey, metaKey,
                    button, relatedTarget);
            } else {
                customEvent = document.createEvent("UIEvents");
                customEvent.initEvent(type, bubbles, cancelable);
                customEvent.view = view;
                customEvent.detail = detail;
                customEvent.screenX = screenX;
                customEvent.screenY = screenY;
                customEvent.clientX = clientX;
                customEvent.clientY = clientY;
                customEvent.ctrlKey = ctrlKey;
                customEvent.altKey = altKey;
                customEvent.metaKey = metaKey;
                customEvent.shiftKey = shiftKey;
                customEvent.button = button;
                customEvent.relatedTarget = relatedTarget;
            }

            if(relatedTarget && !customEvent.relatedTarget) {
                if(type === "mouseout") {
                    customEvent.toElement = relatedTarget;
                } else if(type === "mouseover") {
                    customEvent.fromElement = relatedTarget;
                }
            }

            target.dispatchEvent(customEvent);
        };

        var simulateUIEvent = function(target, type, bubbles, cancelable, view, detail) {
            if(!target) {
                throw Error("Invalid target.");
            }

            if(isString(type)) {
                type = type.toLowerCase();

                if(!UI_EVENTS[type]) {
                    throw Error("Event type '" + type + "' not supported.");
                }
            } else {
                throw Error("Event type must be a string.");
            }

            var customEvent = null;

            if(!isBoolean(bubbles)) {
                bubbles = (type in BUBBLE_EVENTS);

                if(!isBoolean(cancelable)) {
                    cancelable = (type === "submit");

                    if(!isObject(view)) {
                        view = window;

                        if(!$.isNumeric(detail)) {
                            detail = 1;

                            if($.isFunction(document.createEvent)) {

                                customEvent = document.createEvent("UIEvents");
                                customEvent.initUIEvent(type, bubbles, cancelable, view, detail);

                                target.dispatchEvent(customEvent);

                            } else {
                                throw Error("No event simulation framework present.");
                            }
                        }
                    }
                }
            }
        };

        var simulateGestureEvent = function(target, type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, scale, rotation) {
            var customEvent;

            if(!UA.ios || UA.ios < 2.0) {
                throw Error("Native gesture DOM eventframe is not available in this platform.");
            }

            if(!target) {
                throw Error("Invalid target.");
            }

            if(isString(type)) {
                type = type.toLowerCase();

                if(!GESTURE_EVENTS[type]) {
                    throw Error("Event type '" + type + "' not supported.");
                }
            } else {
                throw Error("Event type must be a string.");
            }

            if(!isBoolean(bubbles)) { bubbles = true; }
            if(!isBoolean(cancelable)) { cancelable = true; }
            if(!isObject(view)) { view = window; }
            if(!$.isNumeric(detail)) { detail = 2; }
            if(!$.isNumeric(screenX)) { screenX = 0; }
            if(!$.isNumeric(screenY)) { screenY = 0; }
            if(!$.isNumeric(clientX)) { clientX = 0; }
            if(!$.isNumeric(clientY)) { clientY = 0; }
            if(!isBoolean(ctrlKey)) { ctrlKey = false; }
            if(!isBoolean(altKey)) { altKey = false; }
            if(!isBoolean(shiftKey)) { shiftKey = false; }
            if(!isBoolean(metaKey)) { metaKey = false; }

            if(!$.isNumeric(scale)) { scale = 1.0; }
            if(!$.isNumeric(rotation)) { rotation = 0.0; }

            customEvent = document.createEvent("GestureEvent");

            customEvent.initGestureEvent(type, bubbles, cancelable, view, detail,
                screenX, screenY, clientX, clientY,
                ctrlKey, altKey, shiftKey, metaKey,
                target, scale, rotation);

            target.dispatchEvent(customEvent);
        };

        var simulateTouchEvent = function(target, type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation) {
            var customEvent;

            if(!target) {
                throw Error("Invalid target.");
            }

            if(isString(type)) {
                type = type.toLowerCase();

                if(!TOUCH_EVENTS[type]) {
                    throw Error("Event type '" + type + "' not supported.");
                }
            } else {
                throw Error("Event type must be a string.");
            }

            if(type === 'touchstart' || type === 'touchmove') {
                if(touches.length === 0) {
                    throw Error('No touch object in touches');
                }
            } else if(type === 'touchend') {
                if(changedTouches.length === 0) {
                    throw Error('No touch object in changedTouches');
                }
            }

            if(!isBoolean(bubbles)) { bubbles = true; }
            if(!isBoolean(cancelable)) {
                cancelable = (type !== "touchcancel");
            }
            if(!isObject(view)) { view = window; }
            if(!$.isNumeric(detail)) { detail = 1; }
            if(!$.isNumeric(screenX)) { screenX = 0; }
            if(!$.isNumeric(screenY)) { screenY = 0; }
            if(!$.isNumeric(clientX)) { clientX = 0; }
            if(!$.isNumeric(clientY)) { clientY = 0; }
            if(!isBoolean(ctrlKey)) { ctrlKey = false; }
            if(!isBoolean(altKey)) { altKey = false; }
            if(!isBoolean(shiftKey)) { shiftKey = false; }
            if(!isBoolean(metaKey)) { metaKey = false; }
            if(!$.isNumeric(scale)) { scale = 1.0; }
            if(!$.isNumeric(rotation)) { rotation = 0.0; }

            if(UA.android && !UA.chrome) {
                customEvent = document.createEvent("MouseEvents");
                customEvent.initMouseEvent(type, bubbles, cancelable, view, detail,
                    screenX, screenY, clientX, clientY,
                    ctrlKey, altKey, shiftKey, metaKey,
                    0, target);

                customEvent.touches = touches || [];
                customEvent.targetTouches = targetTouches || [];
                customEvent.changedTouches = changedTouches || [];
            } else if(UA.ios) {
                if(UA.ios >= 2.0) {
                    customEvent = document.createEvent("TouchEvent");

                    var createTouchByOptions = function(options) {
                        return new window.Touch({
                            target: options.target || document.body,
                            identifier: options.identifier || $.now(),
                            pageX: options.pageX || 0,
                            pageY: options.pageY || 0,
                            screenX: options.screenX || 0,
                            screenY: options.screenY || 0 }
                        );
                    };

                    var createTouchListByArray = function(array) {
                        var result = array || [];

                        $.each(result, function(i) {
                            result[i] = createTouchByOptions(this);
                        });

                        return result;
                    };

                    touches = createTouchListByArray(touches);
                    targetTouches = createTouchListByArray(targetTouches);
                    changedTouches = createTouchListByArray(changedTouches);

                    customEvent = new window.TouchEvent(type, {
                        cancelable: cancelable,
                        bubbles: bubbles,
                        touches: touches,
                        targetTouches: targetTouches,
                        changedTouches: changedTouches
                    });

                } else {
                    throw Error('No touch event simulation framework present for iOS, ' + UA.ios + '.');
                }
            } else if(UA.chrome && ('ontouchstart' in window)) {
                customEvent = new window.UIEvent(type, { view: view, detail: detail, bubbles: bubbles, cancelable: cancelable, target: target });

                customEvent.screenX = screenX;
                customEvent.screenY = screenY;
                customEvent.clientX = clientX;
                customEvent.clientY = clientY;
                customEvent.ctrlKey = ctrlKey;
                customEvent.altKey = altKey;
                customEvent.metaKey = metaKey;
                customEvent.shiftKey = shiftKey;
                customEvent.touches = touches || [];
                customEvent.targetTouches = targetTouches || [];
                customEvent.changedTouches = changedTouches || [];
            } else {
                throw Error('Not supported agent yet, ' + UA.userAgent);
            }

            target.dispatchEvent(customEvent);
        };

        return function(target, type, options) {
            options = options || {};

            if(MOUSE_EVENTS[type] || POINTER_EVENTS[type]) {
                simulateMouseEvent(target, type, options.bubbles,
                    options.cancelable, options.view, options.detail, options.screenX,
                    options.screenY, options.clientX, options.clientY, options.ctrlKey,
                    options.altKey, options.shiftKey, options.metaKey, options.button,
                    options.relatedTarget);
            } else if(KEY_EVENTS[type]) {
                simulateKeyEvent(target, type, options.bubbles,
                    options.cancelable, options.view, options.ctrlKey,
                    options.altKey, options.shiftKey, options.metaKey,
                    options.keyCode, options.charCode);
            } else if(UI_EVENTS[type]) {
                simulateUIEvent(target, type, options.bubbles,
                    options.cancelable, options.view, options.detail);
            } else if(TOUCH_EVENTS[type]) {
                if((window && ("ontouchstart" in window)) && !(UA.chrome && UA.chrome < 6)) {
                    simulateTouchEvent(target, type,
                        options.bubbles, options.cancelable, options.view, options.detail,
                        options.screenX, options.screenY, options.clientX, options.clientY,
                        options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
                        options.touches, options.targetTouches, options.changedTouches,
                        options.scale, options.rotation);
                } else {
                    throw Error("Event '" + type + "' can't be simulated. Use gesture-simulate module instead.");
                }

            } else if(UA.ios && UA.ios >= 2.0 && GESTURE_EVENTS[type]) {
                simulateGestureEvent(target, type,
                    options.bubbles, options.cancelable, options.view, options.detail,
                    options.screenX, options.screenY, options.clientX, options.clientY,
                    options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
                    options.scale, options.rotation);

            } else {
                throw Error("Event '" + type + "' can't be simulated.");
            }
        };
    })();

    var pointerEventsSupport = !!window.PointerEvent && UA.msie;

    var createEvent = function(type, options) {
        if(typeof window.PointerEvent === "function") {
            return new PointerEvent(type, options);
        }

        var event = document.createEvent("pointerEvent");
        var args = [];
        $.each(["type", "bubbles", "cancelable", "view", "detail", "screenX", "screenY", "clientX", "clientY", "ctrlKey", "altKey",
            "shiftKey", "metaKey", "button", "relatedTarget", "offsetX", "offsetY", "width", "height", "pressure", "rotation", "tiltX",
            "tiltY", "pointerId", "pointerType", "hwTimestamp", "isPrimary"], function(i, name) {
            if(name in options) {
                args.push(options[name]);
            } else {
                args.push(event[name]);
            }
        });
        event.initPointerEvent.apply(event, args);

        return event;
    };

    var simulatePointerEvent = function($element, type, options) {
        options = $.extend({
            bubbles: true,
            cancelable: true,
            type: type
        }, options);

        var event = createEvent(type, options);

        $element[0].dispatchEvent(event);
    };


    var result = function($element) {

        $element = $($element);

        var _x,
            _y,
            _scrollTop,
            _scrollLeft,
            _clock;

        var createTouchMock = function(options) {
            // NOTE: All parameters are optional.
            options = $.extend({
                // values: window
                view: window, // The window in which the touch occurred

                // values: DOMNode || document || window || etc.
                target: null, // The EventTarget for the touch

                // Returns a value uniquely identifying this point of contact
                // with the touch surface. This value remains consistent for every
                // event involving this finger's (or stylus's) movement
                // on the surface until it is lifted off the surface.
                //
                // values: unique ID of the Touch object
                identifier: $.now(), // The value for Touch.identifier

                // Coordinates of the touch point relative to the viewport,
                // including any scroll offset.
                pageX: null, // The value for Touch.pageX
                pageY: null, // The value for Touch.pageY

                // Coordinates coordinate of the touch point relative to the screen,
                // not including any scroll offset.
                screenX: null, // The value for Touch.screenX
                screenY: null, // The value for Touch.screenY

                // Coordinates of the touch point relative to the viewport,
                // not including any scroll offset.
                clientX: null, // The value for Touch.clientX
                clientY: null, // The value for Touch.clientY

                // Radiuses of the ellipse that most closely circumscribes the area
                // of contact with the screen. The value is in pixels of the same scale as screenX/screenY.
                radiusX: null, // The value for Touch.radiusX.
                radiusY: null, // The value for Touch.radiusY.

                // The rotation angle, in degrees, of the contact area ellipse defined by Touch.radiusX and Touch.radiusY.
                // values: [ 0 .. 90 ]
                rotationAngle: null, // The value for Touch.rotationAngle.

                // The amount of pressure the user is applying to the touch surface for this
                // values: [ 0.0 .. 1.0 ] - no pressure and the maximum amount of pressure respectively.
                force: null
            }, options);

            return options;
        };

        var createTouchEventMock = function(options) {
            options = $.extend({
                type: "",

                // values: window
                view: window, // The window in which the touch occurred

                // values: DOMNode || document || window || etc.
                target: null, // The EventTarget for the touch

                // Returns a value uniquely identifying this point of contact
                // with the touch surface. This value remains consistent for every
                // event involving this finger's (or stylus's) movement
                // on the surface until it is lifted off the surface.
                //
                // values: unique ID of the Touch object
                identifier: null, // The value for Touch.identifier

                // Coordinates of the touch point relative to the viewport,
                // including any scroll offset.
                pageX: null, // The value for Touch.pageX
                pageY: null, // The value for Touch.pageY

                // Coordinates coordinate of the touch point relative to the screen,
                // not including any scroll offset.
                screenX: null, // The value for Touch.screenX
                screenY: null, // The value for Touch.screenY

                // Coordinates of the touch point relative to the viewport,
                // not including any scroll offset.
                clientX: null, // The value for Touch.clientX
                clientY: null, // The value for Touch.clientY

                // Radiuses of the ellipse that most closely circumscribes the area
                // of contact with the screen. The value is in pixels of the same scale as screenX/screenY.
                radiusX: null, // The value for Touch.radiusX.
                radiusY: null, // The value for Touch.radiusY.

                // The rotation angle, in degrees, of the contact area ellipse defined by Touch.radiusX and Touch.radiusY.
                // values: [ 0 .. 90 ]
                rotationAngle: null, // The value for Touch.rotationAngle.

                // The amount of pressure the user is applying to the touch surface for this
                // values: [ 0.0 .. 1.0 ] - no pressure and the maximum amount of pressure respectively.
                force: null,

                cancelable: true, // whether or not the event's default action can be prevented. Sets the value of event.cancelable.

                touches: [],
                targetTouches: [],
                changedTouches: [],

                scale: 1,
                rotation: 0,

                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,

                detail: 0
            }, options);

            return options;
        };

        var createMouseEventMock = function(options) {
            options = $.extend({
                type: null, // click, mousedown, mouseup, mouseover, mousemove, mouseout.

                bubbles: true, // whether or not the event can bubble. Sets the value of
                cancelable: true, // whether or not the event's default action can be prevented. Sets the value of event.cancelable.

                view: window, // the Event's AbstractView. You should pass the window object here. Sets the value of event.view.
                detail: 0, // the Event's mouse click count. Sets the value of event.detail

                screenX: 0, // the Event's screen x coordinate. Sets the value of event.screenX.
                screenY: 0, // the Event's screen y coordinate. Sets the value of event.screenY.

                clientX: 0, // the Event's client x coordinate. Sets the value of event.clientX.
                clientY: 0, // whether or not control key was depressed during the Event. Sets the value of event.ctrlKey.

                ctrlKey: false, // whether or not alt key was depressed during the Event. Sets the value of event.altKey.
                altKey: false, // whether or not shift key was depressed during the Event. Sets the value of event.shiftKey.
                shiftKey: false, // whether or not meta key was depressed during the Event. Sets the value of event.metaKey.
                metaKey: false, // the Event's mouse event.button.
                button: 0, // Indicates which mouse button caused the event: 0 || 1 || 2

                relatedTarget: null // the Event's related EventTarget. Only used with some event types (e.g. mouseover and mouseout). In other cases, pass null.
            }, options);

            return options;
        };


        var originalEvent = function(options) {
            var event;

            if(/(click|mouse|wheel|pointer)/i.test(options.type)) {
                event = createMouseEventMock(options);
            }

            if(/(touch)/i.test(options.type)) {
                event = createTouchEventMock(options);
            }

            return event;
        };

        var eventMock = function(type, options) {
            options = $.extend({
                type: type
            }, options);

            if(type.indexOf("touch") > -1) {
                var touch = createTouchMock(options);

                options = $.extend({
                    touches: type === "touchend" ? [] : [touch],
                    changedTouches: [touch],
                    targetTouches: type === "touchend" ? [] : [touch]
                }, options);
            }

            if(type.indexOf("pointer") > -1) {
                options = $.extend({
                    pointerType: "mouse"
                }, options);
            }


            var event = $.extend($.Event(options.type), originalEvent(options), options);

            event[$.expando] = false;
            event = $.event.fix(event);

            return event;
        };

        var createEvent = function(type, args) {
            return eventMock(type, $.extend({
                pageX: _x,
                pageY: _y,
                timeStamp: _clock,
                type: type,
                which: 1,
                target: $element.get(0)
            }, args));
        };

        var triggerEvent = function(type, args) {
            var event = createEvent(type, args);
            $element.trigger(event);
            return event;
        };

        return {
            eventMock: eventMock,

            start: function() {
                _x = 0;
                _y = 0;
                _scrollTop = 0;
                _scrollLeft = 0;
                _clock = $.now();
                return this;
            },

            touchStart: function() {
                triggerEvent("touchstart");
                return this;
            },

            touchMove: function(deltaX, deltaY) {
                _x += deltaX || 0;
                _y += deltaY || 0;
                triggerEvent("touchmove");
                return this;
            },

            touchEnd: function() {
                triggerEvent("touchend");
                return this;
            },

            touchCancel: function() {
                triggerEvent("touchcancel");
                return this;
            },

            pointerDown: function() {
                var eventName = "pointerdown";
                try {
                    simulatePointerEvent($element, eventName, { clientX: _x, clientY: _y, pointerType: "mouse", pointerId: 1 });
                } catch(e) {
                    triggerEvent(eventName, { pointerType: "mouse" });
                }
                return this;
            },

            pointerMove: function(deltaX, deltaY) {
                var eventName = "pointermove";

                _x += deltaX || 0;
                _y += deltaY || 0;
                try {
                    simulatePointerEvent($element, eventName, { clientX: _x, clientY: _y, pointerType: "mouse", pointerId: 1 });
                } catch(e) {
                    triggerEvent(eventName, { pointerType: "mouse" });
                }
                return this;
            },

            pointerUp: function() {
                var eventName = "pointerup";
                try {
                    simulatePointerEvent($element, eventName, { clientX: _x, clientY: _y, pointerType: "mouse", pointerId: 1 });
                } catch(e) {
                    triggerEvent(eventName, { pointerType: "mouse" });
                }
                return this;
            },

            pointerCancel: function() {
                var eventName = "pointercancel";
                try {
                    simulatePointerEvent($element, eventName, { clientX: _x, clientY: _y, pointerType: "mouse", pointerId: 1 });
                } catch(e) {
                    triggerEvent(eventName, { pointerType: "mouse" });
                }
                return this;
            },

            mouseDown: function() {
                triggerEvent("mousedown");
                return this;
            },

            mouseMove: function(deltaX, deltaY) {
                _x += deltaX || 0;
                _y += deltaY || 0;
                triggerEvent("mousemove");
                return this;
            },

            mouseUp: function() {
                triggerEvent("mouseup");
                return this;
            },

            mouseOver: function() {
                triggerEvent("mouseover");
                return this;
            },

            mouseOut: function() {
                triggerEvent("mouseout");
                return this;
            },

            mouseEnter: function() {
                triggerEvent("mouseenter");
                return this;
            },

            mouseLeave: function() {
                triggerEvent("mouseleave");
                return this;
            },

            down: function(x, y) {
                _x = x || _x;
                _y = y || _y;
                pointerEventsSupport ? this.pointerDown() : this.touchStart();
                this.mouseDown();
                return this;
            },

            move: function(x, y) {
                if($.isArray(x)) {
                    this.move.apply(this, x);
                } else {
                    pointerEventsSupport ? this.pointerMove(x, y) : this.touchMove(x, y);
                    this.mouseMove();
                }
                return this;
            },

            up: function() {
                pointerEventsSupport ? this.pointerUp() : this.touchEnd();
                this.mouseUp();
                this.click(true);
                return this;
            },

            scroll: function(x, y) {
                _scrollLeft += x;
                _scrollTop += y;

                $element
                    .scrollLeft(_scrollLeft)
                    .scrollTop(_scrollTop);
                return this;
            },

            click: function(clickOnly) {
                if(!clickOnly) {
                    this.down();
                    this.up();
                } else {
                    triggerEvent("click");
                }
                return this;
            },

            wheel: function(d, shiftKey) {
                if(document["onwheel"] !== undefined) {
                    triggerEvent("wheel", {
                        deltaY: -d / 30,
                        shiftKey: shiftKey
                    });
                } else {
                    triggerEvent("mousewheel", {
                        wheelDelta: d,
                        shiftKey: shiftKey
                    });
                }

                triggerEvent("scroll");
                return this;
            },

            wait: function(ms) {
                _clock += ms;
                return this;
            }
        };
    };

    result.simulateEvent = simulateEvent;

    return result;

}));
