"use strict";

var $ = require("../../core/renderer"),
    isDefined = require("../../core/utils/type").isDefined,
    map = require("../../core/utils/iterator").map,
    odataUtils = require("./utils"),
    proxyUrlFormatter = require("../proxy_url_formatter"),
    errors = require("../errors").errors,
    query = require("../query"),
    Store = require("../abstract_store"),
    mixins = require("./mixins"),
    when = require("../../integration/jquery/deferred").when;

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
* @publicName ODataStore
* @inherits Store
* @type object
* @module data/odata/store
* @export default
*/
var ODataStore = Store.inherit({

    ctor: function(options) {
        this.callBase(options);

        /**
         * @name ODataStoreOptions_url
         * @publicName url
         * @type string
         */
        /**
         * @name ODataStoreOptions_beforeSend
         * @publicName beforeSend
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
         * @name ODataStoreOptions_jsonp
         * @publicName jsonp
         * @type boolean
         * @default false
         */
        /**
         * @name ODataStoreOptions_version
         * @publicName version
         * @type number
         * @default 2
         * @acceptValues 2|3|4
         */
        /**
         * @name ODataStoreOptions_withCredentials
         * @publicName withCredentials
         * @type boolean
         * @default false
         */
        /**
         * @name ODataStoreOptions_deserializeDates
         * @publicName deserializeDates
         * @type boolean
         */
        /**
         * @name ODataStoreOptions_onLoading
         * @publicName onLoading
         * @type_function_param1_field8 requireTotalCount:boolean
         * @action
         * @extend_doc
         */
        this._extractServiceOptions(options);

        /**
         * @name ODataStoreOptions_keyType
         * @publicName keyType
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
         * @name ODataStoreOptions_fieldTypes
         * @publicName fieldTypes
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
    * @name ODataStoreMethods_load
    * @publicName load(options)
    * @param1_field8 expand:string|array
    * @param1_field9 requireTotalCount:boolean
    * @param1_field10 customQueryParams:object
    * @extend_doc
    */

    /**
    * @name ODataStoreMethods_byKey
    * @publicName byKey(key, extraOptions)
    * @param1 key:object|string|number
    * @param2 extraOptions:object
    * @param2_field1 expand:string|array
    * @return Promise
    */
    _byKeyImpl: function(key, extraOptions) {
        var params = {};

        if(extraOptions) {
            if(extraOptions.expand) {
                params["$expand"] = map($.makeArray(extraOptions.expand), odataUtils.serializePropName).join();
            }
        }

        return this._sendRequest(this._byKeyUrl(key), "GET", params);
    },

    /**
    * @name ODataStoreMethods_createQuery
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
            d = $.Deferred();

        when(this._sendRequest(this._url, "POST", null, values))
            .done(function(serverResponse) {
                d.resolve(values, that.keyOf(serverResponse));
            })
            .fail(d.reject);

        return d.promise();
    },

    _updateImpl: function(key, values) {
        var d = $.Deferred();

        when(
            this._sendRequest(this._byKeyUrl(key), this._updateMethod, null, values)
        ).done(
            function() {
                d.resolve(key, values);
            }
        ).fail(d.reject);

        return d.promise();
    },

    _removeImpl: function(key) {
        var d = $.Deferred();

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
            for(var keyIndex in key) {
                var keyName = key[keyIndex];
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
