const Class = require('../core/class');
const abstract = Class.abstract;
const EventsStrategy = require('../core/events_strategy').EventsStrategy;
const each = require('../core/utils/iterator').each;
const errorsModule = require('./errors');
const dataUtils = require('./utils');
const compileGetter = require('../core/utils/data').compileGetter;
const storeHelper = require('./store_helper');
const queryByOptions = storeHelper.queryByOptions;
const Deferred = require('../core/utils/deferred').Deferred;
const noop = require('../core/utils/common').noop;

const storeImpl = {};

/**
* @name Store
* @type object
* @hidden
* @module data/abstract_store
* @export default
*/
const Store = Class.inherit({

    ctor: function(options) {
        const that = this;
        options = options || {};
        this._eventsStrategy = new EventsStrategy(this);

        each(
            [
                /**
                 * @name StoreOptions.onLoaded
                 * @type function
                 * @type_function_param1 result:Array<any>
                 * @action
                 */
                'onLoaded',

                /**
                 * @name StoreOptions.onLoading
                 * @type function
                 * @type_function_param1 loadOptions:LoadOptions
                 * @action
                 */
                'onLoading',

                /**
                 * @name StoreOptions.onInserted
                 * @type function
                 * @type_function_param1 values:object
                 * @type_function_param2 key:object|string|number
                 * @action
                 */
                'onInserted',

                /**
                 * @name StoreOptions.onInserting
                 * @type function
                 * @type_function_param1 values:object
                 * @action
                 */
                'onInserting',

                /**
                 * @name StoreOptions.onUpdated
                 * @type function
                 * @type_function_param1 key:object|string|number
                 * @type_function_param2 values:object
                 * @action
                 */
                'onUpdated',

                /**
                 * @name StoreOptions.onUpdating
                 * @type function
                 * @type_function_param1 key:object|string|number
                 * @type_function_param2 values:object
                 * @action
                 */
                'onUpdating',

                /**
                 * @name StoreOptions.onPush
                 * @type function
                 * @type_function_param1 changes:Array<any>
                 * @action
                 */
                'onPush',

                /**
                 * @name StoreOptions.onRemoved
                 * @type function
                 * @type_function_param1 key:object|string|number
                 * @action
                 */
                'onRemoved',

                /**
                 * @name StoreOptions.onRemoving
                 * @type function
                 * @type_function_param1 key:object|string|number
                 * @action
                 */
                'onRemoving',

                /**
                 * @name StoreOptions.onModified
                 * @type function
                 * @action
                 */
                'onModified',

                /**
                 * @name StoreOptions.onModifying
                 * @type function
                 * @action
                 */
                'onModifying'
            ],
            function(_, optionName) {
                if(optionName in options) {
                    that.on(optionName.slice(2).toLowerCase(), options[optionName]);
                }
            });

        /**
         * @name StoreOptions.key
         * @type string|Array<string>
         */
        this._key = options.key;

        /**
         * @name StoreOptions.errorHandler
         * @type function
         */
        this._errorHandler = options.errorHandler;

        this._useDefaultSearch = true;
    },

    _customLoadOptions: function() {
        return null;
    },

    /**
    * @name StoreMethods.key
    * @publicName key()
    * @return any
    */
    key: function() {
        return this._key;
    },

    /**
    * @name StoreMethods.keyOf
    * @publicName keyOf(obj)
    * @param1 obj:object
    * @return any
    */
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
    /**
    * @name StoreMethods.load
    * @publicName load()
    * @return Promise<any>
    */
    /**
    * @name StoreMethods.load
    * @publicName load(options)
    * @param1 options:LoadOptions
    * @return Promise<any>
    */
    load: function(options) {
        const that = this;

        options = options || {};

        this._eventsStrategy.fireEvent('loading', [options]);

        return this._withLock(this._loadImpl(options)).done(function(result) {
            that._eventsStrategy.fireEvent('loaded', [result, options]);
        });
    },

    _loadImpl: function(options) {
        return queryByOptions(this.createQuery(options), options).enumerate();
    },

    _withLock: function(task) {
        const result = new Deferred();

        task.done(function() {
            const that = this;
            const args = arguments;

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

    /**
    * @name StoreMethods.totalCount
    * @publicName totalCount(options)
    * @param1 obj:object
    * @param1_field1 filter:object
    * @param1_field2 group:object
    * @return Promise<number>
    */
    totalCount: function(options) {
        return this._totalCountImpl(options);
    },

    _totalCountImpl: function(options) {
        return queryByOptions(this.createQuery(options), options, true).count();
    },

    /**
    * @name StoreMethods.byKey
    * @publicName byKey(key)
    * @param1 key:object|string|number
    * @return Promise<any>
    */
    byKey: function(key, extraOptions) {
        return this._addFailHandlers(this._withLock(this._byKeyImpl(key, extraOptions)));
    },

    _byKeyImpl: abstract,

    /**
    * @name StoreMethods.insert
    * @publicName insert(values)
    * @param1 values:object
    * @return Promise<any>
    */
    insert: function(values) {
        const that = this;

        that._eventsStrategy.fireEvent('modifying');
        that._eventsStrategy.fireEvent('inserting', [values]);

        return that._addFailHandlers(that._insertImpl(values).done(function(callbackValues, callbackKey) {
            that._eventsStrategy.fireEvent('inserted', [callbackValues, callbackKey]);
            that._eventsStrategy.fireEvent('modified');
        }));
    },

    _insertImpl: abstract,

    /**
    * @name StoreMethods.update
    * @publicName update(key, values)
    * @param1 key:object|string|number
    * @param2 values:object
    * @return Promise<any>
    */
    update: function(key, values) {
        const that = this;

        that._eventsStrategy.fireEvent('modifying');
        that._eventsStrategy.fireEvent('updating', [key, values]);

        return that._addFailHandlers(that._updateImpl(key, values).done(function() {
            that._eventsStrategy.fireEvent('updated', [key, values]);
            that._eventsStrategy.fireEvent('modified');
        }));
    },

    _updateImpl: abstract,

    /**
    * @name StoreMethods.push
    * @publicName push(changes)
    * @param1 changes:Array<any>
    */
    push: function(changes) {
        this._pushImpl(changes);
        this._eventsStrategy.fireEvent('push', [changes]);
    },

    _pushImpl: noop,

    /**
    * @name StoreMethods.remove
    * @publicName remove(key)
    * @param1 key:object|string|number
    * @return Promise<void>
    */
    remove: function(key) {
        const that = this;

        that._eventsStrategy.fireEvent('modifying');
        that._eventsStrategy.fireEvent('removing', [key]);

        return that._addFailHandlers(that._removeImpl(key).done(function(callbackKey) {
            that._eventsStrategy.fireEvent('removed', [callbackKey]);
            that._eventsStrategy.fireEvent('modified');
        }));
    },

    _removeImpl: abstract,

    _addFailHandlers: function(deferred) {
        return deferred.fail(this._errorHandler).fail(errorsModule._errorHandler);
    },

    /**
     * @name StoreMethods.on
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     */
    /**
     * @name StoreMethods.on
     * @publicName on(events)
     * @param1 events:object
     * @return this
     */
    on(eventName, eventHandler) {
        this._eventsStrategy.on(eventName, eventHandler);
        return this;
    },

    /**
     * @name StoreMethods.off
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     */
    /**
     * @name StoreMethods.off
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     */
    off(eventName, eventHandler) {
        this._eventsStrategy.off(eventName, eventHandler);
        return this;
    }
});

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
        const type = inheritor.apply(this, [members]);
        Store.registerClass(type, alias);
        return type;
    };
}(Store.inherit);

module.exports = Store;
