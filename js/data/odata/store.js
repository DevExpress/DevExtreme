import { isDefined } from '../../core/utils/type';
import config from '../../core/config';
import { generateExpand, generateSelect, serializeKey, convertPrimitiveValue } from './utils';
import proxyUrlFormatter from '../proxy_url_formatter';
import { errors } from '../errors';
import query from '../query';
import Store from '../abstract_store';
import { SharedMethods, formatFunctionInvocationUrl, escapeServiceOperationParams } from './mixins';
import { when, Deferred } from '../../core/utils/deferred';

import './query_adapter';

const ANONYMOUS_KEY_NAME = '5d46402c-7899-4ea9-bd81-8b73c47c7683';

const expandKeyType = (key, keyType) => ({ [key]: keyType });

const mergeFieldTypesWithKeyType = (fieldTypes, keyType) => {
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
};

const ODataStore = Store.inherit({

    ctor(options) {
        this.callBase(options);

        this._extractServiceOptions(options);


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

    _customLoadOptions() {
        return ['expand', 'customQueryParams'];
    },

    _byKeyImpl(key, extraOptions) {
        const params = {};

        if(extraOptions) {
            params['$expand'] = generateExpand(this._version, extraOptions.expand, extraOptions.select) || undefined;
            params['$select'] = generateSelect(this._version, extraOptions.select) || undefined;
        }

        return this._sendRequest(this._byKeyUrl(key), 'GET', params);
    },

    createQuery(loadOptions) {
        let url;
        const queryOptions = {
            adapter: 'odata',

            beforeSend: this._beforeSend,
            errorHandler: this._errorHandler,
            jsonp: this._jsonp,
            version: this._version,
            withCredentials: this._withCredentials,
            expand: loadOptions?.expand,
            requireTotalCount: loadOptions?.requireTotalCount,
            deserializeDates: this._deserializeDates,
            fieldTypes: this._fieldTypes
        };

        // NOTE: For AppBuilder, do not remove
        url = loadOptions?.urlOverride ?? this._url;

        if(isDefined(this._filterToLower)) {
            queryOptions.filterToLower = this._filterToLower;
        }

        if(loadOptions?.customQueryParams) {
            const params = escapeServiceOperationParams(loadOptions?.customQueryParams, this.version());

            if(this.version() === 4) {
                url = formatFunctionInvocationUrl(url, params);
            } else {
                queryOptions.params = params;
            }
        }

        return query(url, queryOptions);
    },

    _insertImpl(values) {
        this._requireKey();

        const d = new Deferred();

        when(this._sendRequest(this._url, 'POST', null, values))
            .done(serverResponse =>
                d.resolve(
                    serverResponse && !config().useLegacyStoreResult ? serverResponse : values,
                    this.keyOf(serverResponse)
                )
            )
            .fail(d.reject);

        return d.promise();
    },

    _updateImpl(key, values) {
        const d = new Deferred();

        when(this._sendRequest(this._byKeyUrl(key), this._updateMethod, null, values))
            .done(serverResponse =>
                config().useLegacyStoreResult
                    ? d.resolve(key, values)
                    : d.resolve(serverResponse || values, key)
            )
            .fail(d.reject);

        return d.promise();
    },

    _removeImpl(key) {
        const d = new Deferred();

        when(this._sendRequest(this._byKeyUrl(key), 'DELETE'))
            .done(() => d.resolve(key))
            .fail(d.reject);

        return d.promise();
    },

    _convertKey(value) {
        let result = value;
        const fieldTypes = this._fieldTypes;
        const key = this.key() || this._legacyAnonymousKey;

        if(Array.isArray(key)) {
            result = {};
            for(let i = 0; i < key.length; i++) {
                const keyName = key[i];
                result[keyName] = convertPrimitiveValue(fieldTypes[keyName], value[keyName]);
            }
        } else if(fieldTypes[key]) {
            result = convertPrimitiveValue(fieldTypes[key], value);
        }

        return result;
    },

    _byKeyUrl(value, useOriginalHost) {
        const baseUrl = useOriginalHost
            ? proxyUrlFormatter.formatLocalUrl(this._url)
            : this._url;

        const convertedKey = this._convertKey(value);

        return `${baseUrl}(${encodeURIComponent(serializeKey(convertedKey, this._version))})`;
    }

}, 'odata').include(SharedMethods);


// TODO: replace by "export default" after "odata/context" refactor
module.exports = ODataStore;
