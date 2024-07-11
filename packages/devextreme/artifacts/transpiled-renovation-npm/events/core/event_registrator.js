"use strict";

exports.default = void 0;
var _iterator = require("../../core/utils/iterator");
var _event_registrator_callbacks = _interopRequireDefault(require("./event_registrator_callbacks"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const registerEvent = function (name, eventObject) {
  const strategy = {};
  if ('noBubble' in eventObject) {
    strategy.noBubble = eventObject.noBubble;
  }
  if ('bindType' in eventObject) {
    strategy.bindType = eventObject.bindType;
  }
  if ('delegateType' in eventObject) {
    strategy.delegateType = eventObject.delegateType;
  }
  (0, _iterator.each)(['setup', 'teardown', 'add', 'remove', 'trigger', 'handle', '_default', 'dispose'], function (_, methodName) {
    if (!eventObject[methodName]) {
      return;
    }
    strategy[methodName] = function () {
      const args = [].slice.call(arguments);
      args.unshift(this);
      return eventObject[methodName].apply(eventObject, args);
    };
  });
  _event_registrator_callbacks.default.fire(name, strategy);
};
registerEvent.callbacks = _event_registrator_callbacks.default;
var _default = exports.default = registerEvent;
module.exports = exports.default;
module.exports.default = exports.default;