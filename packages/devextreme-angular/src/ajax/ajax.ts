import { Deferred } from 'devextreme/core/utils/deferred';
import {
  HttpClient, HttpEventType, HttpParams, HttpEvent, HttpErrorResponse, HttpResponse,
} from '@angular/common/http';
import { throwError, Subject } from 'rxjs';
import { takeUntil, timeoutWith } from 'rxjs/operators';
import { isDefined } from 'devextreme/core/utils/type';
import { getWindow } from 'devextreme/core/utils/window';
import {
  isCrossDomain,
  evalCrossDomainScript,
  getRequestOptions,
  getJsonpCallbackName as getCallbackNameAndModifyOptions,
  getRequestHeaders as getAjaxRequestHeaders,
  getAcceptHeader,
  evalScript,
} from 'devextreme/core/utils/ajax_utils';

type Result = Promise<any> & { abort: () => void };
interface Options {
  url: string;
  [key: string]: any;
}

interface XHRSurrogate {
  type?: string; // needs only for testing
  aborted: boolean;
  abort: () => void;
}

const PARSER_ERROR = 'parsererror';
const SUCCESS = 'success';
const ERROR = 'error';
const NO_CONTENT = 'nocontent';
const TIMEOUT = 'timeout';
const STATUS_ABORT = 0;
const CONTENT_TYPE = 'Content-Type';
const URLENCODED = 'application/x-www-form-urlencoded';

function assignResponseProps(xhrSurrogate: XHRSurrogate, response: HttpResponse<any> | HttpErrorResponse) {
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

function isUsedScript(options: Options) {
  return options.dataType === 'script';
}

function isUsedJSONP(options: Options) {
  return options.dataType === 'jsonp';
}

function getRequestHeaders(options: Options) {
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

function isGetMethod(options: Options) {
  return (options.method || 'get').toLowerCase() === 'get';
}

function patchOptions(options: Options) {
  const patchedOptions = { ...options };

  if (options.cache === undefined) {
    patchedOptions.cache = !(isUsedScript(options) || isUsedJSONP(options));
  }

  patchedOptions.crossDomain = isCrossDomain(options.url);

  return patchedOptions;
}

function rejectIfAborted(deferred, xhrSurrogate: XHRSurrogate, callback?: () => void) {
  if (xhrSurrogate.aborted) {
    deferred.reject({ status: STATUS_ABORT, statusText: 'aborted', ok: false });
    callback?.();
  }
}

function addJsonpCallbackAndReturnData(options: Options, deferred, xhrSurrogate: XHRSurrogate) {
  const patchedOptions = { ...options };
  const callbackName = getCallbackNameAndModifyOptions(patchedOptions);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  getWindow()[callbackName] = (data) => deferred.resolve(data, SUCCESS, xhrSurrogate);
  return patchedOptions.data;
}

function sendRequestByScript(url: string, deferred, xhrSurrogate: XHRSurrogate, result: Result) {
  const reject = function () {
    // eslint-disable-next-line no-void
    void deferred.reject(xhrSurrogate, ERROR);
  };
  const resolve = function () {
    // eslint-disable-next-line no-void
    void deferred.resolve(null, SUCCESS, xhrSurrogate);
  };

  evalCrossDomainScript(url).then(resolve, reject);
  return result;
}

function getRequestCallbacks(options: Options, deferred, xhrSurrogate: XHRSurrogate) {
  return {
    next(response: HttpResponse<any>) {
      if (isUsedJSONP(options)) {
        return options.crossDomain
          ? deferred.resolve(response, 'success', assignResponseProps(xhrSurrogate, response))
          : evalScript(response.body);
      }

      if (isUsedScript(options)) {
        evalScript(response.body);
      }

      return deferred.resolve(
        response.body,
        response.body ? 'success' : NO_CONTENT,
        assignResponseProps(xhrSurrogate, response),
      );
    },
    error(error: HttpErrorResponse) {
      let errorStatus = error?.statusText === TIMEOUT ? TIMEOUT : 'error';

      errorStatus = options.dataType === 'json' && error.message.includes('parsing')
        ? PARSER_ERROR
        : errorStatus;

      return deferred.reject(assignResponseProps(xhrSurrogate, error), errorStatus, error);
    },
    complete() {
      rejectIfAborted(deferred, xhrSurrogate, () => {
        options.upload?.onabort?.(xhrSurrogate);
      });
    },
  };
}

function getUploadCallbacks(options: Options, deferred, xhrSurrogate: XHRSurrogate) {
  let total = 0;
  let isUploadStarted = false;

  return {
    next: (event: HttpEvent<Object>) => {
      if (!isUploadStarted
          && [HttpEventType.UploadProgress, HttpEventType.Sent].includes(event.type)) {
        options.upload.onloadstart?.(event);
        isUploadStarted = true;
      }

      if (event.type === HttpEventType.UploadProgress) {
        total += event.loaded;
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

export const sendRequestFactory = (httpClient: HttpClient) => (sendOptions: Options) => {
  const abort$ = new Subject<void>();
  const deferred = Deferred();
  const result = deferred.promise() as Result;
  const method = (sendOptions.method || 'get').toLowerCase();
  const isGet = isGetMethod(sendOptions);
  const isJSONP = isUsedJSONP(sendOptions);
  const isScript = isUsedScript(sendOptions);
  const options = patchOptions(sendOptions);
  const headers = getRequestHeaders(options);
  const xhrSurrogate: XHRSurrogate = {
    type: 'XMLHttpRequestSurrogate',
    aborted: false,
    abort() {
      this.aborted = true;
      abort$.next();
    },
  };

  if (!options.crossDomain && isJSONP) {
    const data = addJsonpCallbackAndReturnData(options, deferred, xhrSurrogate);

    options.data = { ...options.data, ...data };
  }

  const { url, parameters: data } = getRequestOptions(options, headers);
  const { upload, beforeSend, xhrFields } = options;

  result.abort = () => xhrSurrogate.abort();

  if (options.crossDomain && isScript && !xhrSurrogate.aborted) {
    return sendRequestByScript(url, deferred, xhrSurrogate, result);
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

  const request = options.crossDomain && isJSONP
    ? httpClient.jsonp(url, options.jsonp || 'callback')
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
    takeUntil(abort$) as any,
    ...options.timeout
      ? [timeoutWith(options.timeout, throwError({ statusText: TIMEOUT, status: 0, ok: false })) as any]
      : [],
  ]).subscribe(
    subscriptionCallbacks(options, deferred, xhrSurrogate),
  );

  return result;
};
