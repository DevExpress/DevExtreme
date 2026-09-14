/* eslint-disable max-classes-per-file */
import eventsEngine from '@js/common/core/events/core/events_engine';
import ArrayStore from '@js/common/data/array_store';
import { errors } from '@js/common/data/errors';
import domAdapter from '@js/core/dom_adapter';
import type { DeferredObj } from '@js/core/utils/deferred';
import { getWindow } from '@js/core/utils/window';
import type { ArrayStoreOptions } from '@ts/data/array_store';

import Store from './abstract_store';

const window = getWindow();

export interface LocalStoreOptions extends ArrayStoreOptions {
  name?: string;
  immediate?: boolean;
  flushInterval?: number;
}

interface LocalStoreData {
  _array: unknown[];
}

class LocalStoreBackend {
  _store: LocalStoreData;

  _dirty: boolean;

  _immediate: boolean;

  _key: string;

  constructor(store: LocalStoreData, storeOptions: LocalStoreOptions) {
    this._store = store;
    this._dirty = !!storeOptions.data;

    const { name } = storeOptions;
    if (!name) {
      throw errors.Error('E4013');
    }

    this._key = `dx-data-localStore-${name}`;

    this.save();

    const immediate = storeOptions.immediate ?? false;
    this._immediate = immediate;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const flushInterval = Math.max(100, storeOptions.flushInterval || 10 * 1000);

    if (!immediate) {
      const saveProxy = this.save.bind(this);
      setInterval(saveProxy, flushInterval);
      eventsEngine.on(window, 'beforeunload', saveProxy);
      // @ts-expect-error `cordova` is injected by the Cordova container, `Window` has no such field
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

  _loadImpl(): unknown[] {
    const raw = window.localStorage.getItem(this._key);

    if (raw) {
      const stored: unknown = JSON.parse(raw);
      return Array.isArray(stored) ? stored : [];
    }
    return [];
  }

  _saveImpl(array: unknown[]): void {
    if (!array.length) {
      window.localStorage.removeItem(this._key);
    } else {
      window.localStorage.setItem(this._key, JSON.stringify(array));
    }
  }
}

class LocalStore extends ArrayStore {
  _backend: LocalStoreBackend;

  constructor(options?: LocalStoreOptions | string) {
    const storeOptions: LocalStoreOptions = typeof options === 'string'
      ? { name: options }
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      : options || {};

    super(storeOptions);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._array = storeOptions.data || [];

    this._backend = new LocalStoreBackend(this, storeOptions);
    this._backend.load();
  }

  _clearCache(): void {
    this._backend.load();
  }

  clear(): void {
    super.clear();
    this._backend.notifyChanged();
  }

  _insertImpl(values: unknown): DeferredObj<unknown> {
    const b = this._backend;
    return super._insertImpl(values).done(b.notifyChanged.bind(b));
  }

  _updateImpl(key: unknown, values: unknown): DeferredObj<unknown> {
    const b = this._backend;
    return super._updateImpl(key, values).done(b.notifyChanged.bind(b));
  }

  _removeImpl(key: unknown): DeferredObj<unknown> {
    const b = this._backend;
    return super._removeImpl(key).done(b.notifyChanged.bind(b));
  }
}

// Preserve alias registration used by Store.create('local', ...)
Store.registerClass(LocalStore, 'local');

export default LocalStore;
