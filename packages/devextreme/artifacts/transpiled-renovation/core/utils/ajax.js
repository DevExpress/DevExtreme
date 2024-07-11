"use strict";

exports.default = void 0;
var _deferred = require("./deferred");
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
var _http_request = _interopRequireDefault(require("../../core/http_request"));
var _window = require("../../core/utils/window");
var _extend = require("./extend");
var _type = require("./type");
var _dependency_injector = _interopRequireDefault(require("./dependency_injector"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const SUCCESS = 'success';
const ERROR = 'error';
const TIMEOUT = 'timeout';
const NO_CONTENT = 'nocontent';
const PARSER_ERROR = 'parsererror';
const isStatusSuccess = function (status) {
  return 200 <= status && status < 300;
};
const hasContent = function (status) {
  return status !== 204;
};
const paramsConvert = function (params) {
  const result = [];
  for (const name in params) {
    let value = params[name];
    if (value === undefined) {
      continue;
    }
    if (value === null) {
      value = '';
    }
    if (typeof value === 'function') {
      value = value();
    }
    result.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
  }
  return result.join('&');
};
const createScript = function (options) {
  const script = _dom_adapter.default.createElement('script');
  for (const name in options) {
    script[name] = options[name];
  }
  return script;
};
const removeScript = function (scriptNode) {
  scriptNode.parentNode.removeChild(scriptNode);
};
const appendToHead = function (element) {
  return _dom_adapter.default.getHead().appendChild(element);
};
const evalScript = function (code) {
  const script = createScript({
    text: code
  });
  appendToHead(script);
  removeScript(script);
};
const evalCrossDomainScript = function (url) {
  const script = createScript({
    src: url
  });
  return new Promise(function (resolve, reject) {
    const events = {
      'load': resolve,
      'error': reject
    };
    const loadHandler = function (e) {
      events[e.type]();
      removeScript(script);
    };
    for (const event in events) {
      _dom_adapter.default.listen(script, event, loadHandler);
    }
    appendToHead(script);
  });
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
    script: scriptAccept
  };
  (0, _extend.extendFromObject)(accepts, options.accepts, true);
  return accepts[dataType] ? accepts[dataType] + (dataType !== '*' ? ', */*; q=0.01' : '') : accepts['*'];
};
const getContentTypeHeader = function (options) {
  let defaultContentType;
  if (options.data && !options.upload && getMethod(options) !== 'GET') {
    defaultContentType = 'application/x-www-form-urlencoded;charset=utf-8';
  }
  return options.contentType || defaultContentType;
};
const getDataFromResponse = function (xhr) {
  return xhr.responseType && xhr.responseType !== 'text' || typeof xhr.responseText !== 'string' ? xhr.response : xhr.responseText;
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
const isCrossDomain = function (url) {
  if (!(0, _window.hasWindow)()) {
    return true;
  }
  let crossDomain = false;
  const originAnchor = _dom_adapter.default.createElement('a');
  const urlAnchor = _dom_adapter.default.createElement('a');
  originAnchor.href = window.location.href;
  try {
    urlAnchor.href = url;

    // NOTE: IE11
    // eslint-disable-next-line no-self-assign
    urlAnchor.href = urlAnchor.href;
    crossDomain = originAnchor.protocol + '//' + originAnchor.host !== urlAnchor.protocol + '//' + urlAnchor.host;
  } catch (e) {
    crossDomain = true;
  }
  return crossDomain;
};
const setHttpTimeout = function (timeout, xhr) {
  return timeout && setTimeout(function () {
    xhr.customStatus = TIMEOUT;
    xhr.abort();
  }, timeout);
};
const getJsonpOptions = function (options) {
  if (options.dataType === 'jsonp') {
    const random = Math.random().toString().replace(/\D/g, '');
    const callbackName = options.jsonpCallback || 'dxCallback' + Date.now() + '_' + random;
    const callbackParameter = options.jsonp || 'callback';
    options.data = options.data || {};
    options.data[callbackParameter] = callbackName;
    return callbackName;
  }
};
const getRequestOptions = function (options, headers) {
  let params = options.data;
  const paramsAlreadyString = typeof params === 'string';
  let url = options.url || window.location.href;
  if (!paramsAlreadyString && !options.cache) {
    params = params || {};
    params['_'] = Date.now();
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
    url: url,
    parameters: params
  };
};
function getMethod(options) {
  return (options.method || 'GET').toUpperCase();
}
const getRequestHeaders = function (options) {
  const headers = options.headers || {};
  headers['Content-Type'] = headers['Content-Type'] || getContentTypeHeader(options);
  headers['Accept'] = headers['Accept'] || getAcceptHeader(options);
  if (!options.crossDomain && !headers['X-Requested-With']) {
    headers['X-Requested-With'] = 'XMLHttpRequest';
  }
  return headers;
};
const sendRequest = function (options) {
  const xhr = _http_request.default.getXhr();
  const d = new _deferred.Deferred();
  const result = d.promise();
  const async = (0, _type.isDefined)(options.async) ? options.async : true;
  const dataType = options.dataType;
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
  const url = requestOptions.url;
  const parameters = requestOptions.parameters;
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
  xhr.open(getMethod(options), url, async, options.username, options.password);
  if (async) {
    xhr.timeout = timeout;
    timeoutId = setHttpTimeout(timeout, xhr);
  }
  xhr['onreadystatechange'] = function (e) {
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
    xhr.upload['onprogress'] = options.upload['onprogress'];
    xhr.upload['onloadstart'] = options.upload['onloadstart'];
    xhr.upload['onabort'] = options.upload['onabort'];
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
    if (Object.prototype.hasOwnProperty.call(headers, name) && (0, _type.isDefined)(headers[name])) {
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
var _default = exports.default = (0, _dependency_injector.default)({
  sendRequest: sendRequest
});
module.exports = exports.default;
module.exports.default = exports.default;