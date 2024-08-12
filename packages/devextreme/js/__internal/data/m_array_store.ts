import Store from '@js/data/abstract_store';
import {
  applyBatch, indexByKey, insert, remove, update,
} from '@js/data/array_utils';
// @ts-expect-error
import { errors } from '@js/data/errors';
import Query from '@js/data/query';
// @ts-expect-error
import { rejectedPromise, trivialPromise } from '@js/data/utils';

// @ts-expect-error
const ArrayStore = Store.inherit({
  ctor(options) {
    if (Array.isArray(options)) {
      options = { data: options };
    } else {
      options = options || {};
    }

    this.callBase(options);

    const initialArray = options.data;
    if (initialArray && !Array.isArray(initialArray)) {
      throw errors.Error('E4006');
    }

    this._array = initialArray || [];
  },

  createQuery() {
    return Query(this._array, {
      errorHandler: this._errorHandler,
    });
  },

  _byKeyImpl(key) {
    const index = indexByKey(this, this._array, key);

    if (index === -1) {
      return rejectedPromise(errors.Error('E4009'));
    }

    return trivialPromise(this._array[index]);
  },

  _insertImpl(values) {
    // @ts-expect-error
    return insert(this, this._array, values);
  },

  _pushImpl(changes) {
    // @ts-expect-error
    applyBatch({
      keyInfo: this,
      data: this._array,
      changes,
    });
  },

  _updateImpl(key, values) {
    // @ts-expect-error
    return update(this, this._array, key, values);
  },

  _removeImpl(key) {
    // @ts-expect-error
    return remove(this, this._array, key);
  },

  clear() {
    this._eventsStrategy.fireEvent('modifying');
    this._array = [];
    this._eventsStrategy.fireEvent('modified');
  },
}, 'array');

export default ArrayStore;
