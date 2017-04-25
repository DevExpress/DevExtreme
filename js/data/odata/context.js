"use strict";

var $ = require("jquery"),
    Class = require("../../core/class"),
    commonUtils = require("../../core/utils/common"),
    errorsModule = require("../errors"),
    ODataStore = require("./store"),
    mixins = require("./mixins"),
    when = require("../../integration/jquery/deferred").when;

require("./query_adapter");

/**
* @name ODataContext
* @publicName ODataContext
* @type object
* @module data/odata/context
* @export default
*/
var ODataContext = Class.inherit({

    ctor: function(options) {
        var that = this;

        /**
         * @name ODataContextOptions_url
         * @publicName url
         * @type string
         */
        /**
         * @name ODataContextOptions_beforeSend
         * @publicName beforeSend
         * @type function
         */
        /**
         * @name ODataContextOptions_jsonp
         * @publicName jsonp
         * @type boolean
         * @default false
         */
        /**
         * @name ODataContextOptions_version
         * @publicName version
         * @type number
         * @default 2
         * @acceptValues 2|3|4
         */
        /**
         * @name ODataContextOptions_withCredentials
         * @publicName withCredentials
         * @type boolean
         * @default false
         */
        /**
         * @name ODataContextOptions_deserializeDates
         * @publicName deserializeDates
         * @type boolean
         */
        that._extractServiceOptions(options);

        /**
         * @name ODataContextOptions_errorHandler
         * @publicName errorHandler
         * @type function
         */
        that._errorHandler = options.errorHandler;

        /**
         * @name ODataContextOptions_entities
         * @publicName entities
         * @type object
         */
        $.each(options.entities || [], function(entityAlias, entityOptions) {
            that[entityAlias] = new ODataStore($.extend(
                {},
                options,
                {
                    url: that._url + "/" + encodeURIComponent(entityOptions.name || entityAlias)
                },
                entityOptions
            ));
        });
    },

    /**
     * @name ODataContextmethods_get
     * @publicName get(operationName, params)
     * @param1 operationName:string
     * @param2 params:object
     * @return Promise
     */
    get: function(operationName, params) {
        return this.invoke(operationName, params, "GET");
    },

    /**
     * @name ODataContextmethods_invoke
     * @publicName invoke(operationName, params, httpMethod)
     * @param1 operationName:string
     * @param2 params:object
     * @param3 httpMethod:object
     * @return Promise
     */
    invoke: function(operationName, params, httpMethod) {
        params = params || {};
        httpMethod = (httpMethod || "POST").toLowerCase();

        var d = $.Deferred(),
            url = this._url + "/" + encodeURIComponent(operationName),
            payload;

        if(this.version() === 4) {
            if(httpMethod === "get") {
                url = mixins.formatFunctionInvocationUrl(url, mixins.escapeServiceOperationParams(params, this.version()));
                params = null;
            } else if(httpMethod === "post") {
                payload = params;
                params = null;
            }
        }

        when(this._sendRequest(url, httpMethod, mixins.escapeServiceOperationParams(params, this.version()), payload))
            .done(function(r) {
                if($.isPlainObject(r) && operationName in r) {
                    r = r[operationName];
                }
                d.resolve(r);
            })
            .fail([this._errorHandler, errorsModule._errorHandler, d.reject]);

        return d.promise();
    },

    /**
     * @name ODataContextmethods_objectLink
     * @publicName objectLink(entityAlias, key)
     * @param1 entityAlias:string
     * @param2 key:object|string|number
     * @return object
     */
    objectLink: function(entityAlias, key) {
        var store = this[entityAlias];
        if(!store) {
            throw errorsModule.errors.Error("E4015", entityAlias);
        }

        if(!commonUtils.isDefined(key)) {
            return null;
        }

        return {
            __metadata: {
                uri: store._byKeyUrl(key, true)
            }
        };
    }

})
.include(mixins.SharedMethods);

module.exports = ODataContext;
