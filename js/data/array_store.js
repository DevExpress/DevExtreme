import { rejectedPromise, trivialPromise } from "./utils";
import Query from "./query";
import { errors } from "./errors";
import Store from "./abstract_store";
import arrayUtils from "./array_utils";

/**
* @name ArrayStore
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
         * @name ArrayStoreOptions.data
         * @type Array<any>
         */
        this._array = initialArray || [];
    },

    /**
    * @name ArrayStoreMethods.createQuery
    * @publicName createQuery()
    * @return object
    */
    createQuery: function() {
        return Query(this._array, {
            errorHandler: this._errorHandler
        });
    },

    _byKeyImpl: function(key) {
        var index = arrayUtils.indexByKey(this._array, key, this);

        if(index === -1) {
            return rejectedPromise(errors.Error("E4009"));
        }

        return trivialPromise(this._array[index]);
    },

    _insertImpl: function(values) {
        return arrayUtils.insert(this._array, values, this);
    },

    _pushImpl: function(changes) {
        arrayUtils.push(this._array, changes, this);
    },

    _updateImpl: function(key, values) {
        return arrayUtils.update(this._array, key, values, this);
    },

    _removeImpl: function(key) {
        return arrayUtils.remove(this._array, key, this);
    },

    /**
    * @name ArrayStoreMethods.clear
    * @publicName clear()
    */
    clear: function() {
        this.fireEvent("modifying");
        this._array = [];
        this.fireEvent("modified");
    }
}, "array");

module.exports = ArrayStore;
