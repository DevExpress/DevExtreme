"use strict";

exports.default = void 0;
var _iterator = require("../core/utils/iterator");
var _callbacks = _interopRequireDefault(require("./utils/callbacks"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class MemorizedCallbacks {
  constructor() {
    this.memory = [];
    this.callbacks = (0, _callbacks.default)();
  }
  add(fn) {
    (0, _iterator.each)(this.memory, (_, item) => fn.apply(fn, item));
    this.callbacks.add(fn);
  }
  remove(fn) {
    this.callbacks.remove(fn);
  }
  fire() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    this.memory.push(args);
    this.callbacks.fire.apply(this.callbacks, args);
  }
}
exports.default = MemorizedCallbacks;
module.exports = exports.default;
module.exports.default = exports.default;