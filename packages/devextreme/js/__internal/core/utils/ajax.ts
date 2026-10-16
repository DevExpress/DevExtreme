import httpRequest from '@js/core/http_request';
import {
  evalCrossDomainScript,
  evalScript,
  getJsonpCallbackName as getJsonpOptions,
  getMethod,
  getRequestHeaders,
  getRequestOptions,
  isCrossDomain,
} from '@js/core/utils/ajax_utils';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { AjaxRequestOptions } from '@ts/core/utils/ajax_utils';
import { injector } from '@ts/core/utils/dependency_injector';

const window = getWindow();

const SUCCESS = 'success';
const ERROR = 'error';
const TIMEOUT = 'timeout';
const NO_CONTENT = 'nocontent';
const PARSER_ERROR = 'parsererror';

type AjaxXhr = XMLHttpRequest & { customStatus?: string };

type AjaxRequestResult = Promise<unknown> & { abort?: () => void };

const isStatusSuccess = (status: number): boolean => status >= 200 && status < 300;

const hasContent = (status: number): boolean => status !== 204;

const getDataFromResponse = (xhr: AjaxXhr): unknown => (
  (xhr.responseType && xhr.responseType !== 'text') || typeof xhr.responseText !== 'string'
    ? xhr.response
    : xhr.responseText
);

const postProcess = (
  deferred: DeferredObj<unknown>,
  xhr: AjaxXhr,
  dataType: string | undefined,
): void => {
  const data = getDataFromResponse(xhr);

  switch (dataType) {
    case 'jsonp':
      evalScript(data as string);
      break;

    case 'script':
      evalScript(data as string);
      deferred.resolve(data, SUCCESS, xhr);
      break;

    case 'json':
      try {
        deferred.resolve(JSON.parse(data as string), SUCCESS, xhr);
      } catch (e) {
        deferred.reject(xhr, PARSER_ERROR, e);
      }
      break;

    default:
      deferred.resolve(data, SUCCESS, xhr);
  }
};

type TimeoutId = ReturnType<typeof setTimeout>;

const setHttpTimeout = (timeout: number, xhr: AjaxXhr): TimeoutId | undefined => {
  if (!timeout) {
    return undefined;
  }

  // eslint-disable-next-line no-restricted-globals
  return setTimeout(() => {
    xhr.customStatus = TIMEOUT;
    xhr.abort();
  }, timeout);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendRequest = (options: AjaxRequestOptions): any => {
  const xhr: AjaxXhr = httpRequest.getXhr();
  const d = Deferred<unknown>();
  const result = d.promise() as AjaxRequestResult;
  const async = isDefined(options.async) ? options.async : true;
  const { dataType } = options;
  const timeout = options.timeout ?? 0;

  options.crossDomain = isCrossDomain(options.url);
  const needScriptEvaluation = dataType === 'jsonp' || dataType === 'script';

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  if (options.cache === undefined) {
    options.cache = !needScriptEvaluation;
  }

  const callbackName = getJsonpOptions(options);
  const headers = getRequestHeaders(options);
  const requestOptions = getRequestOptions(options, headers);
  const { url } = requestOptions;
  const { parameters } = requestOptions;

  if (callbackName) {
    window[callbackName] = (data: unknown): void => {
      d.resolve(data, SUCCESS, xhr);
    };
  }

  if (options.crossDomain && needScriptEvaluation) {
    const reject = (): void => {
      d.reject(xhr, ERROR);
    };
    const resolve = (): void => {
      if (dataType === 'jsonp') return;
      d.resolve(null, SUCCESS, xhr);
    };

    evalCrossDomainScript(url).then(resolve, reject);
    return result;
  }

  if (options.crossDomain && !('withCredentials' in xhr)) {
    d.reject(xhr, ERROR);
    return result;
  }

  xhr.open(
    getMethod(options),
    url,
    async,
    options.username,
    options.password,
  );

  if (async) {
    xhr.timeout = timeout;
  }

  const timeoutId = async ? setHttpTimeout(timeout, xhr) : undefined;

  xhr.onreadystatechange = (): void => {
    if (xhr.readyState === 4) {
      clearTimeout(timeoutId);
      if (isStatusSuccess(xhr.status)) {
        if (hasContent(xhr.status)) {
          postProcess(d, xhr, dataType);
        } else {
          d.resolve(null, NO_CONTENT, xhr);
        }
      } else {
        d.reject(xhr, xhr.customStatus ?? ERROR);
      }
    }
  };

  if (options.upload) {
    xhr.upload.onprogress = options.upload.onprogress ?? null;
    xhr.upload.onloadstart = options.upload.onloadstart ?? null;
    xhr.upload.onabort = options.upload.onabort ?? null;
  }

  if (options.xhrFields) {
    Object.entries(options.xhrFields).forEach(([field, value]) => {
      (xhr as unknown as Record<string, unknown>)[field] = value;
    });
  }

  if (options.responseType === 'arraybuffer') {
    xhr.responseType = options.responseType;
  }

  Object.entries(headers).forEach(([name, value]) => {
    if (isDefined(value)) {
      xhr.setRequestHeader(name, value as string);
    }
  });

  if (options.beforeSend) {
    options.beforeSend(xhr);
  }

  xhr.send(parameters as XMLHttpRequestBodyInit | null);

  result.abort = (): void => {
    xhr.abort();
  };

  return result;
};

const Ajax = injector({ sendRequest });
export { Ajax };
