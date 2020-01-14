const Class = require('../../core/class');
const extend = require('../../core/utils/extend').extend;
const typeUtils = require('../../core/utils/type');
const each = require('../../core/utils/iterator').each;
const errorsModule = require('../errors');
const ODataStore = require('./store');
const mixins = require('./mixins');
const deferredUtils = require('../../core/utils/deferred');
const when = deferredUtils.when;
const Deferred = deferredUtils.Deferred;

require('./query_adapter');

/**
* @name ODataContext
* @type object
* @module data/odata/context
* @export default
*/
const ODataContext = Class.inherit({

    ctor: function(options) {
        const that = this;

        /**
         * @name ODataContextOptions.url
         * @type string
         */
        /**
         * @name ODataContextOptions.beforeSend
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
         * @name ODataContextOptions.jsonp
         * @type boolean
         * @default false
         */
        /**
         * @name ODataContextOptions.version
         * @type number
         * @default 2
         * @acceptValues 2|3|4
         */
        /**
         * @name ODataContextOptions.withCredentials
         * @type boolean
         * @default false
         */
        /**
         * @name ODataContextOptions.filterToLower
         * @type boolean
         */
        /**
         * @name ODataContextOptions.deserializeDates
         * @type boolean
         */
        that._extractServiceOptions(options);

        /**
         * @name ODataContextOptions.errorHandler
         * @type function
         * @type_function_param1 e:Error
         * @type_function_param1_field1 httpStatus:number
         * @type_function_param1_field2 errorDetails:object
         * @type_function_param1_field3 requestOptions:object
         */
        that._errorHandler = options.errorHandler;

        /**
         * @name ODataContextOptions.entities
         * @type object
         */
        each(options.entities || [], function(entityAlias, entityOptions) {
            that[entityAlias] = new ODataStore(extend(
                {},
                options,
                {
                    url: that._url + '/' + encodeURIComponent(entityOptions.name || entityAlias)
                },
                entityOptions
            ));
        });
    },

    /**
     * @name ODataContextmethods.get
     * @publicName get(operationName, params)
     * @param1 operationName:string
     * @param2 params:object
     * @return Promise<any>
     */
    get: function(operationName, params) {
        return this.invoke(operationName, params, 'GET');
    },

    /**
     * @name ODataContextmethods.invoke
     * @publicName invoke(operationName, params, httpMethod)
     * @param1 operationName:string
     * @param2 params:object
     * @param3 httpMethod:object
     * @return Promise<void>
     */
    invoke: function(operationName, params, httpMethod) {
        params = params || {};
        httpMethod = (httpMethod || 'POST').toLowerCase();

        const d = new Deferred();
        let url = this._url + '/' + encodeURIComponent(operationName);
        let payload;

        if(this.version() === 4) {
            if(httpMethod === 'get') {
                url = mixins.formatFunctionInvocationUrl(url, mixins.escapeServiceOperationParams(params, this.version()));
                params = null;
            } else if(httpMethod === 'post') {
                payload = params;
                params = null;
            }
        }

        when(this._sendRequest(url, httpMethod, mixins.escapeServiceOperationParams(params, this.version()), payload))
            .done(function(r) {
                if(typeUtils.isPlainObject(r) && operationName in r) {
                    r = r[operationName];
                }
                d.resolve(r);
            })
            .fail(this._errorHandler)
            .fail(errorsModule._errorHandler)
            .fail(d.reject);

        return d.promise();
    },

    /**
     * @name ODataContextmethods.objectLink
     * @publicName objectLink(entityAlias, key)
     * @param1 entityAlias:string
     * @param2 key:object|string|number
     * @return object
     */
    objectLink: function(entityAlias, key) {
        const store = this[entityAlias];
        if(!store) {
            throw errorsModule.errors.Error('E4015', entityAlias);
        }

        if(!typeUtils.isDefined(key)) {
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
