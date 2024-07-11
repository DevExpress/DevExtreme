"use strict";

exports.default = void 0;
var _utils = require("./utils");
class OperationManager {
  constructor() {
    this._counter = -1;
    this._deferreds = {};
  }
  add(deferred) {
    this._counter++;
    this._deferreds[this._counter] = deferred;
    return this._counter;
  }
  remove(operationId) {
    return delete this._deferreds[operationId];
  }
  cancel(operationId) {
    if (operationId in this._deferreds) {
      this._deferreds[operationId].reject(_utils.CANCELED_TOKEN);
      return true;
    }
    return false;
  }
  cancelAll() {
    while (this._counter > -1) {
      this.cancel(this._counter);
      this._counter--;
    }
  }
}
exports.default = OperationManager;
module.exports = exports.default;
module.exports.default = exports.default;