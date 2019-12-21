var Class = require('../core/class'),
    abstract = Class.abstract,
    EventsMixin = require('../core/events_mixin'),
    each = require('../core/utils/iterator').each,
    errorsModule = require('./errors'),
    dataUtils = require('./utils'),
    compileGetter = require('../core/utils/data').compileGetter,
    storeHelper = require('./store_helper'),
    queryByOptions = storeHelper.queryByOptions,
    Deferred = require('../core/utils/deferred').Deferred,
    noop = require('../core/utils/common').noop,

    storeImpl = {};

var Store = Class.inherit({

    ctor: function(options) {
        var that = this;
        options = options || {};

        each(
            [
                'onLoaded',

                'onLoading',

                'onInserted',

                'onInserting',

                'onUpdated',

                'onUpdating',

                'onPush',

                'onRemoved',

                'onRemoving',

                'onModified',

                'onModifying'
            ],
            function(_, optionName) {
                if(optionName in options) {
                    that.on(optionName.slice(2).toLowerCase(), options[optionName]);
                }
            });

        this._key = options.key;

        this._errorHandler = options.errorHandler;

        this._useDefaultSearch = true;
    },

    _customLoadOptions: function() {
        return null;
    },

    key: function() {
        return this._key;
    },

    keyOf: function(obj) {
        if(!this._keyGetter) {
            this._keyGetter = compileGetter(this.key());
        }

        return this._keyGetter(obj);
    },

    _requireKey: function() {
        if(!this.key()) {
            throw errorsModule.errors.Error('E4005');
        }
    },
    load: function(options) {
        var that = this;

        options = options || {};

        this.fireEvent('loading', [options]);

        return this._withLock(this._loadImpl(options)).done(function(result) {
            that.fireEvent('loaded', [result, options]);
        });
    },

    _loadImpl: function(options) {
        return queryByOptions(this.createQuery(options), options).enumerate();
    },

    _withLock: function(task) {
        var result = new Deferred();

        task.done(function() {
            var that = this,
                args = arguments;

            dataUtils.processRequestResultLock
                .promise()
                .done(function() {
                    result.resolveWith(that, args);
                });

        }).fail(function() {
            result.rejectWith(this, arguments);
        });

        return result;
    },

    createQuery: abstract,

    totalCount: function(options) {
        return this._totalCountImpl(options);
    },

    _totalCountImpl: function(options) {
        return queryByOptions(this.createQuery(options), options, true).count();
    },

    byKey: function(key, extraOptions) {
        return this._addFailHandlers(this._withLock(this._byKeyImpl(key, extraOptions)));
    },

    _byKeyImpl: abstract,

    insert: function(values) {
        var that = this;

        that.fireEvent('modifying');
        that.fireEvent('inserting', [values]);

        return that._addFailHandlers(that._insertImpl(values).done(function(callbackValues, callbackKey) {
            that.fireEvent('inserted', [callbackValues, callbackKey]);
            that.fireEvent('modified');
        }));
    },

    _insertImpl: abstract,

    update: function(key, values) {
        var that = this;

        that.fireEvent('modifying');
        that.fireEvent('updating', [key, values]);

        return that._addFailHandlers(that._updateImpl(key, values).done(function() {
            that.fireEvent('updated', [key, values]);
            that.fireEvent('modified');
        }));
    },

    _updateImpl: abstract,

    push: function(changes) {
        this._pushImpl(changes);
        this.fireEvent('push', [changes]);
    },

    _pushImpl: noop,

    remove: function(key) {
        var that = this;

        that.fireEvent('modifying');
        that.fireEvent('removing', [key]);

        return that._addFailHandlers(that._removeImpl(key).done(function(callbackKey) {
            that.fireEvent('removed', [callbackKey]);
            that.fireEvent('modified');
        }));
    },

    _removeImpl: abstract,

    _addFailHandlers: function(deferred) {
        return deferred.fail(this._errorHandler).fail(errorsModule._errorHandler);
    }
}).include(EventsMixin);

Store.create = function(alias, options) {
    if(!(alias in storeImpl)) {
        throw errorsModule.errors.Error('E4020', alias);
    }

    return new storeImpl[alias](options);
};

Store.registerClass = function(type, alias) {
    if(alias) {
        storeImpl[alias] = type;
    }
    return type;
};

Store.inherit = function(inheritor) {
    return function(members, alias) {
        var type = inheritor.apply(this, [members]);
        Store.registerClass(type, alias);
        return type;
    };
}(Store.inherit);

module.exports = Store;
