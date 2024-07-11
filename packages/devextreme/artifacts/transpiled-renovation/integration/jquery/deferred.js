"use strict";

var _jquery = _interopRequireDefault(require("jquery"));
var _deferred = require("../../core/utils/deferred");
var _version = require("../../core/utils/version");
var _use_jquery = _interopRequireDefault(require("./use_jquery"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-restricted-imports

const useJQuery = (0, _use_jquery.default)();
if (useJQuery) {
  const Deferred = _jquery.default.Deferred;
  const strategy = {
    Deferred: Deferred
  };
  strategy.when = (0, _version.compare)(_jquery.default.fn.jquery, [3]) < 0 ? _jquery.default.when : function (singleArg) {
    if (arguments.length === 0) {
      return new Deferred().resolve();
    } else if (arguments.length === 1) {
      return singleArg && singleArg.then ? singleArg : new Deferred().resolve(singleArg);
    } else {
      return _jquery.default.when.apply(_jquery.default, arguments);
    }
  };
  (0, _deferred.setStrategy)(strategy);
}