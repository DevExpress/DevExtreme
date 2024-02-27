import { Deferred } from 'devextreme/core/utils/deferred';
import { HttpClient, HttpEventType, HttpParams } from '@angular/common/http';
import { throwError, Subject } from 'rxjs';
import { takeUntil, timeoutWith } from 'rxjs/operators';
import { extendFromObject } from 'devextreme/core/utils//extend';
import { getWindow, hasWindow } from 'devextreme/core/utils/window';
import domAdapter from 'devextreme/core/dom_adapter';

type Result = Promise<any> & { abort: () => void };

const window = getWindow();

const PARSER_ERROR = 'parsererror';
const SUCCESS = 'success';
const NO_CONTENT = 'nocontent';
const TIMEOUT = 'timeout';
const STATUS_ABORT = 0;

const removeScript = function (scriptNode) {
  scriptNode.parentNode.removeChild(scriptNode);
};

const appendToHead = function (element) {
  return (domAdapter as any).getHead().appendChild(element);
};

const createScript = function (options) {
  const script = domAdapter.createElement('script');
  for (const name in options) {
    script[name] = options[name];
  }
  return script;
};

const evalScript = function (code) {
  const script = createScript({ text: code });
  appendToHead(script);
  removeScript(script);
};

function getMethod(options) {
  return (options.method || 'GET').toUpperCase();
}

const getContentTypeHeader = function (options) {
  let defaultContentType = '';
  if (options.data && !options.upload && getMethod(options) !== 'GET') {
    defaultContentType = 'application/x-www-form-urlencoded;charset=utf-8';
  }

  return options.contentType
        || defaultContentType;
};

const paramsConvert = function (params) {
  const result: string[] = [];

  for (const name in params) {
    let value = params[name];

    if (value === undefined) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (value === null) {
      value = '';
    }

    if (typeof value === 'function') {
      value = value();
    }

    result.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
  }

  return result.join('&');
};

const getAcceptHeader = function (options) {
  const dataType = options.dataType || '*';
  const scriptAccept = 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript';
  const accepts = {
    '*': '*/*',
    text: 'text/plain',
    html: 'text/html',
    xml: 'application/xml, text/xml',
    json: 'application/json, text/javascript',
    jsonp: scriptAccept,
    script: scriptAccept,
  };
  extendFromObject(accepts, options.accepts, true);

  return accepts[dataType]
    ? accepts[dataType] + (dataType !== '*' ? ', */*; q=0.01' : '')
    : accepts['*'];
};

const getRequestOptions = function (options, headers) {
  let params = options.data;
  const paramsAlreadyString = typeof params === 'string';
  let url = options.url || window.location.href;

  if (!paramsAlreadyString && !options.cache) {
    params = params || {};
    params._ = Date.now();
  }

  if (params && !options.upload) {
    if (!paramsAlreadyString) {
      params = paramsConvert(params);
    }

    if (getMethod(options) === 'GET') {
      if (params !== '') {
        url += (url.indexOf('?') > -1 ? '&' : '?') + params;
      }
      params = null;
    } else if (headers['Content-Type'] && headers['Content-Type'].indexOf('application/x-www-form-urlencoded') > -1) {
      params = params.replace(/%20/g, '+');
    }
  }

  return {
    url,
    parameters: params,
  };
};

const isCrossDomain = function (url: string) {
  if (!hasWindow()) {
    return true;
  }

  let crossDomain = false;
  const originAnchor = domAdapter.createElement('a') as HTMLAnchorElement;
  const urlAnchor = domAdapter.createElement('a') as HTMLAnchorElement;

  originAnchor.href = window.location.href;

  try {
    urlAnchor.href = url;

    // NOTE: IE11
    // eslint-disable-next-line no-self-assign
    urlAnchor.href = urlAnchor.href;

    crossDomain = `${originAnchor.protocol}//${originAnchor.host}`
            !== `${urlAnchor.protocol}//${urlAnchor.host}`;
  } catch (e) {
    crossDomain = true;
  }
  return crossDomain;
};

const getJsonpCallbackName = function (options: Record<string, any>) {
  if (options.dataType === 'jsonp') {
    const random = Math.random().toString().replace(/\D/g, '');
    const callbackName = options.jsonpCallback || `dxCallback${Date.now()}_${random}`;
    const callbackParameter = options.jsonp || 'callback';

    options.data = options.data || {};
    options.data[callbackParameter] = callbackName;

    return callbackName;
  }
};

const getRequestHeaders = function (options) {
  const headers = options.headers || {};

  headers['Content-Type'] = headers['Content-Type'] || getContentTypeHeader(options);
  headers.Accept = headers.Accept || getAcceptHeader(options);

  if (!options.crossDomain && !headers['X-Requested-With']) {
    headers['X-Requested-With'] = 'XMLHttpRequest';
  }
  return headers;
};

