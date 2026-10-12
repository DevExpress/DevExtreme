import '@js/common/data/odata/query_adapter';

import type { Query } from '@js/common/data';
import { errors } from '@js/common/data/errors';
import RequestDispatcher from '@js/common/data/odata/request_dispatcher';
import query from '@js/common/data/query';
import config from '@js/core/config';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import type { StoreKey, StoreLoadOptions, StoreOptions } from '@ts/data/abstract_store';
import Store from '@ts/data/abstract_store';

import {
  convertPrimitiveValue,
  escapeServiceOperationParams,
  formatFunctionInvocationUrl,
  generateExpand,
  generateSelect,
  serializeKey,
} from './utils';

const ANONYMOUS_KEY_NAME = '5d46402c-7899-4ea9-bd81-8b73c47c7683';

export type FieldTypes = Record<string, string>;

export interface ODataStoreOptions extends StoreOptions {
  url?: string;
  fieldTypes?: FieldTypes;
  keyType?: string | FieldTypes;
}

export interface ODataLoadOptions extends StoreLoadOptions {
  urlOverride?: string;
  customQueryParams?: Record<string, unknown>;
}

const expandKeyType = (key: StoreKey, keyType: string): FieldTypes => ({ [String(key)]: keyType });

const getProperty = (source: unknown, name: string): unknown => (
  typeof source === 'object' && source !== null && name in source ? source[name] : undefined
);

const mergeFieldTypesWithKeyType = (
  fieldTypes: FieldTypes | undefined,
  keyType: FieldTypes,
): FieldTypes => {
  const result: FieldTypes = {};
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

class ODataStore extends Store {
  _requestDispatcher: RequestDispatcher;

  _fieldTypes: FieldTypes;

  _updateMethod: string;

  _legacyAnonymousKey?: StoreKey;

  constructor(options?: ODataStoreOptions) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const storeOptions: ODataStoreOptions = options || {};

    super(storeOptions);

    this._requestDispatcher = new RequestDispatcher(storeOptions);

    let key = this.key();
    let { fieldTypes } = storeOptions;
    const { keyType } = storeOptions;

    if (keyType) {
      if (!key) {
        key = typeof keyType === 'string' ? ANONYMOUS_KEY_NAME : Object.keys(keyType);
        this._legacyAnonymousKey = key;
      }

      const expandedKeyType = typeof keyType === 'string'
        ? expandKeyType(key, keyType)
        : keyType;

      fieldTypes = mergeFieldTypesWithKeyType(fieldTypes, expandedKeyType);
    }

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._fieldTypes = fieldTypes || {};

    if (this.version() === 2) {
      this._updateMethod = 'MERGE';
    } else {
      this._updateMethod = 'PATCH';
    }
  }

  _customLoadOptions(): string[] {
    return ['expand', 'customQueryParams'];
  }

  _byKeyImpl(key: unknown, extraOptions?: ODataLoadOptions): DeferredObj<unknown> {
    const params: { $expand?: string; $select?: string } = {};

    if (extraOptions) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      params.$expand = generateExpand(this.version(), extraOptions.expand, extraOptions.select)
        || undefined;
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      params.$select = generateSelect(this.version(), extraOptions.select) || undefined;
    }

    const result: DeferredObj<unknown> = this._requestDispatcher
      .sendRequest(this._byKeyUrl(key), 'GET', params, undefined);

    return result;
  }

  createQuery(loadOptions?: ODataLoadOptions): Query {
    const queryOptions: Record<string, unknown> = {
      adapter: 'odata',
      beforeSend: this._requestDispatcher.beforeSend,
      errorHandler: this._errorHandler,
      jsonp: this._requestDispatcher.jsonp,
      version: this._requestDispatcher.version,
      withCredentials: this._requestDispatcher._withCredentials,
      expand: loadOptions?.expand,
      requireTotalCount: loadOptions?.requireTotalCount,
      processDatesAsUtc: this._requestDispatcher._processDatesAsUtc,
      fieldTypes: this._fieldTypes,
    };

    // NOTE: For AppBuilder, do not remove
    let url: string = loadOptions?.urlOverride ?? this._requestDispatcher.url;

    if (isDefined(this._requestDispatcher.filterToLower)) {
      queryOptions.filterToLower = this._requestDispatcher.filterToLower;
    }

    if (loadOptions?.customQueryParams) {
      const params = escapeServiceOperationParams(loadOptions.customQueryParams, this.version());

      if (this.version() === 4) {
        url = formatFunctionInvocationUrl(url, params);
      } else {
        queryOptions.params = params;
      }
    }

    // @ts-expect-error data/query is untyped: its default export declares no parameters
    const result: Query = query(url, queryOptions);

    return result;
  }

  _insertImpl(values: unknown): DeferredObj<unknown> {
    this._requireKey();
    const d = Deferred<unknown>();

    when(this._requestDispatcher.sendRequest(this._requestDispatcher.url, 'POST', null, values))
      .done((serverResponse) => {
        d.resolve(
          serverResponse && !config().useLegacyStoreResult ? serverResponse : values,
          this.keyOf(serverResponse),
        );
      })
      .fail((...args: unknown[]) => { d.reject(...args); });

    // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
    return d.promise();
  }

  _updateImpl(key: unknown, values: unknown): DeferredObj<unknown> {
    const d = Deferred<unknown>();

    when(
      this._requestDispatcher.sendRequest(this._byKeyUrl(key), this._updateMethod, null, values),
    ).done((serverResponse) => {
      if (config().useLegacyStoreResult) {
        d.resolve(key, values);
      } else {
        d.resolve(serverResponse || values, key);
      }
    })
      .fail((...args: unknown[]) => { d.reject(...args); });

    // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
    return d.promise();
  }

  _removeImpl(key: unknown): DeferredObj<unknown> {
    const d = Deferred<unknown>();

    when(this._requestDispatcher.sendRequest(this._byKeyUrl(key), 'DELETE', undefined, undefined))
      .done(() => { d.resolve(key); })
      .fail((...args: unknown[]) => { d.reject(...args); });

    // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
    return d.promise();
  }

  _convertKey(value: unknown): unknown {
    const fieldTypes = this._fieldTypes;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const key = this.key() || this._legacyAnonymousKey;

    if (Array.isArray(key)) {
      const result: Record<string, unknown> = {};

      key.forEach((keyName: string) => {
        result[keyName] = convertPrimitiveValue(fieldTypes[keyName], getProperty(value, keyName));
      });

      return result;
    }

    if (key && fieldTypes[key]) {
      return convertPrimitiveValue(fieldTypes[key], value);
    }

    return value;
  }

  _byKeyUrl(value: unknown): string {
    const baseUrl: string = this._requestDispatcher.url;
    const convertedKey = this._convertKey(value);
    const serializedKey: string = serializeKey(convertedKey, this.version());

    return `${baseUrl}(${encodeURIComponent(serializedKey)})`;
  }

  version(): number {
    const { version }: { version: number } = this._requestDispatcher;

    return version;
  }
}

Store.registerClass(ODataStore, 'odata');

export default ODataStore;
