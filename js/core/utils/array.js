import { isDefined } from './type';
import { each } from './iterator';
import { orderEach } from './object';
import config from '../config';

export const isEmpty = function(entity) {
    return Array.isArray(entity) && !entity.length;
};

export const wrapToArray = function(entity) {
    return Array.isArray(entity) ? entity : [entity];
};

export const inArray = function(value, object) {
    if(!object) {
        return -1;
    }
    const array = Array.isArray(object) ? object : object.toArray();

    return array.indexOf(value);
};

export const intersection = function(a, b) {
    if(!Array.isArray(a) || a.length === 0 ||
       !Array.isArray(b) || b.length === 0) {
        return [];
    }

    const result = [];

    each(a, function(_, value) {
        const index = inArray(value, b);

        if(index !== -1) {
            result.push(value);
        }
    });

    return result;
};

export const removeDuplicates = function(from, what) {
    if(!Array.isArray(from) || from.length === 0) {
        return [];
    }

    if(!Array.isArray(what) || what.length === 0) {
        return from.slice();
    }

    const result = [];

    each(from, function(_, value) {
        const index = inArray(value, what);

        if(index === -1) {
            result.push(value);
        }
    });

    return result;
};

export const normalizeIndexes = function(items, indexParameterName, currentItem, needIndexCallback) {
    const indexedItems = {};
    let parameterIndex = 0;
    const useLegacyVisibleIndex = config().useLegacyVisibleIndex;

    each(items, function(index, item) {
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
};

export const merge = function(array1, array2) {
    for(let i = 0; i < array2.length; i++) {
        array1[array1.length] = array2[i];
    }

    return array1;
};

export const find = function(array, condition) {
    for(let i = 0; i < array.length; i++) {
        if(condition(array[i])) {
            return array[i];
        }
    }
};

export const groupBy = (array, cb) => array.reduce(
    (result, item) => ({
        ...result,
        [cb(item)]: [
            ...(result[cb(item)] || []),
            item,
        ],
    }),
    {}
);
