import { isPlainObject, isEmptyObject, isDefined } from '../core/utils/type';
import config from '../core/config';
import Guid from '../core/guid';
import { extend, extendFromObject } from '../core/utils/extend';
import { errors } from './errors';
import { deepExtendArraySafe } from '../core/utils/object';
import { compileGetter } from '../core/utils/data';
import { keysEqual, rejectedPromise, trivialPromise } from './utils';

function hasKey(target, keyOrKeys) {
    let key;
    const keys = typeof keyOrKeys === 'string' ? keyOrKeys.split() : keyOrKeys.slice();

    while(keys.length) {
        key = keys.shift();
        if(key in target) {
            return true;
        }
    }

    return false;
}

function findItems(keyInfo, items, key, groupCount) {
    let childItems;
    let result;

    if(groupCount) {
        for(let i = 0; i < items.length; i++) {
            childItems = items[i].items || items[i].collapsedItems || [];
            result = findItems(keyInfo, childItems || [], key, groupCount - 1);
            if(result) {
                return result;
            }
        }
    } else if(indexByKey(keyInfo, items, key) >= 0) {
        return items;
    }
}

function getItems(keyInfo, items, key, groupCount) {
    if(groupCount) {
        return findItems(keyInfo, items, key, groupCount) || [];
    }

    return items;
}

function generateDataByKeyMap(keyInfo, array) {
    if(keyInfo.key() && (!array._dataByKeyMap || array._dataByKeyMapLength !== array.length)) {
        const dataByKeyMap = {};
        const arrayLength = array.length;
        for(let i = 0; i < arrayLength; i++) {
            dataByKeyMap[JSON.stringify(keyInfo.keyOf(array[i]))] = array[i];
        }

        array._dataByKeyMap = dataByKeyMap;
        array._dataByKeyMapLength = arrayLength;
    }
}

function getCacheValue(array, key) {
    if(array._dataByKeyMap) {
        return array._dataByKeyMap[JSON.stringify(key)];
    }
}

function getHasKeyCacheValue(array, key) {
    if(array._dataByKeyMap) {
        return array._dataByKeyMap[JSON.stringify(key)];
    }

    return true;
}

function setDataByKeyMapValue(array, key, data) {
    if(array._dataByKeyMap) {
        array._dataByKeyMap[JSON.stringify(key)] = data;
    }
}

function createObjectWithChanges(target, changes) {
    const result = target ? Object.create(Object.getPrototypeOf(target)) : {};
    const targetWithoutPrototype = extendFromObject({}, target);

    deepExtendArraySafe(result, targetWithoutPrototype, true, true);
    return deepExtendArraySafe(result, changes, true, true);
}

function applyBatch({ keyInfo, data, changes, groupCount, useInsertIndex, immutable, disableCache }) {
    const resultItems = immutable === true ? [...data] : data;

    changes.forEach(item => {
        const items = item.type === 'insert' ? resultItems : getItems(keyInfo, resultItems, item.key, groupCount);

        !disableCache && generateDataByKeyMap(keyInfo, items);

        switch(item.type) {
            case 'update': update(keyInfo, items, item.key, item.data, true, immutable); break;
            case 'insert': insert(keyInfo, items, item.data, useInsertIndex && isDefined(item.index) ? item.index : -1, true); break;
            case 'remove': remove(keyInfo, items, item.key, true); break;
        }
    });
    return resultItems;
}

function applyChanges(data, changes, options = {}) {
    const { keyExpr = 'id', immutable = true } = options;
    const keyGetter = compileGetter(keyExpr);
    const keyInfo = {
        key: () => keyExpr,
        keyOf: (obj) => keyGetter(obj)
    };

    return applyBatch({
        keyInfo,
        data,
        changes,
        immutable,
        disableCache: true
    });
}

function update(keyInfo, array, key, data, isBatch, immutable) {
    let target;
    const extendComplexObject = true;
    const keyExpr = keyInfo.key();

    if(keyExpr) {
        if(hasKey(data, keyExpr) && !keysEqual(keyExpr, key, keyInfo.keyOf(data))) {
            return !isBatch && rejectedPromise(errors.Error('E4017'));
        }

        target = getCacheValue(array, key);
        if(!target) {
            const index = indexByKey(keyInfo, array, key);
            if(index < 0) {
                return !isBatch && rejectedPromise(errors.Error('E4009'));
            }

            target = array[index];

            if(immutable === true && isDefined(target)) {
                array[index] = createObjectWithChanges(target, data);
                return;
            }
        }
    } else {
        target = key;
    }

    deepExtendArraySafe(target, data, extendComplexObject);
    if(!isBatch) {
        if(config().useLegacyStoreResult) {
            return trivialPromise(key, data);
        } else {
            return trivialPromise(target, key);
        }
    }
}

function insert(keyInfo, array, data, index, isBatch) {
    let keyValue;
    const keyExpr = keyInfo.key();

    const obj = isPlainObject(data) ? extend({}, data) : data;

    if(keyExpr) {
        keyValue = keyInfo.keyOf(obj);
        if(keyValue === undefined || typeof keyValue === 'object' && isEmptyObject(keyValue)) {
            if(Array.isArray(keyExpr)) {
                throw errors.Error('E4007');
            }
            keyValue = obj[keyExpr] = String(new Guid());
        } else {
            if(array[indexByKey(keyInfo, array, keyValue)] !== undefined) {
                return !isBatch && rejectedPromise(errors.Error('E4008'));
            }
        }
    } else {
        keyValue = obj;
    }
    if(index >= 0) {
        array.splice(index, 0, obj);
    } else {
        array.push(obj);
    }

    setDataByKeyMapValue(array, keyValue, obj);

    if(!isBatch) {
        return trivialPromise(config().useLegacyStoreResult ? data : obj, keyValue);
    }
}

function remove(keyInfo, array, key, isBatch) {
    const index = indexByKey(keyInfo, array, key);
    if(index > -1) {
        array.splice(index, 1);
    }
    if(!isBatch) {
        return trivialPromise(key);
    }
}

function indexByKey(keyInfo, array, key) {
    const keyExpr = keyInfo.key();

    if(!getHasKeyCacheValue(array, key)) {
        return -1;
    }

    for(let i = 0, arrayLength = array.length; i < arrayLength; i++) {
        if(keysEqual(keyExpr, keyInfo.keyOf(array[i]), key)) {
            return i;
        }
    }
    return -1;
}

export {
    applyBatch,
    createObjectWithChanges,
    update,
    insert,
    remove,
    indexByKey,
    applyChanges
};
