import '@js/common/data/odata/query_adapter';

import { sendRequest } from '@js/common/data/odata/utils';

const DEFAULT_PROTOCOL_VERSION = 4;

export default class RequestDispatcher {
  constructor(options) {
    options = options || {};
    // @ts-expect-error
    this._url = String(options.url).replace(/\/+$/, '');
    // @ts-expect-error
    this._beforeSend = options.beforeSend;
    // @ts-expect-error
    this._jsonp = options.jsonp;
    // @ts-expect-error
    this._version = options.version || DEFAULT_PROTOCOL_VERSION;
    // @ts-expect-error
    this._withCredentials = options.withCredentials;
    // @ts-expect-error
    this._deserializeDates = options.deserializeDates;
    // @ts-expect-error
    this._filterToLower = options.filterToLower;
  }

  sendRequest(url, method, params, payload) {
    return sendRequest(
      this.version,
      {
        url,
        method,
        params: params || {},
        payload,
      },
      {
        // @ts-expect-error
        beforeSend: this._beforeSend,
        // @ts-expect-error
        jsonp: this._jsonp,
        // @ts-expect-error
        withCredentials: this._withCredentials,
        // @ts-expect-error
        deserializeDates: this._deserializeDates,
      },
    );
  }

  get version() {
    // @ts-expect-error
    return this._version;
  }

  get beforeSend() {
    // @ts-expect-error
    return this._beforeSend;
  }

  get url() {
    // @ts-expect-error
    return this._url;
  }

  get jsonp() {
    // @ts-expect-error
    return this._jsonp;
  }

  get filterToLower() {
    // @ts-expect-error
    return this._filterToLower;
  }
}
