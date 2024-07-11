"use strict";

exports.createEventTrigger = createEventTrigger;
exports.createIncidentOccurred = void 0;
exports.createResizeHandler = createResizeHandler;
var _version = require("../../core/version");
var _string = require("../../core/utils/string");
var _errors_warnings = _interopRequireDefault(require("./errors_warnings"));
var _iterator = require("../../core/utils/iterator");
var _resize_callbacks = _interopRequireDefault(require("../../core/utils/resize_callbacks"));
var _resize_observer = _interopRequireDefault(require("../../core/resize_observer"));
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ERROR_MESSAGES = _errors_warnings.default.ERROR_MESSAGES;
function createEventTrigger(eventsMap, callbackGetter) {
  let triggers = {};
  (0, _iterator.each)(eventsMap, function (name, info) {
    if (info.name) {
      createEvent(name);
    }
  });
  let changes;
  triggerEvent.change = function (name) {
    const eventInfo = eventsMap[name];
    if (eventInfo) {
      (changes = changes || {})[name] = eventInfo;
    }
    return !!eventInfo;
  };
  triggerEvent.applyChanges = function () {
    if (changes) {
      (0, _iterator.each)(changes, function (name, eventInfo) {
        createEvent(eventInfo.newName || name);
      });
      changes = null;
    }
  };
  triggerEvent.dispose = function () {
    eventsMap = callbackGetter = triggers = null;
  };
  return triggerEvent;
  function createEvent(name) {
    const eventInfo = eventsMap[name];
    triggers[eventInfo.name] = callbackGetter(name, eventInfo.actionSettings);
  }
  function triggerEvent(name, arg, complete) {
    triggers[name](arg);
    complete && complete();
  }
}
let createIncidentOccurred = function (widgetName, eventTrigger) {
  return function incidentOccurred(id, args) {
    eventTrigger('incidentOccurred', {
      target: {
        id: id,
        type: id[0] === 'E' ? 'error' : 'warning',
        args: args,
        text: _string.format.apply(null, [ERROR_MESSAGES[id]].concat(args || [])),
        widget: widgetName,
        version: _version.version
      }
    });
  };
};
exports.createIncidentOccurred = createIncidentOccurred;
function getResizeManager(resizeCallback) {
  return (observe, unsubscribe) => {
    const {
      handler,
      dispose
    } = createDeferredHandler(resizeCallback, unsubscribe);
    observe(handler);
    return dispose;
  };
}
function createDeferredHandler(callback, unsubscribe) {
  let timeout;
  const handler = function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, 100);
  };
  return {
    handler,
    dispose() {
      clearTimeout(timeout);
      unsubscribe(handler);
    }
  };
}
function createResizeHandler(contentElement, redrawOnResize, resize) {
  let disposeHandler;
  const resizeManager = getResizeManager(resize);
  if ((0, _utils.normalizeEnum)(redrawOnResize) === 'windowonly') {
    disposeHandler = resizeManager(handler => _resize_callbacks.default.add(handler), handler => _resize_callbacks.default.remove(handler));
  } else if (redrawOnResize === true) {
    disposeHandler = resizeManager(handler => _resize_observer.default.observe(contentElement, handler), () => _resize_observer.default.unobserve(contentElement));
  }
  return disposeHandler;
}