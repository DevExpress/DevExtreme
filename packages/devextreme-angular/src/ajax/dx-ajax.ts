import { Deferred } from 'devextreme/core/utils/deferred';
import { HttpClient, HttpEventType, HttpParams } from '@angular/common/http';
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
  function getResponseHeader(name: string) {
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

function getRequestCallbacks(options: Record<string, any>, d, xhrSurrogate) {
  return {
    next: (response) => {
      if (isNeedScriptEvaluation(options)) {
        evalScript(response.body);
      }

      return d.resolve(
        response.body,
        response.body ? 'success' : NO_CONTENT,
        assignResponseProps(xhrSurrogate, response),
      );
    },
    error: (error) => {
      const errorStatus = options.dataType === 'json' && error.message.includes('parsing')
        ? PARSER_ERROR
        : error?.timeout || 'error';

      return d.reject(assignResponseProps(xhrSurrogate, error), errorStatus, error);
    },
  };
}

function getUploadCallbacks(options: Record<string, any>, d, xhrSurrogate) {
  let total = 0;
  let isUploadStarted = false;

  return {
    next: (event: Record<string, any>) => {
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
    error: (error) => {
      options.upload.onerror?.(assignResponseProps(xhrSurrogate, error));
      return d.reject(assignResponseProps(xhrSurrogate, error), error.status, error);
    },
  };
}

export const sendRequestFactory = (httpClient: HttpClient) => (sendOptions: Record<string, any>) => {
  const options = { ...sendOptions };
  const destroy$ = new Subject<void>();
  const d = Deferred();
  const method = (options.method || 'get').toLowerCase();
  const isGet = isGetMethod(options);
  const needScriptEvaluation = isNeedScriptEvaluation(options);

  if (options.cache === undefined) {
    options.cache = !needScriptEvaluation;
  }

  options.crossDomain = isCrossDomain(options.url);

  const jsonpCallBackName = getJsonpCallbackName(options);
  const headers = getRequestHeaders(options);
  const { url, parameters: data } = getRequestOptions(options, headers);
  const { upload, beforeSend, xhrFields } = options;

  const result: Result = d.promise() as Result;

  result.abort = (): void => {
    destroy$.next();
    destroy$.complete();
    upload?.onabort?.(xhrSurrogate);
    // eslint-disable-next-line no-void
    void d.reject({ status: STATUS_ABORT }, 'error');
  };

  const xhrSurrogate = {
    type: 'XMLHttpRequestSurrogate',
    abort(): void { result.abort(); },
  };

  if (jsonpCallBackName) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window[jsonpCallBackName] = (callback_data: unknown) => d.resolve(callback_data, SUCCESS, xhrSurrogate);
  }

  if (options.cache === false && isGet && data) {
    data._ = Date.now() + 1;
  }

  const makeBody = () => {
    if (!upload && typeof data === 'object' && headers[CONTENT_TYPE].indexOf(URLENCODED) === 0) {
      const httpParams = new HttpParams();
      Object.keys(data).forEach((key) => httpParams.set(key, data[key]));

      return httpParams.toString();
    }

    return data;
  };

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

  request.pipe(
    takeUntil(destroy$) as any,
    timeoutWith(options.timeout || 0, throwError(() => ({ timeout: TIMEOUT }))) as any,
  ).subscribe(
    subscriptionCallbacks(options, d, xhrSurrogate),
  );

  return result;
};
