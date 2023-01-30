import { isDefined } from './type';
import { orderEach } from './object';
import config from '../config';

function createOccurrenceMap(array) {
    return array.reduce((map, value) => {
        const count = (map.get(value) ?? 0) + 1;
        map.set(value, count);
        return map;
    }, new Map());
}

export const wrapToArray = function(item) {
    return Array.isArray(item) ? item : [item];
};

export const getUniqueValues = function(values) {
    return [...new Set(values)];
};

export const getIntersection = function(firstArray, secondArray) {
    const toRemoveMap = createOccurrenceMap(secondArray);
    return firstArray.filter(value => {
        const occurrencesCount = toRemoveMap.get(value);
        occurrencesCount && toRemoveMap.set(value, occurrencesCount - 1);
        return occurrencesCount;
    });
};

export const removeDuplicates = function(from = [], toRemove = []) {
    const toRemoveMap = createOccurrenceMap(toRemove);
    return from.filter(value => {
        const occurrencesCount = toRemoveMap.get(value);
        occurrencesCount && toRemoveMap.set(value, occurrencesCount - 1);
        return !occurrencesCount;
    });
};

export const normalizeIndexes = function(items, indexPropName, currentItem, needIndexCallback) {
    const indexedItems = {};
    const { useLegacyVisibleIndex } = config();
    let currentIndex = 0;

    const shouldUpdateIndex = (item) => !isDefined(item[indexPropName])
            && (!needIndexCallback || needIndexCallback(item));

    items.forEach((item) => {
        const index = item[indexPropName];
        if(index >= 0) {
            indexedItems[index] = indexedItems[index] || [];

            if(item === currentItem) {
                indexedItems[index].unshift(item);
            } else {
                indexedItems[index].push(item);
            }
        } else {
            item[indexPropName] = undefined;
        }
    });

    if(!useLegacyVisibleIndex) {
        items.forEach(item => {
            if(shouldUpdateIndex(item)) {
                while(indexedItems[currentIndex]) {
                    currentIndex++;
                }
                indexedItems[currentIndex] = [item];
                currentIndex++;
            }
        });
    }

    currentIndex = 0;

    orderEach(indexedItems, function(index, items) {
        items.forEach(item => {
            if(index >= 0) {
                item[indexPropName] = currentIndex++;
            }
        });
    });

    if(useLegacyVisibleIndex) {
        items.forEach(item => {
            if(shouldUpdateIndex(item)) {
                item[indexPropName] = currentIndex++;
            }
        });
    }
};

export const groupBy = (array, getGroupName) => {
    return array.reduce((groupedResult, item) => {
        const groupName = getGroupName(item);
        groupedResult[groupName] = groupedResult[groupName] ?? [];
        groupedResult[groupName].push(item);

        return groupedResult;
    }, {});
};
