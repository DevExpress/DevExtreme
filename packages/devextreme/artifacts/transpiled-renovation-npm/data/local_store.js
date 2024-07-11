"use strict";

exports.default = void 0;
var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));
var _dom_adapter = _interopRequireDefault(require("../core/dom_adapter"));
var _window = require("../core/utils/window");
var _class = _interopRequireDefault(require("../core/class"));
var _errors = require("./errors");
var _array_store = _interopRequireDefault(require("./array_store"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const abstract = _class.default.abstract;
const LocalStoreBackend = _class.default.inherit({
  ctor: function (store, storeOptions) {
    this._store = store;
    this._dirty = !!storeOptions.data;
    this.save();
    const immediate = this._immediate = storeOptions.immediate;
    const flushInterval = Math.max(100, storeOptions.flushInterval || 10 * 1000);
    if (!immediate) {
      const saveProxy = this.save.bind(this);
      setInterval(saveProxy, flushInterval);
      _events_engine.default.on(window, 'beforeunload', saveProxy);
      if (window.cordova) {
        _dom_adapter.default.listen(_dom_adapter.default.getDocument(), 'pause', saveProxy, false);
      }
    }
  },
  notifyChanged: function () {
    this._dirty = true;
    if (this._immediate) {
      this.save();
    }
  },
  load: function () {
    this._store._array = this._loadImpl();
    this._dirty = false;
  },
  save: function () {
    if (!this._dirty) {
      return;
    }
    this._saveImpl(this._store._array);
    this._dirty = false;
  },
  _loadImpl: abstract,
  _saveImpl: abstract
});
const DomLocalStoreBackend = LocalStoreBackend.inherit({
  ctor: function (store, storeOptions) {
    const name = storeOptions.name;
    if (!name) {
      throw _errors.errors.Error('E4013');
    }
    this._key = 'dx-data-localStore-' + name;
    this.callBase(store, storeOptions);
  },
  _loadImpl: function () {
    const raw = window.localStorage.getItem(this._key);
    if (raw) {
      return JSON.parse(raw);
    }
    return [];
  },
  _saveImpl: function (array) {
    if (!array.length) {
      window.localStorage.removeItem(this._key);
    } else {
      window.localStorage.setItem(this._key, JSON.stringify(array));
    }
  }
});
const localStoreBackends = {
  'dom': DomLocalStoreBackend
};
const LocalStore = _array_store.default.inherit({
  ctor: function (options) {
    if (typeof options === 'string') {
      options = {
        name: options
      };
    } else {
      options = options || {};
    }
    this.callBase(options);
    this._backend = new localStoreBackends[options.backend || 'dom'](this, options);
    this._backend.load();
  },
  _clearCache() {
    this._backend.load();
  },
  clear: function () {
    this.callBase();
    this._backend.notifyChanged();
  },
  _insertImpl: function (values) {
    const b = this._backend;
    return this.callBase(values).done(b.notifyChanged.bind(b));
  },
  _updateImpl: function (key, values) {
    const b = this._backend;
    return this.callBase(key, values).done(b.notifyChanged.bind(b));
  },
  _removeImpl: function (key) {
    const b = this._backend;
    return this.callBase(key).done(b.notifyChanged.bind(b));
  }
}, 'local');
var _default = exports.default = LocalStore;
module.exports = exports.default;
module.exports.default = exports.default;