import httpRequest from '../../core/http_request';
import { getWindow } from '../../core/utils/window';
import {
  evalCrossDomainScript,
  evalScript,
  getJsonpCallbackName as getJsonpOptions,
  getMethod,
  getRequestHeaders,
  getRequestOptions,
  isCrossDomain,
} from './ajax_utils';
import { Deferred } from './deferred';
import injector from './dependency_injector';
import { isDefined } from './type';

const window = getWindow();

const SUCCESS = 'success';
const ERROR = 'error';
const TIMEOUT = 'timeout';
const NO_CONTENT = 'nocontent';
const PARSER_ERROR = 'parsererror';

const isStatusSuccess = function (status) {
  return status >= 200 && status < 300;
};

const hasContent = function (status) {
  return status !== 204;
};

const getDataFromResponse = function (xhr) {
  return xhr.responseType && xhr.responseType !== 'text' || typeof xhr.responseText !== 'string'
    ? xhr.response
    : xhr.responseText;
};

const postProcess = function (deferred, xhr, dataType) {
  const data = getDataFromResponse(xhr);

  switch (dataType) {
    case 'jsonp':
      evalScript(data);
      break;

    case 'script':
      evalScript(data);
      deferred.resolve(data, SUCCESS, xhr);
      break;

    case 'json':
      try {
        deferred.resolve(JSON.parse(data), SUCCESS, xhr);
      } catch (e) {
        deferred.reject(xhr, PARSER_ERROR, e);
      }
      break;

    default:
      deferred.resolve(data, SUCCESS, xhr);
  }
};

const setHttpTimeout = function (timeout, xhr) {
  return timeout && setTimeout(() => {
    xhr.customStatus = TIMEOUT;
    xhr.abort();
  }, timeout);
};

const sendRequest = function (options) {
  const xhr = httpRequest.getXhr();
  const d = new Deferred();
  const result = d.promise();
  const async = isDefined(options.async) ? options.async : true;
  const { dataType } = options;
  const timeout = options.timeout || 0;
  let timeoutId;

  options.crossDomain = isCrossDomain(options.url);
  const needScriptEvaluation = dataType === 'jsonp' || dataType === 'script';

  if (options.cache === undefined) {
    options.cache = !needScriptEvaluation;
  }

  const callbackName = getJsonpOptions(options);
  const headers = getRequestHeaders(options);
  const requestOptions = getRequestOptions(options, headers);
  const { url } = requestOptions;
  const { parameters } = requestOptions;

  if (callbackName) {
    window[callbackName] = function (data) {
      d.resolve(data, SUCCESS, xhr);
    };
  }

  if (options.crossDomain && needScriptEvaluation) {
    const reject = function () {
      d.reject(xhr, ERROR);
    };
    const resolve = function () {
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
    timeoutId = setHttpTimeout(timeout, xhr);
  }

  xhr.onreadystatechange = function (e) {
    if (xhr.readyState === 4) {
      clearTimeout(timeoutId);
      if (isStatusSuccess(xhr.status)) {
        if (hasContent(xhr.status)) {
          postProcess(d, xhr, dataType);
        } else {
          d.resolve(null, NO_CONTENT, xhr);
        }
      } else {
        d.reject(xhr, xhr.customStatus || ERROR);
      }
    }
  };

  if (options.upload) {
    xhr.upload.onprogress = options.upload.onprogress;
    xhr.upload.onloadstart = options.upload.onloadstart;
    xhr.upload.onabort = options.upload.onabort;
  }

  if (options.xhrFields) {
    for (const field in options.xhrFields) {
      xhr[field] = options.xhrFields[field];
    }
  }

  if (options.responseType === 'arraybuffer') {
    xhr.responseType = options.responseType;
  }

  for (const name in headers) {
    if (Object.prototype.hasOwnProperty.call(headers, name) && isDefined(headers[name])) {
      xhr.setRequestHeader(name, headers[name]);
    }
  }

  if (options.beforeSend) {
    options.beforeSend(xhr);
  }

  xhr.send(parameters);

  result.abort = function () {
    xhr.abort();
  };

  return result;
};

const Ajax = injector({ sendRequest });
export { Ajax };
