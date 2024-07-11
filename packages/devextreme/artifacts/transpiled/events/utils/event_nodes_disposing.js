"use strict";

exports.unsubscribeNodesDisposing = exports.subscribeNodesDisposing = void 0;
var _events_engine = _interopRequireDefault(require("../core/events_engine"));
var _remove = require("../remove");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function nodesByEvent(event) {
  return event && [event.target, event.delegateTarget, event.relatedTarget, event.currentTarget].filter(node => !!node);
}
const subscribeNodesDisposing = (event, callback) => {
  _events_engine.default.one(nodesByEvent(event), _remove.removeEvent, callback);
};
exports.subscribeNodesDisposing = subscribeNodesDisposing;
const unsubscribeNodesDisposing = (event, callback) => {
  _events_engine.default.off(nodesByEvent(event), _remove.removeEvent, callback);
};
exports.unsubscribeNodesDisposing = unsubscribeNodesDisposing;