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

const ODataContext = Class.inherit({

    ctor: function(options) {
        const that = this;

        that._extractServiceOptions(options);

        that._errorHandler = options.errorHandler;

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

    get: function(operationName, params) {
        return this.invoke(operationName, params, 'GET');
    },

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
