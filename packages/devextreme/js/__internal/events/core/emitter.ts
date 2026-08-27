import { fireEvent, hasTouches, isDxMouseWheelEvent } from '@js/common/core/events/utils/index';
import Class from '@js/core/class';
import $ from '@js/core/renderer';
import Callbacks from '@js/core/utils/callbacks';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';

const Emitter = Class.inherit({

  ctor(element) {
    this._$element = $(element);

    this._cancelCallback = Callbacks();
    this._acceptCallback = Callbacks();
  },

  getElement() {
    return this._$element;
  },

  validate(e) {
    return !isDxMouseWheelEvent(e);
  },

  validatePointers(e) {
    return hasTouches(e) === 1;
  },

  allowInterruptionByMouseWheel() {
    return true;
  },

  configure(data) {
    extend(this, data);
  },

  addCancelCallback(callback) {
    this._cancelCallback.add(callback);
  },

  removeCancelCallback() {
    this._cancelCallback.empty();
  },

  _cancel(e) {
    this._cancelCallback.fire(this, e);
  },

  addAcceptCallback(callback) {
    this._acceptCallback.add(callback);
  },

  removeAcceptCallback() {
    this._acceptCallback.empty();
  },

  _accept(e) {
    this._acceptCallback.fire(this, e);
  },

  _requestAccept(e) {
    this._acceptRequestEvent = e;
  },

  _forgetAccept() {
    this._accept(this._acceptRequestEvent);
    this._acceptRequestEvent = null;
  },

  start: noop,
  move: noop,
  end: noop,

  cancel: noop,
  reset() {
    if (this._acceptRequestEvent) {
      this._accept(this._acceptRequestEvent);
    }
  },

  _fireEvent(eventName, e, params) {
    const eventData = extend({
      type: eventName,
      originalEvent: e,
      target: this._getEmitterTarget(e),
      delegateTarget: this.getElement().get(0),
    }, params);

    e = fireEvent(eventData);

    if (e.cancel) {
      this._cancel(e);
    }

    return e;
  },

  _getEmitterTarget(e) {
    return (this.delegateSelector ? $(e.target).closest(this.delegateSelector) : this.getElement()).get(0);
  },

  dispose: noop,

});

export default Emitter;
