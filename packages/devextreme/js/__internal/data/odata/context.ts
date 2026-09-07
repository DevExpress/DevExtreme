import '@js/common/data/odata/query_adapter';

import RequestDispatcher from '@js/common/data/odata/request_dispatcher';
import ODataStore from '@js/common/data/odata/store';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import type { StoreErrorHandler } from '@ts/data/abstract_store';

import { errors, handleError } from '../m_errors';
import { escapeServiceOperationParams, formatFunctionInvocationUrl } from './utils';

export type ServiceOperationParams = Record<string, unknown>;

export interface ODataContextOptions {
  url?: string;
  errorHandler?: StoreErrorHandler;
  entities?: Record<string, { name?: string }>;
}

interface ObjectLink {
  __metadata: {
    uri: string;
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> => isPlainObject(value);

class ODataContext {
  // Entity stores are exposed as dynamic properties named after the entity aliases.
  [entityAlias: string]: unknown;

  _requestDispatcher: RequestDispatcher;

  _errorHandler?: StoreErrorHandler;

  constructor(options: ODataContextOptions) {
    this._requestDispatcher = new RequestDispatcher(options);

    this._errorHandler = options.errorHandler;

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    each(options.entities || [], (entityAlias: string, entityOptions: { name?: string }): void => {
      this[entityAlias] = new ODataStore(extend(
        {},
        options,
        {
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          url: `${this._requestDispatcher.url}/${encodeURIComponent(entityOptions.name || entityAlias)}`,
        },
        entityOptions,
      ));
    });
  }

  get(operationName: string, params?: ServiceOperationParams): DeferredObj<unknown> {
    return this.invoke(operationName, params, 'GET');
  }

  invoke(
    operationName: string,
    params: ServiceOperationParams = {},
    httpMethod = 'POST',
  ): DeferredObj<unknown> {
    const method = httpMethod.toLowerCase();
    const d = Deferred<unknown>();
    const baseUrl = `${this._requestDispatcher.url}/${encodeURIComponent(operationName)}`;

    const isV4 = this.version() === 4;
    const passParamsInUrl = isV4 && method === 'get';
    const passParamsInPayload = isV4 && method === 'post';

    const url = passParamsInUrl
      ? formatFunctionInvocationUrl(baseUrl, escapeServiceOperationParams(params, this.version()))
      : baseUrl;
    const payload = passParamsInPayload ? params : undefined;
    const requestParams = passParamsInUrl || passParamsInPayload ? null : params;

    when(this._requestDispatcher.sendRequest(
      url,
      method,
      escapeServiceOperationParams(requestParams, this.version()),
      payload,
    ))
      .done((response) => {
        const result = isRecord(response) && operationName in response
          ? response[operationName]
          : response;

        d.resolve(result);
      })
      .fail(this._errorHandler)
      .fail(handleError)
      .fail((...args: unknown[]) => { d.reject(...args); });

    // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
    return d.promise();
  }

  objectLink(entityAlias: string, key: unknown): ObjectLink | null {
    const store = this[entityAlias];

    if (!(store instanceof ODataStore)) {
      throw errors.Error('E4015', entityAlias);
    }

    if (!isDefined(key)) {
      return null;
    }

    return {
      __metadata: {
        uri: store._byKeyUrl(key),
      },
    };
  }

  version(): number {
    const { version }: { version: number } = this._requestDispatcher;

    return version;
  }
}

export default ODataContext;
