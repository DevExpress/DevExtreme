/* eslint-disable max-classes-per-file */
import eventsEngine from '@js/common/core/events/core/events_engine';
import ArrayStore from '@js/common/data/array_store';
import { errors } from '@js/common/data/errors';
import domAdapter from '@js/core/dom_adapter';
import { getWindow } from '@js/core/utils/window';
import Store from '@js/data/abstract_store';

const window = getWindow();
abstract class LocalStoreBackend {
  _store: any;

  _dirty: boolean;

  _immediate: boolean;

  constructor(store, storeOptions) {
    this._store = store;
    this._dirty = !!storeOptions.data;
    this.save();

    this._immediate = storeOptions.immediate;
    const flushInterval = Math.max(100, storeOptions.flushInterval || 10 * 1000);

    if (!this._immediate) {
      const saveProxy = this.save.bind(this);
      setInterval(saveProxy, flushInterval);
      eventsEngine.on(window, 'beforeunload', saveProxy);
      // @ts-expect-error Cordova environment hook
      if (window.cordova) {
        domAdapter.listen(domAdapter.getDocument(), 'pause', saveProxy, false);
      }
    }
  }

  notifyChanged() {
    this._dirty = true;
    if (this._immediate) {
      this.save();
    }
  }

  load() {
    this._store._array = this._loadImpl();
    this._dirty = false;
  }

  save() {
    if (!this._dirty) {
      return;
    }

    this._saveImpl(this._store._array);
    this._dirty = false;
  }

  // impl in backends
  abstract _loadImpl();
  abstract _saveImpl(array);
}

class DomLocalStoreBackend extends LocalStoreBackend {
  _key: string;

  constructor(store, storeOptions) {
    super(store, storeOptions);
    const { name } = storeOptions;
    if (!name) {
      throw errors.Error('E4013');
    }
    this._key = `dx-data-localStore-${name}`;
  }

  _loadImpl() {
    const raw = window.localStorage.getItem(this._key);
    if (raw) {
      return JSON.parse(raw);
    }
    return [];
  }

  _saveImpl(array) {
    if (!array.length) {
      window.localStorage.removeItem(this._key);
    } else {
      window.localStorage.setItem(this._key, JSON.stringify(array));
    }
  }
}

const localStoreBackends = {
  dom: DomLocalStoreBackend,
};
class LocalStore extends ArrayStore {
  _backend: any;

  constructor(options) {
    if (typeof options === 'string') {
      options = { name: options };
    } else {
      options = options || {};
    }

    super(options);

    this._backend = new localStoreBackends[options.backend || 'dom'](this, options);
    this._backend.load();
  }

  _clearCache() {
    this._backend.load();
  }

  clear() {
    super.clear();
    this._backend.notifyChanged();
  }

  _insertImpl(values) {
    const b = this._backend;
    return super._insertImpl(values).done(b.notifyChanged.bind(b));
  }

  _updateImpl(key, values) {
    const b = this._backend;
    return super._updateImpl(key, values).done(b.notifyChanged.bind(b));
  }

  _removeImpl(key) {
    const b = this._backend;
    return super._removeImpl(key).done(b.notifyChanged.bind(b));
  }
}

// Preserve alias registration used by Store.create('local', ...)
// @ts-expect-error register ES6 class with alias
Store.registerClass(LocalStore as any, 'local');

export default LocalStore;
