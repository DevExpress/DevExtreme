import dataUtils from './utils';
import Query from './query';
import errorUtils from './errors';
import Store from './abstract_store';
import { indexByKey, insert, applyBatch, update, remove } from './array_utils';

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
            throw errorUtils.errors.Error('E4006');
        }

        this._array = initialArray || [];
    },

    createQuery: function() {
        return Query(this._array, {
            errorHandler: this._errorHandler
        });
    },

    _byKeyImpl: function(key) {
        const index = indexByKey(this, this._array, key);

        if(index === -1) {
            return dataUtils.rejectedPromise(errorUtils.errors.Error('E4009'));
        }

        return dataUtils.trivialPromise(this._array[index]);
    },

    _insertImpl: function(values) {
        return insert(this, this._array, values);
    },

    _pushImpl: function(changes) {
        applyBatch({
            keyInfo: this,
            data: this._array,
            changes
        });
    },

    _updateImpl: function(key, values) {
        return update(this, this._array, key, values);
    },

    _removeImpl: function(key) {
        return remove(this, this._array, key);
    },

    clear: function() {
        this._eventsStrategy.fireEvent('modifying');
        this._array = [];
        this._eventsStrategy.fireEvent('modified');
    }
}, 'array');

export default ArrayStore;
