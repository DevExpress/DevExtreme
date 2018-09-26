import { isObject } from "./type";

var findChanges = function(oldItems, newItems, getKey, isItemEquals) {
    var oldIndexByKey = {},
        newIndexByKey = {},
        addedCount = 0,
        removeCount = 0,
        result = [];

    var getKeyWrapper = function(item) {
        var key = getKey(item);
        if(isObject(key)) {
            key = JSON.stringify(key);
        }
        return key;
    };

    oldItems.forEach(function(item, index) {
        var key = getKeyWrapper(item);
        oldIndexByKey[key] = index;
    });

    newItems.forEach(function(item, index) {
        var key = getKeyWrapper(item);
        newIndexByKey[key] = index;
    });

    var itemCount = Math.max(oldItems.length, newItems.length);
    for(var index = 0; index < itemCount + addedCount; index++) {
        var newItem = newItems[index],
            key = getKeyWrapper(newItem),
            oldIndex = oldIndexByKey[key],
            oldItem = oldItems[oldIndex],
            newIndex = index - addedCount + removeCount;

        if(!newItem) {
            if(oldItems[newIndex]) {
                result.push({
                    type: "remove",
                    key: getKey(oldItems[newIndex]),
                    index: index,
                    oldItem: oldItems[newIndex]
                });
                removeCount++;
                index--;
            }
        } else if(!oldItem) {
            addedCount++;
            result.push({
                type: "insert",
                data: newItem,
                index: index
            });
        } else if(oldIndex === newIndex) {
            if(!isItemEquals(oldItem, newItem)) {
                result.push({
                    type: "update",
                    data: newItem,
                    key: getKey(newItem),
                    index: index,
                    oldItem: oldItem
                });
            }
        } else {
            oldItem = oldItems[newIndex];
            key = getKeyWrapper(oldItem);
            newItem = newItems[newIndexByKey[key]];

            if(oldItem && !newItem) {
                result.push({
                    type: "remove",
                    key: getKey(oldItem),
                    index: index,
                    oldItem: oldItem
                });

                removeCount++;
                index--;
            } else {
                return;
            }
        }
    }

    return result;
};

module.exports.findChanges = findChanges;
