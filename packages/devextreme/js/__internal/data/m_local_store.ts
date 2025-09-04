/* eslint-disable max-classes-per-file */
import eventsEngine from '@js/common/core/events/core/events_engine';
import ArrayStore from '@js/common/data/array_store';
import { errors } from '@js/common/data/errors';
import domAdapter from '@js/core/dom_adapter';
import { getWindow } from '@js/core/utils/window';

import Store from './m_abstract_store';

const window = getWindow();

class LocalStoreBackend {
  _store: any;

  _dirty: boolean;

  _immediate: boolean;

  _key: string;

  constructor(store, storeOptions) {
    this._store = store;
    this._dirty = !!storeOptions.data;

    const { name } = storeOptions;
    if (!name) {
      throw errors.Error('E4013');
    }

    this._key = `dx-data-localStore-${name}`;

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
  }

  notifyChanged(): void {
    this._dirty = true;
    if (this._immediate) {
      this.save();
    }
  }

  load(): void {
    this._store._array = this._loadImpl();
    this._dirty = false;
  }

  save(): void {
    if (!this._dirty) {
      return;
    }

    this._saveImpl(this._store._array);
    this._dirty = false;
  }

  _loadImpl(): any {
    const raw = window.localStorage.getItem(this._key);

    if (raw) {
      return JSON.parse(raw);
    }
    return [];
  }

  _saveImpl(array): void {
    if (!array.length) {
      window.localStorage.removeItem(this._key);
    } else {
      window.localStorage.setItem(this._key, JSON.stringify(array));
    }
  }
}
class LocalStore extends ArrayStore {
  _backend: LocalStoreBackend;

  _array: any;

  constructor(options) {
    if (typeof options === 'string') {
      options = { name: options };
    } else {
      options = options || {};
    }

    super(options);
    this._array = options.data || [];

    this._backend = new LocalStoreBackend(this, options);
    this._backend.load();
  }

  _clearCache(): void {
    this._backend.load();
  }

  clear(): void {
    super.clear();
    this._backend.notifyChanged();
  }

  _insertImpl(values): any {
    const b = this._backend;
    return super._insertImpl(values).done(b.notifyChanged.bind(b));
  }

  _updateImpl(key, values): any {
    const b = this._backend;
    return super._updateImpl(key, values).done(b.notifyChanged.bind(b));
  }

  _removeImpl(key): any {
    const b = this._backend;
    return super._removeImpl(key).done(b.notifyChanged.bind(b));
  }
}

// Preserve alias registration used by Store.create('local', ...)
// @ts-expect-error register ES6 class with alias
Store.registerClass(LocalStore, 'local');

export default LocalStore;
