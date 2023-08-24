import { isDefined } from '../../../core/utils/type';

export class Cache {
    constructor() {
        this._cache = new Map();
    }

    get size() { return this._cache.size; }

    clear() {
        this._cache.clear();
    }

    get(name, callback) {
        if(!this._cache.has(name) && callback) {
            this.set(name, callback());
        }

        return this._cache.get(name);
    }

    set(name, value) {
        isDefined(value) && this._cache.set(name, value);
    }
}
