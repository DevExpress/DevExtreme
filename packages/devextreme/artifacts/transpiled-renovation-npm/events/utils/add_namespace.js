"use strict";

exports.default = void 0;
var _errors = _interopRequireDefault(require("../../core/errors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const addNamespace = (eventNames, namespace) => {
  if (!namespace) {
    throw _errors.default.Error('E0017');
  }
  if (Array.isArray(eventNames)) {
    return eventNames.map(eventName => addNamespace(eventName, namespace)).join(' ');
  }
  if (eventNames.indexOf(' ') !== -1) {
    return addNamespace(eventNames.split(/\s+/g), namespace);
  }
  return `${eventNames}.${namespace}`;
};
var _default = exports.default = addNamespace;
module.exports = exports.default;
module.exports.default = exports.default;