const isDefined = require('../../core/utils/type').isDefined;
const config = require('../../core/config');
const odataUtils = require('./utils');
const proxyUrlFormatter = require('../proxy_url_formatter');
const errors = require('../errors').errors;
const query = require('../query');
const Store = require('../abstract_store');
const RequestDispatcher = require('./request_dispatcher').default;
const deferredUtils = require('../../core/utils/deferred');
const when = deferredUtils.when;
const Deferred = deferredUtils.Deferred;

require('./query_adapter');

const ANONYMOUS_KEY_NAME = '5d46402c-7899-4ea9-bd81-8b73c47c7683';

function expandKeyType(key, keyType) {
    const result = {};
    result[key] = keyType;
    return result;
}

function mergeFieldTypesWithKeyType(fieldTypes, keyType) {
    const result = {};

    for(const field in fieldTypes) {
        result[field] = fieldTypes[field];
    }

    for(const keyName in keyType) {
        if(keyName in result) {
            if(result[keyName] !== keyType[keyName]) {
                errors.log('W4001', keyName);
            }
        } else {
            result[keyName] = keyType[keyName];
        }
    }

    return result;
}

const ODataStore = Store.inherit({

    ctor: function(options) {
        this.callBase(options);

        this._requestDispatcher = new RequestDispatcher(options);

        let key = this.key();
        let fieldTypes = options.fieldTypes;
        let keyType = options.keyType;

        if(keyType) {
            const keyTypeIsString = (typeof keyType === 'string');

            if(!key) {
                key = keyTypeIsString ? ANONYMOUS_KEY_NAME : Object.keys(keyType);
                this._legacyAnonymousKey = key;
            }

            if(keyTypeIsString) {
                keyType = expandKeyType(key, keyType);
            }

            fieldTypes = mergeFieldTypesWithKeyType(fieldTypes, keyType);
        }

        this._fieldTypes = fieldTypes || {};

        if(this.version() === 2) {
            this._updateMethod = 'MERGE';
        } else {
            this._updateMethod = 'PATCH';
        }
    },

    _customLoadOptions: function() {
        return ['expand', 'customQueryParams'];
    },

    _byKeyImpl: function(key, extraOptions) {
        const params = {};

        if(extraOptions) {
            params['$expand'] = odataUtils.generateExpand(this.version(), extraOptions.expand, extraOptions.select) || undefined;
            params['$select'] = odataUtils.generateSelect(this.version(), extraOptions.select) || undefined;
        }

        return this._requestDispatcher.sendRequest(this._byKeyUrl(key), 'GET', params);
    },

    createQuery: function(loadOptions) {
        let url;

        loadOptions = loadOptions || {};
        const queryOptions = {
            adapter: 'odata',

            beforeSend: this._requestDispatcher.beforeSend,
            errorHandler: this._errorHandler,
            jsonp: this._requestDispatcher.jsonp,
            version: this._requestDispatcher.version,
            withCredentials: this._requestDispatcher._withCredentials,
            expand: loadOptions.expand,
            requireTotalCount: loadOptions.requireTotalCount,
            deserializeDates: this._requestDispatcher._deserializeDates,
            fieldTypes: this._fieldTypes
        };

        // NOTE: For AppBuilder, do not remove
        if(isDefined(loadOptions.urlOverride)) {
            url = loadOptions.urlOverride;
        } else {
            url = this._requestDispatcher.url;
        }

        if(isDefined(this._requestDispatcher.filterToLower)) {
            queryOptions.filterToLower = this._requestDispatcher.filterToLower;
        }

        if(loadOptions.customQueryParams) {
            const params = odataUtils.escapeServiceOperationParams(loadOptions.customQueryParams, this.version());

            if(this.version() === 4) {
                url = odataUtils.formatFunctionInvocationUrl(url, params);
            } else {
                queryOptions.params = params;
            }
        }

        return query(url, queryOptions);
    },

    _insertImpl: function(values) {
        this._requireKey();

        const that = this;
        const d = new Deferred();

        when(this._requestDispatcher.sendRequest(this._requestDispatcher.url, 'POST', null, values))
            .done(function(serverResponse) {
                d.resolve(config().useLegacyStoreResult ? values : (serverResponse || values), that.keyOf(serverResponse));
            })
            .fail(d.reject);

        return d.promise();
    },

    _updateImpl: function(key, values) {
        const d = new Deferred();

        when(
            this._requestDispatcher.sendRequest(this._byKeyUrl(key), this._updateMethod, null, values)
        ).done(
            function(serverResponse) {
                if(config().useLegacyStoreResult) {
                    d.resolve(key, values);
                } else {
                    d.resolve(serverResponse || values, key);
                }
            }
        ).fail(d.reject);

        return d.promise();
    },

    _removeImpl: function(key) {
        const d = new Deferred();

        when(
            this._requestDispatcher.sendRequest(this._byKeyUrl(key), 'DELETE')
        ).done(
            function() {
                d.resolve(key);
            }
        ).fail(d.reject);

        return d.promise();
    },

    _convertKey: function(value) {
        let result = value;
        const fieldTypes = this._fieldTypes;
        const key = this.key() || this._legacyAnonymousKey;

        if(Array.isArray(key)) {
            result = {};
            for(let i = 0; i < key.length; i++) {
                const keyName = key[i];
                result[keyName] = odataUtils.convertPrimitiveValue(fieldTypes[keyName], value[keyName]);
            }
        } else if(fieldTypes[key]) {
            result = odataUtils.convertPrimitiveValue(fieldTypes[key], value);
        }

        return result;
    },

    _byKeyUrl: function(value, useOriginalHost) {
        const baseUrl = useOriginalHost
            ? proxyUrlFormatter.formatLocalUrl(this._requestDispatcher.url)
            : this._requestDispatcher.url;

        const convertedKey = this._convertKey(value);

        return baseUrl + '(' + encodeURIComponent(odataUtils.serializeKey(convertedKey, this.version())) + ')';
    },

    version() {
        return this._requestDispatcher.version;
    }

}, 'odata');

module.exports = ODataStore;
