import '@js/common/data/odata/query_adapter';

import { sendRequest } from '@js/common/data/odata/utils';
import type { DeferredObj } from '@js/core/utils/deferred';

const DEFAULT_PROTOCOL_VERSION = 4;

export interface RequestDispatcherOptions {
  url?: string;
  beforeSend?: Function;
  jsonp?: boolean;
  version?: number;
  withCredentials?: boolean;
  processDatesAsUtc?: boolean;
  deserializeDates?: boolean;
  filterToLower?: boolean;
}

export default class RequestDispatcher {
  _url: string;

  _beforeSend?: Function;

  _jsonp?: boolean;

  _version: number;

  _withCredentials?: boolean;

  _processDatesAsUtc: boolean;

  _filterToLower?: boolean;

  constructor(options?: RequestDispatcherOptions) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const dispatcherOptions: RequestDispatcherOptions = options || {};

    this._url = String(dispatcherOptions.url).replace(/\/+$/, '');
    this._beforeSend = dispatcherOptions.beforeSend;
    this._jsonp = dispatcherOptions.jsonp;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._version = dispatcherOptions.version || DEFAULT_PROTOCOL_VERSION;
    this._withCredentials = dispatcherOptions.withCredentials;
    this._processDatesAsUtc = dispatcherOptions.processDatesAsUtc
      ?? dispatcherOptions.deserializeDates ?? false;
    this._filterToLower = dispatcherOptions.filterToLower;
  }

  sendRequest(
    url: string,
    method?: string,
    params?: Record<string, unknown> | null,
    payload?: unknown,
  ): DeferredObj<unknown> {
    return sendRequest(
      this.version,
      {
        url,
        method,
        params: params ?? {},
        payload,
      },
      {
        beforeSend: this._beforeSend,
        jsonp: this._jsonp,
        withCredentials: this._withCredentials,
        processDatesAsUtc: this._processDatesAsUtc,
      },
    );
  }

  get version(): number {
    return this._version;
  }

  get beforeSend(): Function | undefined {
    return this._beforeSend;
  }

  get url(): string {
    return this._url;
  }

  get jsonp(): boolean | undefined {
    return this._jsonp;
  }

  get filterToLower(): boolean | undefined {
    return this._filterToLower;
  }
}
