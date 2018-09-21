import { isPlainObject, isEmptyObject } from "../core/utils/type";
import Guid from "../core/guid";
import { extend } from "../core/utils/extend";
import { errors } from "./errors";
import objectUtils from "../core/utils/object";
import { keysEqual, rejectedPromise, trivialPromise } from "./utils";

function hasKey(target, keyOrKeys) {
    var key,
        keys = typeof keyOrKeys === "string" ? keyOrKeys.split() : keyOrKeys.slice();

    while(keys.length) {
        key = keys.shift();
        if(key in target) {
            return true;
        }
    }

    return false;
}

function applyBatch(keyInfo, array, batchData) {
    batchData.forEach(item => {
        switch(item.type) {
            case "update": update(keyInfo, array, item.key, item.data); break;
            case "insert": insert(keyInfo, array, item.data); break;
            case "remove": remove(keyInfo, array, item.key); break;
        }
    });
}

function update(keyInfo, array, key, data) {
    var target,
        extendComplexObject = true,
        keyExpr = keyInfo.key();

    if(keyExpr) {
        if(hasKey(data, keyExpr) && !keysEqual(keyExpr, key, keyInfo.keyOf(data))) {
            return rejectedPromise(errors.Error("E4017"));
        }

        let index = indexByKey(keyInfo, array, key);
        if(index < 0) {
            return rejectedPromise(errors.Error("E4009"));
        }

        target = array[index];
    } else {
        target = key;
    }

    objectUtils.deepExtendArraySafe(target, data, extendComplexObject);
    return trivialPromise(key, data);
}

function insert(keyInfo, array, data) {
    var keyValue,
        obj,
        keyExpr = keyInfo.key();

    obj = isPlainObject(data) ? extend({}, data) : data;

    if(keyExpr) {
        keyValue = keyInfo.keyOf(obj);
        if(keyValue === undefined || typeof keyValue === "object" && isEmptyObject(keyValue)) {
            if(Array.isArray(keyExpr)) {
                throw errors.Error("E4007");
            }
            keyValue = obj[keyExpr] = String(new Guid());
        } else {
            if(array[indexByKey(keyInfo, array, keyValue)] !== undefined) {
                return rejectedPromise(errors.Error("E4008"));
            }
        }
    } else {
        keyValue = obj;
    }

    array.push(obj);
    return trivialPromise(data, keyValue);
}

function remove(keyInfo, array, key) {
    var index = indexByKey(keyInfo, array, key);
    if(index > -1) {
        array.splice(index, 1);
    }
    return trivialPromise(key);
}

function indexByKey(keyInfo, array, key) {
    var keyExpr = keyInfo.key();
    for(var i = 0, arrayLength = array.length; i < arrayLength; i++) {
        if(keysEqual(keyExpr, keyInfo.keyOf(array[i]), key)) {
            return i;
        }
    }
    return -1;
}

module.exports.applyBatch = applyBatch;
module.exports.update = update;
module.exports.insert = insert;
module.exports.remove = remove;
module.exports.indexByKey = indexByKey;
