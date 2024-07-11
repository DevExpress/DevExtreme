"use strict";

exports.default = void 0;
var _errors = _interopRequireDefault(require("../errors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Locker = function () {
  const info = {};
  const currentCount = function (lockName) {
    return info[lockName] || 0;
  };
  return {
    obtain: function (lockName) {
      info[lockName] = currentCount(lockName) + 1;
    },
    release: function (lockName) {
      const count = currentCount(lockName);
      if (count < 1) {
        throw _errors.default.Error('E0014');
      }
      if (count === 1) {
        delete info[lockName];
      } else {
        info[lockName] = count - 1;
      }
    },
    locked: function (lockName) {
      return currentCount(lockName) > 0;
    }
  };
};
var _default = exports.default = Locker;
module.exports = exports.default;
module.exports.default = exports.default;