export const sendRequestFactory = (httpClient) => {
  const URLENCODED = 'application/x-www-form-urlencoded';
  const CONTENT_TYPE = 'Content-Type';

  let nonce = Date.now();

  function assignResponseProps(xhrSurrogate, response) {
    function getResponseHeader(name) {
      return response.headers.get(name);
    }

    function makeResponseText() {
      const body = 'error' in response ? response.error : response.body;

      if (typeof body !== 'string' || String(getResponseHeader(CONTENT_TYPE)).startsWith('application/json')) {
        return JSON.stringify(body);
      }

      return body;
    }

    Object.assign(xhrSurrogate, {
      status: response.status,
      statusText: response.statusText,
      getResponseHeader,
      responseText: makeResponseText(),
    });

    return xhrSurrogate;
  }

  return (options) => {
    const destroy$ = new Subject();
    const d = Deferred();
    const method = (options.method || 'get').toLowerCase();
    const isGet = method === 'get';
    const needScriptEvaluation = options.dataType === 'jsonp' || options.dataType === 'script';
    if (options.cache === undefined) {
      options.cache = !needScriptEvaluation;
    }
    options.crossDomain = isCrossDomain(options.url);

    const jsonpCallBackName = getJsonpCallbackName(options);
    const headers = getRequestHeaders(options);
    const requestOptions = getRequestOptions(options, headers);
    const { url } = requestOptions;
    const { parameters } = requestOptions;
    const data = parameters;
    const { upload } = options;
    const { beforeSend } = options;
    const { xhrFields } = options;
    const result: Result = d.promise() as Result;

    result.abort = function (): void { // TODO need test
      destroy$.next(null);
      destroy$.complete();
      upload?.onabort?.(xhrSurrogate);
      // eslint-disable-next-line no-void
      void d.reject({ status: STATUS_ABORT }, 'error');
    };

    const xhrSurrogate = {
      type: 'XMLHttpRequestSurrogate',
      abort() { result.abort(); },
    };

    if (jsonpCallBackName) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      window[jsonpCallBackName] = (callback_data) => d.resolve(callback_data, SUCCESS, xhrSurrogate);
    }

    if (options.cache === false && isGet && data) {
      data._ = nonce++;
    }

    if (!headers.Accept) {
      headers.Accept = getAcceptHeader(options);
    }

    if (!upload && !isGet && !headers[CONTENT_TYPE]) {
      headers[CONTENT_TYPE] = options.contentType || `${URLENCODED};charset=utf-8`;
    }

    let params;
    let body;

    if (isGet) {
      params = data;
    } else if (!upload && typeof data === 'object' && headers[CONTENT_TYPE].indexOf(URLENCODED) === 0) {
      body = new HttpParams();
      Object.keys(data).forEach((key) => body.set(key, data[key]));
      body = body.toString();
    } else {
      body = data;
    }

    if (beforeSend) {
      beforeSend(xhrSurrogate);
    }

    const request = options.crossDomain && needScriptEvaluation
      ? httpClient.jsonp(url, jsonpCallBackName)
      : httpClient.request(
        method,
        url,
        {
          params,
          body,
          headers,
          reportProgress: true,
          withCredentials: xhrFields?.withCredentials,
          observe: upload ? 'events' : 'response',
          responseType: options.responseType || (['jsonp', 'script'].includes(options.dataType) ? 'text' : options.dataType),
        },
      ).pipe(takeUntil(destroy$));

    const requestWithTimeout = options.timeout
      ? request.pipe(timeoutWith(options.timeout, throwError(() => ({ timeout: TIMEOUT }))))
      : request;
    let total = 0;
    let isUploadStarted = false;

    if (!upload) {
      requestWithTimeout.subscribe(
        (response) => {
          if (needScriptEvaluation) {
            evalScript(response.body);
          }

          return d.resolve(
            response.body,
            response.body ? 'success' : NO_CONTENT,
            assignResponseProps(xhrSurrogate, response),
          );
        },
        (response) => {
          const errorStatus = options.dataType === 'json' && response.message.includes('parsing')
            ? PARSER_ERROR
            : response?.timeout || 'error';

          return d.reject(assignResponseProps(xhrSurrogate, response), errorStatus, response);
        },
      );
    } else {
      requestWithTimeout.subscribe(
        (event: Record<string, any>) => {
          if (event.type === HttpEventType.Sent) {
            if (!isUploadStarted) {
              options.upload.onloadstart?.(event);
              isUploadStarted = true;
            }
          } else if (event.type === HttpEventType.UploadProgress) {
            total += event.loaded;
            if (!isUploadStarted) {
              options.upload.onloadstart?.(event);
              isUploadStarted = true;
            }
            options.upload.onprogress?.({ ...event, total });
          } else if (event.type === HttpEventType.Response) {
            return d.resolve(xhrSurrogate, SUCCESS);
          }
          return null;
        },
        (response) => {
          options.upload.onerror?.(assignResponseProps(xhrSurrogate, response));
          return d.reject(assignResponseProps(xhrSurrogate, response), response.status, response);
        },
        () => {},
      );
    }

    return result;
  };
};
