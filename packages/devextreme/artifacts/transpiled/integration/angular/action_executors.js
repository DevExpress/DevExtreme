"use strict";

var _action = _interopRequireDefault(require("../../core/action"));
var _angular = _interopRequireDefault(require("angular"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
// eslint-disable-next-line no-restricted-imports

if (_angular.default) {
  _action.default.registerExecutor({
    'ngExpression': {
      execute: function (e) {
        if (typeof e.action === 'string') {
          e.context.$eval(e.action);
        }
      }
    }
  });
}