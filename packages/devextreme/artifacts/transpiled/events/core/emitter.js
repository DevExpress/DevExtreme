"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _common = require("../../core/utils/common");
var _class = _interopRequireDefault(require("../../core/class"));
var _callbacks = _interopRequireDefault(require("../../core/utils/callbacks"));
var _extend = require("../../core/utils/extend");
var _index = require("../utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Emitter = _class.default.inherit({
  ctor: function (element) {
    this._$element = (0, _renderer.default)(element);
    this._cancelCallback = (0, _callbacks.default)();
    this._acceptCallback = (0, _callbacks.default)();
  },
  getElement: function () {
    return this._$element;
  },
  validate: function (e) {
    return !(0, _index.isDxMouseWheelEvent)(e);
  },
  validatePointers: function (e) {
    return (0, _index.hasTouches)(e) === 1;
  },
  allowInterruptionByMouseWheel: function () {
    return true;
  },
  configure: function (data) {
    (0, _extend.extend)(this, data);
  },
  addCancelCallback: function (callback) {
    this._cancelCallback.add(callback);
  },
  removeCancelCallback: function () {
    this._cancelCallback.empty();
  },
  _cancel: function (e) {
    this._cancelCallback.fire(this, e);
  },
  addAcceptCallback: function (callback) {
    this._acceptCallback.add(callback);
  },
  removeAcceptCallback: function () {
    this._acceptCallback.empty();
  },
  _accept: function (e) {
    this._acceptCallback.fire(this, e);
  },
  _requestAccept: function (e) {
    this._acceptRequestEvent = e;
  },
  _forgetAccept: function () {
    this._accept(this._acceptRequestEvent);
    this._acceptRequestEvent = null;
  },
  start: _common.noop,
  move: _common.noop,
  end: _common.noop,
  cancel: _common.noop,
  reset: function () {
    if (this._acceptRequestEvent) {
      this._accept(this._acceptRequestEvent);
    }
  },
  _fireEvent: function (eventName, e, params) {
    const eventData = (0, _extend.extend)({
      type: eventName,
      originalEvent: e,
      target: this._getEmitterTarget(e),
      delegateTarget: this.getElement().get(0)
    }, params);
    e = (0, _index.fireEvent)(eventData);
    if (e.cancel) {
      this._cancel(e);
    }
    return e;
  },
  _getEmitterTarget: function (e) {
    return (this.delegateSelector ? (0, _renderer.default)(e.target).closest(this.delegateSelector) : this.getElement()).get(0);
  },
  dispose: _common.noop
});
var _default = exports.default = Emitter;
module.exports = exports.default;
module.exports.default = exports.default;