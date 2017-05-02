"use strict";

var $ = require("../core/renderer"),
    extend = require("../core/utils/extend").extend,
    typeUtils = require("../core/utils/type"),
    Guid = require("../core/guid"),
    objectUtils = require("../core/utils/object"),
    keysEqual = require("./utils").keysEqual,
    Query = require("./query"),
    errors = require("./errors").errors,
    Store = require("./abstract_store");

var hasKey = function(target, keyOrKeys) {
    var key,
        keys = $.makeArray(keyOrKeys);

    while(keys.length) {
        key = keys.shift();
        if(key in target) {
            return true;
        }
    }

    return false;
};

var trivialPromise = function() {
    var d = $.Deferred();
    return d.resolve.apply(d, arguments).promise();
};

var rejectedPromise = function() {
    var d = $.Deferred();
    return d.reject.apply(d, arguments).promise();
};

/**
* @name ArrayStore
* @publicName ArrayStore
* @inherits Store
* @type object
* @module data/array_store
* @export default
*/
var ArrayStore = Store.inherit({
    ctor: function(options) {
        if(Array.isArray(options)) {
            options = { data: options };
        } else {
            options = options || {};
        }

        this.callBase(options);

        var initialArray = options.data;
        if(initialArray && !Array.isArray(initialArray)) {
            throw errors.Error("E4006");
        }

        /**
         * @name ArrayStoreOptions_data
         * @publicName data
         * @type array
         */
        this._array = initialArray || [];
    },

    /**
    * @name ArrayStoreMethods_createQuery
    * @publicName createQuery()
    * @return object
    */
    createQuery: function() {
        return Query(this._array, {
            errorHandler: this._errorHandler
        });
    },

    _byKeyImpl: function(key) {
        var index = this._indexByKey(key);

        if(index === -1) {
            return rejectedPromise(errors.Error("E4009"));
        }

        return trivialPromise(this._array[index]);
    },

    _insertImpl: function(values) {
        var keyExpr = this.key(),
            keyValue,
            obj;

        if(typeUtils.isPlainObject(values)) {
            obj = extend({}, values);
        } else {
            obj = values;
        }

        if(keyExpr) {
            keyValue = this.keyOf(obj);
            if(keyValue === undefined || typeof keyValue === "object" && typeUtils.isEmptyObject(keyValue)) {
                if(Array.isArray(keyExpr)) {
                    throw errors.Error("E4007");
                }
                keyValue = obj[keyExpr] = String(new Guid());
            } else {
                if(this._array[this._indexByKey(keyValue)] !== undefined) {
                    return rejectedPromise(errors.Error("E4008"));
                }
            }
        } else {
            keyValue = obj;
        }

        this._array.push(obj);
        return trivialPromise(values, keyValue);
    },

    _updateImpl: function(key, values) {
        var index,
            target,
            keyExpr = this.key(),
            extendComplexObject = true;

        if(keyExpr) {

            if(hasKey(values, keyExpr) && !keysEqual(keyExpr, key, this.keyOf(values))) {
                return rejectedPromise(errors.Error("E4017"));
            }

            index = this._indexByKey(key);
            if(index < 0) {
                return rejectedPromise(errors.Error("E4009"));
            }

            target = this._array[index];
        } else {
            target = key;
        }

        objectUtils.deepExtendArraySafe(target, values, extendComplexObject);
        return trivialPromise(key, values);
    },

    _removeImpl: function(key) {
        var index = this._indexByKey(key);
        if(index > -1) {
            this._array.splice(index, 1);
        }
        return trivialPromise(key);
    },

    _indexByKey: function(key) {
        for(var i = 0, arrayLength = this._array.length; i < arrayLength; i++) {
            if(keysEqual(this.key(), this.keyOf(this._array[i]), key)) {
                return i;
            }
        }
        return -1;
    },

    /**
    * @name ArrayStoreMethods_clear
    * @publicName clear()
    */
    clear: function() {
        this.fireEvent("modifying");
        this._array = [];
        this.fireEvent("modified");
    }
}, "array");

module.exports = ArrayStore;
