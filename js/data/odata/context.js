import Class from '../../core/class';
import { extend } from '../../core/utils/extend';
import { isDefined, isPlainObject } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import errorsModule from '../errors';
import ODataStore from './store';
import { SharedMethods, formatFunctionInvocationUrl, escapeServiceOperationParams } from './mixins';
import { when, Deferred } from '../../core/utils/deferred';
import './query_adapter';

const ODataContext = Class.inherit({

    ctor(options) {
        this._extractServiceOptions(options);

        this._errorHandler = options.errorHandler;

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

    get(operationName, params) {
        return this.invoke(operationName, params, 'GET');
    },

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
