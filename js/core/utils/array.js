import { isDefined } from './type';
import { each } from './iterator';
import { orderEach } from './object';
import config from '../config';

function createOccurrenceMap(array) {
    return array.reduce((map, value) => {
        map[value] = (map[value] ?? 0) + 1;
        return map;
    }, {});
}

export const getIntersection = function(firstArray, secondArray) {
    const secondArrayMap = createOccurrenceMap(secondArray);

    return firstArray.filter(value => secondArrayMap[value]--);
};

export const removeDuplicates = function(from = [], toRemove = []) {
    const toRemoveMap = createOccurrenceMap(toRemove);

    return from.filter(value => !toRemoveMap[value]--);
};

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

export const uniqueValues = function(data) {
    return [...new Set(data)];
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
