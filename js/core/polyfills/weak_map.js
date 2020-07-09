import { inArray } from '../utils/array';
import { hasWindow, getWindow } from '../utils/window';
let weakMap = hasWindow() ? getWindow().WeakMap : WeakMap;

if(!weakMap) {
    // NOTE: This is an incomplete WeakMap polyfill but it is enough for creation purposes

    weakMap = function() {
        const keys = [];
        const values = [];

        this.set = function(key, value) {
            const index = inArray(key, keys);
            if(index === -1) {
                keys.push(key);
                values.push(value);
            } else {
                values[index] = value;
            }
        };

        this.get = function(key) {
            const index = inArray(key, keys);
            if(index === -1) {
                return undefined;
            }
            return values[index];
        };

        this.has = function(key) {
            const index = inArray(key, keys);
            if(index === -1) {
                return false;
            }
            return true;
        };

        this.delete = function(key) {
            const index = inArray(key, keys);
            if(index === -1) {
                return;
            }
            keys.splice(index, 1);
            values.splice(index, 1);
        };
    };
}

export default weakMap;
