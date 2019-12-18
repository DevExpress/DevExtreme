import { isObject } from './type';

var getKeyWrapper = function(item, getKey) {
    var key = getKey(item);
    if(isObject(key)) {
        try {
            return JSON.stringify(key);
        } catch(e) {
            return key;
        }
    }
    return key;
};

var getSameNewByOld = function(oldItem, newItems, newIndexByKey, getKey) {
    var key = getKeyWrapper(oldItem, getKey);
    return newItems[newIndexByKey[key]];
};

export const findChanges = function(oldItems, newItems, getKey, isItemEquals) {
    var oldIndexByKey = {},
        newIndexByKey = {},
        addedCount = 0,
        removeCount = 0,
        result = [];

    oldItems.forEach(function(item, index) {
        var key = getKeyWrapper(item, getKey);
        oldIndexByKey[key] = index;
    });

    newItems.forEach(function(item, index) {
        var key = getKeyWrapper(item, getKey);
        newIndexByKey[key] = index;
    });

    var itemCount = Math.max(oldItems.length, newItems.length);
    for(var index = 0; index < itemCount + addedCount; index++) {
        var newItem = newItems[index],
            oldNextIndex = index - addedCount + removeCount,
            nextOldItem = oldItems[oldNextIndex],
            isRemoved = !newItem || (nextOldItem && !getSameNewByOld(nextOldItem, newItems, newIndexByKey, getKey));

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
            var key = getKeyWrapper(newItem, getKey),
                oldIndex = oldIndexByKey[key],
                oldItem = oldItems[oldIndex];
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

