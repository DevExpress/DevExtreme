/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import domAdapter from '@js/core/dom_adapter';
import { extendFromObject } from '@js/core/utils/extend';
import { getWindow, hasWindow } from '@js/core/utils/window';

const window = getWindow();

export type AjaxRequestData = string | FormData | Record<string, unknown>;

export type AjaxRequestHeaders = Record<string, unknown>;

export interface AjaxUploadHandlers {
  onprogress?: (e: ProgressEvent) => void;
  onloadstart?: (e: ProgressEvent) => void;
  onabort?: (e: ProgressEvent) => void;
}

export interface AjaxRequestOptions {
  url?: string;
  method?: string;
  data?: AjaxRequestData;
  dataType?: string;
  cache?: boolean;
  crossDomain?: boolean;
  contentType?: string | false;
  accepts?: Record<string, string>;
  headers?: AjaxRequestHeaders;
  jsonp?: string | false;
  jsonpCallback?: string;
  timeout?: number;
  async?: boolean;
  username?: string;
  password?: string;
  responseType?: string;
  xhrFields?: Record<string, unknown>;
  upload?: AjaxUploadHandlers;
  beforeSend?: (xhr: XMLHttpRequest) => void;
}

export interface AjaxRequestTarget {
  url: string;
  parameters: AjaxRequestData | null | undefined;
}

// NOTE: not instanceof - a FormData built in another window (an iframe, or the one
// getWindow() was pointed at) comes from a different realm and would not match.
export const isFormData = (data: unknown): data is FormData => Object.prototype.toString
  .call(data) === '[object FormData]';

type ScriptAttributes = Partial<Pick<HTMLScriptElement, 'src' | 'text'>>;

const createScript = (attributes: ScriptAttributes): HTMLScriptElement => {
  const script = domAdapter.createElement('script') as HTMLScriptElement;

  return Object.assign(script, attributes);
};

const appendToHead = (element: Node): void => {
  domAdapter.getHead().appendChild(element);
};

const removeScript = (scriptNode: Node): void => {
  scriptNode.parentNode?.removeChild(scriptNode);
};

const evalScript = (code: string): void => {
  const script = createScript({ text: code });
  appendToHead(script);
  removeScript(script);
};

const evalCrossDomainScript = (url: string): Promise<void> => {
  const script = createScript({ src: url });

  return new Promise((resolve, reject) => {
    const events: Record<string, () => void> = {
      load: (): void => resolve(),
      error: (): void => reject(),
    };

    const loadHandler = (e: Event): void => {
      events[e.type]();
      removeScript(script);
    };

    Object.keys(events).forEach((event) => {
      domAdapter.listen(script, event, loadHandler);
    });

    appendToHead(script);
  });
};

function getMethod(options: AjaxRequestOptions): string {
  return (options.method || 'GET').toUpperCase();
}

const paramsConvert = (params: Record<string, unknown>): string => {
  const result: string[] = [];

  Object.entries(params).forEach(([name, rawValue]) => {
    if (rawValue === undefined) {
      return;
    }

    let value: unknown = rawValue === null ? '' : rawValue;

    if (typeof value === 'function') {
      value = (value as () => unknown)();
    }

    result.push(`${encodeURIComponent(name)}=${encodeURIComponent(value as string)}`);
  });

  return result.join('&');
};

const getContentTypeHeader = (options: AjaxRequestOptions): string | undefined => {
  const defaultContentType = options.data
    && !options.upload
    && !isFormData(options.data)
    && getMethod(options) !== 'GET'
    ? 'application/x-www-form-urlencoded;charset=utf-8'
    : undefined;

  return options.contentType
        || defaultContentType;
};

const getAcceptHeader = (options: AjaxRequestOptions): string => {
  const dataType = options.dataType || '*';
  const scriptAccept = 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript';
  const accepts: Record<string, string> = {
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

const getRequestHeaders = (options: AjaxRequestOptions): AjaxRequestHeaders => {
  const headers = options.headers || {};

  headers['Content-Type'] = headers['Content-Type'] || getContentTypeHeader(options);
  headers.Accept = headers.Accept || getAcceptHeader(options);

  if (!options.crossDomain && !headers['X-Requested-With']) {
    headers['X-Requested-With'] = 'XMLHttpRequest';
  }
  return headers;
};

const getJsonpOptions = (options: AjaxRequestOptions): string | undefined => {
  if (options.dataType !== 'jsonp') {
    return undefined;
  }

  const random = Math.random().toString().replace(/\D/g, '');
  const callbackName = options.jsonpCallback || `dxCallback${Date.now()}_${random}`;
  const callbackParameter = options.jsonp || 'callback';

  options.data = options.data || {};
  (options.data as Record<string, unknown>)[callbackParameter] = callbackName;

  return callbackName;
};

const getRequestOptions = (
  options: AjaxRequestOptions,
  headers: AjaxRequestHeaders,
): AjaxRequestTarget => {
  let params: AjaxRequestData | null | undefined = options.data;
  const paramsAlreadyString = typeof params === 'string';
  const sendsFormData = isFormData(params);
  let url = options.url || window.location.href;

  if (!paramsAlreadyString && !sendsFormData && !options.cache) {
    params = params || {};
    (params as Record<string, unknown>)._ = Date.now();
  }

  if (params && !options.upload && !sendsFormData) {
    if (!paramsAlreadyString) {
      params = paramsConvert(params as Record<string, unknown>);
    }

    if (getMethod(options) === 'GET') {
      if (params !== '') {
        url += (url.includes('?') ? '&' : '?') + (params as string);
      }
      params = null;
    } else if ((headers['Content-Type'] as string | undefined)?.includes('application/x-www-form-urlencoded')) {
      params = (params as string).replace(/%20/g, '+');
    }
  }

  return {
    url,
    parameters: params,
  };
};

const isCrossDomain = (url: string | undefined): boolean => {
  if (!hasWindow()) {
    return true;
  }

  let crossDomain = false;
  const originAnchor = domAdapter.createElement('a') as HTMLAnchorElement;
  const urlAnchor = domAdapter.createElement('a') as HTMLAnchorElement;

  originAnchor.href = window.location.href;

  try {
    urlAnchor.href = url as string;

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

export {
  evalCrossDomainScript,
  evalScript,
  getAcceptHeader,
  getJsonpOptions as getJsonpCallbackName,
  getMethod,
  getRequestHeaders,
  getRequestOptions,
  isCrossDomain,
};
