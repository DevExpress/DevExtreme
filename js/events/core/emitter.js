var $ = require("../../core/renderer"),
    noop = require("../../core/utils/common").noop,
    Class = require("../../core/class"),
    Callbacks = require("../../core/utils/callbacks"),
    extend = require("../../core/utils/extend").extend,
    eventUtils = require("../utils");

var Emitter = Class.inherit({

    ctor: function(element) {
        this._$element = $(element);

        this._cancelCallback = Callbacks();
        this._acceptCallback = Callbacks();
    },

    getElement: function() {
        return this._$element;
    },

    validate: function(e) {
        return !eventUtils.isDxMouseWheelEvent(e);
    },

    validatePointers: function(e) {
        return eventUtils.hasTouches(e) === 1;
    },

    allowInterruptionByMouseWheel: function() {
        return true;
    },

    configure: function(data) {
        extend(this, data);
    },

    addCancelCallback: function(callback) {
        this._cancelCallback.add(callback);
    },

    removeCancelCallback: function() {
        this._cancelCallback.empty();
    },

    _cancel: function(e) {
        this._cancelCallback.fire(this, e);
    },

    addAcceptCallback: function(callback) {
        this._acceptCallback.add(callback);
    },

    removeAcceptCallback: function() {
        this._acceptCallback.empty();
    },

    _accept: function(e) {
        this._acceptCallback.fire(this, e);
    },

    _requestAccept: function(e) {
        this._acceptRequestEvent = e;
    },

    _forgetAccept: function() {
        this._accept(this._acceptRequestEvent);
        this._acceptRequestEvent = null;
    },

    start: noop,
    move: noop,
    end: noop,

    cancel: noop,
    reset: function() {
        if(this._acceptRequestEvent) {
            this._accept(this._acceptRequestEvent);
        }
    },

    _fireEvent: function(eventName, e, params) {
        var eventData = extend({
            type: eventName,
            originalEvent: e,
            target: this._getEmitterTarget(e),
            delegateTarget: this.getElement().get(0)
        }, params);

        e = eventUtils.fireEvent(eventData);

        if(e.cancel) {
            this._cancel(e);
        }

        return e;
    },

    _getEmitterTarget: function(e) {
        return (this.delegateSelector ? $(e.target).closest(this.delegateSelector) : this.getElement()).get(0);
    },

    dispose: noop

});

module.exports = Emitter;
