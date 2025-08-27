import eventsEngine from '@js/common/core/events/core/events_engine';
import ArrayStore from '@js/common/data/array_store';
import { errors } from '@js/common/data/errors';
import Class from '@js/core/class';
import domAdapter from '@js/core/dom_adapter';
import { getWindow } from '@js/core/utils/window';

const window = getWindow();
const { abstract } = Class;

const LocalStoreBackend = Class.inherit({

  ctor(store, storeOptions) {
    this._store = store;
    this._dirty = !!storeOptions.data;
    this.save();

    const immediate = this._immediate = storeOptions.immediate;
    const flushInterval = Math.max(100, storeOptions.flushInterval || 10 * 1000);

    if (!immediate) {
      const saveProxy = this.save.bind(this);
      setInterval(saveProxy, flushInterval);
      eventsEngine.on(window, 'beforeunload', saveProxy);
      // @ts-expect-error
      if (window.cordova) {
        domAdapter.listen(domAdapter.getDocument(), 'pause', saveProxy, false);
      }
    }
  },

  notifyChanged() {
    this._dirty = true;
    if (this._immediate) {
      this.save();
    }
  },

  load() {
    this._store._array = this._loadImpl();
    this._dirty = false;
  },

  save() {
    if (!this._dirty) {
      return;
    }

    this._saveImpl(this._store._array);
    this._dirty = false;
  },

  _loadImpl: abstract,
  _saveImpl: abstract,
});

const DomLocalStoreBackend = LocalStoreBackend.inherit({

  ctor(store, storeOptions) {
    const { name } = storeOptions;
    if (!name) {
      throw errors.Error('E4013');
    }
    this._key = `dx-data-localStore-${name}`;

    this.callBase(store, storeOptions);
  },

  _loadImpl() {
    const raw = window.localStorage.getItem(this._key);

    if (raw) {
      return JSON.parse(raw);
    }
    return [];
  },

  _saveImpl(array) {
    if (!array.length) {
      window.localStorage.removeItem(this._key);
    } else {
      window.localStorage.setItem(this._key, JSON.stringify(array));
    }
  },

});

const localStoreBackends = {
  dom: DomLocalStoreBackend,
};
const LocalStore = ArrayStore.inherit({

  ctor(options) {
    if (typeof options === 'string') {
      options = { name: options };
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

  clear() {
    this.callBase();
    this._backend.notifyChanged();
  },

  _insertImpl(values) {
    const b = this._backend;
    return this.callBase(values).done(b.notifyChanged.bind(b));
  },

  _updateImpl(key, values) {
    const b = this._backend;
    return this.callBase(key, values).done(b.notifyChanged.bind(b));
  },

  _removeImpl(key) {
    const b = this._backend;
    return this.callBase(key).done(b.notifyChanged.bind(b));
  },
}, 'local');

export default LocalStore;
