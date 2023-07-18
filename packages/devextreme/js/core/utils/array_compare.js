import { isObject } from './type';

const getKeyWrapper = function(item, getKey) {
    const key = getKey(item);
    if(isObject(key)) {
        try {
            return JSON.stringify(key);
        } catch(e) {
            return key;
        }
    }
    return key;
};

const getSameNewByOld = function(oldItem, newItems, newIndexByKey, getKey) {
    const key = getKeyWrapper(oldItem, getKey);
    return newItems[newIndexByKey[key]];
};

export const isKeysEqual = function(oldKeys, newKeys) {
    if(oldKeys.length !== newKeys.length) {
        return false;
    }

    for(let i = 0; i < newKeys.length; i++) {
        if(oldKeys[i] !== newKeys[i]) {
            return false;
        }
    }

    return true;
};

export const findChanges = function(oldItems, newItems, getKey, isItemEquals) {
    const oldIndexByKey = {};
    const newIndexByKey = {};
    let addedCount = 0;
    let removeCount = 0;
    const result = [];

    oldItems.forEach(function(item, index) {
        const key = getKeyWrapper(item, getKey);
        oldIndexByKey[key] = index;
    });

    newItems.forEach(function(item, index) {
        const key = getKeyWrapper(item, getKey);
        newIndexByKey[key] = index;
    });

    const itemCount = Math.max(oldItems.length, newItems.length);
    for(let index = 0; index < itemCount + addedCount; index++) {
        const newItem = newItems[index];
        const oldNextIndex = index - addedCount + removeCount;
        const nextOldItem = oldItems[oldNextIndex];
        const isRemoved = !newItem || (nextOldItem && !getSameNewByOld(nextOldItem, newItems, newIndexByKey, getKey));

        if(isRemoved) {
            if(nextOldItem) {
                result.push({
                    type: 'remove',
                    key: getKey(nextOldItem),
                    index: index,
                    oldItem: nextOldItem
                });
                removeCount++;
                index--;
            }
        } else {
            const key = getKeyWrapper(newItem, getKey);
            const oldIndex = oldIndexByKey[key];
            const oldItem = oldItems[oldIndex];
            if(!oldItem) {
                addedCount++;
                result.push({
                    type: 'insert',
                    data: newItem,
                    index: index
                });
            } else if(oldIndex === oldNextIndex) {
                if(!isItemEquals(oldItem, newItem)) {
                    result.push({
                        type: 'update',
                        data: newItem,
                        key: getKey(newItem),
                        index: index,
                        oldItem: oldItem
                    });
                }
            } else {
                return;
            }
        }
    }

    return result;
};

