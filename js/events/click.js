var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    devices = require("../core/devices"),
    domAdapter = require("../core/dom_adapter"),
    domUtils = require("../core/utils/dom"),
    animationFrame = require("../animation/frame"),
    eventUtils = require("./utils"),
    pointerEvents = require("./pointer"),
    Emitter = require("./core/emitter"),
    registerEmitter = require("./core/emitter_registrator"),
    compareVersions = require("../core/utils/version").compare;

var CLICK_EVENT_NAME = "dxclick",
    TOUCH_BOUNDARY = 10,
    abs = Math.abs;

var isInput = function(element) {
    return $(element).is("input, textarea, select, button ,:focus, :focus *");
};

var misc = { requestAnimationFrame: animationFrame.requestAnimationFrame, cancelAnimationFrame: animationFrame.cancelAnimationFrame };

var ClickEmitter = Emitter.inherit({

    ctor: function(element) {
        this.callBase(element);

        this._makeElementClickable($(element));
    },

    _makeElementClickable: function($element) {
        if(!$element.attr("onclick")) {
            $element.attr("onclick", "void(0)");
        }
    },

    start: function(e) {
        this._blurPrevented = e.isDefaultPrevented();
        this._startTarget = e.target;
        this._startEventData = eventUtils.eventData(e);
    },

    end: function(e) {
        if(this._eventOutOfElement(e, this.getElement().get(0)) || e.type === pointerEvents.cancel) {
            this._cancel(e);
            return;
        }

        if(!isInput(e.target) && !this._blurPrevented) {
            domUtils.resetActiveElement();
        }

        this._accept(e);
        this._clickAnimationFrame = misc.requestAnimationFrame((function() {
            this._fireClickEvent(e);
        }).bind(this));
    },

    _eventOutOfElement: function(e, element) {
        var target = e.target,
            targetChanged = !domUtils.contains(element, target) && element !== target,

            gestureDelta = eventUtils.eventDelta(eventUtils.eventData(e), this._startEventData),
            boundsExceeded = abs(gestureDelta.x) > TOUCH_BOUNDARY || abs(gestureDelta.y) > TOUCH_BOUNDARY;

        return targetChanged || boundsExceeded;
    },

    _fireClickEvent: function(e) {
        this._fireEvent(CLICK_EVENT_NAME, e, {
            target: domUtils.closestCommonParent(this._startTarget, e.target)
        });
    },

    dispose: function() {
        misc.cancelAnimationFrame(this._clickAnimationFrame);
    }

});


// NOTE: native strategy for desktop, iOS 9.3+, Android 5+
(function() {
    var NATIVE_CLICK_CLASS = "dx-native-click";
    var realDevice = devices.real(),
        useNativeClick =
            realDevice.generic ||
            realDevice.ios && compareVersions(realDevice.version, [9, 3]) >= 0 ||
            realDevice.android && compareVersions(realDevice.version, [5]) >= 0;

    var isNativeClickEvent = function(target) {
        return useNativeClick || $(target).closest("." + NATIVE_CLICK_CLASS).length;
    };


    var prevented = null,
        lastFiredEvent = null;

    var clickHandler = function(e) {
        var originalEvent = e.originalEvent,
            eventAlreadyFired = lastFiredEvent === originalEvent || originalEvent && originalEvent.DXCLICK_FIRED,
            leftButton = !e.which || e.which === 1;

        if(leftButton && !prevented && isNativeClickEvent(e.target) && !eventAlreadyFired) {
            if(originalEvent) {
                originalEvent.DXCLICK_FIRED = true;
            }

            lastFiredEvent = originalEvent;
            eventUtils.fireEvent({
                type: CLICK_EVENT_NAME,
                originalEvent: e
            });
        }
    };

    ClickEmitter = ClickEmitter.inherit({
        _makeElementClickable: function($element) {
            if(!isNativeClickEvent($element)) {
                this.callBase($element);
            }

            eventsEngine.on($element, "click", clickHandler);
        },

        configure: function(data) {
            this.callBase(data);
            if(data.useNative) {
                this.getElement().addClass(NATIVE_CLICK_CLASS);
            }
        },

        start: function(e) {
            prevented = null;

            if(!isNativeClickEvent(e.target)) {
                this.callBase(e);
            }
        },

        end: function(e) {
            if(!isNativeClickEvent(e.target)) {
                this.callBase(e);
            }
        },

        cancel: function() {
            prevented = true;
        },

        dispose: function() {
            this.callBase();

            eventsEngine.off(this.getElement(), "click", clickHandler);
        }
    });

    ///#DEBUG
    exports.useNativeClick = useNativeClick;
    ///#ENDDEBUG
})();


// NOTE: fixes native click blur on slow devices
(function() {
    var desktopDevice = devices.real().generic;

    if(!desktopDevice) {
        var startTarget = null,
            blurPrevented = false;

        var pointerDownHandler = function(e) {
            startTarget = e.target;
            blurPrevented = e.isDefaultPrevented();
        };

        var clickHandler = function(e) {
            var $target = $(e.target);
            if(!blurPrevented && startTarget && !$target.is(startTarget) && !$(startTarget).is("label") && isInput($target)) {
                domUtils.resetActiveElement();
            }

            startTarget = null;
            blurPrevented = false;
        };

        var NATIVE_CLICK_FIXER_NAMESPACE = "NATIVE_CLICK_FIXER",
            document = domAdapter.getDocument();
        eventsEngine.subscribeGlobal(document, eventUtils.addNamespace(pointerEvents.down, NATIVE_CLICK_FIXER_NAMESPACE), pointerDownHandler);
        eventsEngine.subscribeGlobal(document, eventUtils.addNamespace("click", NATIVE_CLICK_FIXER_NAMESPACE), clickHandler);
    }
})();


/**
  * @name UI Events.dxclick
  * @type eventType
  * @type_function_param1 event:event
  * @module events/click
*/
registerEmitter({
    emitter: ClickEmitter,
    bubble: true,
    events: [
        CLICK_EVENT_NAME
    ]
});

exports.name = CLICK_EVENT_NAME;

///#DEBUG
exports.misc = misc;
///#ENDDEBUG
