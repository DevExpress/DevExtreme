import '@js/common/data/odata/query_adapter';

import { errors } from '@js/common/data/errors';
import RequestDispatcher from '@js/common/data/odata/request_dispatcher';
import query from '@js/common/data/query';
import config from '@js/core/config';
import { Deferred, when } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import Store from '@js/data/abstract_store';

import {
  convertPrimitiveValue,
  escapeServiceOperationParams,
  formatFunctionInvocationUrl,
  generateExpand,
  generateSelect,
  serializeKey,
} from './m_utils';

const ANONYMOUS_KEY_NAME = '5d46402c-7899-4ea9-bd81-8b73c47c7683';

const expandKeyType = (key, keyType) => ({ [key]: keyType });

const mergeFieldTypesWithKeyType = (fieldTypes, keyType) => {
  const result = {};
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const field in fieldTypes) {
    result[field] = fieldTypes[field];
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const keyName in keyType) {
    if (keyName in result) {
      if (result[keyName] !== keyType[keyName]) {
        errors.log('W4001', keyName);
      }
    } else {
      result[keyName] = keyType[keyName];
    }
  }

  return result;
};

// @ts-expect-error
const ODataStore = Store.inherit({

  ctor(options) {
    this.callBase(options);

    this._requestDispatcher = new RequestDispatcher(options);

    let key = this.key();
    let { fieldTypes } = options;
    let { keyType } = options;

    if (keyType) {
      const keyTypeIsString = typeof keyType === 'string';

      if (!key) {
        key = keyTypeIsString ? ANONYMOUS_KEY_NAME : Object.keys(keyType);
        this._legacyAnonymousKey = key;
      }

      if (keyTypeIsString) {
        keyType = expandKeyType(key, keyType);
      }

      fieldTypes = mergeFieldTypesWithKeyType(fieldTypes, keyType);
    }

    this._fieldTypes = fieldTypes || {};

    if (this.version() === 2) {
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

    if (extraOptions) {
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      params.$expand = generateExpand(this.version(), extraOptions.expand, extraOptions.select) || undefined;
      // @ts-expect-error
      params.$select = generateSelect(this.version(), extraOptions.select) || undefined;
    }

    return this._requestDispatcher.sendRequest(this._byKeyUrl(key), 'GET', params);
  },

  createQuery(loadOptions) {
    let url;
    const queryOptions = {
      adapter: 'odata',
      beforeSend: this._requestDispatcher.beforeSend,
      errorHandler: this._errorHandler,
      jsonp: this._requestDispatcher.jsonp,
      version: this._requestDispatcher.version,
      withCredentials: this._requestDispatcher._withCredentials,
      expand: loadOptions?.expand,
      requireTotalCount: loadOptions?.requireTotalCount,
      deserializeDates: this._requestDispatcher._deserializeDates,
      fieldTypes: this._fieldTypes,
    };

    // NOTE: For AppBuilder, do not remove
    url = loadOptions?.urlOverride ?? this._requestDispatcher.url;

    if (isDefined(this._requestDispatcher.filterToLower)) {
      // @ts-expect-error
      queryOptions.filterToLower = this._requestDispatcher.filterToLower;
    }

    if (loadOptions?.customQueryParams) {
      const params = escapeServiceOperationParams(loadOptions?.customQueryParams, this.version());

      if (this.version() === 4) {
        url = formatFunctionInvocationUrl(url, params);
      } else {
        // @ts-expect-error
        queryOptions.params = params;
      }
    }

    // @ts-expect-error
    return query(url, queryOptions);
  },

  _insertImpl(values) {
    this._requireKey();
    // @ts-expect-error
    const d = new Deferred();

    when(this._requestDispatcher.sendRequest(this._requestDispatcher.url, 'POST', null, values))
      .done((serverResponse) => d.resolve(
        serverResponse && !config().useLegacyStoreResult ? serverResponse : values,
        this.keyOf(serverResponse),
      ))
      .fail(d.reject);

    return d.promise();
  },

  _updateImpl(key, values) {
    // @ts-expect-error
    const d = new Deferred();

    when(
      this._requestDispatcher.sendRequest(this._byKeyUrl(key), this._updateMethod, null, values),
    ).done((serverResponse) => (config().useLegacyStoreResult
      ? d.resolve(key, values)
      : d.resolve(serverResponse || values, key)))
      .fail(d.reject);

    return d.promise();
  },

  _removeImpl(key) {
    // @ts-expect-error
    const d = new Deferred();

    when(this._requestDispatcher.sendRequest(this._byKeyUrl(key), 'DELETE'))
      .done(() => d.resolve(key))
      .fail(d.reject);

    return d.promise();
  },

  _convertKey(value) {
    let result = value;
    const fieldTypes = this._fieldTypes;
    const key = this.key() || this._legacyAnonymousKey;

    if (Array.isArray(key)) {
      result = {};
      for (let i = 0; i < key.length; i++) {
        const keyName = key[i];
        result[keyName] = convertPrimitiveValue(fieldTypes[keyName], value[keyName]);
      }
    } else if (fieldTypes[key]) {
      result = convertPrimitiveValue(fieldTypes[key], value);
    }

    return result;
  },

  _byKeyUrl(value) {
    const baseUrl = this._requestDispatcher.url;
    const convertedKey = this._convertKey(value);

    return `${baseUrl}(${encodeURIComponent(serializeKey(convertedKey, this.version()))})`;
  },

  version() {
    return this._requestDispatcher.version;
  },

}, 'odata');

export default ODataStore;
