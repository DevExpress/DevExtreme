import Class from '../../core/class';
import { extend } from '../../core/utils/extend';
import { isDefined, isPlainObject } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import errorsModule from '../errors';
import ODataStore from './store';
import { SharedMethods, formatFunctionInvocationUrl, escapeServiceOperationParams } from './mixins';
import { when, Deferred } from '../../core/utils/deferred';
import './query_adapter';

/**
* @name ODataContext
* @type object
* @module data/odata/context
* @export default
*/
const ODataContext = Class.inherit({

    ctor(options) {
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
        this._extractServiceOptions(options);

        /**
         * @name ODataContextOptions.errorHandler
         * @type function
         * @type_function_param1 e:Error
         * @type_function_param1_field1 httpStatus:number
         * @type_function_param1_field2 errorDetails:object
         * @type_function_param1_field3 requestOptions:object
         */
        this._errorHandler = options.errorHandler;

        /**
         * @name ODataContextOptions.entities
         * @type object
         */
        each(options.entities || [], (entityAlias, entityOptions) => {
            this[entityAlias] = new ODataStore(extend(
                {},
                options,
                {
                    url: `${this._url}/${encodeURIComponent(entityOptions.name || entityAlias)}`
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
    get(operationName, params) {
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
    invoke(operationName, params = {}, httpMethod = 'POST') {
        httpMethod = httpMethod.toLowerCase();

        const d = new Deferred();
        let url = `${this._url}/${encodeURIComponent(operationName)}`;
        let payload;

        if(this.version() === 4) {
            if(httpMethod === 'get') {
                url = formatFunctionInvocationUrl(url, escapeServiceOperationParams(params, this.version()));
                params = null;
            } else if(httpMethod === 'post') {
                payload = params;
                params = null;
            }
        }

        when(this._sendRequest(url, httpMethod, escapeServiceOperationParams(params, this.version()), payload))
            .done((r) => {
                if(isPlainObject(r) && operationName in r) {
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
    objectLink(entityAlias, key) {
        const store = this[entityAlias];
        if(!store) {
            throw errorsModule.errors.Error('E4015', entityAlias);
        }

        if(!isDefined(key)) {
            return null;
        }

        return {
            __metadata: {
                uri: store._byKeyUrl(key, true)
            }
        };
    }

})
    .include(SharedMethods);

export default ODataContext;
