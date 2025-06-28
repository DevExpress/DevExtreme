import { isDefined } from '@js/core/utils/type';

export class Cache {
  _cache = new Map();

  get size(): number { return this._cache.size; }

  clear(): void {
    this._cache.clear();
  }

  get<R>(name: string, defaultValueCallback?: () => R): R {
    if (!this._cache.has(name) && defaultValueCallback) {
      this.set(name, defaultValueCallback());
    }

    return this._cache.get(name) as R;
  }

  set<R>(name: string, value: R): R {
    if (isDefined(value)) {
      this._cache.set(name, value);
    }

    return value;
  }

  delete(name: string): void {
    this._cache.delete(name);
  }
}

export const globalCache = {
  timezones: new Cache(),
};
