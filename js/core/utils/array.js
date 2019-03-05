import config from "../config";
import { each } from "./iterator";
import { isDefined } from "./type";
import { orderEach } from "./object";

export const isEmpty = (entity) => Array.isArray(entity) && !entity.length;
export const wrapToArray = (entity) => Array.isArray(entity) ? entity : [entity];

export function intersection(a, b) {
    if(!Array.isArray(a) || a.length === 0 || !Array.isArray(b) || b.length === 0) {
        return [];
    }

    const result = [];

    each(a, (_, value) => inArray(value, b) !== -1 && result.push(value));

    return result;
}

export function removeDuplicates(from, what) {
    if(!Array.isArray(from) || from.length === 0) {
        return [];
    }

    if(!Array.isArray(what) || what.length === 0) {
        return from.slice();
    }

    const result = [];

    each(from, (_, value) => inArray(value, what) === -1 && result.push(value));

    return result;
}

export function normalizeIndexes(items, indexParameterName, currentItem, needIndexCallback) {
    const useLegacyVisibleIndex = config().useLegacyVisibleIndex;
    const indexedItems = {};
    let parameterIndex = 0;

    each(items, (index, item) => {
        index = item[indexParameterName];

        if(index >= 0) {
            indexedItems[index] = indexedItems[index] || [];

            if(item === currentItem) {
                indexedItems[index].unshift(item);
            } else {
                indexedItems[index].push(item);
            }
        } else {
            item[indexParameterName] = undefined;
        }
    });

    if(!useLegacyVisibleIndex) {
        each(items, function() {
            if(!isDefined(this[indexParameterName]) && (!needIndexCallback || needIndexCallback(this))) {
                while(indexedItems[parameterIndex]) {
                    parameterIndex++;
                }
                indexedItems[parameterIndex] = [this];
                parameterIndex++;
            }
        });
    }

    parameterIndex = 0;

    orderEach(indexedItems, function(index, items) {
        each(items, function() {
            if(index >= 0) {
                this[indexParameterName] = parameterIndex++;
            }
        });
    });

    if(useLegacyVisibleIndex) {
        each(items, function() {
            if(!isDefined(this[indexParameterName]) && (!needIndexCallback || needIndexCallback(this))) {
                this[indexParameterName] = parameterIndex++;
            }
        });
    }

    return parameterIndex;
}

export function inArray(value, object) {
    if(!object) {
        return -1;
    }

    const array = Array.isArray(object) ? object : object.toArray();

    return array.indexOf(value);
}

export function merge(array1, array2) {
    for(let i = 0; i < array2.length; i++) {
        array1[array1.length] = array2[i];
    }

    return array1;
}

export function find(array, condition) {
    for(let i = 0; i < array.length; i++) {
        if(condition(array[i])) {
            return array[i];
        }
    }
}
