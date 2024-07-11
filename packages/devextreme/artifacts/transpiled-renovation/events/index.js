"use strict";

exports.triggerHandler = exports.trigger = exports.one = exports.on = exports.off = exports.Event = void 0;
var _events_engine = _interopRequireDefault(require("./core/events_engine"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
* @name events
*/

const on = exports.on = _events_engine.default.on;
const one = exports.one = _events_engine.default.one;
const off = exports.off = _events_engine.default.off;
const trigger = exports.trigger = _events_engine.default.trigger;
const triggerHandler = exports.triggerHandler = _events_engine.default.triggerHandler;

/**
* @name events.Event
* @type function
* @param1 source:string|event
* @param2 config:object
* @return event
* @module events
* @export Event
* @hidden
*/

const Event = exports.Event = _events_engine.default.Event;