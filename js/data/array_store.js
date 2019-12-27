import { rejectedPromise, trivialPromise } from './utils';
import Query from './query';
import { errors } from './errors';
import Store from './abstract_store';
import arrayUtils from './array_utils';

const ArrayStore = Store.inherit({
    ctor: function(options) {
        if(Array.isArray(options)) {
            options = { data: options };
        } else {
            options = options || {};
        }

        this.callBase(options);

        const initialArray = options.data;
        if(initialArray && !Array.isArray(initialArray)) {
            throw errors.Error('E4006');
        }

        this._array = initialArray || [];
    },

    createQuery: function() {
        return Query(this._array, {
            errorHandler: this._errorHandler
        });
    },

    _byKeyImpl: function(key) {
        const index = arrayUtils.indexByKey(this, this._array, key);

        if(index === -1) {
            return rejectedPromise(errors.Error('E4009'));
        }

        return trivialPromise(this._array[index]);
    },

    _insertImpl: function(values) {
        return arrayUtils.insert(this, this._array, values);
    },

    _pushImpl: function(changes) {
        arrayUtils.applyBatch(this, this._array, changes);
    },

    _updateImpl: function(key, values) {
        return arrayUtils.update(this, this._array, key, values);
    },

    _removeImpl: function(key) {
        return arrayUtils.remove(this, this._array, key);
    },

    clear: function() {
        this.fireEvent('modifying');
        this._array = [];
        this.fireEvent('modified');
    }
}, 'array');

module.exports = ArrayStore;
