var Class = require('../../core/class'),
    extend = require('../../core/utils/extend').extend,
    typeUtils = require('../../core/utils/type'),
    each = require('../../core/utils/iterator').each,
    errorsModule = require('../errors'),
    ODataStore = require('./store'),
    mixins = require('./mixins'),
    deferredUtils = require('../../core/utils/deferred'),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred;

require('./query_adapter');

var ODataContext = Class.inherit({

    ctor: function(options) {
        var that = this;

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

        var d = new Deferred(),
            url = this._url + '/' + encodeURIComponent(operationName),
            payload;

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
        var store = this[entityAlias];
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
