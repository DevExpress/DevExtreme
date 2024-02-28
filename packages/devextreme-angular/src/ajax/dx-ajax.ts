import { Deferred } from 'devextreme/core/utils/deferred';
import { HttpEventType, HttpParams } from '@angular/common/http';
import { throwError, Subject } from 'rxjs';
import { takeUntil, timeoutWith } from 'rxjs/operators';
import { getWindow } from 'devextreme/core/utils/window';
import {
  isCrossDomain,
  getJsonpCallbackName,
  getRequestOptions,
  getRequestHeaders,
  getAcceptHeader,
  evalScript,
} from 'devextreme/core/utils/ajax.utils';

type Result = Promise<any> & { abort: () => void };

const window = getWindow();

const PARSER_ERROR = 'parsererror';
const SUCCESS = 'success';
const NO_CONTENT = 'nocontent';
const TIMEOUT = 'timeout';
const STATUS_ABORT = 0;
const CONTENT_TYPE = 'Content-Type';

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

function subscribeRequest(request, options, d, xhrSurrogate) {
  const needScriptEvaluation = isNeedScriptEvaluation(options);

  request.subscribe(
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
}
function subscribeUpload(request, options, d, xhrSurrogate) {
  let total = 0;
  let isUploadStarted = false;

  request.subscribe(
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

function isNeedScriptEvaluation(options) {
  return options.dataType === 'jsonp' || options.dataType === 'script';
}

export const sendRequestFactory = (httpClient) => {
  const URLENCODED = 'application/x-www-form-urlencoded';

  let nonce = Date.now();

  return (options) => {
    const destroy$ = new Subject<undefined>();
    const d = Deferred();
    const method = (options.method || 'get').toLowerCase();
    const isGet = method === 'get';
    const needScriptEvaluation = isNeedScriptEvaluation(options);

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
      destroy$.next();
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

    if (upload) {
      subscribeUpload(requestWithTimeout, options, d, xhrSurrogate);
    } else {
      subscribeRequest(requestWithTimeout, options, d, xhrSurrogate);
    }

    return result;
  };
};
