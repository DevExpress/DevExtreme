"use strict";

exports.getJsonpCallbackName = exports.getAcceptHeader = exports.evalScript = exports.evalCrossDomainScript = void 0;
exports.getMethod = getMethod;
exports.isCrossDomain = exports.getRequestOptions = exports.getRequestHeaders = void 0;
var _extend = require("./extend");
var _window = require("./window");
var _dom_adapter = _interopRequireDefault(require("../dom_adapter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const createScript = function (options) {
  const script = _dom_adapter.default.createElement('script');
  for (const name in options) {
    script[name] = options[name];
  }
  return script;
};
const appendToHead = function (element) {
  return _dom_adapter.default.getHead().appendChild(element);
};
const removeScript = function (scriptNode) {
  scriptNode.parentNode.removeChild(scriptNode);
};
const evalScript = function (code) {
  const script = createScript({
    text: code
  });
  appendToHead(script);
  removeScript(script);
};
exports.evalScript = evalScript;
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
exports.evalCrossDomainScript = evalCrossDomainScript;
function getMethod(options) {
  return (options.method || 'GET').toUpperCase();
}
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
const getContentTypeHeader = function (options) {
  let defaultContentType;
  if (options.data && !options.upload && getMethod(options) !== 'GET') {
    defaultContentType = 'application/x-www-form-urlencoded;charset=utf-8';
  }
  return options.contentType || defaultContentType;
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
exports.getAcceptHeader = getAcceptHeader;
const getRequestHeaders = function (options) {
  const headers = options.headers || {};
  headers['Content-Type'] = headers['Content-Type'] || getContentTypeHeader(options);
  headers['Accept'] = headers['Accept'] || getAcceptHeader(options);
  if (!options.crossDomain && !headers['X-Requested-With']) {
    headers['X-Requested-With'] = 'XMLHttpRequest';
  }
  return headers;
};
exports.getRequestHeaders = getRequestHeaders;
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
exports.getJsonpCallbackName = getJsonpOptions;
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
exports.getRequestOptions = getRequestOptions;
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
exports.isCrossDomain = isCrossDomain;