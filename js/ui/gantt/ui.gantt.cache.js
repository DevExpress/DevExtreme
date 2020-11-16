import { extendFromObject } from '../../core/utils/extend';

export class GanttDataCache {
    constructor() {
        this._cache = { };
        this._timers = { };
    }

    saveData(key, data, keyExpireCallback) {
        if(data) {
            this._clearTimer(key);
            const storage = this._getCache(key, true);
            extendFromObject(storage, data, true);
            if(keyExpireCallback) {
                this._setExpireTimer(key, keyExpireCallback);
            }
        }
    }
    pullDataFromCache(key, target) {
        const data = this._getCache(key);
        if(data) {
            extendFromObject(target, data);
        }
        this._onKeyExpired(key);
    }
    hasData(key) {
        return !!this._cache[key];
    }
    _getCache(key, forceCreate) {
        if(!this._cache[key] && forceCreate) {
            this._cache[key] = { };
        }
        return this._cache[key];
    }
    _setExpireTimer(key, callback) {
        this._timers[key] = setTimeout(() => {
            callback(key, this._getCache(key));
            this._onKeyExpired(key);
        }, 200);
    }
    _onKeyExpired(key) {
        this._clearCache(key);
        this._clearTimer(key);
    }
    _clearCache(key) {
        this._cache[key];
    }
    _clearTimer(key) {
        const timers = this._timers;
        if(timers && timers[key]) {
            clearTimeout(timers[key]);
            delete timers[key];
        }
    }
}
