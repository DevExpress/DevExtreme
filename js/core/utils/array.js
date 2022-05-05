import { isDefined } from './type';
import { each } from './iterator';
import { orderEach } from './object';
import config from '../config';

export const wrapToArray = function(item) {
    return Array.isArray(item) ? item : [item];
};

export const getUniqueValues = function(values) {
    return [...new Set(values)];
};

export const removeDuplicates = function(from = [], toRemove = []) {
    const toRemoveMap = toRemove.reduce((map, value) => {
        map[value] = (map[value] ?? 0) + 1;
        return map;
    }, {});

    return from.filter(value => !toRemoveMap[value]--);
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

export const groupBy = (array, getGroupName) => {
    return array.reduce((groupedResult, item) => {
        const groupName = getGroupName(item);
        groupedResult[groupName] = groupedResult[groupName] ?? [];
        groupedResult[groupName].push(item);

        return groupedResult;
    }, {});
};
