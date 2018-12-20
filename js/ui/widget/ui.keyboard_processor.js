import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import Class from "../../core/class";
import { inArray } from "../../core/utils/array";
import { each } from "../../core/utils/iterator";
import eventUtils from "../../events/utils";

const KeyboardProcessor = Class.inherit({
    _keydown: eventUtils.addNamespace("keydown", "KeyboardProcessor"),

    keyMap: {
        "backspace": "backspace",
        "tab": "tab",
        "enter": "enter",
        "escape": "escape",
        "pageup": "pageUp",
        "pagedown": "pageDown",
        "end": "end",
        "home": "home",
        "arrowleft": "leftArrow",
        "arrowup": "upArrow",
        "arrowright": "rightArrow",
        "arrowdown": "downArrow",
        "delete": "del",
        " ": "space",
        "f": "F",
        "a": "A",
        "*": "asterisk",
        "-": "minus",
        // IE11:
        "left": "leftArrow",
        "up": "upArrow",
        "right": "rightArrow",
        "down": "downArrow",
        "multiply": "asterisk",
        "spacebar": "space",
        "del": "del",
        "subtract": "minus"
    },

    ctor: function(options) {
        options = options || {};
        if(options.element) {
            this._element = $(options.element);
        }
        if(options.focusTarget) {
            this._focusTarget = options.focusTarget;
        }
        this._handler = options.handler;
        this._context = options.context;
        this._childProcessors = [];
        if(this._element) {
            this._processFunction = (e) => {
                this.process(e);
            };
            eventsEngine.on(this._element, this._keydown, this._processFunction);
        }
    },

    dispose: function() {
        if(this._element) {
            eventsEngine.off(this._element, this._keydown, this._processFunction);
        }
        this._element = undefined;
        this._handler = undefined;
        this._context = undefined;
        this._childProcessors = undefined;
    },

    clearChildren: function() {
        this._childProcessors = [];
    },

    push: function(child) {
        if(!this._childProcessors) {
            this.clearChildren();
        }

        this._childProcessors.push(child);
        return child;
    },

    attachChildProcessor: function() {
        var childProcessor = new KeyboardProcessor();
        this._childProcessors.push(childProcessor);
        return childProcessor;
    },

    reinitialize: function(childHandler, childContext) {
        this._context = childContext;
        this._handler = childHandler;
        return this;
    },

    process: function(e) {
        if(this._focusTarget && this._focusTarget !== e.target && inArray(e.target, this._focusTarget) < 0) {
            return false;
        }

        var args = {
            keyName: this.keyMap[e.key.toLowerCase()] || e.key,
            key: e.key,
            code: e.code,
            ctrl: e.ctrlKey,
            location: e.location,
            metaKey: e.metaKey,
            shift: e.shiftKey,
            alt: e.altKey,
            originalEvent: e
        };

        var handlerResult = this._handler && this._handler.call(this._context, args);

        if(handlerResult && this._childProcessors) {
            each(this._childProcessors, function(index, childProcessor) {
                childProcessor.process(e);
            });
        }
    }

});

module.exports = KeyboardProcessor;
