import { isDefined } from '../core/utils/type';
import { extend } from '../core/utils/extend';
import { equalByValue } from '../core/utils/common';
import { errors } from './errors';
import Guid from '../core/guid';

const getItemIndexByKey = function(key, items, keyName) {
    let index = -1;

    if(key !== undefined && Array.isArray(items)) {
        keyName = arguments.length <= 2 ? 'key' : keyName;
        for(let i = 0; i < items.length; i++) {
            const item = isDefined(keyName) ? items[i][keyName] : items[i];

            if(equalByValue(key, item)) {
                index = i;
                break;
            }
        }
    }

    return index;
};

const insertItemToArray = function(items, item, keyName) {
    if(isDefined(item)) {
        const newItem = extend({}, item);
        if(isDefined(keyName) && !isDefined(newItem[keyName])) {
            newItem[keyName] = String(new Guid());
        }
        items.push(newItem);
    } else {
        errors.log('Inserted data is not defined');
    }
};

const updateItemInArray = function(items, item, key, keyName) {
    if(isDefined(keyName)) {
        const index = getItemIndexByKey(key, items, keyName);
        if(index >= 0) {
            items[index] = extend({}, items[index], item);
        } else {
            errors.log(`Item with the following key is not found: ${JSON.stringify(key)}`);
        }
    } else {
        errors.log('keyName is not defined');
    }
};

const removeItemFromArray = function(items, key, keyName) {
    if(isDefined(keyName)) {
        const index = getItemIndexByKey(key, items, keyName);
        index >= 0 && items.splice(index, 1);
    } else {
        errors.log('keyName is not defined');
    }
};

const applyChanges = function(data, changes, keyName, options) {
    const { immutable = true } = isDefined(options) ? options : {};
    let result = null;

    if(!isDefined(data)) {
        return result;
    }

    result = immutable === true ? [...data] : data;

    if(!isDefined(changes)) {
        return result;
    }

    changes.forEach((change) => {
        switch(change.type) {
            case 'insert': {
                insertItemToArray(result, change.data);
                break;
            }
            case 'update': {
                updateItemInArray(result, change.data, change.key, keyName);
                break;
            }
            case 'remove': {
                removeItemFromArray(result, change.key, keyName);
                break;
            }
        }
    });
    return result;
};

export default applyChanges;
