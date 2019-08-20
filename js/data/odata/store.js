var isDefined = require("../../core/utils/type").isDefined,
    config = require("../../core/config"),
    odataUtils = require("./utils"),
    proxyUrlFormatter = require("../proxy_url_formatter"),
    errors = require("../errors").errors,
    query = require("../query"),
    Store = require("../abstract_store"),
    mixins = require("./mixins"),
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred;

require("./query_adapter");

var ANONYMOUS_KEY_NAME = "5d46402c-7899-4ea9-bd81-8b73c47c7683";

function expandKeyType(key, keyType) {
    var result = {};
    result[key] = keyType;
    return result;
}

function mergeFieldTypesWithKeyType(fieldTypes, keyType) {
    var result = {};

    for(var field in fieldTypes) {
        result[field] = fieldTypes[field];
    }

    for(var keyName in keyType) {
        if(keyName in result) {
            if(result[keyName] !== keyType[keyName]) {
                errors.log("W4001", keyName);
            }
        } else {
            result[keyName] = keyType[keyName];
        }
    }

    return result;
}

/**
* @name ODataStore
* @inherits Store
* @type object
* @module data/odata/store
* @export default
*/
var ODataStore = Store.inherit({

    ctor: function(options) {
        this.callBase(options);

        /**
         * @name ODataStoreOptions.url
         * @type string
         */
        /**
         * @name ODataStoreOptions.beforeSend
         * @type function
         * @type_function_param1 options:object
         * @type_function_param1_field1 url:string
         * @type_function_param1_field2 async:boolean
         * @type_function_param1_field3 method:string
         * @type_function_param1_field4 timeout:number
         * @type_function_param1_field5 params:object
         * @type_function_param1_field6 payload:object
         * @type_function_param1_field7 headers:object
         */
        /**
         * @name ODataStoreOptions.jsonp
         * @type boolean
         * @default false
         */
        /**
         * @name ODataStoreOptions.version
         * @type number
         * @default 2
         * @acceptValues 2|3|4
         */
        /**
         * @name ODataStoreOptions.withCredentials
         * @type boolean
         * @default false
         */
        /**
         * @name ODataStoreOptions.filterToLower
         * @type boolean
         */
        /**
         * @name ODataStoreOptions.deserializeDates
         * @type boolean
         */
        /**
         * @name ODataStoreOptions.errorHandler
         * @type function
         * @type_function_param1 e:Error
         * @type_function_param1_field1 httpStatus:number
         * @type_function_param1_field2 errorDetails:object
         * @type_function_param1_field3 requestOptions:object
         */
        /**
         * @name ODataStoreOptions.onLoading
         * @action
         */
        this._extractServiceOptions(options);

        /**
         * @name ODataStoreOptions.keyType
         * @type string|object
         * @acceptValues "String"|"Int32"|"Int64"|"Guid"|"Boolean"|"Single"|"Decimal"
         */

        var key = this.key(),
            fieldTypes = options.fieldTypes,
            keyType = options.keyType;

        if(keyType) {
            var keyTypeIsString = (typeof keyType === "string");

            if(!key) {
                key = keyTypeIsString ? ANONYMOUS_KEY_NAME : Object.keys(keyType);
                this._legacyAnonymousKey = key;
            }

            if(keyTypeIsString) {
                keyType = expandKeyType(key, keyType);
            }

            fieldTypes = mergeFieldTypesWithKeyType(fieldTypes, keyType);
        }

        /**
         * @name ODataStoreOptions.fieldTypes
         * @type object
         * @default {}
         */
        this._fieldTypes = fieldTypes || {};

        if(this.version() === 2) {
            this._updateMethod = "MERGE";
        } else {
            this._updateMethod = "PATCH";
        }
    },

    _customLoadOptions: function() {
        return ["expand", "customQueryParams"];
    },

    /**
    * @name ODataStoreMethods.byKey
    * @publicName byKey(key, extraOptions)
    * @param1 key:object|string|number
    * @param2 extraOptions:object
    * @param2_field1 expand:string|Array<string>
    * @param2_field2 select:string|Array<string>
    * @return Promise<any>
    */
    _byKeyImpl: function(key, extraOptions) {
        var params = {};

        if(extraOptions) {
            params["$expand"] = odataUtils.generateExpand(this._version, extraOptions.expand, extraOptions.select);
            params["$select"] = odataUtils.generateSelect(this._version, extraOptions.select);
        }

        return this._sendRequest(this._byKeyUrl(key), "GET", params);
    },

    /**
    * @name ODataStoreMethods.createQuery
    * @publicName createQuery(loadOptions)
    * @param1 loadOptions:object
    * @return object
    */
    createQuery: function(loadOptions) {
        var url,
            queryOptions;

        loadOptions = loadOptions || {};
        queryOptions = {
            adapter: "odata",

            beforeSend: this._beforeSend,
            errorHandler: this._errorHandler,
            jsonp: this._jsonp,
            version: this._version,
            withCredentials: this._withCredentials,
            expand: loadOptions.expand,
            requireTotalCount: loadOptions.requireTotalCount,
            deserializeDates: this._deserializeDates,
            fieldTypes: this._fieldTypes
        };

        // NOTE: For AppBuilder, do not remove
        if(isDefined(loadOptions.urlOverride)) {
            url = loadOptions.urlOverride;
        } else {
            url = this._url;
        }

        if(isDefined(this._filterToLower)) {
            queryOptions.filterToLower = this._filterToLower;
        }

        if(loadOptions.customQueryParams) {
            var params = mixins.escapeServiceOperationParams(loadOptions.customQueryParams, this.version());

            if(this.version() === 4) {
                url = mixins.formatFunctionInvocationUrl(url, params);
            } else {
                queryOptions.params = params;
            }
        }

        return query(url, queryOptions);
    },

    _insertImpl: function(values) {
        this._requireKey();

        var that = this,
            d = new Deferred();

        when(this._sendRequest(this._url, "POST", null, values))
            .done(function(serverResponse) {
                d.resolve(config().useLegacyStoreResult ? values : (serverResponse || values), that.keyOf(serverResponse));
            })
            .fail(d.reject);

        return d.promise();
    },

    _updateImpl: function(key, values) {
        var d = new Deferred();

        when(
            this._sendRequest(this._byKeyUrl(key), this._updateMethod, null, values)
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
        var d = new Deferred();

        when(
            this._sendRequest(this._byKeyUrl(key), "DELETE")
        ).done(
            function() {
                d.resolve(key);
            }
        ).fail(d.reject);

        return d.promise();
    },

    _convertKey: function(value) {
        var result = value,
            fieldTypes = this._fieldTypes,
            key = this.key() || this._legacyAnonymousKey;

        if(Array.isArray(key)) {
            result = {};
            for(var i = 0; i < key.length; i++) {
                var keyName = key[i];
                result[keyName] = odataUtils.convertPrimitiveValue(fieldTypes[keyName], value[keyName]);
            }
        } else if(fieldTypes[key]) {
            result = odataUtils.convertPrimitiveValue(fieldTypes[key], value);
        }

        return result;
    },

    _byKeyUrl: function(value, useOriginalHost) {
        var baseUrl = useOriginalHost
            ? proxyUrlFormatter.formatLocalUrl(this._url)
            : this._url;

        var convertedKey = this._convertKey(value);

        return baseUrl + "(" + encodeURIComponent(odataUtils.serializeKey(convertedKey, this._version)) + ")";
    }

}, "odata").include(mixins.SharedMethods);

module.exports = ODataStore;
