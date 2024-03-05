import { Deferred } from 'devextreme/core/utils/deferred';
import {
  HttpClient, HttpEventType, HttpParams, HttpEvent, HttpErrorResponse, HttpResponse,
} from '@angular/common/http';
import { throwError, Subject } from 'rxjs';
import { takeUntil, timeoutWith } from 'rxjs/operators';
import { getWindow } from 'devextreme/core/utils/window';
import { isDefined } from 'devextreme/core/utils/type';
import {
  isCrossDomain,
  getJsonpCallbackName,
  getRequestOptions,
  getRequestHeaders as getAjaxRequestHeaders,
  getAcceptHeader,
  evalScript,
} from 'devextreme/core/utils/ajax_utils';

type Result = Promise<any> & { abort: () => void };

const window = getWindow();

const PARSER_ERROR = 'parsererror';
const SUCCESS = 'success';
const NO_CONTENT = 'nocontent';
const TIMEOUT = 'timeout';
const STATUS_ABORT = 0;
const CONTENT_TYPE = 'Content-Type';
const URLENCODED = 'application/x-www-form-urlencoded';

function assignResponseProps(xhrSurrogate, response) {
  const getResponseHeader = (name: string) => response.headers.get(name);

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

function isNeedScriptEvaluation(options) {
  return options.dataType === 'jsonp' || options.dataType === 'script';
}

function getRequestHeaders(options) {
  const headers = getAjaxRequestHeaders(options);
  const { upload } = options;

  if (!headers.Accept) {
    headers.Accept = getAcceptHeader(options);
  }

  if (!upload && !isGetMethod(options) && !headers[CONTENT_TYPE]) {
    headers[CONTENT_TYPE] = options.contentType || `${URLENCODED};charset=utf-8`;
  }

  return Object.keys(headers).reduce((acc, key) => {
    if (isDefined(headers[key])) {
      acc[key] = headers[key];
    }
    return acc;
  }, {});
}

function isGetMethod(options) {
  return (options.method || 'get').toLowerCase() === 'get';
}

function patchOptions(options) {
  const patchedOptions = { ...options };

  if (options.cache === undefined) {
    patchedOptions.cache = !isNeedScriptEvaluation(options);
  }

  patchedOptions.crossDomain = isCrossDomain(options.url);
  return patchedOptions;
}

function rejectIfAborted(deferred, xhrSurrogate) {
  if (xhrSurrogate.aborted) {
    deferred.reject({ status: STATUS_ABORT });
  }
}

function getRequestCallbacks(options: Record<string, any>, deferred, xhrSurrogate) {
  return {
    next(response: HttpResponse<any>) {
      if (isNeedScriptEvaluation(options)) {
        evalScript(response.body);
      }

      return deferred.resolve(
        response.body,
        response.body ? 'success' : NO_CONTENT,
        assignResponseProps(xhrSurrogate, response),
      );
    },
    error(error: HttpErrorResponse) {
      let errorStatus = error?.message === TIMEOUT ? TIMEOUT : 'error';

      errorStatus = options.dataType === 'json' && error.message.includes('parsing')
        ? PARSER_ERROR
        : errorStatus;

      return deferred.reject(assignResponseProps(xhrSurrogate, error), errorStatus, error);
    },
    complete() {
      rejectIfAborted(deferred, xhrSurrogate);
    },
  };
}

function getUploadCallbacks(options: Record<string, any>, deferred, xhrSurrogate) {
  let total = 0;
  let isUploadStarted = false;

  return {
    next: (event: HttpEvent<Object>) => {
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
        return deferred.resolve(xhrSurrogate, SUCCESS);
      }
      return null;
    },
    error(error: HttpErrorResponse) {
      return deferred.reject(assignResponseProps(xhrSurrogate, error), error.status, error);
    },
    complete() {
      rejectIfAborted(deferred, xhrSurrogate);
    },
  };
}

export const sendRequestFactory = (httpClient: HttpClient) => (sendOptions: Record<string, any>) => {
  const destroy$ = new Subject<void>();
  const deferred = Deferred();
  const method = (sendOptions.method || 'get').toLowerCase();
  const isGet = isGetMethod(sendOptions);
  const needScriptEvaluation = isNeedScriptEvaluation(sendOptions);
  const options = patchOptions(sendOptions);
  const jsonpCallBackName = getJsonpCallbackName(options);
  const headers = getRequestHeaders(options);
  const { url, parameters: data } = getRequestOptions(options, headers);
  const { upload, beforeSend, xhrFields } = options;

  const result = deferred.promise() as Result;

  result.abort = () => {
    xhrSurrogate.aborted = true;
    destroy$.next();
    upload?.onabort?.(xhrSurrogate);
  };

  const xhrSurrogate = {
    type: 'XMLHttpRequestSurrogate', // needs only for testing
    aborted: false,
    abort() { result.abort(); },
  };

  if (jsonpCallBackName) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window[jsonpCallBackName] = (callback_data: unknown) => deferred.resolve(callback_data, SUCCESS, xhrSurrogate);
  }

  if (options.cache === false && isGet && data) {
    data._ = Date.now() + 1;
  }

  const makeBody = () => (!upload && typeof data === 'object' && headers[CONTENT_TYPE].indexOf(URLENCODED) === 0
    ? Object.keys(data).reduce(
      (httpParams, key) => httpParams.set(key, data[key]),
      new HttpParams(),
    ).toString()
    : data);

  const body = isGet ? undefined : makeBody();
  const params = isGet ? data : undefined;

  beforeSend?.(xhrSurrogate);

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
    );

  const subscriptionCallbacks = upload
    ? getUploadCallbacks
    : getRequestCallbacks;

  request.pipe.apply(request, [
    takeUntil(destroy$) as any,
    ...options.timeout
      ? [timeoutWith(options.timeout, throwError(() => ({ message: TIMEOUT }))) as any]
      : [],
  ]).subscribe(
    subscriptionCallbacks(options, deferred, xhrSurrogate),
  );

  return result;
};
