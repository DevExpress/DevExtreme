/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { extendFromObject } from '@js/core/utils/extend';

export class GanttDataCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _cache: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _timers: any;

  constructor() {
    this._cache = {};
    this._timers = {};
  }

  saveData(key, data, keyExpireCallback): void {
    if (data) {
      this._clearTimer(key);
      const storage = this._getCache(key, true);
      extendFromObject(storage, data, true);
      if (keyExpireCallback) {
        this._setExpireTimer(key, keyExpireCallback);
      }
    }
  }

  pullDataFromCache(key, target): void {
    const data = this._getCache(key);
    if (data) {
      // @ts-expect-error ts-error
      extendFromObject(target, data);
    }
    this._onKeyExpired(key);
  }

  hasData(key): boolean {
    return !!this._cache[key];
  }

  resetCache(key): void {
    this._onKeyExpired(key);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getCache(key, forceCreate?) {
    if (!this._cache[key] && forceCreate) {
      this._cache[key] = {};
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._cache[key];
  }

  _setExpireTimer(key, callback): void {
    // eslint-disable-next-line no-restricted-globals
    this._timers[key] = setTimeout((): void => {
      callback(key, this._getCache(key));
      this._onKeyExpired(key);
    }, 200);
  }

  _onKeyExpired(key): void {
    this._clearCache(key);
    this._clearTimer(key);
  }

  _clearCache(key): void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this._cache[key];
  }

  _clearTimer(key): void {
    const timers = this._timers;
    if (timers?.[key]) {
      clearTimeout(timers[key]);
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete timers[key];
    }
  }
}
