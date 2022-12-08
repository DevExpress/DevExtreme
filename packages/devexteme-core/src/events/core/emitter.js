import $ from '../../core/renderer';
import { noop } from '../../core/utils/common';
import Class from '../../core/class';
import Callbacks from '../../core/utils/callbacks';
import { extend } from '../../core/utils/extend';
import { isDxMouseWheelEvent, hasTouches, fireEvent } from '../utils/index';

const Emitter = Class.inherit({

    ctor: function(element) {
        this._$element = $(element);

        this._cancelCallback = Callbacks();
        this._acceptCallback = Callbacks();
    },

    getElement: function() {
        return this._$element;
    },

    validate: function(e) {
        return !isDxMouseWheelEvent(e);
    },

    validatePointers: function(e) {
        return hasTouches(e) === 1;
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
        const eventData = extend({
            type: eventName,
            originalEvent: e,
            target: this._getEmitterTarget(e),
            delegateTarget: this.getElement().get(0)
        }, params);

        e = fireEvent(eventData);

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

export default Emitter;
