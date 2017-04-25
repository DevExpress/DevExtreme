"use strict";

var $ = require("jquery"),
    commonUtils = require("../../core/utils/common"),
    odataUtils = require("./utils"),
    proxyUrlFormatter = require("../proxy_url_formatter"),
    errorsModule = require("../errors"),
    query = require("../query"),
    Store = require("../abstract_store"),
    mixins = require("./mixins"),
    when = require("../../integration/jquery/deferred").when;

require("./query_adapter");

var convertSimpleKey = function(keyType, keyValue) {
    var converter = odataUtils.keyConverters[keyType];
    if(!converter) {
        throw errorsModule.errors.Error("E4014", keyType);
    }
    return converter(keyValue);
};

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
        this._keyType = options.keyType;

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
                params["$expand"] = $.map($.makeArray(extraOptions.expand), odataUtils.serializePropName).join();
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
            deserializeDates: this._deserializeDates,
            expand: loadOptions.expand,
            requireTotalCount: loadOptions.requireTotalCount
        };

        // NOTE: For AppBuilder, do not remove
        if(commonUtils.isDefined(loadOptions.urlOverride)) {
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

    _byKeyUrl: function(key, useOriginalHost) {
        var keyObj = key,
            keyType = this._keyType,
            baseUrl = useOriginalHost
                ? proxyUrlFormatter.formatLocalUrl(this._url)
                : this._url;

        if($.isPlainObject(keyType)) {
            keyObj = {};
            $.each(keyType, function(subKeyName, subKeyType) {
                keyObj[subKeyName] = convertSimpleKey(subKeyType, key[subKeyName]);
            });
        } else if(keyType) {
            keyObj = convertSimpleKey(keyType, key);
        }

        return baseUrl + "(" + encodeURIComponent(odataUtils.serializeKey(keyObj, this._version)) + ")";
    }

}, "odata").include(mixins.SharedMethods);

module.exports = ODataStore;
