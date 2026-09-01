/* eslint-disable no-return-assign */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import Callbacks from '@js/core/utils/callbacks';

export let DataExchanger = function () {
  this._store = {};
};

DataExchanger.prototype = {
  constructor: DataExchanger,

  dispose() {
    this._store = null;
    return this;
  },

  _get(category, name) {
    const store = this._store[category] || (this._store[category] = {});
    return store[name] || (store[name] = { callbacks: Callbacks() });
  },

  set(category, name, data) {
    const item = this._get(category, name);
    item.data = data;
    item.callbacks.fire(data);
    return this;
  },

  bind(category, name, callback) {
    const item = this._get(category, name);
    item.callbacks.add(callback);
    item.data && callback(item.data);
    return this;
  },

  unbind(category, name, callback) {
    const item = this._get(category, name);
    item.callbacks.remove(callback);
    return this;
  },
};

/// #DEBUG
export function DEBUG_set_DataExchanger(value: typeof DataExchanger): void {
  DataExchanger = value;
}
/// #ENDDEBUG
