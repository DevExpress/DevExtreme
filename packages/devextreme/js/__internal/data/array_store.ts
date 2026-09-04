import type { Query } from '@js/common/data';
import {
  applyBatch, indexByKey, insert, remove, update,
} from '@js/common/data/array_utils';
import { errors } from '@js/common/data/errors';
import query from '@js/common/data/query';
import { rejectedPromise, trivialPromise } from '@js/common/data/utils';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { StoreChange } from '@js/data/store';
import type { StoreOptions } from '@ts/data/abstract_store';
import Store from '@ts/data/abstract_store';

export interface ArrayStoreOptions extends StoreOptions {
  data?: unknown[];
}

class ArrayStore extends Store {
  _array: unknown[];

  constructor(options?: ArrayStoreOptions | unknown[]) {
    const storeOptions: ArrayStoreOptions = Array.isArray(options)
      ? { data: options }
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      : options || {};

    super(storeOptions);

    const initialArray = storeOptions.data;
    if (initialArray && !Array.isArray(initialArray)) {
      throw errors.Error('E4006');
    }

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._array = initialArray || [];
  }

  createQuery(): Query {
    // @ts-expect-error data/query is untyped: its default export declares no parameters
    const result: Query = query(this._array, {
      errorHandler: this._errorHandler,
    });

    return result;
  }

  _byKeyImpl(key: unknown): DeferredObj<unknown> {
    const index = indexByKey(this, this._array, key);

    if (index === -1) {
      const rejected: DeferredObj<unknown> = rejectedPromise(errors.Error('E4009'));

      return rejected;
    }

    const resolved: DeferredObj<unknown> = trivialPromise(this._array[index]);

    return resolved;
  }

  _insertImpl(values: unknown): DeferredObj<unknown> {
    const result: DeferredObj<unknown> = insert(this, this._array, values);

    return result;
  }

  _pushImpl(changes: StoreChange[]): void {
    applyBatch({
      keyInfo: this,
      data: this._array,
      changes,
    });
  }

  _updateImpl(key: unknown, values: unknown): DeferredObj<unknown> {
    const result: DeferredObj<unknown> = update(this, this._array, key, values);

    return result;
  }

  _removeImpl(key: unknown): DeferredObj<unknown> {
    const result: DeferredObj<unknown> = remove(this, this._array, key);

    return result;
  }

  clear(): void {
    this._eventsStrategy.fireEvent('modifying', []);
    this._array = [];
    this._eventsStrategy.fireEvent('modified', []);
  }
}

Store.registerClass(ArrayStore, 'array');

export default ArrayStore;
